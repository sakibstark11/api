import { Router, Request, Response, NextFunction } from "express";
import { Logger } from 'pino';
import { TypeAuthenticationController } from '../utils/types/controllers';
import { GenericResponse } from '../utils/types/genericResponse';
import { TokenResponsePayload } from '../utils/types/token';
import { UnauthorizedUser } from '../utils/types/user/newUser';

const COOKIE_EXPIRATION_MS = 1000;

export default (controller: TypeAuthenticationController,
    authenticationMiddleware: NextFunction,
    refreshTokenMiddleware: NextFunction,
    logger: Logger) => {
    const router = Router();

    router.post('/', async (req: Request, res: Response) => {
        const { email, password } = req.body as UnauthorizedUser;;
        const { status, payload } = await controller.loginUser({ email, password });
        return res.status(status).json(payload);
    });

    router.delete('/', authenticationMiddleware, async (req: Request, res: Response) => {
        const { status, payload } = await controller.logoutUser(req.headers.id as string);
        return res.status(status).json(payload);
    });

    router.get('/', refreshTokenMiddleware, async (req: Request, res: Response) => {
        const { status, payload } = await controller.refreshUser(req.headers.id as string);
        return res.status(status).json(payload);
    });
    return router;
};
