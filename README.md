# mix-n-matchers

Miscellaneous custom Jest matchers

## Installation

Install via `npm` or `yarn`:

```
npm install -D mix-n-matchers
```

```
yarn add -D mix-n-matchers
```

## Setup

Create a setup script with the following:

```js
// add all matchers
import * as mixNMatchers from "mix-n-matchers";
expect.extend(mixNMatchers);

// or just add specific matchers
import {
  toBeCalledWithContext,
  lastCalledWithContext,
  nthCalledWithContext,
  exactly,
} from "mix-n-matchers";

expect.extend({
  toBeCalledWithContext,
  lastCalledWithContext,
  nthCalledWithContext,
  exactly,
});
```

Add your setup script to your Jest `setupFilesAfterEnv` configuration. [For reference](https://jestjs.io/docs/configuration#setupfilesafterenv-array)

```json
"jest": {
  "setupFilesAfterEnv": ["./testSetup.js"]
}
```

To automatically extend `expect` with all matchers, you can use

```json
"jest": {
  "setupFilesAfterEnv": ["mix-n-matchers/all"]
}
```

If you're using `@jest/globals` instead of injecting globals, you should use the `jest-globals` entry point instead of `all`.

```json
"jest": {
  "setupFilesAfterEnv": ["mix-n-matchers/jest-globals"]
}
```

If you're using Vitest, you should instead use `mix-n-matchers/vitest`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["mix-n-matchers/vitest"],
    include: ["src/**/*.vi.test.ts"],
  },
});
```

## Typescript

If your editor does not recognise the custom `mix-n-matchers` matchers, add a `global.d.ts` file to your project with:

```ts
// global.d.ts
import "mix-n-matchers/all";
```

If you want finer control of which matchers are included (i.e. you're only extending with some), you can set this up yourself:

```ts
// global.d.ts
import type { MixNMatchers, AsymmetricMixNMatchers } from "mix-n-matchers";

declare global {
  namespace jest {
    export interface Matchers<R, T>
      extends Pick<
        MixNMatchers<R, T>,
        | "toBeCalledWithContext"
        | "lastCalledWithContext"
        | "nthCalledWithContext"
      > {}

    export interface Expect extends Pick<AsymmetricMixNMatchers, "exactly"> {}

    export interface InverseAsymmetricMatchers
      extends Pick<AsymmetricMixNMatchers, "exactly"> {}
  }
}
```

One method of ensuring this is in line with your actual setup file would be by exporting objects:

```js
// testSetup.js
import {
  toBeCalledWithContext,
  lastCalledWithContext,
  nthCalledWithContext,
  exactly,
} from "mix-n-matchers";

export const mixNMatchers = {
  toBeCalledWithContext,
  lastCalledWithContext,
  nthCalledWithContext,
};

expect.extend(mixNMatchers);

export const asymmMixNMatchers = { exactly };

expect.extend(asymmMixNMatchers);
```

```ts
// global.d.ts
import type { mixNMatchers, asymmMixNMatchers } from "../testSetup.js";
import type { MixNMatchers, AsymmetricMixNMatchers } from "mix-n-matchers";

declare global {
  namespace jest {
    export interface Matchers<R, T>
      extends Pick<MixNMatchers<R, T>, keyof typeof mixNMatchers> {}

    export interface Expect
      extends Pick<AsymmetricMixNMatchers, keyof typeof asymmMixNMatchers> {}

    export interface InverseAsymmetricMatchers
      extends Pick<AsymmetricMixNMatchers, keyof typeof asymmMixNMatchers> {}
  }
}
```

### `@jest/globals`

If you disable `injectGlobals` for Jest and instead import from `'@jest/globals'`, the setup will look slightly different.

If you just want all of the matchers, your `global.d.ts` file should have:

```ts
// global.d.ts
import "mix-n-matchers/jest-globals";
```

If you want finer control over which matchers are added, you should follow the below:

```ts
// global.d.ts
import type { MixNMatchers, AsymmetricMixNMatchers } from "mix-n-matchers";

declare module "@jest/extend" {
  export interface Matchers<R, T>
    extends Pick<
      MixNMatchers<R, T>,
      "toBeCalledWithContext" | "lastCalledWithContext" | "nthCalledWithContext"
    > {}

