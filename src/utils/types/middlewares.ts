export type MiddlewareMap = {
    authentication: (...args: any[]) => void;
    refreshToken: (...args: any[]) => void;
};
