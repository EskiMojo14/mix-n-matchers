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

## Typescript

To ensure the correct types are included, add a `global.d.ts` file to your project with:

```ts
import type { MixNMatchers, AsymmetricMixNMatchers } from "mix-n-matchers";

declare global {
  namespace jest {
    // if all matchers
    export interface Matchers<R> extends MixNMatchers<R> {}

    export interface Expect extends AsymmetricMixNMatchers {}

    export interface InverseAsymmetricMatchers extends AsymmetricMixNMatchers {}

    // if some matchers
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

If only some matchers are added, you can avoid duplication by exporting objects from your setup file.

```js
// setup file
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
