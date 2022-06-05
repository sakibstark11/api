import { Logger } from 'pino';

interface Config {
    port: number;
    logger: Logger;
    database: {
        host: string,
        port: number,
        user: string,
        name: string;
        password: string;
    };
}

export default Config;
