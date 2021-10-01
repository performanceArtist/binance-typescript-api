import * as t from 'io-ts';
export declare const BinanceKlineIO: t.TupleType<[t.NumberC, t.StringC, t.StringC, t.StringC, t.StringC, t.StringC, t.NumberC, t.StringC, t.NumberC, t.StringC, t.StringC, t.StringC], readonly [number, string, string, string, string, string, number, string, number, string, string, string], readonly [number, string, string, string, string, string, number, string, number, string, string, string], unknown>;
export declare type BinanceKline = t.TypeOf<typeof BinanceKlineIO>;
