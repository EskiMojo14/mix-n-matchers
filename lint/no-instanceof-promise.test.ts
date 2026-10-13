import { describe, it } from "@globals";
import { RuleTester } from "vite-plus/lint/plugins-dev";

import rule from "./no-instanceof-promise.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      lang: "ts",
    },
  },
});

// @ts-expect-error Oxlint's RuleTester context is narrower than ESLint's RuleModule type.
ruleTester.run("no-instanceof-promise", rule, {
  valid: ["value instanceof Error", 'value instanceof globalThis["Promise"]'],
  invalid: [
    {
      code: "value instanceof Promise",
      errors: [{ messageId: "noInstanceofPromise" }],
    },
    {
      code: "value instanceof globalThis.Promise",
      errors: [{ messageId: "noInstanceofPromise" }],
    },
  ],
});
