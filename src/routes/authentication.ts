import { Router, Request, Response, NextFunction } from 'express';
import { isTokenPayload } from '../utils/typeGuard';
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

        if (isTokenPayload(payload)) {
            res.cookie('refreshToken', payload.refreshToken, {
                maxAge: refreshTokenTtl * 1000,
                httpOnly: true,
                secure: true,
                path: '/',
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

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                path: '/',
            });

            return res.status(status).json(payload);
        },
    );

    router.get(
        '/',
        refreshTokenMiddleware,
        async (req: Request, res: Response) => {
            const { status, payload } = (await controller.refreshUser(
                req.headers.id as string,
            )) as HttpResponse<BaseHttpError | Partial<TokenResponsePayload>>;

            if (isTokenPayload(payload)) {
                res.cookie('refreshToken', payload.refreshToken, {
                    maxAge: refreshTokenTtl * 1000,
                    httpOnly: true,
                    secure: true,
                    path: '/',
                });
                delete payload.refreshToken;
            }

            return res.status(status).json(payload);
        },
    );
    return router;
};
