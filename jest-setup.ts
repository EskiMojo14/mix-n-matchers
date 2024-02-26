import { expect, describe, it, jest } from "@jest/globals";
import { alignedAnsiStyleSerializer } from "./src/utils/tests";
import type * as globals from "./src/utils/globals";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

jest.unstable_mockModule("@globals", (): typeof globals => {
  return { describe, it, expect, fn: jest.fn };
});
