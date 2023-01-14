import { Router, Request, Response } from 'express';
import { TypeUserController } from '../utils/types/controllers';
import { NewUser } from '../utils/types/user/newUser';

export default (controller: TypeUserController) => {
    const router = Router();
    router.post('/', async (req: Request, res: Response) => {
        const { email, password, name } = req.body as NewUser;
        const { status, payload } = await controller.createUser({
            email,
            password,
            name,
        });
        return res.status(status).json(payload);
    });
    return router;
};
