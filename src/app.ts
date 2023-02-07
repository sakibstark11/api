import express, { NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { Config } from './utils/types/config';
import UserRouter from './routes/user';
import AuthenticationRouter from './routes/authentication';
import { MiddlewareMap } from './utils/types/middlewares';
import Controllers from './utils/types/controllers';

export default async (
    {
        logger,
        port,
        token: {
            refresh: { ttl },
        },
    }: Config,
    { user, authentication }: Controllers,
    {
        authentication: authMiddleware,
        refreshToken: refreshTokenMiddleware,
    }: MiddlewareMap,
) => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    const userRouter = UserRouter(user);
    const authenticationRouter = AuthenticationRouter(
        authentication,
        authMiddleware as NextFunction,
        refreshTokenMiddleware as NextFunction,
        ttl,
    );

    app.use('/user', userRouter);
    app.use('/login', authenticationRouter);

    app.listen(port, () => {
        logger.info(`listening on port ${port}`);
    });
};
