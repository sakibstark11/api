export type TokenResponsePayload = {
    accessToken: string;
    refreshToken: string;
};

export type TokenConfig = { ttl: number, secret: string; };

export interface RequestObjectStructure {
    headers: {
        authorization: string;
    };
    cookies: {
        refreshToken: string;
    };
};
