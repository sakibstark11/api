import { Router, Request, Response } from "express";
import { Logger } from 'pino';
import { Repository } from 'typeorm';
import user from '../controllers/user';
import userController from '../controllers/user';
import UserModel from '../models/user';
import NewUser from '../utils/types/newUser';

export default (repository: Repository<UserModel>, logger: Logger) => {
    const router = Router();
    const controller = userController(repository, logger);
    router.post('/', async (req: Request, res: Response) => {
        const { email, password } = req.body as NewUser;
        const { status, payload } = await controller.createUser({ email, password });
        return res.status(status).json(payload);
    });
    return router;
};
