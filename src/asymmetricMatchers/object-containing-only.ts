import { printReceived } from "jest-matcher-utils";
import { makeEqualValue } from "../utils";
import type { MatcherFunction } from "../utils/types";

// Retrieves an object's keys for evaluation by getObjectSubset.  This evaluates
// the prototype chain for string keys but not for non-enumerable symbols.
// (Otherwise, it could find values such as a Set or Map's Symbol.toStringTag,
// with unexpected results.)
export const getObjectKeys = (object: object): Array<string | symbol> => {
  return [
    ...Object.keys(object),
    ...Object.getOwnPropertySymbols(object).filter(
      (s) => Object.getOwnPropertyDescriptor(object, s)?.enumerable,
    ),
  ];
};

function getPrototype(obj: object) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (Object.getPrototypeOf) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Object.getPrototypeOf(obj);
  }

  if (obj.constructor.prototype == obj) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return obj.constructor.prototype;
}

export function hasProperty(
  obj: object | null,
  property: string | symbol,
): boolean {
  if (!obj) {
    return false;
  }

  if (Object.prototype.hasOwnProperty.call(obj, property)) {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return hasProperty(getPrototype(obj), property);
}

export const objectContainingOnly: MatcherFunction<
  [expected: Record<string | symbol, unknown>]
> = function (received, expected) {
  if (typeof expected !== "object") {
    throw new Error(`Expected value must be an object, not ${typeof expected}`);
  }

  const receivedIsObject = typeof received === "object" && received !== null;
  let pass = receivedIsObject;

  if (receivedIsObject) {
    const equalValue = makeEqualValue(this);
    const receivedKeys = getObjectKeys(received);

    for (const key of receivedKeys) {
      if (
        !hasProperty(expected, key) ||
        !equalValue(received[key as never], expected[key])
      ) {
        pass = false;
        break;
      }
    }
  }

  return {
    pass,
    message: () =>
      `expected ${printReceived(received)} ${pass ? "not" : ""} to be an object containing only keys from ${printReceived(expected)}`,
  };
};

declare module "./index" {
  interface AsymmetricMixNMatchers {
    /**
     * Matches any object containing only matching keys and values.
     * Not all keys in the expected object need to be present in the received object.
     *
     * @example
     * expect({ a: 1 }).toEqual(objectContainingOnly({ a: 1, b: 2 })); // pass
     *
     * expect({ a: 1, b: 2 }).toEqual(objectContainingOnly({ a: 1 })); // fail
     */
    objectContainingOnly<E = {}>(expected: E): boolean;
  }
}
