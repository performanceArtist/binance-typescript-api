import { HKT, Kind, Kind2, URIS, URIS2 } from 'fp-ts/lib/HKT';
import { MonadThrow, MonadThrow1, MonadThrow2 } from 'fp-ts/lib/MonadThrow';
import { Errors } from 'io-ts';
export interface Request {
    readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    readonly url: string;
    readonly responseType: 'json' | 'blob' | 'text';
    readonly query?: string;
    readonly body?: unknown;
    readonly headers?: Record<string, unknown>;
}
export interface HTTPClient<F> extends MonadThrow<F> {
    readonly request: (request: Request) => HKT<F, unknown>;
}
export interface HTTPClient1<F extends URIS> extends MonadThrow1<F> {
    readonly request: (request: Request) => Kind<F, unknown>;
}
export interface HTTPClient2<F extends URIS2> extends MonadThrow2<F> {
    readonly request: (request: Request) => Kind2<F, unknown, unknown>;
}
export declare class ResponseValidationError extends Error {
    readonly errors: Errors;
    static create(errors: Errors): ResponseValidationError;
    constructor(errors: Errors);
}
