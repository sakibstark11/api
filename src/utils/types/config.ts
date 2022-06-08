import { Logger } from 'pino';

export default interface Config {
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
        access: {
            secret: string,
            ttl: number;
        };
        refresh: {
            secret: string,
            ttl: number;
        };
    };
}
