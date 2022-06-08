import { Router, Request, Response } from "express";
import { Logger } from 'pino';
import { Repository } from 'typeorm';
import AuthenticationController from '../controllers/authentication';
import UserService from '../services/user';
import UserModel from '../models/user';
import unauthorizedUser from '../utils/types/newUser';

export default (userService: any
    , redisService: any,
    tokenService: any, logger: Logger) => {
    const router = Router();
    const controller = AuthenticationController(redisService, userService, tokenService, logger);


    router.post('/', async (req: Request, res: Response) => {
        const { email, password } = req.body as unauthorizedUser;
        const { status, payload } = await controller.loginUser({ email, password });
        return res.status(status).json(payload);
    });
    return router;
};
