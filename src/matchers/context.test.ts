/* eslint-disable @typescript-eslint/no-empty-function */
import { alignedAnsiStyleSerializer } from "../utils/tests";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

// Given a Jest mock function, return a minimal mock of a spy.
const createSpy = (fn: jest.Mock) => {
  const spy = function () {};

  spy.calls = {
    all() {
      const info: Array<jasmine.CallInfo> = [];
      let i = 0;
      while (i < fn.mock.calls.length) {
        const returnRecord = fn.mock.results[i];
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        info.push({
          args: fn.mock.calls[i],
          object: fn.mock.contexts[i],
          returnValue:
            returnRecord?.type === "return" ? returnRecord.value : undefined,
        });
        /* eslint-enable @typescript-eslint/no-unsafe-assignment */
        i++;
      }
      return info;
    },
    count() {
      return fn.mock.calls.length;
    },
  };

  return spy;
};

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
  it("works only on spies or jest.fn", () => {
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
    const fn = jest.fn();
    if (isToHaveNth(calledWithContext)) {
      expect(createSpy(fn)).not[calledWithContext](1, "foo");
      expect(fn).not[calledWithContext](1, "foo");

      expect(() => {
        expect(fn)[calledWithContext](1, "foo");
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(createSpy(fn)).not[calledWithContext]("foo");
      expect(fn).not[calledWithContext]("foo");

      expect(() => {
        expect(fn)[calledWithContext]("foo");
      }).toThrowErrorMatchingSnapshot();
    }
  });
  it("works with a context that doesn't match", () => {
    const fn = jest.fn();
    fn.call("bar");

    if (isToHaveNth(calledWithContext)) {
      expect(createSpy(fn)).not[calledWithContext](1, "foo");
      expect(fn).not[calledWithContext](1, "foo");

      expect(() => {
        expect(fn)[calledWithContext](1, "foo");
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(createSpy(fn)).not[calledWithContext]("foo");
      expect(fn).not[calledWithContext]("foo");

      expect(() => {
        expect(fn)[calledWithContext]("foo");
      }).toThrowErrorMatchingSnapshot();
    }
  });
  it("works with a context that doesn't match with matchers", () => {
    const fn = jest.fn();
    fn.call("bar");

    if (isToHaveNth(calledWithContext)) {
      expect(createSpy(fn)).not[calledWithContext](1, expect.any(Number));
      expect(fn).not[calledWithContext](1, expect.any(Number));

      expect(() => {
        expect(fn)[calledWithContext](1, expect.any(Number));
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(createSpy(fn)).not[calledWithContext](expect.any(Number));
      expect(fn).not[calledWithContext](expect.any(Number));

      expect(() => {
        expect(fn)[calledWithContext](expect.any(Number));
      }).toThrowErrorMatchingSnapshot();
    }
  });
  it("works with a context that matches", () => {
    const fn = jest.fn();
    fn.call("foo");

    if (isToHaveNth(calledWithContext)) {
      expect(createSpy(fn))[calledWithContext](1, "foo");
      expect(fn)[calledWithContext](1, "foo");

      expect(() => {
        expect(fn).not[calledWithContext](1, "foo");
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(createSpy(fn))[calledWithContext]("foo");
      expect(fn)[calledWithContext]("foo");

      expect(() => {
        expect(fn).not[calledWithContext]("foo");
      }).toThrowErrorMatchingSnapshot();
    }
  });
  it("works with a context that matches with a matcher", () => {
    const fn = jest.fn();
    fn.call("foo");

    if (isToHaveNth(calledWithContext)) {
      expect(createSpy(fn))[calledWithContext](1, expect.any(String));
      expect(fn)[calledWithContext](1, expect.any(String));

      expect(() => {
        expect(fn).not[calledWithContext](1, expect.any(String));
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(createSpy(fn))[calledWithContext](expect.any(String));
      expect(fn)[calledWithContext](expect.any(String));

      expect(() => {
        expect(fn).not[calledWithContext](expect.any(String));
      }).toThrowErrorMatchingSnapshot();
    }
  });

  it("includes the custom mock name in the error message", () => {
    const fn = jest.fn().mockName("named-mock");

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
