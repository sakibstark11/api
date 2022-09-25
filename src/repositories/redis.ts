import { Logger } from 'pino';
import RedisSource from '../utils/redis/redis';

export default (connection: ReturnType<typeof RedisSource>) => {
    return {
        store: (key: string, token: string, refreshTokenTTL: number) => {
            return connection.set(key, token, {
                EX: refreshTokenTTL
            });
        },
        fetch: (key: string) => {
            return connection.get(key);
        },
        delete: (key: string) => {
            return connection.del(key);
        }
    };

};
