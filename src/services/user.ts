import { Logger } from 'pino';
import { Repository } from 'typeorm';
import UserModel from '../models/user';
import { EnteredUser } from '../utils/types/user/enteredUser';
import { UnauthorizedUser } from '../utils/types/user/newUser';

export default class UserService {
    private repository: Repository<UserModel>;
    private logger: Logger;

    constructor(repository: Repository<UserModel>, logger: Logger) {
        this.repository = repository;
        this.logger = logger;
    }

    async getUser(email: string): Promise<UserModel | null> {
        const user = await this.repository.findOneBy({ email });
        if (user) {
            return user;
        }

        this.logger.info({ email }, 'no user found');

        return null;
    }

    async createUser({ email, password: passwordHash }: UnauthorizedUser): Promise<EnteredUser> {
        const newUser = await this.repository.save({ email, password: passwordHash });
        const user = { email: newUser.email, id: newUser.id };
        return user;
    }
}
