import { Logger } from 'pino';
import { Repository } from 'typeorm';
import UserModel from '../models/user';
import NewUser from '../utils/types/newUser';

export default (repository: Repository<UserModel>, logger: Logger) => ({
    createUser: async ({ email, password }: NewUser) => {
        const user = new UserModel();
        user.email = email;
        user.password = password;

        const createdUser = await repository.save(user);
        logger.info(createdUser);
    }
});
