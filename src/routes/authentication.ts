import { Router, Request, Response } from "express";
import { Logger } from 'pino';
import AuthenticationController from '../controllers/authentication';
import { UnauthorizedUser } from '../utils/types/newUser';

export default (userService: any,
    redisService: any,
    tokenService: any, logger: Logger) => {
    const router = Router();
    const controller = AuthenticationController(redisService, userService, tokenService, logger);

    router.post('/', async (req: Request, res: Response) => {
        const { email, password } = req.body as UnauthorizedUser;;
        const { status, payload } = await controller.loginUser({ email, password });
        return res.status(status).json(payload);
    });

    router.delete('/', async (req: Request, resp: Response) => {
        const { status, payload } = await controller.logoutUser(req.headers.id as string);
        return resp.status(status).json(payload);
    });
    return router;
};