  export interface AsymmetricMatchers
    extends Pick<AsymmetricMixNMatchers, "exactly"> {}
}
```

### Vitest

If you're using Vitest, you should use `mix-n-matchers/vitest` instead of the 'all' entry point:

```ts
// global.d.ts
import "mix-n-matchers/vitest";
```

If you want finer control over which matchers are added, you should follow the below:

```ts
// global.d.ts
import { expect } from "vitest";
import type { MixNMatchers, AsymmetricMixNMatchers } from "mix-n-matchers";

declare module "vitest" {
  interface Assertion<T>
    extends Pick<
      mixNMatchers.MixNMatchers<void, T>,
      "toBeCalledWithContext" | "lastCalledWithContext" | "nthCalledWithContext"
    > {}
  interface AsymmetricMatchersContaining
    extends Pick<mixNMatchers.AsymmetricMixNMatchers, "exactly"> {}
}
```

## Matchers

### Asymmetric Matchers

<table>
<tr>
<th>Name</th><th>Description</th><th>Example</th>
</tr>
<tr>
<td>

`exactly`

</td>
<td>

Uses `Object.is` to ensure referential equality in situations where deep equality would typically be used.

</td>
<td>

```ts
expect(mock).toBeCalledWith(expect.exactly(reference));
```

</td>
</tr>
<tr>
<td>

`typeOf`

</td>
<td>

Checks equality using `typeof`.

</td>
<td>

```ts
expect(mock).toBeCalledWith(expect.typeOf("string"));
```

</td>
</tr>
<tr>
<tr>
<td>

`oneOf`

</td>
<td>

Checks that the value matches one of the specified values, using deep equality.

</td>
<td>

```ts
expect(mock).toBeCalledWith(expect.oneOf([1, 2, 3]));
```

</td>
</tr>
<tr>
<tr>
<td>

`ofEnum` / `enum`

</td>
<td>

Checks that the value is a member of the specified enum.

Exported as `ofEnum` and aliased as `enum` in auto-setup files. (See [Tips](#aliasing-expectofenum-to-expectenum))

</td>
<td>

```ts
expect(mock).toBeCalledWith(expect.ofEnum(MyEnum));
expect(mock).toBeCalledWith(expect.enum(MyEnum));
```

</td>
</tr>
<tr>
<td>

`arrayContainingOnly`

</td>
<td>

Checks that value is an array only containing the specified values. Values can be repeated (or omitted), but all elements present should be present in the expected array.

Put another way, it checks that the received array is a subset of (or equal to) the expected array. This is in contrast to `arrayContaining`, which checks that the received array is a superset of (or equal to) the expected array.

</td>
<td>

```ts
// will pass
expect({ array: [1, 2] }).toEqual({
  array: expect.arrayContainingOnly([1, 2, 3]),
});
expect({ array: [1, 2] }).toEqual({
  array: expect.arrayContainingOnly([1, 2]),
});
expect({ array: [1, 1] }).toEqual({
  array: expect.arrayContainingOnly([1, 2, 2]),
});
// will fail
expect({ array: [1, 2, 3] }).toEqual({
  array: expect.arrayContainingOnly([1, 2]),
});
```

</td>
</tr>
<tr>
<td>

`objectContainingOnly`

</td>
<td>

Checks that value is an object only containing the specified keys. Keys can be omitted, but all keys present should match the expected object.

Put another way, it checks that the received object is a subset of (or equal to) the expected object. This is in contrast to `objectContaining`, which checks that the received object is a superset of (or equal to) the expected object.

</td>
<td>

```ts
// will pass
expect({ a: 1 }).toEqual(expect.objectContainingOnly({ a: 1, b: 2 }));
expect({ a: 1, b: 2 }).toEqual(expect.objectContainingOnly({ a: 1, b: 2 }));
// will fail
expect({ a: 1, b: 2 }).toEqual(expect.objectContainingOnly({ a: 1 }));
```

</td>
</tr>
<tr>
<td>

`sequence`

</td>
<td>

Matches an iterable that satisfies the specified sequence of predicates.

</td>
<td>

```ts
expect({
  array: [1, 2, 3],
}).toEqual({
  array: expect.sequence(
    (x) => x === 1,
    (x) => x === 2,
    (x) => x === 3,
  ),
});
```

</td>
</tr>
<tr>
<td>

`sequenceOf`

</td>
<td>

Matches an iterable that matches the specified sequence of values, using deep equality.

</td>
<td>

```ts
expect({
  array: [1, 2, 3],
}).toEqual({
  array: expect.sequenceOf(1, 2, 3),
});
```

</td>
</tr>
<tr>
<td>

`strictSequenceOf`

</td>
<td>

Matches an iterable that matches the specified sequence of values, using [strict deep equality](https://jestjs.io/docs/expect#tostrictequalvalue).

</td>
<td>

```ts
expect({
  array: [1, 2, 3],
}).toEqual({
  array: expect.strictSequenceOf(1, 2, 3),
});
```

</td>
</tr>
<tr>
<td>

`containingSequenceSatisfying`

</td>
<td>

Matches an iterable that contains a sequence that satisfies the specified sequence of predicates.

</td>
<td>

```ts
expect({
  array: [1, 2, 3],
}).toEqual({
  array: expect.containingSequenceSatisfying(
    (x) => x === 2,
    (x) => x === 3,
  ),
});
```

</td>
</tr>
<tr>
<td>

`containingSequence`

</td>
<td>

Matches an iterable that contains the specified sequence of values, using reference equality.

</td>
<td>

```ts
expect({
  array: [1, 2, 3],
}).toEqual({
  array: expect.containingSequence(2, 3),
});
```

</td>
</tr>

<tr>
<td>

`containingEqualSequence`

</td>
<td>

Matches an iterable that contains the specified sequence of values, using deep equality.

</td>
<td>

```ts
expect({
  array: [1, 2, 3],
}).toEqual({
  array: expect.containingEqualSequence(2, 3),
});
```

</td>
</tr>
<tr>
<td>

`containingStrictEqualSequence`

</td>
<td>

Matches an iterable that contains the specified sequence of values, using [strict deep equality](https://jestjs.io/docs/expect#tostrictequalvalue).

</td>
<td>

```ts
expect({
  array: [1, 2, 3],
}).toEqual({
  array: expect.containingStrictEqualSequence(2, 3),
});
```

</td>
</tr>
<tr>
<td>

`iterableOf`

</td>
<td>

Matches an iterable where every value matches the expected value, using deep equality.

</td>
<td>

```ts
expect({
  array: [1, 2, 3],
}).toEqual({
  array: expect.iterableOf(expect.any(Number)),
});
```

</td>
</tr>
<tr>
<td>

`strictIterableOf`

</td>
<td>

Matches an iterable where every value matches the expected value, using [strict deep equality](https://jestjs.io/docs/expect#tostrictequalvalue).

</td>
<td>

```ts
expect({
  array: [1, 2, 3],
}).toEqual({
  array: expect.strictIterableOf(expect.any(Number)),
});
```

</td>
</tr>
<tr>
<td>

`recordOf`

</td>
<td>

Matches an object where every value matches the expected value, using deep equality.

Optionally, you can pass two arguments and the first will be matched against keys.

_Note: keys and values are retrieved using `Object.entries`, so only string (non-symbol) enumerable keys are checked._

</td>
<td>

```ts
expect({
  object: { a: 1, b: 2 },
}).toEqual({
  object: expect.recordOf(expect.any(Number)),
});

