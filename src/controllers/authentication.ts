import { Logger } from 'pino';
import HttpResponse from '../utils/types/responses/base';
import { BaseHttpError, Server500, NotFound404, Forbidden403 } from '../utils/types/responses/errors/httpErrors';
import { UnauthorizedUser } from '../utils/types/user/newUser';
import { TokenResponsePayload } from '../utils/types/token';
import { GenericResponse } from '../utils/types/genericResponse';

export default (redisService: any, userService: any, tokenService: any, logger: Logger) => {
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

                const accessToken = tokenService.createAccessToken(user);
                const refreshToken = tokenService.createRefreshToken(user);

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
        }
    };
};
