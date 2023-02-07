import UserRepository from '../../repositories/user';
import RedisRepository from '../../repositories/redis';

export type TypeUserRepository = ReturnType<typeof UserRepository>;
export type RedisRepository = ReturnType<typeof RedisRepository>;
