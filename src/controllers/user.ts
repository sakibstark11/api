import { Logger } from 'pino';
import UserModel from '../models/user';
import UserService from '../services/user';
import { EnteredUser } from '../utils/types/enteredUser';
import HttpResponse from '../utils/types/responses/base';
import { BaseHttpError, Conflict409, Server500 } from '../utils/types/responses/errors/httpErrors';
import { UnauthorizedUser } from '../utils/types/newUser';

export default (service: UserService, logger: Logger) => {
    return {
        createUser: async ({ email, password }: UnauthorizedUser): Promise<HttpResponse<BaseHttpError | EnteredUser>> => {
            const user = new UserModel();
            user.email = email;
            user.password = password;
            try {
                const existingUser = await service.getUser(email);
                if (existingUser) {
                    throw new Conflict409(`user already exists`);
                }
                const createdUser = await service.createUser(user);
                logger.info({ createdUser }, 'user created');
                return {
                    status: 200,
                    payload: createdUser
                };


            } catch (error) {
                if (error instanceof BaseHttpError) {
                    logger.error({ error, email });
                    return error.removeStackTrace();
                }
                return new Server500('something went wrong').removeStackTrace();
            }
        }
    };
};
