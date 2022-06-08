import token from '../../services/token';
import redis from '../redis/redis';
import user from '../../services/user';

export default interface ServiceMap {
    user: any;
    redis: any;
    token: any;
}
