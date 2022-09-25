import { Logger } from 'pino';
import { RedisRepository } from '../utils/types/repositories';

export default (repository: RedisRepository, refreshTokenTTL: number, logger: Logger) => {
    return {
        storeRefreshToken: (key: string, token: string) => {
            return repository.store(key, token,
                refreshTokenTTL
            );
        },
        fetchRefreshToken: (key: string) => {
            return repository.fetch(key);
        },
        removeRefreshToken: (key: string) => {
            return repository.delete(key);
        }
    };

};
