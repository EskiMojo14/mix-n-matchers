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
  interface Assertion<T = any>
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

Checks that the value is an iterable that satisfies the specified sequence of predicates.

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
