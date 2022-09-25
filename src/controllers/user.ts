import { Logger } from 'pino';
import { validate } from 'class-validator';
import UserModel from '../models/user';
import { EnteredUser } from '../utils/types/user/enteredUser';
import HttpResponse from '../utils/types/responses/base';
import {
    BadRequest400,
    BaseHttpError,
    Server500,
} from '../utils/types/responses/errors/httpErrors';
import { NewUser } from '../utils/types/user/newUser';
import { TypeUserService } from '../utils/types/services';

export default (service: TypeUserService, logger: Logger) => {
    return {
        createUser: async ({
            email,
            password,
            name,
        }: NewUser): Promise<HttpResponse<BaseHttpError | EnteredUser>> => {
            const user = new UserModel({ email, password, name });
            try {
                const inputValidation = await validate(user);
                if (inputValidation.length) {
                    throw new BadRequest400(
                        'please check payload',
                        inputValidation,
                    );
                }
                const createdUser = await service.createUser(user);
                if (createdUser === null) {
                    throw new Server500('please check payload');
                }
                logger.info({ createdUser }, 'user created');
                return {
                    status: 200,
                    payload: createdUser,
                };
            } catch (error) {
                if (error instanceof BaseHttpError) {
                    logger.error({ error, email });
                    return error.removeStackTrace();
                }
                return new Server500('something went wrong').removeStackTrace();
            }
        },
    };
};
