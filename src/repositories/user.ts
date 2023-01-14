import { Repository } from 'typeorm';
import UserModel from '../models/user';
import { EnteredUser } from '../utils/types/user/enteredUser';
import { NewUser } from '../utils/types/user/newUser';

export default (connection: Repository<UserModel>) => {
    return {
        fetchUser: async (email: string): Promise<UserModel | null> => {
            const user = await connection.findOneBy({ email });
            return user;
        },
        insertUser: async ({ email, password, name }: NewUser): Promise<EnteredUser> => {
            const newUser = await connection.save({ email, password, name });
            const user = { email: newUser.email, id: newUser.id };
            return user;
        }
    };

};
