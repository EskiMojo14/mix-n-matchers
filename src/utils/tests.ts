/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ansiRegex from "ansi-regex";
// ansi-styles is ESM - as a result we need to run our Jest tests with `--experimental-vm-modules` flag
import style from "ansi-styles";

export const alignedAnsiStyleSerializer = {
  serialize(val: string | Error): string {
    // Return the string itself, not escaped nor enclosed in double quote marks.
    return (val instanceof Error ? val.message : val).replace(ansiRegex(), (match) => {
      switch (match) {
        case style.inverse.open:
          return "<i>";
        case style.inverse.close:
          return "</i>";

        case style.bold.open:
          return "<b>";
        case style.dim.open:
          return "<d>";
        case style.green.open:
          return "<g>";
        case style.red.open:
          return "<r>";
        case style.yellow.open:
          return "<y>";
        case style.bgYellow.open:
          return "<Y>";

        case style.bold.close:
          return "</b>";
        case style.dim.close:
          return "</d>";
        case style.green.close:
          return "</g>";
        case style.red.close:
          return "</r>";
        case style.yellow.close:
          return "</y>";
        case style.bgYellow.close:
          return "</Y>";

        default:
          return match; // unexpected escape sequence
      }
    });
  },
  test(val: unknown) {
    return typeof val === "string" || val instanceof Error;
  },
};

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

import type { SnapshotSerializer } from "vitest";

function getErrorName(error: Error): string {
  return error.name !== "Error"
    ? error.name
    : (typeof error.constructor === "function" && error.constructor.name) || "Object";
}

function serializeCausalChain(e: Error): string {
  let error: unknown = e;
  let message = "";
  while (typeof error === "object" && error !== null && "cause" in error) {
    error = error.cause;
    if (error instanceof Error) {
      message += `\nCause: [${getErrorName(error)}: ${error.message}]`;
    } else {
      if (typeof error === "string") {
        message += `\nCause: [Error: ${error}]`;
      }
      break;
    }
  }
  return message;
}

// Because Vitest doesn't Snapshot Error.cause automatically
// see https://github.com/vitest-dev/vitest/issues/10339
export const errorSerializer: SnapshotSerializer = {
  test: (val: unknown): boolean => {
    return !!((val as Error)?.cause && (val as Error)?.cause instanceof Error);
  },

  serialize(error: Error) {
    return `${alignedAnsiStyleSerializer.serialize(error.message)}${serializeCausalChain(error)}`;
  },
};
