import TokenService from '../../services/token';
import RedisService from '../../services/redis';
import UserService from '../../services/user';

export type TypeUserService = ReturnType<typeof UserService>;
export type TypeRedisService = ReturnType<typeof RedisService>;
export type TypeTokenService = ReturnType<typeof TokenService>;

export default interface ServiceMap {
    user: TypeUserService;
    redis: TypeRedisService;
    token: TypeTokenService;
}
