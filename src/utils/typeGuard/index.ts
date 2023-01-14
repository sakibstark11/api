import { BaseHttpError } from '../types/responses/errors/httpErrors';

export const isPayloadHTTPError = (payload: any): payload is BaseHttpError => {
    return 'error' in payload;
};
