import { sign, TokenExpiredError, verify } from "jsonwebtoken";

import { TokenConfig, TOKEN_EXPIRED } from '../utils/types/token';
import { Logger } from 'pino';


export default class TokenService {
    private accessToken: TokenConfig;
    private refreshToken: TokenConfig;
    private logger: Logger;
    public refreshTokenTTL: number;

    constructor(accessToken: TokenConfig, refreshToken: TokenConfig, logger: Logger) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.refreshTokenTTL = refreshToken.ttl;
        this.logger = logger;
    }

    createRefreshToken(
        id: string
    ) {
        return sign({
            id
        }, this.refreshToken.secret, { expiresIn: this.refreshToken.ttl });

    }

    createAccessToken(
        id: string
    ) {
        return sign({
            id
        }, this.accessToken.secret, { expiresIn: this.accessToken.ttl });
    }

    decodeAccessToken(token: string) {
        try {
            const decoded = verify(token, this.accessToken.secret);
            return decoded;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                this.logger.warn(error, 'access token expired');
                return TOKEN_EXPIRED;
            }
            this.logger.error(error, 'failed to verify access token');
            return null;
        }
    }

    decodeRefreshToken(token: string) {
        try {
            const decoded = verify(token, this.refreshToken.secret);
            return decoded;
        } catch (error) {
            this.logger.error(error, 'failed to verify refresh token');
            return null;
        }
    }
}
