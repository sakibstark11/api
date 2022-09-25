
import express, { NextFunction } from 'express';
import cookieParser from "cookie-parser";
import { Config } from './utils/types/config';
import ServiceMap from './utils/types/services';
import UserRouter from './routes/user';
import AuthenticationRouter from './routes/authentication';
import { MiddlewareMap } from './utils/types/middlewares';
import Controllers from './utils/types/controllers';


export default async ({ logger, port }: Config, { user }: Controllers, { authentication, refreshToken }: MiddlewareMap) => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    const userRouter = UserRouter(user, logger);
    // const authenticationRouter = AuthenticationRouter(user, redis, token, authentication as NextFunction, refreshToken as NextFunction, logger);

    app.use("/user", userRouter);
    // app.use("/login", authenticationRouter);



    app.listen(port, () => {
        logger.info(`listening on port ${port}`);
    });
};
