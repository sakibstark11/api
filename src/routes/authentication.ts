import { Router, Request, Response, NextFunction } from "express";
import { Logger } from 'pino';
import AuthenticationController from '../controllers/authentication';
import RedisService from '../services/redis';
import TokenService from '../services/token';
import UserService from '../services/user';
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
        return res.status(status).json(payload);
    });

    router.delete('/', authenticationMiddleware, async (req: Request, resp: Response) => {
        const { status, payload } = await controller.logoutUser(req.headers.id as string);
        return resp.status(status).json(payload);
    });
    return router;
};
