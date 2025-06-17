/* eslint-disable @typescript-eslint/no-empty-function */
import type { Mock } from "@globals";
import { it, expect, describe, fn } from "@globals";
import type { CallInfo, Spy } from "../utils";

// Given a Jest mock function, return a minimal mock of a spy.
const createSpy = (mock: Mock): Spy => {
  const spy = function () {};

  spy.calls = {
    all() {
      const info: Array<CallInfo> = [];
      let i = 0;
      while (i < mock.mock.calls.length) {
        const returnRecord = mock.mock.results[i];
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        info.push({
          args: mock.mock.calls[i] ?? [],
          object:
            "contexts" in mock.mock
              ? mock.mock.contexts[i]
              : (mock.mock as { instances: Array<unknown> }).instances[i],
          returnValue:
            returnRecord?.type === "return" ? returnRecord.value : undefined,
        });
        /* eslint-enable @typescript-eslint/no-unsafe-assignment */
        i++;
      }
      return info;
    },
    count() {
      return mock.mock.calls.length;
    },
  };

  return spy;
};

describe.each([
  "toHaveBeenCalledWithContext",
  "toHaveBeenLastCalledWithContext",
  "toHaveBeenNthCalledWithContext",
] as const)("%s", (calledWithContext) => {
  it("works only on spies or fn", () => {
    const mock = function mock() {};
    if (calledWithContext === "toHaveBeenNthCalledWithContext") {
      expect(() => {
        expect(mock)[calledWithContext](3, "foo");
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(() => {
        expect(mock)[calledWithContext]("foo");
      }).toThrowErrorMatchingSnapshot();
    }
  });
  it("works when not called", () => {
    const mock = fn();
    if (calledWithContext === "toHaveBeenNthCalledWithContext") {
      expect(createSpy(mock)).not[calledWithContext](1, "foo");
      expect(mock).not[calledWithContext](1, "foo");

      expect(() => {
        expect(mock)[calledWithContext](1, "foo");
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(createSpy(mock)).not[calledWithContext]("foo");
      expect(mock).not[calledWithContext]("foo");

      expect(() => {
        expect(mock)[calledWithContext]("foo");
      }).toThrowErrorMatchingSnapshot();
    }
  });
  it("works with a context that doesn't match", () => {
    const mock = fn();
    mock.call("bar");

    if (calledWithContext === "toHaveBeenNthCalledWithContext") {
      expect(createSpy(mock)).not[calledWithContext](1, "foo");
      expect(mock).not[calledWithContext](1, "foo");

      expect(() => {
        expect(mock)[calledWithContext](1, "foo");
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(createSpy(mock)).not[calledWithContext]("foo");
      expect(mock).not[calledWithContext]("foo");

      expect(() => {
        expect(mock)[calledWithContext]("foo");
      }).toThrowErrorMatchingSnapshot();
    }
  });
  it("works with a context that doesn't match with matchers", () => {
    const mock = fn();
    mock.call("bar");

    if (calledWithContext === "toHaveBeenNthCalledWithContext") {
      expect(createSpy(mock)).not[calledWithContext](1, expect.any(Number));
      expect(mock).not[calledWithContext](1, expect.any(Number));

      expect(() => {
        expect(mock)[calledWithContext](1, expect.any(Number));
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(createSpy(mock)).not[calledWithContext](expect.any(Number));
      expect(mock).not[calledWithContext](expect.any(Number));

      expect(() => {
        expect(mock)[calledWithContext](expect.any(Number));
      }).toThrowErrorMatchingSnapshot();
    }
  });
  it("works with a context that matches", () => {
    const mock = fn();
    mock.call("foo");

    if (calledWithContext === "toHaveBeenNthCalledWithContext") {
      expect(createSpy(mock))[calledWithContext](1, "foo");
      expect(mock)[calledWithContext](1, "foo");

      expect(() => {
        expect(mock).not[calledWithContext](1, "foo");
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(createSpy(mock))[calledWithContext]("foo");
      expect(mock)[calledWithContext]("foo");

      expect(() => {
        expect(mock).not[calledWithContext]("foo");
      }).toThrowErrorMatchingSnapshot();
    }
  });
  it("works with a context that matches with a matcher", () => {
    const mock = fn();
    mock.call("foo");

    if (calledWithContext === "toHaveBeenNthCalledWithContext") {
      expect(createSpy(mock))[calledWithContext](1, expect.any(String));
      expect(mock)[calledWithContext](1, expect.any(String));

      expect(() => {
        expect(mock).not[calledWithContext](1, expect.any(String));
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(createSpy(mock))[calledWithContext](expect.any(String));
      expect(mock)[calledWithContext](expect.any(String));

      expect(() => {
        expect(mock).not[calledWithContext](expect.any(String));
      }).toThrowErrorMatchingSnapshot();
    }
  });

  it("includes the custom mock name in the error message", () => {
    const mock = fn().mockName("named-mock");

    mock.call("foo");

    if (calledWithContext === "toHaveBeenNthCalledWithContext") {
      expect(mock)[calledWithContext](1, "foo");

      expect(() => {
        expect(mock).not[calledWithContext](1, "foo");
      }).toThrowErrorMatchingSnapshot();
    } else {
      expect(mock)[calledWithContext]("foo");

      expect(() => {
        expect(mock).not[calledWithContext]("foo");
      }).toThrowErrorMatchingSnapshot();
    }
  });
});
