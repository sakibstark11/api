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
            ttl: string;
        };
        refresh: {
            secret: string,
            ttl: string;
        };
    };
}
