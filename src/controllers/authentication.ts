import { Logger } from 'pino';
import HttpResponse from '../utils/types/responses/base';
import { BaseHttpError, Server500, NotFound404, Forbidden403 } from '../utils/types/responses/errors/httpErrors';
import { UnauthorizedUser } from '../utils/types/user/newUser';
import { TokenResponsePayload } from '../utils/types/token';
import { GenericResponse } from '../utils/types/genericResponse';
import RedisService from '../services/redis';
import UserService from '../services/user';
import TokenService from '../services/token';
import { TypeRedisService, TypeTokenService, TypeUserService } from '../utils/types/services';

export default (redisService: TypeRedisService, userService: TypeUserService, tokenService: TypeTokenService, logger: Logger) => {
    return {
        loginUser: async ({ email, password }: UnauthorizedUser): Promise<HttpResponse<BaseHttpError | TokenResponsePayload>> => {
            try {
                const user = await userService.getUser(email);
                if (!user) {
                    throw new NotFound404(`user does not exist`);
                }

                if (user.password !== password) {
                    throw new Forbidden403(`email or password incorrect`);
                }

                const accessToken = tokenService.createAccessToken(user.id);
                const refreshToken = tokenService.createRefreshToken(user.id);

                await redisService.storeRefreshToken(user.id, refreshToken);

                return { status: 200, payload: { accessToken, refreshToken } };
            } catch (error) {
                if (error instanceof BaseHttpError) {
                    logger.error({ error, email });
                    return error.removeStackTrace();
                }
                return new Server500('something went wrong').removeStackTrace();
            }

        },
        logoutUser: async (id: string): Promise<HttpResponse<BaseHttpError | GenericResponse>> => {
            try {
                await redisService.removeRefreshToken(id);

                return { status: 200, payload: { message: 'logged out' } };
            } catch (error) {
                if (error instanceof BaseHttpError) {
                    logger.error({ error, id });
                    return error.removeStackTrace();
                }
                return new Server500('something went wrong').removeStackTrace();
            }
        },
        refreshUser: async (id: string): Promise<HttpResponse<BaseHttpError | TokenResponsePayload>> => {
            try {
                await redisService.removeRefreshToken(id);

                const accessToken = tokenService.createAccessToken(id);
                const refreshToken = tokenService.createRefreshToken(id);

                await redisService.storeRefreshToken(id, refreshToken);

                return { status: 200, payload: { accessToken, refreshToken } };
            } catch (error) {
                if (error instanceof BaseHttpError) {
                    logger.error({ error, id });
                    return error.removeStackTrace();
                }
                return new Server500('something went wrong').removeStackTrace();
            }
        }
    };
};
