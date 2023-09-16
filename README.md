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
import { toBeCalledWithContext } from "mix-n-matchers";
expect.extend({ toBeCalledWithContext });
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
import type { MixNMatchers } from "mix-n-matchers";

declare global {
  namespace jest {
    // if all matchers
    export interface Matchers<R> extends MixNMatchers<R> {}

    // if some matchers
    export interface Matchers<R>
      extends Pick<MixNMatchers<R>, "toBeCalledWithContext"> {}
  }
}
```

If only some matchers are added, you can avoid duplication by exporting an object from your setup file.

```js
// setup file
import { toBeCalledWithContext } from "mix-n-matchers";

export const mixNMatchers = { toBeCalledWithContext };

expect.extend(mixNMatchers);
```

```ts
// global.d.ts
import type { mixNMatchers } from "../testSetup.js";
import type { MixNMatchers } from "mix-n-matchers";

declare global {
  namespace jest {
    export interface Matchers<R>
      extends Pick<MixNMatchers<R>, keyof typeof mixNMatchers> {}
  }
}
```
