import { Router, Request, Response, NextFunction } from "express";
import { Logger } from 'pino';
import userController from '../controllers/user';
import { TypeUserService } from '../utils/types/services';
import { NewUser } from '../utils/types/user/newUser';

export default (userService: TypeUserService, logger: Logger) => {
    const router = Router();
    const controller = userController(userService, logger);
    router.post('/', async (req: Request, res: Response) => {
        const { email, password, name } = req.body as NewUser;
        const { status, payload } = await controller.createUser({ email, password, name });
        return res.status(status).json(payload);
    });
    return router;
};
