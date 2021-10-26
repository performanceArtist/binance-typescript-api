import { either } from 'fp-ts';
import * as t from 'io-ts';
import { Either } from 'fp-ts/lib/Either';
import { Observable } from 'rxjs';
import { Json } from 'fp-ts/lib/Json';
import { BinanceInterval } from './socketTypes';
import { observableEither } from 'fp-ts-rxjs';
export declare const buildQueryString: (o: {}) => string;
export declare const makeSignQuery: (apiSecret: string) => <T extends Record<string, unknown>>(query: T) => T & {
    signature: string;
    timestamp: t.Int;
};
export declare type SignQuery = ReturnType<typeof makeSignQuery>;
export declare const fromPromiseToStream: <A>(promise: () => Promise<A>) => Observable<either.Either<unknown, A>>;
export declare type BinanceConfig = {
    apiKey: string;
    apiSecret: string;
};
interface Request {
    readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    readonly url: string;
    readonly responseType: 'json' | 'blob' | 'text';
    readonly query?: string;
    readonly body?: unknown;
    readonly headers?: Record<string, unknown>;
}
export declare const makeBinanceHttpClient: (baseURL: string, config: BinanceConfig) => {
    signQuery: <T extends Record<string, unknown>>(query: T) => T & {
        signature: string;
        timestamp: t.Int;
    };
    httpClient: {
        request: (request: Request) => Observable<either.Either<Error, any>>;
        ap: <E, A, B>(fab: observableEither.ObservableEither<E, (a: A) => B>, fa: observableEither.ObservableEither<E, A>) => observableEither.ObservableEither<E, B>;
        URI: "ObservableEither";
        map: <E_1, A_1, B_1>(fa: observableEither.ObservableEither<E_1, A_1>, f: (a: A_1) => B_1) => observableEither.ObservableEither<E_1, B_1>;
        of: <E_2, A_2>(a: A_2) => observableEither.ObservableEither<E_2, A_2>;
        chain: <E_3, A_3, B_2>(fa: observableEither.ObservableEither<E_3, A_3>, f: (a: A_3) => observableEither.ObservableEither<E_3, B_2>) => observableEither.ObservableEither<E_3, B_2>;
        bimap: <E_4, A_4, G, B_3>(fea: observableEither.ObservableEither<E_4, A_4>, f: (e: E_4) => G, g: (a: A_4) => B_3) => observableEither.ObservableEither<G, B_3>;
        mapLeft: <E_5, A_5, G_1>(fea: observableEither.ObservableEither<E_5, A_5>, f: (e: E_5) => G_1) => observableEither.ObservableEither<G_1, A_5>;
        alt: <E_6, A_6>(fa: observableEither.ObservableEither<E_6, A_6>, that: import("fp-ts/lib/function").Lazy<observableEither.ObservableEither<E_6, A_6>>) => observableEither.ObservableEither<E_6, A_6>;
        fromObservable: <E_7, A_7>(fa: Observable<A_7>) => observableEither.ObservableEither<E_7, A_7>;
        fromIO: import("fp-ts/lib/NaturalTransformation").NaturalTransformation12<"IO", "ObservableEither">;
        fromTask: import("fp-ts/lib/NaturalTransformation").NaturalTransformation12<"Task", "ObservableEither">;
        throwError: <E_8, A_8>(e: E_8) => observableEither.ObservableEither<E_8, A_8>;
    };
};
export declare const makeWebSocketStream: (url: string, websocketImplementation?: any) => Observable<Either<Error, Json>>;
export declare const makeBinanceWebSocketClient: (baseURL: string, websocketImplementation?: any) => {
    aggregatedTrade: (symbol: string) => Observable<either.Either<Error, {
        e: "aggTrade";
        E: t.Branded<number, t.IntBrand>;
        s: string;
        a: t.Branded<number, t.IntBrand>;
        p: string;
        q: string;
        f: t.Branded<number, t.IntBrand>;
        l: t.Branded<number, t.IntBrand>;
        T: t.Branded<number, t.IntBrand>;
        m: boolean;
        M: boolean;
    }>>;
    trade: (symbol: string) => Observable<either.Either<Error, {
        e: "trade";
        E: t.Branded<number, t.IntBrand>;
        s: string;
        t: t.Branded<number, t.IntBrand>;
        p: string;
        q: string;
        b: t.Branded<number, t.IntBrand>;
        a: t.Branded<number, t.IntBrand>;
        T: t.Branded<number, t.IntBrand>;
        m: boolean;
        M: boolean;
    }>>;
    kline: (symbol: string, interval: BinanceInterval) => Observable<either.Either<Error, {
        e: "kline";
        E: number;
        s: string;
        k: {
            t: number;
            T: number;
            s: string;
            i: "1m" | "3m" | "5m" | "15m" | "30m" | "1h" | "2h" | "4h" | "6h" | "8h" | "12h" | "1d" | "3d" | "1w" | "1M";
            f: number;
            L: number;
            o: string;
            c: string;
            h: string;
            l: string;
            v: string;
            n: number;
            x: boolean;
            q: string;
            V: string;
            Q: string;
            B: string;
        };
    }>>;
    miniTicker: (symbol: string) => Observable<either.Either<Error, {
        e: "24hrMiniTicker";
        E: t.Branded<number, t.IntBrand>;
        s: string;
        c: string;
        o: string;
        h: string;
        l: string;
        v: string;
        q: string;
    }>>;
    miniTickers: () => Observable<either.Either<Error, {
        e: "24hrMiniTicker";
        E: t.Branded<number, t.IntBrand>;
        s: string;
        c: string;
        o: string;
        h: string;
        l: string;
        v: string;
        q: string;
    }[]>>;
    ticker: (symbol: string) => Observable<either.Either<Error, {
        e: "24hrTicker";
        E: t.Branded<number, t.IntBrand>;
        s: string;
        p: string;
        P: string;
        w: string;
        x: string;
        c: string;
        Q: string;
        b: string;
        B: string;
        a: string;
        A: string;
        o: string;
        h: string;
        l: string;
        v: string;
        q: string;
        O: t.Branded<number, t.IntBrand>;
        C: t.Branded<number, t.IntBrand>;
        F: t.Branded<number, t.IntBrand>;
        L: t.Branded<number, t.IntBrand>;
        n: t.Branded<number, t.IntBrand>;
    }>>;
    tickers: () => Observable<either.Either<Error, {
        e: "24hrTicker";
        E: t.Branded<number, t.IntBrand>;
        s: string;
        p: string;
        P: string;
        w: string;
        x: string;
        c: string;
        Q: string;
        b: string;
        B: string;
        a: string;
        A: string;
        o: string;
        h: string;
        l: string;
        v: string;
        q: string;
        O: t.Branded<number, t.IntBrand>;
        C: t.Branded<number, t.IntBrand>;
        F: t.Branded<number, t.IntBrand>;
        L: t.Branded<number, t.IntBrand>;
        n: t.Branded<number, t.IntBrand>;
    }[]>>;
    bookTicker: (symbol: string) => Observable<either.Either<Error, {
        u: t.Branded<number, t.IntBrand>;
        s: string;
        b: string;
        B: string;
        a: string;
        A: string;
    }>>;
    bookTickers: () => Observable<either.Either<Error, {
        u: t.Branded<number, t.IntBrand>;
        s: string;
        b: string;
        B: string;
        a: string;
        A: string;
    }>>;
    partialBookDepth: (symbol: string, levels: 5 | 10 | 20, speed: 100 | 1000) => Observable<either.Either<Error, {
        lastUpdateId: t.Branded<number, t.IntBrand>;
        bids: [string, string][];
        asks: [string, string][];
    }>>;
    diffBookDepth: (symbol: string, speed: 100 | 1000) => Observable<either.Either<Error, {
        e: "depthUpdate";
        E: t.Branded<number, t.IntBrand>;
        s: string;
        U: t.Branded<number, t.IntBrand>;
        u: t.Branded<number, t.IntBrand>;
        b: [string, string][];
        a: [string, string][];
    }>>;
    userData: (listenKey: string) => Observable<either.Either<Error, {
        e: "outboundAccountPosition";
        E: t.Branded<number, t.IntBrand>;
        u: t.Branded<number, t.IntBrand>;
        B: {
            a: string;
            f: string;
            l: string;
        }[];
    } | {
        e: "balanceUpdate";
        E: t.Branded<number, t.IntBrand>;
        a: string;
        d: string;
        T: t.Branded<number, t.IntBrand>;
    } | {
        e: "executionReport";
        E: t.Branded<number, t.IntBrand>;
        s: string;
        c: string;
        S: "SELL" | "BUY";
        o: "LIMIT" | "MARKET" | "STOP_LOSS" | "STOP_LOSS_LIMIT" | "TAKE_PROFIT" | "TAKE_PROFIT_LIMIT" | "LIMIT_MAKER";
        f: "GTC" | "IOC" | "FOK";
        q: string;
        p: string;
        P: string;
        F: string;
        g: t.Branded<number, t.IntBrand>;
        C: string;
        x: "NEW" | "CANCELED" | "REPLACED" | "TRADE" | "EXPIRED";
        X: "NEW" | "EXPIRED" | "PARTIALLY_FILLED" | "FILLED" | "CANCELLED" | "PENDING_CANCEL" | "REJECTED";
        r: string;
        i: t.Branded<number, t.IntBrand>;
        l: string;
        z: string;
        L: string;
        n: string;
        N: null;
        T: t.Branded<number, t.IntBrand>;
        t: t.Branded<number, t.IntBrand>;
        I: t.Branded<number, t.IntBrand>;
        w: boolean;
        m: boolean;
        M: boolean;
        O: t.Branded<number, t.IntBrand>;
        Z: string;
        Y: string;
        Q: string;
    } | {
        e: "listStatus";
        E: t.Branded<number, t.IntBrand>;
        s: string;
        g: t.Branded<number, t.IntBrand>;
        c: "OCO";
        l: "RESPONSE" | "EXEC_STARTED" | "ALL_DONE";
        L: "ALL_DONE" | "EXECUTING" | "REJECT";
        r: string;
        C: string;
        T: t.Branded<number, t.IntBrand>;
        O: {
            s: string;
            i: t.Branded<number, t.IntBrand>;
            c: string;
        }[];
    }>>;
};
export declare type BinanceWebSocketClient = ReturnType<typeof makeBinanceWebSocketClient>;
export {};
