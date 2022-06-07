import { createSecureServer } from 'http2';
import { Logger } from 'pino';
import { Repository, Tree } from 'typeorm';
import UserModel from '../models/user';
import EnteredUser from '../utils/types/enteredUser';
import NewUser from '../utils/types/newUser';

export default (repository: Repository<UserModel>) => ({
    checkIfExistingUser: async (email: string): Promise<Boolean> => {
        const user = await repository.findOneBy({ email });
        if (user) {
            return true;
        }
        return false;
    },

    createUser: async ({ email, password: passwordHash }: NewUser): Promise<EnteredUser> => {
        const newUser = await repository.save({ email, password: passwordHash });
        const user = { email: newUser.email, id: newUser.id };
        return user;
    }
});
