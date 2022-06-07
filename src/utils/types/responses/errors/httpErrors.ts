import HttpResponse from '../base';

export class BaseError extends Error implements HttpResponse<any>{
    status: number;
    payload: any;
    constructor(message: string, status: number) {
        super(message);
        Object.setPrototypeOf(this, BaseError.prototype);
        this.status = status;
        this.payload = { message };
    }

    removeStackTrace() {
        delete this.stack;
        return this;
    }
};

export class Conflict409 extends BaseError {
    constructor(message: string) {
        super(message, 409);
    }
}

export class Server500 extends BaseError {
    constructor(message: string) {
        super(message, 500);
    }
}

export class NotFound404 extends BaseError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class Forbidden403 extends BaseError {
    constructor(message: string) {
        super(message, 403);
    }
}
