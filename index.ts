import dotenv from "dotenv";
import logger from './src/loggers/logger';
import App from './src/app';
import Config from './src/utils/types/config';
import DataSource from './src/utils/database/database';
import RedisSource from './src/utils/redis/redis';
import TokenService from "./src/services/token";
import UserModel from './src/models/user';
import UserService from './src/services/user';
import ServiceMap from './src/utils/types/services';

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

const dataSource = DataSource(config);
const redisSource = RedisSource();
const tokenService = TokenService(config);

const userService = UserService(dataSource.getRepository(UserModel), logger);

const services: ServiceMap = {
    user: userService,
    redis: redisSource,
    token: tokenService
};


dataSource.initialize().then(() => {
    logger.info('database initialized');
    redisSource.connect().then(() => {
        logger.info('redis initialized');
        App(config, services);
    });
}).catch((error) => {
    logger.error(error, 'something went wrong');
    process.exit(1);
});
