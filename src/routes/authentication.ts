import { Router, Request, Response, NextFunction } from "express";
import { Logger } from 'pino';
import AuthenticationController from '../controllers/authentication';
import RedisService from '../services/redis';
import TokenService from '../services/token';
import UserService from '../services/user';
import { GenericResponse } from '../utils/types/genericResponse';
import HttpResponse from '../utils/types/responses/base';
import { BaseHttpError } from '../utils/types/responses/errors/httpErrors';
import { TokenResponsePayload } from '../utils/types/token';
import { UnauthorizedUser } from '../utils/types/user/newUser';

export default (userService: UserService,
    redisService: RedisService,
    tokenService: TokenService,
    authenticationMiddleware: NextFunction,
    logger: Logger) => {
    const router = Router();
    const controller = AuthenticationController(redisService, userService, tokenService, logger);

    router.post('/', async (req: Request, res: Response) => {
        const { email, password } = req.body as UnauthorizedUser;;
        const { status, payload } = await controller.loginUser({ email, password });
        const modifiedPayload: GenericResponse | Partial<TokenResponsePayload> = { ...payload };
        if ("refreshToken" in modifiedPayload) {
            res.cookie("refreshToken", modifiedPayload.refreshToken, { maxAge: tokenService.refreshTokenTTL, httpOnly: true, secure: true, path: "/api" });
            delete modifiedPayload.refreshToken;
        }
        return res.status(status).json(modifiedPayload);
    });

    router.delete('/', authenticationMiddleware, async (req: Request, resp: Response) => {
        const { status, payload } = await controller.logoutUser(req.headers.id as string);
        return resp.status(status).json(payload);
    });
    return router;
};
