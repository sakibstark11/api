import { sign, verify } from "jsonwebtoken";
import { EnteredUser } from "../utils/types/user/enteredUser";


import { TokenConfig } from '../utils/types/token';
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
        { id, email }: EnteredUser
    ) {
        return sign({
            id, email
        }, this.refreshToken.secret, { expiresIn: this.refreshToken.ttl });

    }

    createAccessToken(
        { id, email }: EnteredUser
    ) {
        return sign({
            id, email
        }, this.accessToken.secret, { expiresIn: this.accessToken.ttl });
    }

    decodeAccessToken(token: string) {
        try {
            const decode = verify(token, this.accessToken.secret);
            return decode;
        } catch (error) {
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
