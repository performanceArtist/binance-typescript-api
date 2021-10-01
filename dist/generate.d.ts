/// <reference types="replace-in-file" />
import { taskEither } from 'fp-ts';
export declare const generateApifromFile: (baseDir: string, specPath: string, out: string) => taskEither.TaskEither<unknown, import("replace-in-file").ReplaceResult[]>;
export declare const generateApifromURL: (baseDir: string, specUrl: string, out: string) => taskEither.TaskEither<unknown, void>;
