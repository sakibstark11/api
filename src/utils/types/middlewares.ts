import AuthenticationMiddleware from '../../middleware/checkAuthentication';

export type MiddlewareMap = {
    authentication: ReturnType<typeof AuthenticationMiddleware>;
};
