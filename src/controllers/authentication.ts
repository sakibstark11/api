import { Logger } from 'pino';
import { Repository } from 'typeorm';
import UserModel from '../models/user';
import UserService from '../services/user';
import EnteredUser from '../utils/types/enteredUser';
import HttpResponse from '../utils/types/responses/base';
import { BaseError, Conflict409, Server500, NotFound404, Forbidden403 } from '../utils/types/responses/errors/httpErrors';
import unauthorizedUser from '../utils/types/newUser';
import Token from '../utils/types/token';

export default (redisService: any, userService: any, tokenService: any, logger: Logger) => {
    return {
        loginUser: async ({ email, password }: unauthorizedUser): Promise<HttpResponse<BaseError | Token>> => {
            try {
                const user = await userService.getUser(email);
                if (!user) {
                    throw new NotFound404(`user does not exist`);
                }

                if (user.password !== password) {
                    throw new Forbidden403(`email or password incorrect`);
                }

                const accessToken = await tokenService.createAccessToken(user);
                const refreshToken = await tokenService.createRefreshToken(user);

                return { status: 200, payload: { accessToken, refreshToken } };

            } catch (error) {
                if (error instanceof BaseError) {
                    logger.error({ error, email });
                    return error.removeStackTrace();
                }
                return new Server500('something went wrong').removeStackTrace();
            }

        }
    };
};
