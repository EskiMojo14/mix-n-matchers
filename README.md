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
    export interface Matchers<R>
      extends Pick<
        MixNMatchers<R>,
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
    export interface Matchers<R>
      extends Pick<MixNMatchers<R>, keyof typeof mixNMatchers> {}

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

If you want finer control over which matchers are added, you should use the below:

```ts
// global.d.ts
import type { MixNMatchers, AsymmetricMixNMatchers } from "mix-n-matchers";

declare module "@jest/extend" {
  export interface Matchers<R>
    extends Pick<
      MixNMatchers<R>,
      "toBeCalledWithContext" | "lastCalledWithContext" | "nthCalledWithContext"
    > {}

  export interface AsymmetricMatchers
    extends Pick<AsymmetricMixNMatchers, "exactly"> {}
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
</table>

### Symmetric Matchers

<table>
<tr>
<th>Name</th><th>Description</th><th>Example</th>
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
