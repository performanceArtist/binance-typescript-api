"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateApifromURL = exports.generateApifromFile = void 0;
const swagger_codegen_ts_1 = require("@devexperts/swagger-codegen-ts");
const path = __importStar(require("path"));
const _3_0_1 = require("@devexperts/swagger-codegen-ts/dist/language/typescript/3.0");
const openapi_object_1 = require("@devexperts/swagger-codegen-ts/dist/schema/3.0/openapi-object");
const fp_ts_1 = require("fp-ts");
const replace_in_file_1 = require("replace-in-file");
const function_1 = require("fp-ts/lib/function");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
// api has a parameter called 'symbol', which conflicts with js' native type
const fixSymbolType = (glob) => (0, replace_in_file_1.replaceInFile)({
    files: glob,
    from: [
        'export type symbol = string;',
        'export const symbolIO = string;',
        new RegExp(`import { symbol, symbolIO } from '../components/parameters/symbol';`, 'g'),
        new RegExp('symbol: symbol', 'g'),
        new RegExp('symbolIO.', 'g'),
    ],
    to: [
        'export type tickerSymbol = string;',
        'export const tickerSymbolIO = string;',
        "import { tickerSymbol, tickerSymbolIO } from '../components/parameters/symbol';",
        'symbol: tickerSymbol',
        'tickerSymbolIO.',
    ],
});
const generateApifromFile = (baseDir, specPath, out) => (0, function_1.pipe)((0, swagger_codegen_ts_1.generate)({
    cwd: baseDir,
    spec: path.resolve(baseDir, specPath),
    out: path.resolve(baseDir, out),
    language: _3_0_1.serialize,
    decoder: openapi_object_1.OpenapiObjectCodec,
}), fp_ts_1.taskEither.chain(() => fp_ts_1.taskEither.tryCatch(() => fixSymbolType(`${path.resolve(baseDir, out)}/spot_api.yaml/**/*.ts`), function_1.identity)));
exports.generateApifromFile = generateApifromFile;
const cleanup = fp_ts_1.taskEither.tryCatch(() => (0, util_1.promisify)(fs_1.default.unlink)('spot_api.yaml'), (e) => {
    console.log('Failed to cleanup');
    return e;
});
const generateApifromURL = (baseDir, specUrl, out) => (0, function_1.pipe)(fp_ts_1.taskEither.tryCatch(() => axios_1.default.get(specUrl), function_1.identity), fp_ts_1.taskEither.chain((response) => fp_ts_1.taskEither.tryCatch(() => (0, util_1.promisify)(fs_1.default.writeFile)('spot_api.yaml', response.data), function_1.identity)), fp_ts_1.taskEither.chain(() => (0, exports.generateApifromFile)(baseDir, 'spot_api.yaml', out)), fp_ts_1.task.chain(fp_ts_1.either.fold((e) => (0, function_1.pipe)(cleanup, fp_ts_1.task.map(() => fp_ts_1.either.left(e))), () => cleanup)));
exports.generateApifromURL = generateApifromURL;
