import { Repository } from 'typeorm';
import UserModel from '../../models/user';

interface RepositoryMap {
    user: Repository<UserModel>;
}

export default RepositoryMap;
