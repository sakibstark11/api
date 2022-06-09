import { Logger } from 'pino';
import RedisSource from '../utils/redis/redis';


export default class RedisService {
    private repository: any;
    private refreshTokenTTL: number;

    constructor(repository: ReturnType<typeof RedisSource>, refreshTokenTTL: number, logger: Logger) {
        this.refreshTokenTTL = refreshTokenTTL;
        this.repository = repository;
    }

    storeRefreshToken(key: string, token: string) {
        return this.repository.set(key, token, {
            EX: this.refreshTokenTTL
        });
    }

    fetchRefreshToken(key: string) {
        return this.repository.get(key);
    }

    removeRefreshToken(key: string) {
        return this.repository.del(key);
    }
}
