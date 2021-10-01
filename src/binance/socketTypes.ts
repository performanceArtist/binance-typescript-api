import * as t from 'io-ts';

export const BinanceSocketOrderTypeIO = t.union([
  t.literal('LIMIT'),
  t.literal('MARKET'),
  t.literal('STOP_LOSS'),
  t.literal('STOP_LOSS_LIMIT'),
  t.literal('TAKE_PROFIT'),
  t.literal('TAKE_PROFIT_LIMIT'),
  t.literal('LIMIT_MAKER'),
]);

export type BinanceSocketOrderType = t.TypeOf<typeof BinanceSocketOrderTypeIO>;

export const BinanceSocketSideIO = t.union([
  t.literal('SELL'),
  t.literal('BUY'),
]);

export type BinanceSocketSide = t.TypeOf<typeof BinanceSocketSideIO>;

export const BinanceTimeInForceIO = t.union([
  t.literal('GTC'),
  t.literal('IOC'),
  t.literal('FOK'),
]);

export type BinanceTimeInForce = t.TypeOf<typeof BinanceTimeInForceIO>;

export const BinanceIntervalIO = t.union([
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

export type BinanceInterval = t.TypeOf<typeof BinanceIntervalIO>;

export const BinanceOrderResponseIO = t.type({
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

export type BinanceOrderResponse = t.TypeOf<typeof BinanceOrderResponseIO>;

// websocket
export const BinanceSocketAggregatedTradeIO = t.type({
  e: t.literal('aggTrade'), // Event type
  E: t.Int, // Event time
  s: t.string, // Symbol
  a: t.Int, // Aggregate trade ID
  p: t.string, // Price
  q: t.string, // Quantity
  f: t.Int, // First trade ID
  l: t.Int, // Last trade ID
  T: t.Int, // Trade time
  m: t.boolean, // Is the buyer the market maker?
  M: t.boolean, // Ignore
});

export type BinanceSocketAggregatedTrade = t.TypeOf<
  typeof BinanceSocketAggregatedTradeIO
>;

export const BinanceSocketTradeIO = t.type({
  e: t.literal('trade'),
  E: t.Int, // Event time
  s: t.string, // Symbol
  t: t.Int, // Trade ID
  p: t.string, // Price
  q: t.string, // Quantity
  b: t.Int, // Buyer order ID
  a: t.Int, // Seller order ID
  T: t.Int, // Trade time
  m: t.boolean, // Is the buyer the market maker?
  M: t.boolean, // Ignore
});

export type BinanceSocketTrade = t.TypeOf<typeof BinanceSocketTradeIO>;

export const BinanceSocketKlineIO = t.type({
  e: t.literal('kline'), // Event type
  E: t.number, // Event time
  s: t.string, // Symbol
  k: t.type({
    t: t.number, // Kline start time
    T: t.number, // Kline close time
    s: t.string, // Symbol
    i: BinanceIntervalIO, // Interval
    f: t.number, // First trade ID
    L: t.number, // Last trade ID
    o: t.string, // Open price
    c: t.string, // Close price
    h: t.string, // High price
    l: t.string, // Low price
    v: t.string, // Base asset volume
    n: t.number, // Number of trades
    x: t.boolean, // Is this kline closed?
    q: t.string, // Quote asset volume
    V: t.string, // Taker buy base asset volume
    Q: t.string, // Taker buy quote asset volume
    B: t.string, // Ignore
  }),
});

export type BinanceSocketKline = t.TypeOf<typeof BinanceSocketKlineIO>;

export const BinanceSocketMiniTickerIO = t.type({
  e: t.literal('24hrMiniTicker'), // Event type
  E: t.Int, // Event time
  s: t.string, // Symbol
  c: t.string, // Close price
  o: t.string, // Open price
  h: t.string, // High price
  l: t.string, // Low price
  v: t.string, // Total traded base asset volume
  q: t.string, // Total traded quote asset volume
});

export type BinanceSocketMiniTicker = t.TypeOf<
  typeof BinanceSocketMiniTickerIO
>;

export const BinanceSocketTickerIO = t.type({
  e: t.literal('24hrTicker'), // Event type
  E: t.Int, // Event time
  s: t.string, // Symbol
  p: t.string, // Price change
  P: t.string, // Price change percent
  w: t.string, // Weighted average price
  x: t.string, // First trade(F)-1 price (first trade before the 24hr rolling window)
  c: t.string, // Last price
  Q: t.string, // Last quantity
  b: t.string, // Best bid price
  B: t.string, // Best bid quantity
  a: t.string, // Best ask price
  A: t.string, // Best ask quantity
  o: t.string, // Open price
  h: t.string, // High price
  l: t.string, // Low price
  v: t.string, // Total traded base asset volume
  q: t.string, // Total traded quote asset volume
  O: t.Int, // Statistics open time
  C: t.Int, // Statistics close time
  F: t.Int, // First trade ID
  L: t.Int, // Last trade Id
  n: t.Int, // Total number of trades
});

export type BinanceSocketTicker = t.TypeOf<typeof BinanceSocketTickerIO>;

export const BinanceSocketBookTickerIO = t.type({
  u: t.Int, // order book updateId
  s: t.string, // symbol
  b: t.string, // best bid price
  B: t.string, // best bid qty
  a: t.string, // best ask price
  A: t.string, // best ask qty
});

export type BinanceSocketBookTicker = t.TypeOf<
  typeof BinanceSocketBookTickerIO
>;

export const BinanceSocketPartialBookDepthIO = t.type({
  lastUpdateId: t.Int, // Last update ID
  bids: t.array(t.tuple([t.string, t.string])), // [Price level to be updated, Quantity][]
  asks: t.array(t.tuple([t.string, t.string])), // [Price level to be updated, Quantity][]
});

export type BinanceSocketPartialBookDepth = t.TypeOf<
  typeof BinanceSocketPartialBookDepthIO
>;

export const BinanceSocketDiffDepthIO = t.type({
  e: t.literal('depthUpdate'), // Event type
  E: t.Int, // Event time
  s: t.string, // Symbol
  U: t.Int, // First update ID in event
  u: t.Int, // Final update ID in event
  b: t.array(t.tuple([t.string, t.string])), // [Price level to be updated, Quantity][]
  a: t.array(t.tuple([t.string, t.string])), // [Price level to be updated, Quantity][]
});

export type BinanceSocketDiffDepth = t.TypeOf<typeof BinanceSocketDiffDepthIO>;

export const BinanceSocketAccountUpdateIO = t.type({
  e: t.literal('outboundAccountPosition'), //Event type
  E: t.Int, //Event Time
  u: t.Int, //Time of last account update
  B:
    //Balances Array
    t.array(
      t.type({
        a: t.string, //Asset
        f: t.string, //Free
        l: t.string, //Locked
      })
    ),
});

export type BinanceSocketAccountUpdate = t.TypeOf<
  typeof BinanceSocketAccountUpdateIO
>;

export const BinanceSocketBalanceUpdateIO = t.type({
  e: t.literal('balanceUpdate'), //Event Type
  E: t.Int, //Event Time
  a: t.string, //Asset
  d: t.string, //Balance Delta
  T: t.Int, //Clear Time
});

export type BinanceSocketBalanceUpdate = t.TypeOf<
  typeof BinanceSocketBalanceUpdateIO
>;

export const BinanceSocketExecutionTypeIO = t.union([
  t.literal('NEW'),
  t.literal('CANCELED'),
  t.literal('REPLACED'),
  t.literal('TRADE'),
  t.literal('EXPIRED'),
]);

export type BinanceSocketExecutionType = t.TypeOf<
  typeof BinanceSocketExecutionTypeIO
>;

export const BinanceSocketOrderStatusIO = t.union([
  t.literal('NEW'),
  t.literal('PARTIALLY_FILLED'),
  t.literal('FILLED'),
  t.literal('CANCELLED'),
  t.literal('PENDING_CANCEL'),
  t.literal('REJECTED'),
  t.literal('EXPIRED'),
]);

export type BinanceSocketOrderStatus = t.TypeOf<
  typeof BinanceSocketOrderStatusIO
>;

export const BinanceSocketOrderUpdateIO = t.type({
  e: t.literal('executionReport'), // Event type
  E: t.Int, // Event time
  s: t.string, // Symbol
  c: t.string, // Client order ID
  S: BinanceSocketSideIO, // Side
  o: BinanceSocketOrderTypeIO, // Order type
  f: BinanceTimeInForceIO, // Time in force
  q: t.string, // Order quantity
  p: t.string, // Order price
  P: t.string, // Stop price
  F: t.string, // Iceberg quantity
  g: t.Int, // OrderListId
  C: t.string, // Original client order ID; This is the ID of the order being canceled
  x: BinanceSocketExecutionTypeIO, // Current execution type
  X: BinanceSocketOrderStatusIO, // Current order status
  r: t.string, // Order reject reason; will be an error code. ('NONE' or error code)
  i: t.Int, // Order ID
  l: t.string, // Last executed quantity
  z: t.string, // Cumulative filled quantity
  L: t.string, // Last executed price
  n: t.string, // Commission amount
  N: t.null, // Commission asset
  T: t.Int, // Transaction time
  t: t.Int, // Trade ID
  I: t.Int, // Ignore
  w: t.boolean, // Is the order on the book?
  m: t.boolean, // Is this trade the maker side?
  M: t.boolean, // Ignore
  O: t.Int, // Order creation time
  Z: t.string, // Cumulative quote asset transacted quantity
  Y: t.string, // Last quote asset transacted quantity (i.e. lastPrice * lastQty)
  Q: t.string, // Quote Order Qty
});

export type BinanceSocketOrderUpdate = t.TypeOf<
  typeof BinanceSocketOrderUpdateIO
>;

export const BinanceSocketOCOListStatusIO = t.union([
  t.literal('RESPONSE'),
  t.literal('EXEC_STARTED'),
  t.literal('ALL_DONE'),
]);

export type BinanceSocketOCOListStatus = t.TypeOf<
  typeof BinanceSocketOCOListStatusIO
>;

export const BinanceSocketOCOListOrderStatusIO = t.union([
  t.literal('EXECUTING'),
  t.literal('ALL_DONE'),
  t.literal('REJECT'),
]);

export type BinanceSocketOCOListOrderStatus = t.TypeOf<
  typeof BinanceSocketOCOListOrderStatusIO
>;

export const BinanceSocketListStatusIO = t.type({
  e: t.literal('listStatus'), //Event Type
  E: t.Int, //Event Time
  s: t.string, //Symbol
  g: t.Int, //OrderListId
  c: t.literal('OCO'), //Contingency Type
  l: BinanceSocketOCOListStatusIO, //List Status Type
  L: BinanceSocketOCOListOrderStatusIO, //List Order Status
  r: t.string, //List Reject Reason ('NONE' or error code)
  C: t.string, //List Client Order ID
  T: t.Int, //Transaction Time
  O: t.array(
    t.type({
      s: t.string, //Symbol
      i: t.Int, // orderId
      c: t.string, //ClientOrderId
    })
  ),
});

export type BinanceSocketListStatus = t.TypeOf<
  typeof BinanceSocketListStatusIO
>;

export const BinanceSocketUserUpdateIO = t.union([
  BinanceSocketAccountUpdateIO,
  BinanceSocketBalanceUpdateIO,
  BinanceSocketOrderUpdateIO,
  BinanceSocketListStatusIO,
]);

export type BinanceSocketUserUpdate = t.TypeOf<
  typeof BinanceSocketUserUpdateIO
>;
