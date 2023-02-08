import UserController from '../../controllers/user';
import AuthenticationController from '../../controllers/authentication';

export type TypeUserController = ReturnType<typeof UserController>;
export type TypeAuthenticationController = ReturnType<
    typeof AuthenticationController
>;

export default interface Controllers {
    user: TypeUserController;
    authentication: TypeAuthenticationController;
}
