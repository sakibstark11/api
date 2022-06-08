import { Logger } from 'pino';

export default (repository: any, refreshTokenTTL: number, logger: Logger) => ({
    storeRefreshToken: (key: string, token: string) => repository.set(key, token, {
        EX: refreshTokenTTL
    }),

    fetchRefreshToken: (key: string) => repository.get(key),

    removeRefreshToken: (key: string) => repository.del(key)
});
