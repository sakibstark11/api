import dotenv from "dotenv";
import logger from './src/loggers/logger';
import App from './src/app';
import { Config } from './src/utils/types/config';
import AuthenticationMiddleware from './src/middleware/checkAuthentication';
import { MiddlewareMap } from './src/utils/types/middlewares';
import DataSource from './src/utils/database/database';
import RedisSource from './src/utils/redis/redis';
import UserModel from './src/models/user';
import UserService from './src/services/user';
import RedisService from './src/services/redis';
import TokenService from "./src/services/token";
import ServiceMap from './src/utils/types/services';
import { NextFunction } from 'express';

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
            ttl: Number(process.env.ACCESS_TOKEN_TTL)
        },
        refresh: {
            secret: process.env.REFRESH_TOKEN_SECRET as string,
            ttl: Number(process.env.REFRESH_TOKEN_TTL)
        }
    }
};

const dataSource = DataSource(config);
const redisSource = RedisSource(config);

const tokenService = new TokenService(config.token.access, config.token.refresh, logger);
const userService = new UserService(dataSource.getRepository(UserModel), logger);
const redisService = new RedisService(redisSource, config.token.refresh.ttl, logger);

const services: ServiceMap = {
    user: userService,
    redis: redisService,
    token: tokenService
};

const middlewares: MiddlewareMap = {
    authentication: AuthenticationMiddleware(redisService, tokenService, logger)
};

dataSource.initialize().then(() => {
    logger.info('database initialized');
    redisSource.connect().then(() => {
        logger.info('redis initialized');
        App(config, services, middlewares);
    }).catch((error) => {
        logger.error(error, "failed to initialize redis");
        process.exit(1);
    });
}).catch((error) => {
    logger.error(error, "failed to initialize database");
    process.exit(1);
});
