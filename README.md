# mix-n-matchers

![logo](./website/static/img/logo.png)

Miscellaneous custom Jest matchers.

```ts
expect(mock).toHaveBeenCalledWithContext(expect.exactly(service));

expect(iterable).toContainSequence(1, 2, 3);

expect(getDirection()).toBeEnum(Direction);

expect(post).toEqual({
  id: expect.typeOf("string"),
  status: expect.oneOf(["pinned", "archived", undefined]),
});
```

See [website](https://eskimojo14.github.io/mix-n-matchers/) for more information.
