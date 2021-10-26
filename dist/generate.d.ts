/// <reference types="replace-in-file" />
import { either, task, taskEither } from 'fp-ts';
export declare const generateApifromFile: (baseDir: string, specPath: string, out: string) => taskEither.TaskEither<unknown, import("replace-in-file").ReplaceResult[]>;
export declare const generateApifromURL: (baseDir: string, specUrl: string, out: string) => task.Task<either.Either<unknown, void>>;
