import * as crypto from 'crypto';
import axios from 'axios';
import { flow, pipe } from 'fp-ts/lib/function';
import { array, either, option } from 'fp-ts';
import * as t from 'io-ts';
import { Either } from 'fp-ts/lib/Either';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Observable, Subject } from 'rxjs';
import * as rxo from 'rxjs/operators';
import { Json, parse } from 'fp-ts/lib/Json';
import {
  BinanceInterval,
  BinanceSocketAggregatedTradeIO,
  BinanceSocketBookTickerIO,
  BinanceSocketDiffDepthIO,
  BinanceSocketKlineIO,
  BinanceSocketMiniTickerIO,
  BinanceSocketPartialBookDepthIO,
  BinanceSocketTickerIO,
  BinanceSocketTradeIO,
  BinanceSocketUserUpdateIO,
} from './socketTypes';
import { Option } from 'fp-ts/lib/Option';
import { observableEither } from 'fp-ts-rxjs';
import queryStringLib from 'query-string';

// refer to binance-node-connector
/**
 * NOTE: The array conversion logic is different from usual query string.
 * E.g. symbols=["BTCUSDT","BNBBTC"] instead of symbols[]=BTCUSDT&symbols[]=BNBBTC
 */
const stringifyKeyValuePair = ([key, value]: [string, any]) => {
  const valueString = Array.isArray(value) ? `["${value.join('","')}"]` : value;
  return `${key}=${encodeURIComponent(valueString)}`;
};

export const buildQueryString = flow(
  Object.entries,
  array.filter(([_, value]) => (isOption(value) ? option.isSome(value) : true)),
  array.map(([key, value]): [string, unknown] =>
    option.isSome(value) ? [key, value.value] : [key, value]
  ),
  array.map(stringifyKeyValuePair),
  (kv) => kv.join('&')
);

const isOption = (input: unknown): input is Option<unknown> =>
  option.isNone(input as any) || option.isSome(input as any);

// the whole query is stored in signature field in order to make it a single source of truth
// otherwise it is required to sign the query twice - once on the user side and then again in the client callback(`request` function)
export const makeSignQuery =
  (apiSecret: string) =>
  <T extends Record<string, unknown>>(
    query: T
  ): T & { signature: string; timestamp: t.Int } => {
    const timestamp = Date.now();
    const queryString = buildQueryString({
      ...query,
      timestamp,
    });
    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(queryString)
      .digest('hex');

    return {
      ...query,
      timestamp: timestamp as t.Int,
      signature: `${queryString}&signature=${signature}`,
    };
  };

export type SignQuery = ReturnType<typeof makeSignQuery>;

const getBinanceUrl = (url: string, rawQuery: string | undefined) =>
  rawQuery === undefined
    ? url
    : pipe(
        rawQuery,
        queryStringLib.parse,
        (query) =>
          query['signature']
            ? (query['signature'] as string)
            : buildQueryString(query),
        (binanceQuery) => `${url}?${binanceQuery}`
      );

export const fromPromiseToStream = <A>(
  promise: () => Promise<A>
): Observable<Either<unknown, A>> =>
  new Observable((subscriber) => {
    promise()
      .then((value) => {
        if (!subscriber.closed) {
          subscriber.next(either.right(value));
          subscriber.complete();
        }
      })
      .catch((e) => subscriber.next(either.left(e)));
  });

export type BinanceConfig = {
  apiKey: string;
  apiSecret: string;
};

// from devexperts swagger codegen
interface Request {
  readonly method:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'HEAD'
    | 'OPTIONS';
  readonly url: string;
  readonly responseType: 'json' | 'blob' | 'text';
  readonly query?: string;
  readonly body?: unknown;
  readonly headers?: Record<string, unknown>;
}

export const makeBinanceHttpClient = (
  baseURL: string,
  config: BinanceConfig
) => ({
  signQuery: makeSignQuery(config.apiSecret),
  httpClient: {
    ...observableEither.observableEither,
    request: (request: Request) => {
      const { method, query: rawQueryString, url: rawUrl } = request;
      const url = getBinanceUrl(rawUrl, rawQueryString);
      const instance = axios.create({
        baseURL,
        headers: {
          'Content-Type': 'application/json',
          'X-MBX-APIKEY': config.apiKey,
        },
      });
      instance.interceptors.response.use(
        (r) => r,
        (error) => Promise.reject(error.response.data)
      );

      return pipe(
        () =>
          instance.request({
            method,
            url,
          }),
        fromPromiseToStream,
        rxo.map(
          either.bimap(
            (e) => new Error(String(e)),
            (response) => response.data
          )
        )
      );
    },
  },
});

