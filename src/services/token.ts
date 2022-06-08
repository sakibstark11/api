import { sign, verify } from "jsonwebtoken";
import EnteredUser from "../utils/types/enteredUser";
import Config from '../utils/types/config';
import { Logger } from 'pino';

export default ({ token: { access, refresh } }: Config, logger: Logger) => ({
    createAccessToken: (
        { id, email }: EnteredUser
    ) => sign({
        id, email
    }, access.secret, { expiresIn: access.ttl }),

    createRefreshToken: (
        { id, email }: EnteredUser
    ) => sign({
        id, email
    }, refresh.secret, { expiresIn: refresh.ttl }),

    decodeAccessToken: (token: string) => {
        try {
            const decode = verify(token, access.secret);
            return decode;
        } catch (error) {
            logger.error(error, 'failed to verify access token');
            return null;
        }
    },

    decodeRefreshToken: (token: string) => {
        try {
            const decoded = verify(token, refresh.secret);
            return decoded;
        } catch (error) {
            logger.error(error, 'failed to verify refresh token');
            return null;
        }
    },
});
