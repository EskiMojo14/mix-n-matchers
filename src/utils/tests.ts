/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ansiRegex from "ansi-regex";
// ansi-styles is ESM - as a result we need to run our Jest tests with `--experimental-vm-modules` flag
import style from "ansi-styles";
import type { NewPlugin } from "pretty-format";

export const alignedAnsiStyleSerializer: NewPlugin = {
  serialize(val: string | Error): string {
    // Return the string itself, not escaped nor enclosed in double quote marks.
    return (val instanceof Error ? val.message : val).replace(
      ansiRegex(),
      (match) => {
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
      },
    );
  },
  test(val: unknown) {
    return typeof val === "string" || val instanceof Error;
  },
};
