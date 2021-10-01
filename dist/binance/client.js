"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseValidationError = void 0;
const PathReporter_1 = require("io-ts/lib/PathReporter");
const Either_1 = require("fp-ts/lib/Either");
class ResponseValidationError extends Error {
    constructor(errors) {
        super(PathReporter_1.PathReporter.report((0, Either_1.left)(errors)).join('\n\n'));
        this.errors = errors;
        this.name = 'ResponseValidationError';
        Object.setPrototypeOf(this, ResponseValidationError.prototype);
    }
    static create(errors) {
        return new ResponseValidationError(errors);
    }
}
exports.ResponseValidationError = ResponseValidationError;