expect({
  object: { a: 1, b: 2 },
}).toEqual({
  object: expect.recordOf(expect.any(String), expect.any(Number)),
});
```

</td>
</tr>
<tr>
<td>

`strictRecordOf`

</td>
<td>

Matches an object where every value matches the expected value, using [strict deep equality](https://jestjs.io/docs/expect#tostrictequalvalue).

Optionally, you can pass two arguments and the first will be matched against keys.

_Note: keys and values are retrieved using `Object.entries`, so only string (non-symbol) enumerable keys are checked._

</td>
<td>

```ts
expect({
  object: { a: 1, b: 2 },
}).toEqual({
  object: expect.strictRecordOf(expect.any(Number)),
});

expect({
  object: { a: 1, b: 2 },
}).toEqual({
  object: expect.strictRecordOf(expect.any(String), expect.any(Number)),
});
```

</td>
</tr>
</table>

### Symmetric Matchers

<table>
<tr>
<th>Name</th><th>Description</th><th>Example</th>
</tr>
<tr>
<td>

`toBeEnum`

</td>
<td>

Assert a value is a member of the specified enum.

</td>
<td>

```ts
expect(getDirection()).toBeEnum(Direction);
```

</td>
</tr>
<tr>
<td>

`toSatisfySequence`

</td>
<td>

Assert a value is an iterable that satisfies the specified sequence of predicates.

</td>
<td>

```ts
expect([1, 2, 3]).toSatisfySequence(
  (x) => x === 1,
  (x) => x === 2,
  (x) => x === 3,
);
```

</td>
</tr>
<tr>
<td>

`toEqualSequence`

</td>
<td>

Assert a value is an iterable that matches the specified sequence of values, using deep equality.

</td>
<td>

```ts
expect([1, 2, 3]).toEqualSequence(1, 2, 3);
```

</td>
</tr>

<tr>
<td>

`toStrictEqualSequence`

</td>
<td>

Assert a value is an iterable that matches the specified sequence of values, using [strict deep equality](https://jestjs.io/docs/expect#tostrictequalvalue).

</td>
<td>

```ts
expect([1, 2, 3]).toStrictEqualSequence(1, 2, 3);
```

</td>
</tr>
<tr>
<td>

`toContainSequenceSatisfying`

</td>
<td>

Assert an iterable contains a sequence satisfying a sequence of predicates.

</td>
<td>

```ts
expect([1, 2, 3]).toContainSequenceSatisfying(
  (x) => x === 2,
  (x) => x === 3,
);
```

</td>
</tr>

<tr>
<td>

`toContainSequence`

</td>
<td>

Assert a value is an iterable that contains the specified sequence of values, using reference equality (===).

</td>
<td>

```ts
expect([1, 2, 3]).toContainSequence(2, 3);
```

</td>
</tr>

<tr>
<td>

`toContainEqualSequence`

</td>
<td>

Assert a value is an iterable that contains the specified sequence of values, using deep equality.

</td>
<td>

```ts
expect([1, 2, 3]).toContainEqualSequence(2, 3);
```

</td>
</tr>

<tr>
<td>

`toContainStrictEqualSequence`

</td>
<td>

Assert a value is an iterable that contains the specified sequence of values, using [strict deep equality](https://jestjs.io/docs/expect#tostrictequalvalue).

</td>
<td>

```ts
expect([1, 2, 3]).toContainStrictEqualSequence(2, 3);
```

</td>
</tr>
<tr>
<td>

`toBeIterableOf`

</td>
<td>

Assert a value is an iterable where every value matches the expected value, using deep equality.

</td>
<td>

```ts
expect([1, 2, 3]).toBeIterableOf(expect.any(Number));
```

</td>
</tr>

<tr>
<td>

`tobeStrictIterableOf`

</td>
<td>

Assert a value is an iterable where every value matches the expected value, using [strict deep equality](https://jestjs.io/docs/expect#tostrictequalvalue).

</td>
<td>

```ts
expect([1, 2, 3]).toBeStrictIterableOf(expect.any(Number));
```

</td>
</tr>
<tr>
<td>

`toBeRecordOf`

</td>
<td>

Assert a value is an object where every value matches the expected value, using deep equality.

Optionally, you can pass two arguments and the first will be matched against keys.

_Note: keys and values are retrieved using `Object.entries`, so only string (non-symbol) enumerable keys are checked._

</td>
<td>

```ts
expect({ a: 1, b: 2 }).toBeRecordOf(expect.any(Number));
expect({ a: 1, b: 2 }).toBeRecordOf(expect.any(String), expect.any(Number));
```

</td>
</tr>

<tr>
<td>

`toBeStrictRecordOf`

</td>
<td>

Assert a value is an object where every value matches the expected value, using [strict deep equality](https://jestjs.io/docs/expect#tostrictequalvalue).

Optionally, you can pass two arguments and the first will be matched against keys.

_Note: keys and values are retrieved using `Object.entries`, so only string (non-symbol) enumerable keys are checked._

</td>
<td>

```ts
expect({ a: 1, b: 2 }).toBeStrictRecordOf(expect.any(Number));
expect({ a: 1, b: 2 }).toBeStrictRecordOf(
  expect.any(String),
  expect.any(Number),
);
```

</td>
</tr>
<tr>
<td>

`toBeCalledWithContext`/`toHaveBeenCalledWithContext`

</td>
<td>

Assert a function has been called with a specific context (`this`).

</td>
<td>

```ts
expect(mock).toBeCalledWithContext(expectedContext);
expect(mock).toHaveBeenCalledWithContext(expectedContext);
```

</td>
</tr>
<tr>
<td>

`lastCalledWithContext`/`toHaveBeenLastCalledWithContext`

</td>
<td>

Assert the last call of a function was with a specific context (`this`).

</td>
<td>

```ts
expect(mock).lastCalledWithContext(expectedContext);
expect(mock).toHaveBeenLastCalledWithContext(expectedContext);
```

</td>
</tr>
<tr>
<td>

`nthCalledWithContext`/`toHaveBeenNthCalledWithContext`

</td>
<td>

Assert the Nth call of a function was with a specific context (`this`).

</td>
<td>

```ts
expect(mock).nthCalledWithContext(1, expectedContext);
expect(mock).toHaveBeenNthCalledWithContext(1, expectedContext);
```

</td>
</tr>
</table>

## Tips

### Aliasing `expect.ofEnum` to `expect.enum`

As `enum` is a reserved word in Javascript, it is not possible to export a matcher with this name. However, you can alias it in your setup file:

```js
import { ofEnum } from "mix-n-matchers";

