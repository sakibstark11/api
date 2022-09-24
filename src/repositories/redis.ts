import { Logger } from 'pino';
import RedisSource from '../utils/redis/redis';

export default (connection: ReturnType<typeof RedisSource>) => {
    return {
        storeRefreshToken: (key: string, token: string, refreshTokenTTL: number) => {
            return connection.set(key, token, {
                EX: refreshTokenTTL
            });
        },
        fetchRefreshToken: (key: string) => {
            return connection.get(key);
        },
        removeRefreshToken: (key: string) => {
            return connection.del(key);
        }
    };

};
