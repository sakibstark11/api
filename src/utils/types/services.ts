import TokenService from '../../services/token';
import RedisService from '../../services/redis';
import UserService from '../../services/user';

export type TypeUserService = ReturnType<typeof UserService>;
export type TypeRedisService = ReturnType<typeof RedisService>;
export type TypeTokenService = ReturnType<typeof TokenService>;

import { TypeUserController } from '../../utils/types/controllers';

export default interface Controllers {
    user: TypeUserController;
}
