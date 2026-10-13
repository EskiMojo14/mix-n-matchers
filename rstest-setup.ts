import type * as globals from "@globals";
import { expect, describe, it, rs, beforeAll, afterAll } from "@rstest/core";

import { alignedAnsiStyleSerializer } from "./src/utils/tests";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

rs.mock("@globals", (): Record<keyof typeof globals, unknown> => {
  return {
    describe,
    it,
    expect,
    fn: rs.fn,
    beforeAll,
    afterAll,
    useFakeTimers: rs.useFakeTimers,
  };
});
