import { Router, Request, Response, NextFunction } from 'express';
import { isPayloadHTTPError } from '../utils/typeGuard';
import { TypeAuthenticationController } from '../utils/types/controllers';
import { HttpResponse } from '../utils/types/responses/base';
import { BaseHttpError } from '../utils/types/responses/errors/httpErrors';
import { TokenResponsePayload } from '../utils/types/token';
import { UnauthorizedUser } from '../utils/types/user/newUser';

export default (
    controller: TypeAuthenticationController,
    authenticationMiddleware: NextFunction,
    refreshTokenMiddleware: NextFunction,
    refreshTokenTtl: number,
) => {
    const router = Router();

    router.post('/', async (req: Request, res: Response) => {
        const { email, password } = req.body as UnauthorizedUser;
        const { status, payload } = (await controller.loginUser({
            email,
            password,
        })) as HttpResponse<BaseHttpError | Partial<TokenResponsePayload>>;

        if (!isPayloadHTTPError(payload)) {
            res.cookie('refreshToken', payload.refreshToken, {
                maxAge: refreshTokenTtl,
                secure: true,
                httpOnly: true,
            });
            delete payload.refreshToken;
        }

        return res.status(status).json(payload);
    });

    router.delete(
        '/',
        authenticationMiddleware,
        async (req: Request, res: Response) => {
            const { status, payload } = await controller.logoutUser(
                req.headers.id as string,
            );
            return res.status(status).json(payload);
        },
    );

    router.get(
        '/',
        refreshTokenMiddleware,
        async (req: Request, res: Response) => {
            const { status, payload } = await controller.refreshUser(
                req.headers.id as string,
            );
            return res.status(status).json(payload);
        },
    );
    return router;
};
