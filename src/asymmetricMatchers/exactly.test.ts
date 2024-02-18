import { alignedAnsiStyleSerializer } from "../utils/tests";

expect.addSnapshotSerializer(alignedAnsiStyleSerializer);

describe("exactly", () => {
  it("allows Object.is equality where deep equality would normally be used", () => {
    const ref = {};
    const fn = import.meta.jest.fn();
    fn(ref);
    expect(fn).toBeCalledWith(expect.exactly(ref));
    expect(() => {
      expect(fn).toBeCalledWith(expect.exactly({}));
    }).toThrowErrorMatchingSnapshot();

    expect(fn).toBeCalledWith(expect.not.exactly({}));
    expect(() => {
      expect(fn).toBeCalledWith(expect.not.exactly(ref));
    }).toThrowErrorMatchingSnapshot();
  });
});
