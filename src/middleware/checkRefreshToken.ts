import { NextFunction, Request, Response } from 'express';
import { Logger } from 'pino';
import { EnteredUser } from '../utils/types/user/enteredUser';
import {
    BaseHttpError,
    Server500,
    Forbidden403,
} from '../utils/types/responses/errors/httpErrors';
import { RequestObjectStructure } from '../utils/types/token';
import { TypeRedisService, TypeTokenService } from '../utils/types/services';

export default (
        redisService: TypeRedisService,
        tokenService: TypeTokenService,
        logger: Logger,
    ) =>
    async (
        req: Request & RequestObjectStructure,
        res: Response,
        next: NextFunction,
    ): Promise<void | Response> => {
        const {
            cookies: { refreshToken },
            headers: { authorization },
        } = req;
        try {
            const accessToken = authorization.split('Bearer ')[1];
            const decodedRefreshToken = tokenService.decodeRefreshToken(
                refreshToken,
            ) as EnteredUser;
            const decodeAccessToken =
                tokenService.decodeAccessToken(accessToken);

            if (decodeAccessToken === null) {
                throw new Error('invalid token');
            }

            if (decodedRefreshToken === null) {
                throw new Forbidden403('access denied');
            }

            const existingRefreshToken = await redisService.fetchRefreshToken(
                decodedRefreshToken.id,
            );

            if (existingRefreshToken !== refreshToken) {
                throw new Forbidden403('access denied');
            }

            req.headers.id = decodedRefreshToken.id;

            logger.info(
                { id: decodedRefreshToken.id },
                'refresh token checked',
            );
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
