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
exports.makeBinanceWebsocketClient = exports.makeWebsocketStream = exports.makeBinanceHttpClient = exports.fromPromiseToStream = exports.makeSignQuery = exports.buildQueryString = void 0;
const crypto = __importStar(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const function_1 = require("fp-ts/lib/function");
const fp_ts_1 = require("fp-ts");
const t = __importStar(require("io-ts"));
const reconnecting_websocket_1 = __importDefault(require("reconnecting-websocket"));
const rxjs_1 = require("rxjs");
const rxo = __importStar(require("rxjs/operators"));
const Json_1 = require("fp-ts/lib/Json");
const socketTypes_1 = require("./socketTypes");
const fp_ts_rxjs_1 = require("fp-ts-rxjs");
const query_string_1 = __importDefault(require("query-string"));
// refer to binance-node-connector
/**
 * NOTE: The array conversion logic is different from usual query string.
 * E.g. symbols=["BTCUSDT","BNBBTC"] instead of symbols[]=BTCUSDT&symbols[]=BNBBTC
 */
const stringifyKeyValuePair = ([key, value]) => {
    const valueString = Array.isArray(value) ? `["${value.join('","')}"]` : value;
    return `${key}=${encodeURIComponent(valueString)}`;
};
exports.buildQueryString = (0, function_1.flow)(Object.entries, fp_ts_1.array.filter(([_, value]) => (isOption(value) ? fp_ts_1.option.isSome(value) : true)), fp_ts_1.array.map(([key, value]) => fp_ts_1.option.isSome(value) ? [key, value.value] : [key, value]), fp_ts_1.array.map(stringifyKeyValuePair), (kv) => kv.join('&'));
const isOption = (input) => fp_ts_1.option.isNone(input) || fp_ts_1.option.isSome(input);
// the whole query is stored in signature field in order to make it a single source of truth
// otherwise it is required to sign the query twice - once on the user side and then again in the client callback(`request` function)
const makeSignQuery = (apiSecret) => (query) => {
    const timestamp = Date.now();
    const queryString = (0, exports.buildQueryString)(Object.assign(Object.assign({}, query), { timestamp }));
    const signature = crypto
        .createHmac('sha256', apiSecret)
        .update(queryString)
        .digest('hex');
    return Object.assign(Object.assign({}, query), { timestamp: timestamp, signature: `${queryString}&signature=${signature}` });
};
exports.makeSignQuery = makeSignQuery;
const getBinanceUrl = (url, rawQuery) => rawQuery === undefined
    ? url
    : (0, function_1.pipe)(rawQuery, query_string_1.default.parse, (query) => query['signature']
        ? query['signature']
        : (0, exports.buildQueryString)(query), (binanceQuery) => `${url}?${binanceQuery}`);
const fromPromiseToStream = (promise) => new rxjs_1.Observable((subscriber) => {
    promise()
        .then((value) => {
        if (!subscriber.closed) {
            subscriber.next(fp_ts_1.either.right(value));
            subscriber.complete();
        }
    })
        .catch((e) => subscriber.next(fp_ts_1.either.left(e)));
});
exports.fromPromiseToStream = fromPromiseToStream;
const makeBinanceHttpClient = (baseURL, config) => ({
    signQuery: (0, exports.makeSignQuery)(config.apiSecret),
    httpClient: Object.assign(Object.assign({}, fp_ts_rxjs_1.observableEither.observableEither), { request: (request) => {
            const { method, query: rawQueryString, url: rawUrl } = request;
            const url = getBinanceUrl(rawUrl, rawQueryString);
            const instance = axios_1.default.create({
                baseURL,
                headers: {
                    'Content-Type': 'application/json',
                    'X-MBX-APIKEY': config.apiKey,
                },
            });
            instance.interceptors.response.use((r) => r, (error) => Promise.reject(error.response.data));
            return (0, function_1.pipe)(() => instance.request({
                method,
                url,
            }), exports.fromPromiseToStream, rxo.map(fp_ts_1.either.bimap((e) => new Error(String(e)), (response) => response.data)));
        } }),
});
exports.makeBinanceHttpClient = makeBinanceHttpClient;
const makeWebsocketStream = (url, websocketImplementation) => {
    const subject = new rxjs_1.Subject();
    const websocket = new reconnecting_websocket_1.default(url, undefined, {
        debug: true,
        minReconnectionDelay: 3000,
        WebSocket: websocketImplementation,
    });
    websocket.addEventListener('message', (e) => subject.next((0, function_1.pipe)((0, Json_1.parse)(e.data), fp_ts_1.either.mapLeft((e) => new Error(String(e))))));
    return subject.asObservable();
};
exports.makeWebsocketStream = makeWebsocketStream;
const fromWebsocketStream = (stream$, parser) => (0, function_1.pipe)(stream$, rxo.map(fp_ts_1.either.chain((0, function_1.flow)(parser, fp_ts_1.either.mapLeft((e) => new Error(JSON.stringify(e.map((e) => e.context))))))));
// based on binance-connector
const makeBinanceWebsocketClient = (baseURL, websocketImplementation) => ({
    aggregatedTrade: (symbol) => fromWebsocketStream((0, exports.makeWebsocketStream)(`${baseURL}/ws/${symbol.toLowerCase()}@aggTrade`, websocketImplementation), socketTypes_1.BinanceSocketAggregatedTradeIO.decode),
    trade: (symbol) => fromWebsocketStream((0, exports.makeWebsocketStream)(`${baseURL}/ws/${symbol.toLowerCase()}@trade`, websocketImplementation), socketTypes_1.BinanceSocketTradeIO.decode),
    kline: (symbol, interval) => fromWebsocketStream((0, exports.makeWebsocketStream)(`${baseURL}/ws/${symbol.toLowerCase()}@kline_${interval}`, websocketImplementation), socketTypes_1.BinanceSocketKlineIO.decode),
    miniTicker: (symbol) => fromWebsocketStream((0, exports.makeWebsocketStream)(`${baseURL}/ws/${symbol.toLowerCase()}@miniTicker`, websocketImplementation), socketTypes_1.BinanceSocketMiniTickerIO.decode),
    miniTickers: () => fromWebsocketStream((0, exports.makeWebsocketStream)(`${baseURL}/ws/!miniTicker@arr`, websocketImplementation), t.array(socketTypes_1.BinanceSocketMiniTickerIO).decode),
    ticker: (symbol) => fromWebsocketStream((0, exports.makeWebsocketStream)(`${baseURL}/ws/${symbol.toLowerCase()}@ticker`, websocketImplementation), socketTypes_1.BinanceSocketTickerIO.decode),
    tickers: () => fromWebsocketStream((0, exports.makeWebsocketStream)(`${baseURL}/ws/!ticker@arr`, websocketImplementation), t.array(socketTypes_1.BinanceSocketTickerIO).decode),
    bookTicker: (symbol) => fromWebsocketStream((0, exports.makeWebsocketStream)(`${baseURL}/ws/${symbol.toLowerCase()}@bookTicker`, websocketImplementation), socketTypes_1.BinanceSocketBookTickerIO.decode),
    bookTickers: () => fromWebsocketStream((0, exports.makeWebsocketStream)(`${baseURL}/ws/!bookTicker`, websocketImplementation), socketTypes_1.BinanceSocketBookTickerIO.decode),
    partialBookDepth: (symbol, levels, speed) => fromWebsocketStream((0, exports.makeWebsocketStream)(`${baseURL}/ws/${symbol.toLowerCase()}@depth${levels}@${speed}`, websocketImplementation), socketTypes_1.BinanceSocketPartialBookDepthIO.decode),
    diffBookDepth: (symbol, speed) => fromWebsocketStream((0, exports.makeWebsocketStream)(`${baseURL}/ws/${symbol.toLowerCase()}@depth@${speed}`, websocketImplementation), socketTypes_1.BinanceSocketDiffDepthIO.decode),
    userData: (listenKey) => fromWebsocketStream((0, exports.makeWebsocketStream)(`${baseURL}/ws/${listenKey}`, websocketImplementation), socketTypes_1.BinanceSocketUserUpdateIO.decode),
});
exports.makeBinanceWebsocketClient = makeBinanceWebsocketClient;
