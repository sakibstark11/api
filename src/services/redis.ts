import { Logger } from 'pino';

export default (repository: any, refreshTokenTTL: number, logger: Logger) => ({
    storeRefreshToken: async (key: string, token: string) => {
        try {
            await repository.set(key, token, {
                EX: refreshTokenTTL
            });
            return true;
        } catch (error) {
            logger.error(error, `failed to store refresh token for ${key}`);
            return null;
        }
    },

    fetchRefreshToken: async (key: string) => {
        try {
            return repository.get(key);
        } catch (error) {
            logger.error(error, `failed to fetch refresh token for ${key}`);
            return null;
        }
    }
});
