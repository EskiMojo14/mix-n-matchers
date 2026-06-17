function aggregateErrors(errors: Array<unknown>): string {
  let errorMsg = "None of the items satisfied the assertion.";
  for (const error of errors) {
    if (error instanceof Error) {
      errorMsg += `\n- ${error.message}`;
    } else {
      errorMsg += `\n- ${String(error)}`;
    }
  }
  return errorMsg;
}

/**
 * Runs the assertion function on each element of the iterable until one of them passes. If none pass, it throws the last error encountered.
 * If the iterable is empty, it throws an error indicating that the assertion cannot be performed.
 *
 * @template T - The type of the elements in the iterable.
 * @template R - The return type of the assertion function.
 * @param actual - The iterable of elements to be tested.
 * @param assertion - The assertion function to be applied to each element of the iterable.
 * @returns The result of the assertion function for the first element that passes the assertion.
 * @throws {RangeError} If the iterable is empty
 * @throws {AggregateError} If none of the elements satisfy the assertion, containing all the errors encountered during the assertions.
 *
 * @example
 * const array = [1, 2, 3];
 * const result = some(array, (value) => {
 *   expect(value).toBeGreaterThan(2);
 *   return value;
 * });
 * // result will be 3
 */
export function some<T, R>(actual: Iterable<T>, assertion: (value: T) => Promise<R>): Promise<R>;
export function some<T, R>(actual: Iterable<T>, assertion: (value: T) => R): R;
export function some<T, R>(
  actual: Iterable<T>,
  assertion: (value: T) => R | Promise<R>,
): R | Promise<R> {
  const errors: Array<unknown> = [];
  const iterator = actual[Symbol.iterator]();
  let hasAsserted = false;

  // Try sync path first
  for (let next = iterator.next(); !next.done; next = iterator.next()) {
    hasAsserted = true;
    try {
      const result = assertion(next.value);

      // If we got a Promise, switch to async path
      if (result instanceof Promise) {
        return handleAsyncSome(iterator, assertion, result, errors);
      }

      return result;
    } catch (error) {
      errors.push(error);
    }
  }

  if (!hasAsserted) throw new RangeError("No items to assert on.");

  // All items failed
  throw new AggregateError(errors, aggregateErrors(errors));
}

async function handleAsyncSome<T, R>(
  iterator: Iterator<T>,
  assertion: (value: T) => R | Promise<R>,
  firstResult: Promise<R>,
  errors: Array<unknown>,
): Promise<R> {
  try {
    return await firstResult;
  } catch (error) {
    errors.push(error);
  }

  for (let next = iterator.next(); !next.done; next = iterator.next()) {
    try {
      return await assertion(next.value);
    } catch (error) {
      errors.push(error);
    }
  }

  throw new AggregateError(errors, aggregateErrors(errors));
}

/**
 * Runs the assertion function on each element of the async iterable until one of them passes. If none pass, it throws an AggregateError containing all the errors encountered.
 * If the async iterable is empty, it throws a RangeError indicating that the assertion cannot be performed.
 *
 * @template T - The type of the elements in the async iterable.
 * @template R - The return type of the assertion function.
 * @param actual - The async iterable of elements to be tested.
 * @param assertion - The assertion function to be applied to each element of the async iterable.
 * @returns A Promise that resolves to the result of the assertion function for the first element that passes the assertion.
 * @throws {RangeError} If the async iterable is empty
 * @throws {AggregateError} If none of the elements satisfy the assertion, containing all the errors encountered during the assertions.
 *
 * @example
 * const nums = async function* () {
 *   for (let i = 1; i <= 3; i++) {
 *     await wait(100); // Simulate async operation
 *     yield i;
 *   }
 * };
 * const result = await someAsync(nums(), (value) => {
 *   expect(value).toBeGreaterThan(2);
 *   return value;
 * });
 * // result will be 3
 */
export async function someAsync<T, R>(
  actual: AsyncIterable<T>,
  assertion: (value: Awaited<T>) => Promise<R> | R,
): Promise<R> {
  const errors: Array<unknown> = [];
  let hasAsserted = false;

  for await (const item of actual) {
    hasAsserted = true;
    try {
      return await assertion(item);
    } catch (error) {
      errors.push(error);
    }
  }

  if (!hasAsserted) throw new RangeError("No items to assert on.");

  throw new AggregateError(errors, aggregateErrors(errors));
}

/**
 * Runs the assertion function on each element of the iterable and collects the results. If any element does not satisfy the assertion, it throws an error.
 *
 * @template T - The type of the elements in the iterable.
 * @template R - The return type of the assertion function.
 * @param actual - The iterable of elements to be tested.
 * @param assertion - The assertion function to be applied to each element of the iterable.
 * @returns An array of results from the assertion function for each element that passes the assertion.
 * @throws {Error} If any of the elements do not satisfy the assertion.
 *
 * @example
 * const array = [1, 2, 3];
 * const results = every(array, (value) => {
 *   expect(value).toBeGreaterThan(0);
 *   return value * 2;
 * });
 * // results will be [2, 4, 6]
 */
export function every<T, R>(
  actual: Iterable<T>,
  assertion: (value: T) => Promise<R>,
): Promise<Array<Awaited<R>>>;
export function every<T, R>(actual: Iterable<T>, assertion: (value: T) => R): Array<R>;
export function every<T, R>(
  actual: Iterable<T>,
  assertion: (value: T) => R | Promise<R>,
): Array<R> | Promise<Array<Awaited<R>>> {
  const results: Array<R | Promise<R>> = [];
  let hasPromise = false;

  for (const item of actual) {
    const result = assertion(item);
    if (result instanceof Promise) {
      hasPromise = true;
    }
    results.push(result);
  }

  return hasPromise ? Promise.all(results) : (results as Array<R>);
}

/**
 * Runs the assertion function on each element of the async iterable and collects the results. If any element does not satisfy the assertion, it throws an error.
 *
 * @template T - The type of the elements in the async iterable.
 * @template R - The return type of the assertion function.
 * @param actual - The async iterable of elements to be tested.
 * @param assertion - The assertion function to be applied to each element of the async iterable.
 * @returns A Promise that resolves to an array of results from the assertion function for each element that passes the assertion.
 * @throws {Error} If any of the elements do not satisfy the assertion.
 *
 * @example
 * const nums = async function* () {
 *   for (let i = 1; i <= 3; i++) {
 *     await wait(100); // Simulate async operation
 *     yield i;
 *   }
 * };
 * const results = await everyAsync(nums(), (value) => {
 *   expect(value).toBeGreaterThan(0);
 *   return value * 2;
 * });
 * // results will be [2, 4, 6]
 */
export async function everyAsync<T, R>(
  actual: AsyncIterable<T>,
  assertion: (value: Awaited<T>) => Promise<R> | R,
): Promise<Array<Awaited<R>>> {
  const results: Array<Awaited<R>> = [];
  for await (const item of actual) {
    results.push(await assertion(item));
  }
  return results;
}
