// @ts-check

/** @type {import("eslint").Rule.RuleModule} */
const noInstanceofPromise = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow instanceof Promise",
    },
    schema: [],
    messages: {
      noInstanceofPromise:
        "`instanceof Promise` is fragile, and does not account for custom thenables or Promise patching. Prefer `isThenable`, which duck types.",
    },
  },
  create(context) {
    return {
      BinaryExpression(node) {
        const isPromiseIdentifier =
          node.right.type === "Identifier" && node.right.name === "Promise";
        const isGlobalThisPromise =
          node.right.type === "MemberExpression" &&
          !node.right.computed &&
          node.right.object.type === "Identifier" &&
          node.right.object.name === "globalThis" &&
          node.right.property.type === "Identifier" &&
          node.right.property.name === "Promise";

        if (node.operator === "instanceof" && (isPromiseIdentifier || isGlobalThisPromise)) {
          context.report({
            messageId: "noInstanceofPromise",
            node,
          });
        }
      },
    };
  },
};

export default noInstanceofPromise;
