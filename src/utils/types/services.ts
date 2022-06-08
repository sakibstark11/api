import { Repository } from 'typeorm';
import UserModel from '../../models/user';

export default interface ServiceMap {
    user: any;
    redis: any;
    token: any;
}
