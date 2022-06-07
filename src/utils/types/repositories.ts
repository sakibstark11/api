import { Repository } from 'typeorm';
import UserModel from '../../models/user';

export default interface RepositoryMap {
    user: Repository<UserModel>;
}
