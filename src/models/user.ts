import { IsEmail } from 'class-validator';
import { Entity, Column } from "typeorm";
import { UnauthorizedUser } from '../utils/types/newUser';

import Base from "./base/base";

@Entity()
export default class UserModel extends Base implements UnauthorizedUser {
    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column()
    password: string;
}
