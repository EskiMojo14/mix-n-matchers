import { describe, expect, it, fn } from "@globals";
import { waitFor, waitUntil } from "./poll";

describe("waitFor", () => {
  it("resolves immediately when the callback succeeds", async () => {
    const callback = fn().mockResolvedValue("done");

    await expect(waitFor(callback, { interval: 5, timeout: 50 })).resolves.toBe("done");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("retries until the callback succeeds", async () => {
    const callback = fn()
      .mockRejectedValueOnce(new Error("first attempt fails"))
      .mockRejectedValueOnce(new Error("second attempt fails"))
      .mockResolvedValue("done");

    await expect(waitFor(callback, { interval: 5, timeout: 100 })).resolves.toBe("done");
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("throws the last error once the timeout is reached", async () => {
    const error = new Error("always fails");
    const callback = fn().mockRejectedValue(error);

    await expect(waitFor(callback, { interval: 5, timeout: 25 })).rejects.toThrow(error);
    expect(callback).toHaveBeenCalled();
  });
});

describe("waitUntil", () => {
  it("resolves once the predicate becomes truthy", async () => {
    let attempts = 0;
    const callback = fn(() => {
      attempts += 1;
      return attempts >= 3 ? "ready" : 0;
    });

    await expect(waitUntil(callback, { interval: 5, timeout: 100 })).resolves.toBe("ready");
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("fails immediately when the callback throws an error", async () => {
    const error = new Error("callback exploded");
    const callback = fn().mockRejectedValue(error);

    await expect(waitUntil(callback, { interval: 5, timeout: 100 })).rejects.toThrow(error);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("throws when the value never becomes truthy before the timeout", async () => {
    const callback = fn(() => 0);

    await expect(waitUntil(callback, { interval: 5, timeout: 25 })).rejects.toThrow(
      "Condition not met",
    );
    expect(callback).toHaveBeenCalled();
  });
});
