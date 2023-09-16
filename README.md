# misc-matchers

Miscellaneous custom Jest matchers

## Installation

Install via `npm` or `yarn`:

```
npm install -D misc-matchers
```

```
yarn add -D misc-matchers
```

## Setup

Create a setup script with the following:

```js
// add all matchers
import * as miscMatchers from "misc-matchers";
expect.extend(miscMatchers);

// or just add specific matchers
import { toBeCalledWithContext } from "misc-matchers";
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
import type { MiscMatchers } from "misc-matchers";

declare global {
  namespace jest {
    // if all matchers
    export interface Matchers<R> extends MiscMatchers<R> {}

    // if some matchers
    export interface Matchers<R>
      extends Pick<MiscMatchers<R>, "toBeCalledWithContext"> {}
  }
}
```

If only some matchers are added, you can avoid duplication by exporting an object from your setup file.

```js
// setup file
import { toBeCalledWithContext } from "misc-matchers";

export const miscMatchers = { toBeCalledWithContext };

expect.extend(miscMatchers);
```

```ts
// global.d.ts
import type { miscMatchers } from "../testSetup.js";
import type { MiscMatchers } from "misc-matchers";

declare global {
  namespace jest {
    export interface Matchers<R>
      extends Pick<MiscMatchers<R>, keyof typeof miscMatchers> {}
  }
}
```
