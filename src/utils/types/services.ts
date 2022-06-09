import TokenService from '../../services/token';
import RedisService from '../../services/redis';
import UserService from '../../services/user';

export default interface ServiceMap {
    user: UserService;
    redis: RedisService;
    token: TokenService;
}
