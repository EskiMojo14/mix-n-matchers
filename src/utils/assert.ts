export function assert(
  condition: unknown,
  message: string | (() => string),
): asserts condition {
  if (!condition) {
    throw new Error(typeof message === "function" ? message() : message);
  }
}
