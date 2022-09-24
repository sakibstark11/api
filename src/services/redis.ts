import { Logger } from 'pino';
import RedisSource from '../utils/redis/redis';

export default (repository: ReturnType<typeof RedisSource>, refreshTokenTTL: number, logger: Logger) => {
    return {
        storeRefreshToken: (key: string, token: string) => {
            return repository.set(key, token, {
                EX: refreshTokenTTL
            });
        },
        fetchRefreshToken: (key: string) => {
            return repository.get(key);
        },
        removeRefreshToken: (key: string) => {
            return repository.del(key);
        }
    };

};
