import { Request } from 'express';

export type TokenResponsePayload = {
    accessToken: string;
    refreshToken: string;
};

export type TokenConfig = { ttl: number, secret: string; };

export interface TokenRequestHeader {
    headers: {
        access_token: string;
        refresh_token: string;
    };
};
