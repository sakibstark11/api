import dotenv from "dotenv";
import logger from './src/loggers/logger';
import App from './src/app';
import Config from './src/utils/types/config';
import database from './src/utils/database/database';
import UserModel from './src/models/user';
import RepositoryMap from './src/utils/types/repositories';


dotenv.config({ path: `${__dirname}/.env` });

const config: Config = {
    port: Number(process.env.PORT),
    logger,
    database: {
        host: process.env.DB_HOST as string,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER as string,
        name: process.env.DB_NAME as string,
        password: process.env.DB_PASSWORD as string,
    }
};

const dataSource = database(config);

const repositories: RepositoryMap = {
    user: dataSource.getRepository(UserModel)
};

App(config, dataSource, repositories);
