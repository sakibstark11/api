import { NextFunction, Request, Response } from 'express';
import { Logger } from 'pino';
import RedisService from '../services/redis';
import TokenService from '../services/token';
import { EnteredUser } from '../utils/types/user/enteredUser';
import { BaseHttpError, Server500, Forbidden403 } from '../utils/types/responses/errors/httpErrors';
import { RequestObjectStructure } from '../utils/types/token';

export default (redisService: RedisService, tokenService: TokenService, logger: Logger) => async (req: Request & RequestObjectStructure, res: Response, next: NextFunction): Promise<void | Response> => {
    const { cookies: { refreshToken } } = req;
    try {
        const decodedRefreshToken = tokenService.decodeRefreshToken(refreshToken) as EnteredUser;

        const existingRefreshToken = await redisService.fetchRefreshToken(decodedRefreshToken.id);

        if (existingRefreshToken !== refreshToken) { throw new Forbidden403('access denied'); }

        req.headers.id = decodedRefreshToken.id;

        return next();
    } catch (error) {
        logger.error(error, 'refresh token check failed');
        if (error instanceof BaseHttpError) {
            return res.status(error.status).json(error.payload);
        }
        const errorResponse = new Server500('something went wrong');
        return res.status(errorResponse.status).json(errorResponse.payload);

    }
};
