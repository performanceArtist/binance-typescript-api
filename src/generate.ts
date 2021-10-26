import { generate } from '@devexperts/swagger-codegen-ts';
import * as path from 'path';
import { serialize as serializeOpenAPI3 } from '@devexperts/swagger-codegen-ts/dist/language/typescript/3.0';
import { OpenapiObjectCodec } from '@devexperts/swagger-codegen-ts/dist/schema/3.0/openapi-object';
import { either, task, taskEither } from 'fp-ts';
import { replaceInFile } from 'replace-in-file';
import { identity, pipe } from 'fp-ts/lib/function';
import axios from 'axios';
import fs from 'fs';
import { promisify } from 'util';

// api has a parameter called 'symbol', which conflicts with js' native type
const fixSymbolType = (glob: string) =>
  replaceInFile({
    files: glob,
    from: [
      'export type symbol = string;',
      'export const symbolIO = string;',
      new RegExp(
        `import { symbol, symbolIO } from '../components/parameters/symbol';`,
        'g'
      ),
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

export const generateApifromFile = (
  baseDir: string,
  specPath: string,
  out: string
) =>
  pipe(
    generate({
      cwd: baseDir,
      spec: path.resolve(baseDir, specPath),
      out: path.resolve(baseDir, out),
      language: serializeOpenAPI3,
      decoder: OpenapiObjectCodec,
    }),
    taskEither.chain(() =>
      taskEither.tryCatch(
        () =>
          fixSymbolType(`${path.resolve(baseDir, out)}/spot_api.yaml/**/*.ts`),
        identity
      )
    )
  );

const cleanup = taskEither.tryCatch(
  () => promisify(fs.unlink)('spot_api.yaml'),
  (e) => {
    console.log('Failed to cleanup');
    return e;
  }
);

export const generateApifromURL = (
  baseDir: string,
  specUrl: string,
  out: string
) =>
  pipe(
    taskEither.tryCatch(() => axios.get(specUrl), identity),
    taskEither.chain((response) =>
      taskEither.tryCatch(
        () => promisify(fs.writeFile)('spot_api.yaml', response.data),
        identity
      )
    ),
    taskEither.chain(() => generateApifromFile(baseDir, 'spot_api.yaml', out)),
    task.chain(
      either.fold(
        (e) =>
          pipe(
            cleanup,
            task.map(() => either.left(e))
          ),
        () => cleanup
      )
    )
  );
