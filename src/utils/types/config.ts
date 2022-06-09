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
    token: {
        access: TokenConfig;
        refresh: TokenConfig;
    };
};
