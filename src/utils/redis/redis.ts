import { createClient } from 'redis';
import { Config } from '../types/config';

export default ({ redis: {
    host, port
} }: Config) => createClient({ socket: { host, port } });
