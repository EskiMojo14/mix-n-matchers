/* eslint-disable @typescript-eslint/no-empty-function */
import { expect, describe, it, vi } from "vitest";
import { alignedAnsiStyleSerializer } from "../utils/tests";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

describe.each([
  "toHaveBeenCalledWithContext",
  "toBeCalledWithContext",
  "lastCalledWithContext",
  "toHaveBeenLastCalledWithContext",
  "nthCalledWithContext",
  "toHaveBeenNthCalledWithContext",
] as const)("%s", (calledWithContext) => {
  function isToHaveNth(
    calledWithContext: string,
  ): calledWithContext is
    | "nthCalledWithContext"
    | "toHaveBeenNthCalledWithContext" {
    return (
      calledWithContext === "nthCalledWithContext" ||
      calledWithContext === "toHaveBeenNthCalledWithContext"
    );
  }
  it("works only on spies or vi.fn", () => {
    const fn = function fn() {};
    if (isToHaveNth(calledWithContext)) {
      expect(() => {
        expect(fn)[calledWithContext](3, "foo");
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(() => {
        expect(fn)[calledWithContext]("foo");
      }).toThrowErrorMatchingSnapshot();
    }
  });
  it("works when not called", () => {
    const fn = vi.fn();
    if (isToHaveNth(calledWithContext)) {
      expect(fn).not[calledWithContext](1, "foo");

      expect(() => {
        expect(fn)[calledWithContext](1, "foo");
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(fn).not[calledWithContext]("foo");

      expect(() => {
        expect(fn)[calledWithContext]("foo");
      }).toThrowErrorMatchingSnapshot();
    }
  });
  it("works with a context that doesn't match", () => {
    const fn = vi.fn();
    fn.call("bar");

    if (isToHaveNth(calledWithContext)) {
      expect(fn).not[calledWithContext](1, "foo");

      expect(() => {
        expect(fn)[calledWithContext](1, "foo");
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(fn).not[calledWithContext]("foo");

      expect(() => {
        expect(fn)[calledWithContext]("foo");
      }).toThrowErrorMatchingSnapshot();
    }
  });
  it("works with a context that doesn't match with matchers", () => {
    const fn = vi.fn();
    fn.call("bar");

    if (isToHaveNth(calledWithContext)) {
      expect(fn).not[calledWithContext](1, expect.any(Number));

      expect(() => {
        expect(fn)[calledWithContext](1, expect.any(Number));
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(fn).not[calledWithContext](expect.any(Number));

      expect(() => {
        expect(fn)[calledWithContext](expect.any(Number));
      }).toThrowErrorMatchingSnapshot();
    }
  });
  it("works with a context that matches", () => {
    const fn = vi.fn();
    fn.call("foo");

    if (isToHaveNth(calledWithContext)) {
      expect(fn)[calledWithContext](1, "foo");

      expect(() => {
        expect(fn).not[calledWithContext](1, "foo");
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(fn)[calledWithContext]("foo");

      expect(() => {
        expect(fn).not[calledWithContext]("foo");
      }).toThrowErrorMatchingSnapshot();
    }
  });
  it("works with a context that matches with a matcher", () => {
    const fn = vi.fn();
    fn.call("foo");

    if (isToHaveNth(calledWithContext)) {
      expect(fn)[calledWithContext](1, expect.any(String));

      expect(() => {
        expect(fn).not[calledWithContext](1, expect.any(String));
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(fn)[calledWithContext](expect.any(String));

      expect(() => {
        expect(fn).not[calledWithContext](expect.any(String));
      }).toThrowErrorMatchingSnapshot();
    }
  });

  it("includes the custom mock name in the error message", () => {
    const fn = vi.fn().mockName("named-mock");

    fn.call("foo");

    if (isToHaveNth(calledWithContext)) {
      expect(fn)[calledWithContext](1, "foo");

      expect(() => {
        expect(fn).not[calledWithContext](1, "foo");
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(fn)[calledWithContext]("foo");

      expect(() => {
        expect(fn).not[calledWithContext]("foo");
      }).toThrowErrorMatchingSnapshot();
    }
  });
});
