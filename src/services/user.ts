import { Logger } from 'pino';
import { Repository } from 'typeorm';
import UserModel from '../models/user';
import { EnteredUser } from '../utils/types/user/enteredUser';
import { NewUser } from '../utils/types/user/newUser';

export default (repository: Repository<UserModel>, logger: Logger) => {
    return {
        getUser: async (email: string): Promise<UserModel | null> => {
            const user = await repository.findOneBy({ email });
            if (user === null) { logger.info({ email }, 'no user found'); }
            return user;
        },
        createUser: async ({ email, password: passwordHash, name }: NewUser): Promise<EnteredUser> => {
            const newUser = await repository.save({ email, password: passwordHash, name });
            const user = { email: newUser.email, id: newUser.id };
            return user;
        }
    };

};
