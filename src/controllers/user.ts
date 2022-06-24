import { Logger } from 'pino';
import { validate } from 'class-validator';
import UserModel from '../models/user';
import UserService from '../services/user';
import { EnteredUser } from '../utils/types/user/enteredUser';
import HttpResponse from '../utils/types/responses/base';
import { BadRequest400, BaseHttpError, Conflict409, Server500 } from '../utils/types/responses/errors/httpErrors';
import { NewUser } from '../utils/types/user/newUser';

export default (service: UserService, logger: Logger) => {
    return {
        createUser: async ({ email, password, name }: NewUser): Promise<HttpResponse<BaseHttpError | EnteredUser>> => {
            const user = new UserModel();
            user.email = email;
            user.password = password;
            user.name = name;
            try {
                const inputValidation = await validate(user);
                if (inputValidation.length) {
                    throw new BadRequest400('please check payload', inputValidation);
                }
                const existingUser = await service.getUser(email);
                if (existingUser) {
                    throw new Conflict409('user already exists');
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
