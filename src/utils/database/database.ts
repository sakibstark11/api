import { DataSource } from 'typeorm';

import UserModel from '../../models/user';
import { Config } from '../types/config';

export default ({ database: { user, host, port, password, name } }: Config) =>
    new DataSource({
        type: 'postgres',
        host,
        port,
        username: user,
        password: password,
        database: name,
        synchronize: true,
        entities: [UserModel],
        subscribers: [],
        migrations: [],
    });
