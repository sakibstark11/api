import { Router, Request, Response } from "express";
import { Logger } from 'pino';
import userController from '../controllers/user';
import unauthorizedUser from '../utils/types/newUser';

export default (userRepository: any, logger: Logger) => {
    const router = Router();
    const controller = userController(userRepository, logger);
        router.post('/', async (req: Request, res: Response) => {
            const { email, password } = req.body as unauthorizedUser;
            const { status, payload } = await controller.createUser({ email, password });
            return res.status(status).json(payload);
        });
    return router;
};
