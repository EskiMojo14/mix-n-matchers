import { describe, expect, it, beforeAll, afterAll } from "@globals";
import * as realEquality from "./equality";
import type { Tester } from "../utils/types";

// expect.addEqualityTesters cannot be reset, so we add testers we can enable/disable to avoid affecting other tests.

const noopTester = () => undefined;
const fakeEquality: {
  -readonly [K in keyof typeof realEquality]: Tester;
} = {
  caseInsensitiveEquality: noopTester,
  formDataEquality: noopTester,
};

function withReal(key: keyof typeof realEquality) {
  beforeAll(() => {
    fakeEquality[key] = realEquality[key];
  });
  afterAll(() => {
    fakeEquality[key] = noopTester;
  });
}

expect.addEqualityTesters([
  function ci(...args) {
    return fakeEquality.caseInsensitiveEquality.call(this, ...args);
  },
  function fd(...args) {
    return fakeEquality.formDataEquality.call(this, ...args);
  },
]);

describe("caseInsensitiveEquality", () => {
  withReal("caseInsensitiveEquality");

  it("returns undefined when values are not both strings", () => {
    expect(realEquality.caseInsensitiveEquality(1, "test")).toBeUndefined();
    expect(realEquality.caseInsensitiveEquality("test", 1)).toBeUndefined();
    expect(realEquality.caseInsensitiveEquality(1, 2)).toBeUndefined();
  });

  it("returns true for equal strings ignoring case", () => {
    expect("HELLO").toEqual("hello");
    expect("world").toEqual("WORLD");
  });
  it("returns false for unequal strings ignoring case", () => {
    expect("HELLO").not.toEqual("world");
    expect("world").not.toEqual("WORLD!");
  });
});

describe("formDataEquality", () => {
  withReal("formDataEquality");

  it("returns undefined when values are not both FormData", () => {
    expect(
      realEquality.formDataEquality.call({ equals: Object.is }, new FormData(), {}, []),
    ).toBeUndefined();
  });

  it("returns true for the same FormData reference", () => {
    const data = new FormData();
    data.append("a", "1");

    expect(data).toEqual(data);
  });

  it("returns true for equal string entries", () => {
    const a = new FormData();
    a.append("a", "1");
    a.append("b", "2");

    const b = new FormData();
    b.append("a", "1");
    b.append("b", "2");

    expect(a).toEqual(b);
  });

  it("returns false when entry order differs", () => {
    const a = new FormData();
    a.append("a", "1");
    a.append("b", "2");

    const b = new FormData();
    b.append("b", "2");
    b.append("a", "1");

    expect(a).not.toEqual(b);
  });

  it("returns false when duplicate-key entry order differs", () => {
    const a = new FormData();
    a.append("a", "1");
    a.append("a", "2");

    const b = new FormData();
    b.append("a", "2");
    b.append("a", "1");

    expect(a).not.toEqual(b);
  });

  describe("with custom testers", () => {
    withReal("caseInsensitiveEquality");
    it("uses custom testers through equals", () => {
      const a = new FormData();
      a.append("a", "Hello");

      const b = new FormData();
      b.append("a", "hello");

      expect(a).toEqual(b);
    });
  });
});
