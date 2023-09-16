/**
 * Given a label, return a function which given a string,
 * right-aligns it preceding the colon in the label.
 */
export const getRightAlignedPrinter = (label: string) => {
  // Assume that the label contains a colon.
  const index = label.indexOf(":");
  const suffix = label.slice(index);

  return (string: string, isExpectedCall: boolean) =>
    (isExpectedCall
      ? `->${" ".repeat(Math.max(0, index - 2 - string.length))}`
      : " ".repeat(Math.max(index - string.length))) +
    string +
    suffix;
};
