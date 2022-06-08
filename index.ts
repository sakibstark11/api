import dotenv from "dotenv";
import logger from './src/loggers/logger';
import App from './src/app';
import Config from './src/utils/types/config';
import database from './src/utils/database/database';
import redis from './src/utils/redis/redis';
import UserModel from './src/models/user';
import ServiceMap from './src/utils/types/services';
import tokenService from "./src/services/token";
import UserService from './src/services/user';

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
    },
    token: {
        access: {
            secret: process.env.ACCESS_TOKEN_SECRET as string,
            ttl: '2m'
        },
        refresh: {
            secret: process.env.REFRESH_TOKEN_SECRET as string,
            ttl: '2h'
        }
    }
};

const dataSource = database(config);
const redisSource = redis();
const tokenSource = tokenService(config);

const repositories: ServiceMap = {
    user: UserService(dataSource.getRepository(UserModel)),
    redis: redisSource,
    token: tokenSource
};


dataSource.initialize().then(() => {
    logger.info('database initialized');
    redisSource.connect().then(() => {
        logger.info('redis initialized');
        App(config, repositories);
    });
}).catch((error) => {
    logger.error(error);
});
