import { NextFunction, Request, Response } from 'express';
import { Logger } from 'pino';
import RedisService from '../services/redis';
import TokenService from '../services/token';
import { EnteredUser } from '../utils/types/enteredUser';
import { BaseHttpError, Server500, Unauthorized401 } from '../utils/types/responses/errors/httpErrors';
import { TokenRequestHeader } from '../utils/types/token';

export default (redisService: RedisService, tokenService: TokenService, logger: Logger) => async (request: Request & TokenRequestHeader, response: Response, next: NextFunction) => {
    const { headers: { access_token, refresh_token } } = request;
    try {
        const decodedAccessToken = tokenService.decodeAccessToken(access_token) as EnteredUser;
        const decodedRefreshToken = tokenService.decodeRefreshToken(refresh_token) as EnteredUser;

        if (decodedAccessToken === null || decodedRefreshToken === null) { throw new Unauthorized401('access denied'); }

        const existingRefreshToken = await redisService.fetchRefreshToken(decodedAccessToken.id);

        if (existingRefreshToken !== refresh_token) { throw new Unauthorized401('access denied'); }

        request.headers.id = decodedAccessToken.id;

        logger.info({ id: decodedAccessToken.id }, 'authenticated');

        return next();
    } catch (error) {
        logger.error(error, 'authentication check failed');
        if (error instanceof BaseHttpError) {
            return response.status(error.status).json(error.payload);
        }
        const errorResponse = new Server500('something went wrong');
        return response.status(errorResponse.status).json(errorResponse.payload);

    }
};
