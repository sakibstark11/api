import { Entity, Column } from "typeorm";
import { IsEmail, Length } from 'class-validator';
import { UnauthorizedUser } from '../utils/types/user/newUser';

import Base from "./base/base";

@Entity()
export default class UserModel extends Base implements UnauthorizedUser {
    @IsEmail()
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Length(5, 30)
    @Column()
    name: string;
}
