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
  const expectedContext = "foo";
  const wrongContext = "bar";
  it("works only on spies or jest.fn", () => {
    const fn = function fn() {};
    if (isToHaveNth(calledWithContext)) {
      expect(() => {
        expect(fn)[calledWithContext](3, expectedContext);
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(() => {
        expect(fn)[calledWithContext](expectedContext);
      }).toThrowErrorMatchingSnapshot();
    }
  });
  it("works when not called", () => {
    const fn = jest.fn();
    if (isToHaveNth(calledWithContext)) {
      expect(createSpy(fn)).not[calledWithContext](1, expectedContext);
      expect(fn).not[calledWithContext](1, expectedContext);

      expect(() => {
        expect(fn)[calledWithContext](1, expectedContext);
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(createSpy(fn)).not[calledWithContext](expectedContext);
      expect(fn).not[calledWithContext](expectedContext);

      expect(() => {
        expect(fn)[calledWithContext](expectedContext);
      }).toThrowErrorMatchingSnapshot();
    }
  });
  it("works with contexts that don't match", () => {
    const fn = jest.fn();
    fn.call(wrongContext);

    if (isToHaveNth(calledWithContext)) {
      expect(createSpy(fn)).not[calledWithContext](1, expectedContext);
      expect(fn).not[calledWithContext](1, expectedContext);

      expect(() => {
        expect(fn)[calledWithContext](1, expectedContext);
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(createSpy(fn)).not[calledWithContext](expectedContext);
      expect(fn).not[calledWithContext](expectedContext);

      expect(() => {
        expect(fn)[calledWithContext](expectedContext);
      }).toThrowErrorMatchingSnapshot();
    }
  });
});
