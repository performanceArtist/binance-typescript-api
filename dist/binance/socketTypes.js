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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceSocketUserUpdateIO = exports.BinanceSocketListStatusIO = exports.BinanceSocketOCOListOrderStatusIO = exports.BinanceSocketOCOListStatusIO = exports.BinanceSocketOrderUpdateIO = exports.BinanceSocketOrderStatusIO = exports.BinanceSocketExecutionTypeIO = exports.BinanceSocketBalanceUpdateIO = exports.BinanceSocketAccountUpdateIO = exports.BinanceSocketDiffDepthIO = exports.BinanceSocketPartialBookDepthIO = exports.BinanceSocketBookTickerIO = exports.BinanceSocketTickerIO = exports.BinanceSocketMiniTickerIO = exports.BinanceSocketKlineIO = exports.BinanceSocketTradeIO = exports.BinanceSocketAggregatedTradeIO = exports.BinanceOrderResponseIO = exports.BinanceIntervalIO = exports.BinanceTimeInForceIO = exports.BinanceSocketSideIO = exports.BinanceSocketOrderTypeIO = void 0;
const t = __importStar(require("io-ts"));
exports.BinanceSocketOrderTypeIO = t.union([
    t.literal('LIMIT'),
    t.literal('MARKET'),
    t.literal('STOP_LOSS'),
    t.literal('STOP_LOSS_LIMIT'),
    t.literal('TAKE_PROFIT'),
    t.literal('TAKE_PROFIT_LIMIT'),
    t.literal('LIMIT_MAKER'),
]);
exports.BinanceSocketSideIO = t.union([
    t.literal('SELL'),
    t.literal('BUY'),
]);
exports.BinanceTimeInForceIO = t.union([
    t.literal('GTC'),
    t.literal('IOC'),
    t.literal('FOK'),
]);
exports.BinanceIntervalIO = t.union([
    t.literal('1m'),
    t.literal('3m'),
    t.literal('5m'),
    t.literal('15m'),
    t.literal('30m'),
    t.literal('1h'),
    t.literal('2h'),
    t.literal('4h'),
    t.literal('6h'),
    t.literal('8h'),
    t.literal('12h'),
    t.literal('1d'),
    t.literal('3d'),
    t.literal('1w'),
    t.literal('1M'),
]);
exports.BinanceOrderResponseIO = t.type({
    symbol: t.string,
    orderId: t.number,
    clientOrderId: t.string,
    transactTime: t.number,
    price: t.string,
    origQty: t.string,
    executedQty: t.string,
    status: t.string,
    timeInForce: t.string,
    type: t.string,
    side: t.string,
});
// websocket
exports.BinanceSocketAggregatedTradeIO = t.type({
    e: t.literal('aggTrade'),
    E: t.Int,
    s: t.string,
    a: t.Int,
    p: t.string,
    q: t.string,
    f: t.Int,
    l: t.Int,
    T: t.Int,
    m: t.boolean,
    M: t.boolean, // Ignore
});
exports.BinanceSocketTradeIO = t.type({
    e: t.literal('trade'),
    E: t.Int,
    s: t.string,
    t: t.Int,
    p: t.string,
    q: t.string,
    b: t.Int,
    a: t.Int,
    T: t.Int,
    m: t.boolean,
    M: t.boolean, // Ignore
});
exports.BinanceSocketKlineIO = t.type({
    e: t.literal('kline'),
    E: t.number,
    s: t.string,
    k: t.type({
        t: t.number,
        T: t.number,
        s: t.string,
        i: exports.BinanceIntervalIO,
        f: t.number,
        L: t.number,
        o: t.string,
        c: t.string,
        h: t.string,
        l: t.string,
        v: t.string,
        n: t.number,
        x: t.boolean,
        q: t.string,
        V: t.string,
        Q: t.string,
        B: t.string, // Ignore
    }),
});
exports.BinanceSocketMiniTickerIO = t.type({
    e: t.literal('24hrMiniTicker'),
    E: t.Int,
    s: t.string,
    c: t.string,
    o: t.string,
    h: t.string,
    l: t.string,
    v: t.string,
    q: t.string, // Total traded quote asset volume
});
exports.BinanceSocketTickerIO = t.type({
    e: t.literal('24hrTicker'),
    E: t.Int,
    s: t.string,
    p: t.string,
    P: t.string,
    w: t.string,
    x: t.string,
    c: t.string,
    Q: t.string,
    b: t.string,
    B: t.string,
    a: t.string,
    A: t.string,
    o: t.string,
    h: t.string,
    l: t.string,
    v: t.string,
    q: t.string,
    O: t.Int,
    C: t.Int,
    F: t.Int,
    L: t.Int,
    n: t.Int, // Total number of trades
});
exports.BinanceSocketBookTickerIO = t.type({
    u: t.Int,
    s: t.string,
    b: t.string,
    B: t.string,
    a: t.string,
    A: t.string, // best ask qty
});
exports.BinanceSocketPartialBookDepthIO = t.type({
    lastUpdateId: t.Int,
    bids: t.array(t.tuple([t.string, t.string])),
    asks: t.array(t.tuple([t.string, t.string])), // [Price level to be updated, Quantity][]
});
exports.BinanceSocketDiffDepthIO = t.type({
    e: t.literal('depthUpdate'),
    E: t.Int,
    s: t.string,
    U: t.Int,
    u: t.Int,
    b: t.array(t.tuple([t.string, t.string])),
    a: t.array(t.tuple([t.string, t.string])), // [Price level to be updated, Quantity][]
});
exports.BinanceSocketAccountUpdateIO = t.type({
    e: t.literal('outboundAccountPosition'),
    E: t.Int,
    u: t.Int,
    B: 
    //Balances Array
    t.array(t.type({
        a: t.string,
        f: t.string,
        l: t.string, //Locked
    })),
});
exports.BinanceSocketBalanceUpdateIO = t.type({
    e: t.literal('balanceUpdate'),
    E: t.Int,
    a: t.string,
    d: t.string,
    T: t.Int, //Clear Time
});
exports.BinanceSocketExecutionTypeIO = t.union([
    t.literal('NEW'),
    t.literal('CANCELED'),
    t.literal('REPLACED'),
    t.literal('TRADE'),
    t.literal('EXPIRED'),
]);
exports.BinanceSocketOrderStatusIO = t.union([
    t.literal('NEW'),
    t.literal('PARTIALLY_FILLED'),
    t.literal('FILLED'),
    t.literal('CANCELLED'),
    t.literal('PENDING_CANCEL'),
    t.literal('REJECTED'),
    t.literal('EXPIRED'),
]);
exports.BinanceSocketOrderUpdateIO = t.type({
    e: t.literal('executionReport'),
    E: t.Int,
    s: t.string,
    c: t.string,
    S: exports.BinanceSocketSideIO,
    o: exports.BinanceSocketOrderTypeIO,
    f: exports.BinanceTimeInForceIO,
    q: t.string,
    p: t.string,
    P: t.string,
    F: t.string,
    g: t.Int,
    C: t.string,
    x: exports.BinanceSocketExecutionTypeIO,
    X: exports.BinanceSocketOrderStatusIO,
    r: t.string,
    i: t.Int,
    l: t.string,
    z: t.string,
    L: t.string,
    n: t.string,
    N: t.null,
    T: t.Int,
    t: t.Int,
    I: t.Int,
    w: t.boolean,
    m: t.boolean,
    M: t.boolean,
    O: t.Int,
    Z: t.string,
    Y: t.string,
    Q: t.string, // Quote Order Qty
});
exports.BinanceSocketOCOListStatusIO = t.union([
    t.literal('RESPONSE'),
    t.literal('EXEC_STARTED'),
    t.literal('ALL_DONE'),
]);
exports.BinanceSocketOCOListOrderStatusIO = t.union([
    t.literal('EXECUTING'),
    t.literal('ALL_DONE'),
    t.literal('REJECT'),
]);
exports.BinanceSocketListStatusIO = t.type({
    e: t.literal('listStatus'),
    E: t.Int,
    s: t.string,
    g: t.Int,
    c: t.literal('OCO'),
    l: exports.BinanceSocketOCOListStatusIO,
    L: exports.BinanceSocketOCOListOrderStatusIO,
    r: t.string,
    C: t.string,
    T: t.Int,
    O: t.array(t.type({
        s: t.string,
        i: t.Int,
        c: t.string, //ClientOrderId
    })),
});
exports.BinanceSocketUserUpdateIO = t.union([
    exports.BinanceSocketAccountUpdateIO,
    exports.BinanceSocketBalanceUpdateIO,
    exports.BinanceSocketOrderUpdateIO,
    exports.BinanceSocketListStatusIO,
]);
