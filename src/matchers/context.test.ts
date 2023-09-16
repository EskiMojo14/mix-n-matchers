import { alignedAnsiStyleSerializer } from "../utils/tests";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

describe("Function context matchers", () => {
  const context = {};
  const func = jest.fn();
  afterEach(() => {
    func.mockClear();
  });
  describe.each([
    "toHaveBeenCalledWithContext",
    "toBeCalledWithContext",
  ] as const)("%s", (toHaveContext) => {
    it("asserts mock has been called at least once with given context", () => {
      expect(() => {
        expect(func)[toHaveContext](context);
      }).toThrowErrorMatchingSnapshot("no calls");

      // called once with context we're looking for
      func.call(context);
      expect(() => {
        expect(func)[toHaveContext](context);
      }).not.toThrow();

      // called at least once with the context we're looking for
      func.call(null);
      expect(() => {
        expect(func)[toHaveContext](context);
      }).not.toThrow();

      func.mockClear();

      // called once with a different context
      func.call(null);
      expect(() => {
        expect(func)[toHaveContext](context);
      }).toThrowErrorMatchingSnapshot("single call");

      // called again with a different context
      func.call(null);
      expect(() => {
        expect(func)[toHaveContext](context);
      }).toThrowErrorMatchingSnapshot("multiple call");
    });
    it("asserts mock has not been called with given context", () => {
      expect(() => {
        expect(func).not[toHaveContext](context);
      }).not.toThrow();

      // called once with context we're avoiding
      func.call(context);
      expect(() => {
        expect(func).not[toHaveContext](context);
      }).toThrowErrorMatchingSnapshot("single call");

      // called at least once with the context we're avoiding
      func.call(null);
      expect(() => {
        expect(func).not[toHaveContext](context);
      }).toThrowErrorMatchingSnapshot("partial call");

      // called twice with the context we're avoiding
      func.call(context);
      expect(() => {
        expect(func).not[toHaveContext](context);
      }).toThrowErrorMatchingSnapshot("multiple call");

      func.mockClear();

      // called once with a different context
      func.call(null);
      expect(() => {
        expect(func).not[toHaveContext](context);
      }).not.toThrow();

      // called again with a different context
      func.call(null);
      expect(() => {
        expect(func).not[toHaveContext](context);
      }).not.toThrow();
    });
  });
  describe.each([
    "lastCalledWithContext",
    "toHaveBeenLastCalledWithContext",
  ] as const)("%s", (lastCalledWithContext) => {});
  describe.each([
    "nthCalledWithContext",
    "toHaveBeenNthCalledWithContext",
  ] as const)("%s", (nthCalledWithContext) => {});
});
