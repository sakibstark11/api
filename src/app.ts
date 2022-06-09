
import express from 'express';
import { Config } from './utils/types/config';
import ServiceMap from './utils/types/services';
import UserRouter from './routes/user';
import AuthenticationRouter from './routes/authentication';
import { MiddlewareMap } from './utils/types/middlewares';


export default async ({ logger, port }: Config, { user, redis, token }: ServiceMap, { authentication }: MiddlewareMap) => {
    const app = express();
    app.use(express.json());

    const userRouter = UserRouter(user, logger);
    const authenticationRouter = AuthenticationRouter(user, redis, token, authentication, logger);

    app.use("/user", userRouter);
    app.use("/login", authenticationRouter);



    app.listen(port, () => {
        logger.info(`listening on port ${port}`);
    });
};
