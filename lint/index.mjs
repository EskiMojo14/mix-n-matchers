// @ts-check

import noInstanceofPromise from "./no-instanceof-promise.mjs";

/** @type {import("eslint").ESLint.Plugin} */
export default {
  meta: {
    name: "mix-n-matchers",
  },
  rules: {
    "no-instanceof-promise": noInstanceofPromise,
  },
};
