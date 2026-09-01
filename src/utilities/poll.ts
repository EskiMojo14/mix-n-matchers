import type { MaybePromiseLike, Truthy } from "../utils/types";
import { wait } from "../utils";

export interface PollOptions {
  /**
   * The interval in milliseconds between each attempt to execute the function.
   * @default 100
   */
  interval?: number;
  /**
   * The maximum time in milliseconds to wait for the function to complete successfully.
   * @default 5000
   */
  timeout?: number;
}

const defaultOptions: Required<PollOptions> = {
  interval: 100,
  timeout: 5000,
};

/**
 * Waits for a function to complete successfully, retrying on failure until a timeout is reached.
 * @param fn The function to execute.
 * @param options Optional polling options, including interval and timeout.
 * @returns A promise that resolves with the result of the function if successful.
 * @throws An error if the function does not complete successfully within the timeout period.
 *
 * @example
 * const result = await waitFor(() => {
 *   expect(someCondition).toBe(true);
 *   return someValue;
 * });
 */
export async function waitFor<T>(fn: () => MaybePromiseLike<T>, options?: PollOptions): Promise<T> {
  const { interval, timeout } = { ...defaultOptions, ...options };

  const startTime = Date.now();

  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (Date.now() - startTime >= timeout) {
        throw error;
      }
      await wait(interval);
    }
  }
}

/**
 * Waits for a function to return a truthy value, retrying on falsy values until a timeout is reached.
 * If the callback throws an error, it is re-thrown immediately instead of retrying.
 * @param fn The function to execute.
 * @param options Optional polling options, including interval and timeout.
 * @returns A promise that resolves with the truthy result of the function if successful.
 * @throws An error if the callback throws or if the function does not return a truthy value within the timeout period.
 *
 * @example
 * const firstItem = await waitUntil(() => {
 *   return array.length > 0 ? array[0] : null;
 * });
 */
export async function waitUntil<T>(
  fn: () => MaybePromiseLike<T>,
  options?: PollOptions,
): Promise<Truthy<T>> {
  const { interval, timeout } = { ...defaultOptions, ...options };
  const startTime = Date.now();

  while (true) {
    const result = await fn();

    if (!result) {
      if (Date.now() - startTime >= timeout) {
        throw new Error("Condition not met", { cause: result });
      }
      await wait(interval);
      continue;
    }

    return result as Truthy<T>;
  }
}
