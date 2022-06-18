import { Entity, Column } from "typeorm";
import { UnauthorizedUser } from '../utils/types/user/newUser';

import Base from "./base/base";

@Entity()
export default class UserModel extends Base implements UnauthorizedUser {
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;
}
