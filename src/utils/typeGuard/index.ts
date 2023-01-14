import { TokenResponsePayload } from '../types/token';

export const isTokenPayload = (
    payload: any,
): payload is Partial<TokenResponsePayload> => {
    return 'refreshToken' in payload;
};
