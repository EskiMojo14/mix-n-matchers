import type { Tester } from "../utils/types";

/**
 * Equality tester for FormData objects. It checks if two FormData instances have the same entries in the same order.
 * It uses the `equals` function from the context to compare the values of the entries.
 */
export const formDataEquality: Tester = function (a, b, customTesters) {
  const { equals } = this;
  if (!(a instanceof FormData && b instanceof FormData)) return undefined;
  // quick win
  if (a === b) return true;

  const aEntries = Array.from(a.entries());
  const bEntries = Array.from(b.entries());

  if (aEntries.length !== bEntries.length) return false;

  for (let idx = 0; idx < aEntries.length; idx++) {
    const [aKey, aValue] = aEntries[idx]!;
    const [bKey, bValue] = bEntries[idx]!;

    if (aKey !== bKey) return false;
    if (!equals(aValue, bValue, customTesters)) return false;
  }

  return true;
};

/**
 * Equality tester for case-insensitive string comparison. It checks if two strings are equal, ignoring case differences.
 */
export function caseInsensitiveEquality(a: unknown, b: unknown) {
  if (typeof a === "string" && typeof b === "string") {
    return a.toLowerCase() === b.toLowerCase();
  }
  return undefined;
}
