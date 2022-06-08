
import express from 'express';
import Config from './utils/types/config';
import ServiceMap from './utils/types/services';
import UserRouter from './routes/user';
import AuthenticationRouter from './routes/authentication';
import { DataSource } from 'typeorm';
import AuthenticationMiddleware from './middleware/checkAuthentication';


export default async ({ logger, port }: Config, { user, redis, token }: ServiceMap) => {
    const app = express();
    app.use(express.json());

    const authenticationRequired = AuthenticationMiddleware(redis, token, logger);

    const userRouter = UserRouter(user, logger);
    const authenticationRouter = AuthenticationRouter(user, redis, token, logger);

    app.use("/user", authenticationRequired, userRouter);
    app.use("/login", authenticationRouter);



    app.listen(port, () => {
        logger.info(`listening on port ${port}`);
    });
};
