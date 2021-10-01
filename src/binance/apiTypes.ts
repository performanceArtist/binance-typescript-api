import * as t from 'io-ts';

/*
  [
  [
    1499040000000,      // Open time
    "0.01634790",       // Open
    "0.80000000",       // High
    "0.01575800",       // Low
    "0.01577100",       // Close
    "148976.11427815",  // Volume
    1499644799999,      // Close time
    "2434.19055334",    // Quote asset volume
    308,                // Number of trades
    "1756.87402397",    // Taker buy base asset volume
    "28.46694368",      // Taker buy quote asset volume
    "17928899.62484339" // Ignore.
  ]
]
*/
// workaround: https://github.com/gcanti/io-ts/issues/431
type TupleFn = <TCodecs extends readonly t.Mixed[]>(
  codecs: TCodecs,
  name?: string
) => t.TupleType<
  {
    -readonly [K in keyof TCodecs]: TCodecs[K];
  },
  {
    [K in keyof TCodecs]: TCodecs[K] extends t.Mixed
      ? t.TypeOf<TCodecs[K]>
      : unknown;
  },
  {
    [K in keyof TCodecs]: TCodecs[K] extends t.Mixed
      ? t.OutputOf<TCodecs[K]>
      : unknown;
  }
>;
const tuple: TupleFn = t.tuple as any;
export const BinanceKlineIO = tuple([
  t.number,
  t.string,
  t.string,
  t.string,
  t.string,
  t.string,
  t.number,
  t.string,
  t.number,
  t.string,
  t.string,
  t.string,
] as const);

export type BinanceKline = t.TypeOf<typeof BinanceKlineIO>;
