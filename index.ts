import * as dotenv from "dotenv";
import logger from './src/loggers/logger';
import App from './src/app';
import { Config } from './src/utils/types/config';
import AuthenticationMiddleware from './src/middleware/checkAuthentication';
import RefreshTokenMiddleware from './src/middleware/checkRefreshToken';
import { MiddlewareMap } from './src/utils/types/middlewares';
import DataSource from './src/utils/database/database';
import RedisSource from './src/utils/redis/redis';
import UserModel from './src/models/user';
import UserService from './src/services/user';
import RedisService from './src/services/redis';
import TokenService from "./src/services/token";
import ServiceMap from './src/utils/types/services';

import UserRepository from "./src/repositories/user";
import RedisRepository from "./src/repositories/redis";


dotenv.config({ path: `${__dirname}/.env` });

const config: Config = {
    port: Number(process.env.APP_PORT),
    logger,
    database: {
        host: process.env.DB_HOST as string,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER as string,
        name: process.env.DB_NAME as string,
        password: process.env.DB_PASSWORD as string,
    },
    redis: {
        host: process.env.REDIS_HOST as string,
        port: Number(process.env.REDIS_PORT),
    },
    token: {
        access: {
            secret: process.env.ACCESS_TOKEN_SECRET as string,
            ttl: Number(process.env.ACCESS_TOKEN_TTL_SECONDS)
        },
        refresh: {
            secret: process.env.REFRESH_TOKEN_SECRET as string,
            ttl: Number(process.env.REFRESH_TOKEN_TTL_SECONDS)
        }
    }
};

const dataSource = DataSource(config);
const redisSource = RedisSource(config);

const userRepository = UserRepository(dataSource.getRepository(UserModel));
const redisRepository = RedisRepository(redisSource);

const tokenService = TokenService(config.token.access, config.token.refresh, logger);
const userService = UserService(userRepository, logger);
const redisService = RedisService(redisRepository, config.token.refresh.ttl, logger);

const services: ServiceMap = {
    user: userService,
    redis: redisService,
    token: tokenService
};

const middlewareFunctions: MiddlewareMap = {
    authentication: AuthenticationMiddleware(redisService, tokenService, logger),
    refreshToken: RefreshTokenMiddleware(redisService, tokenService, logger)
};

dataSource.initialize().then(() => {
    logger.info('database initialized');
    redisSource.connect().then(() => {
        logger.info('redis initialized');
        App(config, services, middlewareFunctions);
    }).catch((error) => {
        logger.error(error, "failed to initialize redis");
        process.exit(1);
    });
}).catch((error) => {
    logger.error(error, "failed to initialize database");
    process.exit(1);
});
