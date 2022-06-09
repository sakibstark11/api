export type TokenHeader = {
    accessToken: string;
    refreshToken: string;
};

export type TokenConfig = { ttl: number, secret: string; };