export const makeWebSocketStream = (
  url: string,
  websocketImplementation?: any
): Observable<Either<Error, Json>> => {
  const subject = new Subject<Either<Error, Json>>();
  const websocket = new ReconnectingWebSocket(url, undefined, {
    debug: true,
    minReconnectionDelay: 3000,
    WebSocket: websocketImplementation,
  });
  websocket.addEventListener('message', (e) =>
    subject.next(
      pipe(
        parse(e.data),
        either.mapLeft((e) => new Error(String(e)))
      )
    )
  );

  return subject.asObservable();
};

const fromWebSocketStream = <A>(
  stream$: Observable<Either<Error, Json>>,
  parser: (input: Json) => Either<t.Errors, A>
) =>
  pipe(
    stream$,
    rxo.map(
      either.chain(
        flow(
          parser,
          either.mapLeft(
            (e) => new Error(JSON.stringify(e.map((e) => e.context)))
          )
        )
      )
    )
  );

// based on binance-connector
export const makeBinanceWebSocketClient = (
  baseURL: string,
  websocketImplementation?: any
) => ({
  aggregatedTrade: (symbol: string) =>
    fromWebSocketStream(
      makeWebSocketStream(
        `${baseURL}/ws/${symbol.toLowerCase()}@aggTrade`,
        websocketImplementation
      ),
      BinanceSocketAggregatedTradeIO.decode
    ),
  trade: (symbol: string) =>
    fromWebSocketStream(
      makeWebSocketStream(
        `${baseURL}/ws/${symbol.toLowerCase()}@trade`,
        websocketImplementation
      ),
      BinanceSocketTradeIO.decode
    ),
  kline: (symbol: string, interval: BinanceInterval) =>
    fromWebSocketStream(
      makeWebSocketStream(
        `${baseURL}/ws/${symbol.toLowerCase()}@kline_${interval}`,
        websocketImplementation
      ),
      BinanceSocketKlineIO.decode
    ),
  miniTicker: (symbol: string) =>
    fromWebSocketStream(
      makeWebSocketStream(
        `${baseURL}/ws/${symbol.toLowerCase()}@miniTicker`,
        websocketImplementation
      ),
      BinanceSocketMiniTickerIO.decode
    ),
  miniTickers: () =>
    fromWebSocketStream(
      makeWebSocketStream(
        `${baseURL}/ws/!miniTicker@arr`,
        websocketImplementation
      ),
      t.array(BinanceSocketMiniTickerIO).decode
    ),
  ticker: (symbol: string) =>
    fromWebSocketStream(
      makeWebSocketStream(
        `${baseURL}/ws/${symbol.toLowerCase()}@ticker`,
        websocketImplementation
      ),
      BinanceSocketTickerIO.decode
    ),
  tickers: () =>
    fromWebSocketStream(
      makeWebSocketStream(`${baseURL}/ws/!ticker@arr`, websocketImplementation),
      t.array(BinanceSocketTickerIO).decode
    ),
  bookTicker: (symbol: string) =>
    fromWebSocketStream(
      makeWebSocketStream(
        `${baseURL}/ws/${symbol.toLowerCase()}@bookTicker`,
        websocketImplementation
      ),
      BinanceSocketBookTickerIO.decode
    ),
  bookTickers: () =>
    fromWebSocketStream(
      makeWebSocketStream(`${baseURL}/ws/!bookTicker`, websocketImplementation),
      BinanceSocketBookTickerIO.decode
    ),
  partialBookDepth: (symbol: string, levels: 5 | 10 | 20, speed: 100 | 1000) =>
    fromWebSocketStream(
      makeWebSocketStream(
        `${baseURL}/ws/${symbol.toLowerCase()}@depth${levels}@${speed}`,
        websocketImplementation
      ),
      BinanceSocketPartialBookDepthIO.decode
    ),
  diffBookDepth: (symbol: string, speed: 100 | 1000) =>
    fromWebSocketStream(
      makeWebSocketStream(
        `${baseURL}/ws/${symbol.toLowerCase()}@depth@${speed}`,
        websocketImplementation
      ),
      BinanceSocketDiffDepthIO.decode
    ),
  userData: (listenKey: string) =>
    fromWebSocketStream(
      makeWebSocketStream(
        `${baseURL}/ws/${listenKey}`,
        websocketImplementation
      ),
      BinanceSocketUserUpdateIO.decode
    ),
});

export type BinanceWebSocketClient = ReturnType<
  typeof makeBinanceWebSocketClient
>;
