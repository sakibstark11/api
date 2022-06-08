import { sign, verify } from "jsonwebtoken";
import EnteredUser from "../utils/types/enteredUser";
import Config from '../utils/types/config';

export default ({ token: { access, refresh } }: Config) => ({
    createAccessToken: async (
        { id, email }: EnteredUser
    ) => sign({
        id, email
    }, access.secret, { expiresIn: access.ttl }),
    createRefreshToken: async (
        { id, email }: EnteredUser
    ) => sign({
        id, email
    }, refresh.secret, { expiresIn: refresh.ttl })
});
