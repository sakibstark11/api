import { Logger } from 'pino';
import { Repository } from 'typeorm';
import UserModel from '../models/user';
import EnteredUser from '../utils/types/enteredUser';
import unauthorizedUser from '../utils/types/newUser';

export default (repository: Repository<UserModel>, logger: Logger) => ({
    getUser: async (email: string): Promise<UserModel | null> => {
        const user = await repository.findOneBy({ email });
        if (user) {
            return user;
        }
        return null;
    },

    createUser: async ({ email, password: passwordHash }: unauthorizedUser): Promise<EnteredUser> => {
        const newUser = await repository.save({ email, password: passwordHash });
        const user = { email: newUser.email, id: newUser.id };
        return user;
    }
});
