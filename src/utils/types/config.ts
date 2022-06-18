import { Logger } from 'pino';
import { TokenConfig } from './token';

export type Config = {
    port: number;
    logger: Logger;
    database: {
        host: string,
        port: number,
        user: string,
        name: string;
        password: string;
    };
    redis: {
        host: string,
        port: number;
    },
    token: {
        access: TokenConfig;
        refresh: TokenConfig;
    };
};
