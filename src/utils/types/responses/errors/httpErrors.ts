import { GenericResponse } from '../../genericResponse';
import { HttpResponse } from '../base';

export class BaseHttpError
    extends Error
    implements HttpResponse<GenericResponse>
{
    status: number;
    payload: any;
    constructor(message: string, status: number, error?: any) {
        super(message);
        Object.setPrototypeOf(this, BaseHttpError.prototype);
        this.status = status;
        this.payload = { message, error };
    }

    removeStackTrace() {
        delete this.stack;
        return this;
    }
}

export class Conflict409 extends BaseHttpError {
    constructor(message: string) {
        super(message, 409);
    }
}

export class Server500 extends BaseHttpError {
    constructor(message: string) {
        super(message, 500);
    }
}

export class NotFound404 extends BaseHttpError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class Forbidden403 extends BaseHttpError {
    constructor(message: string) {
        super(message, 403);
    }
}

export class Unauthorized401 extends BaseHttpError {
    constructor(message: string) {
        super(message, 401);
    }
}

export class BadRequest400 extends BaseHttpError {
    constructor(message: string, error?: any) {
        super(message, 400, error);
    }
}
