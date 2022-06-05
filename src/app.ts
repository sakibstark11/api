
import express from 'express';
import Config from './utils/types/config';
import RepositoryMap from './utils/types/repositories';
import UserRouter from './routes/user';
import { DataSource } from 'typeorm';


export default async ({ logger, port }: Config, dataSource: DataSource, { user }: RepositoryMap) => {

    const app = express();
    app.use(express.json());

    const userRouter = UserRouter(user, logger);
    app.use("/user", userRouter);

    dataSource.initialize().then(() => {
        app.listen(port, () => {
            logger.info(`listening on port ${port}`);
        });
    }).catch((error) => {
        logger.error(error);
    });

};
