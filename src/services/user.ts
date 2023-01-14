import { Logger } from 'pino';
import UserModel from '../models/user';
import { TypeUserRepository } from '../utils/types/repositories';
import { EnteredUser } from '../utils/types/user/enteredUser';
import { NewUser } from '../utils/types/user/newUser';

export default (repository: TypeUserRepository, logger: Logger) => {
    return {
        getUser: async (email: string): Promise<UserModel | null> => {
            const user = await repository.fetchUser(email);
            if (user === null) {
                logger.info({ email }, 'no user found');
            }
            return user;
        },
        createUser: async ({ email, password, name }: NewUser): Promise<EnteredUser | null> => {
            const existingUser = await repository.fetchUser(email);
            if (existingUser) {
                return null;
            }
            const createdUser = await repository.insertUser({ email, password, name });
            return { id: createdUser.id, email: createdUser.email };
        }
    };
};
