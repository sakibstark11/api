import { Logger } from 'pino';
import { Repository } from 'typeorm';
import UserModel from '../models/user';
import UserService from '../services/user';
import EnteredUser from '../utils/types/enteredUser';
import HttpResponse from '../utils/types/responses/base';
import { BaseError, Conflict409, Server500 } from '../utils/types/responses/errors/httpErrors';
import NewUser from '../utils/types/newUser';

export default (repository: Repository<UserModel>, logger: Logger) => {
    const service = UserService(repository);
    return {
        createUser: async ({ email, password }: NewUser): Promise<HttpResponse<BaseError | EnteredUser>> => {
            const user = new UserModel();
            user.email = email;
            user.password = password;
            try {
                const isExistingUser = await service.checkIfExistingUser(email);
                if (isExistingUser) {
                    throw new Conflict409(`user already exists`);
                }
                const createdUser = await service.createUser(user);
                logger.info({ createdUser }, 'user created');
                return {
                    status: 200,
                    payload: createdUser
                };
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
