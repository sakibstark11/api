import { Router, Request, Response, NextFunction } from "express";
import { Logger } from 'pino';
import userController from '../controllers/user';
import UserService from '../services/user';
import { UnauthorizedUser } from '../utils/types/user/newUser';

export default (userService: UserService, logger: Logger) => {
    const router = Router();
    const controller = userController(userService, logger);
    router.post('/', async (req: Request, res: Response) => {
        const { email, password } = req.body as UnauthorizedUser;
        const { status, payload } = await controller.createUser({ email, password });
        return res.status(status).json(payload);
    });
    return router;
};