expect.extend({ enum: ofEnum });
```

To add this to your `global.d.ts`:

```ts
// global.d.ts
import type { AsymmetricMixNMatchers } from "mix-n-matchers";

declare global {
  namespace jest {
    export interface Expect {
      enum: AsymmetricMixNMatchers["ofEnum"];
    }

    interface InverseAsymmetricMatchers {
      enum: AsymmetricMixNMatchers["ofEnum"];
    }
  }
}
```

This approach can be adapted for Jest globals and Vitest as well.

After this setup, you should be able to use `expect.enum` as a matcher.

```ts
expect(mock).toBeCalledWith(expect.enum(MyEnum));
```

This is automatically done for you with the auto-setup files (`mix-n-matchers/all`, `mix-n-matchers/jest-globals`, `mix-n-matchers/vitest`).

### Asymmetric Matchers vs Symmetric Matchers

When `expect.extend` is called, each matcher is added as both an asymmetric and symmetric matcher.

```ts
expect.extend({
  foo(received) {
    const pass = received === "foo";
    return {
      pass,
      message: pass ? () => "Expected 'foo'" : () => "Expected not 'foo'",
    };
  },
});

expect(value).foo(); // symmetric

expect(value).toEqual(expect.foo()); // asymmetric
```

However, conventionally there is a difference in how these matchers are named. For example, `expect().toBeAnArray` vs `expect.array`.

`mix-n-matchers` intentionally only exposes types for matchers as _either_ asymmetric or symmetric, and not both. Sometimes a matcher is available as both, but with different names. For example, `expect().toBeEnum` and `expect.ofEnum`.

This helps to avoid confusion and makes it clear which matchers are designed to be asymmetric and which are symmetric.

If there's any existing matchers that are only available as asymmetric matchers and you'd like to use them as symmetric matchers (or vice versa), please open an issue or a pull request!

You can of course choose to expose these types yourself to enable both symmetric and asymmetric usage of a matcher.

```ts
declare module "mix-n-matchers" {
  interface MixNMatchers<R, T> extends Pick<AsymmetricMixNMatchers, "typeOf"> {}
  interface AsymmetricMixNMatchers
    extends Pick<MixNMatchers, "toBeCalledWithContext"> {}
}

// now allowed
expect(value).typeOf("string");
expect(value).toEqual({ fn: expect.toBeCalledWithContext(context) });
```
