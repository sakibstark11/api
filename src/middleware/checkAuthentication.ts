import { NextFunction, Request, Response } from 'express';
import { Logger } from 'pino';
import RedisService from '../services/redis';
import TokenService from '../services/token';
import { EnteredUser } from '../utils/types/user/enteredUser';
import { BaseHttpError, Forbidden403, Server500 } from '../utils/types/responses/errors/httpErrors';
import { RequestObjectStructure, TokenExpiredError, TOKEN_EXPIRED } from '../utils/types/token';

export default (redisService: RedisService, tokenService: TokenService, logger: Logger) => async (req: Request & RequestObjectStructure, res: Response, next: NextFunction): Promise<void | Response> => {
    const { headers: { authorization }, cookies: { refreshToken } } = req;
    try {
        const accessToken = authorization.split(" ")[1];
        const decodedAccessToken = tokenService.decodeAccessToken(accessToken) as EnteredUser | TokenExpiredError;
        const decodedRefreshToken = tokenService.decodeRefreshToken(refreshToken) as EnteredUser;

        if (decodedAccessToken === TOKEN_EXPIRED || decodedAccessToken === null || decodedRefreshToken === null) { throw new Forbidden403('access denied'); }

        const existingRefreshToken = await redisService.fetchRefreshToken(decodedAccessToken.id);

        if (existingRefreshToken !== refreshToken) { throw new Forbidden403('access denied'); }

        req.headers.id = decodedAccessToken.id;

        logger.info({ id: decodedAccessToken.id }, 'authenticated');

        return next();
    } catch (error) {
        logger.error(error, 'authentication check failed');
        if (error instanceof BaseHttpError) {
            return res.status(error.status).json(error.payload);
        }
        const errorResponse = new Server500('something went wrong');
        return res.status(errorResponse.status).json(errorResponse.payload);

    }
};
