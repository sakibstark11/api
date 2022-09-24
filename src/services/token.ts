import { sign, TokenExpiredError, verify } from "jsonwebtoken";
import { TokenConfig, TOKEN_EXPIRED } from '../utils/types/token';
import { Logger } from 'pino';

export default (accessToken: TokenConfig, refreshToken: TokenConfig, logger: Logger) => {
    return {
        createRefreshToken: (
            id: string
        ) => {
            return sign({
                id
            }, refreshToken.secret, { expiresIn: refreshToken.ttl });

        },
        createAccessToken: (
            id: string
        ) => {
            return sign({
                id
            }, accessToken.secret, { expiresIn: accessToken.ttl });
        },
        decodeAccessToken: (token: string) => {
            try {
                const decoded = verify(token, accessToken.secret);
                return decoded;
            } catch (error) {
                if (error instanceof TokenExpiredError) {
                    logger.warn(error, 'access token expired');
                    return TOKEN_EXPIRED;
                }
                logger.error(error, 'failed to verify access token');
                return null;
            }
        },
        decodeRefreshToken: (token: string) => {
            try {
                const decoded = verify(token, refreshToken.secret);
                return decoded;
            } catch (error) {
                logger.error(error, 'failed to verify refresh token');
                return null;
            }
        }

    };
};
