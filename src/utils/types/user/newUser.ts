export interface UnauthorizedUser {
    email: string;
    password: string;
}

export interface NewUser extends UnauthorizedUser {
    name: string;
}
