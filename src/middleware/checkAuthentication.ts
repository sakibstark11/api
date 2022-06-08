import { NextFunction, Request, Response } from 'express';
import { Logger } from 'pino';
import { BaseHttpError, Server500, Unauthorized401 } from '../utils/types/responses/errors/httpErrors';

export default (redisService: any, tokenService: any, logger: Logger) => async (request: Request, response: Response, next: NextFunction) => {
    const { headers: { access_token, refresh_token } } = request;
    try {
        const decodedAccessToken = await tokenService.decodeAccessToken(access_token);
        const decodedRefreshToken = await tokenService.decodeRefreshToken(refresh_token);

        if (decodedAccessToken === null || decodedRefreshToken === null) { throw new Unauthorized401('access denied'); }

        const existingRefreshToken = await redisService.fetchRefreshToken(decodedAccessToken.id);

        if (existingRefreshToken !== refresh_token) { throw new Unauthorized401('access denied'); }
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
