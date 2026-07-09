import { it, expect, describe } from "@globals";

function withoutGlobalResponse(): Disposable {
  const originalResponse = globalThis.Response;
  // @ts-expect-error: Temporarily remove Response from the global scope for testing
  delete globalThis.Response;
  return {
    [Symbol.dispose]() {
      globalThis.Response = originalResponse;
    },
  };
}

function withoutGlobalRequest(): Disposable {
  const originalRequest = globalThis.Request;
  // @ts-expect-error: Temporarily remove Request from the global scope for testing
  delete globalThis.Request;
  return {
    [Symbol.dispose]() {
      globalThis.Request = originalRequest;
    },
  };
}

describe("toBeOK", () => {
  it("passes when the response is ok", () => {
    const response = new Response(null, { status: 200 });
    expect(response).toBeOK();
    expect(() => {
      expect(response).not.toBeOK();
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when the response is not ok", () => {
    const response = new Response(null, { status: 404 });
    expect(() => {
      expect(response).toBeOK();
    }).toThrowErrorMatchingSnapshot();
    expect(response).not.toBeOK();
  });

  it("fails when the received value is not a Response", () => {
    expect(() => {
      expect({}).toBeOK();
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when Response is not defined in the global scope", () => {
    using _ = withoutGlobalResponse();

    expect(() => {
      expect({}).toBeOK();
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("toHaveStatus", () => {
  it("passes when the response has the expected status", () => {
    const response = new Response(null, { status: 200 });
    expect(response).toHaveStatus(200);
    expect(() => {
      expect(response).not.toHaveStatus(200);
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when the response does not have the expected status", () => {
    const response = new Response(null, { status: 404 });
    expect(() => {
      expect(response).toHaveStatus(200);
    }).toThrowErrorMatchingSnapshot();
    expect(response).not.toHaveStatus(200);
  });

  it("fails when the received value is not a Response", () => {
    expect(() => {
      expect({}).toHaveStatus(200);
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when Response is not defined in the global scope", () => {
    using _ = withoutGlobalResponse();

    expect(() => {
      expect({}).toHaveStatus(200);
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when the expected status is not a number", () => {
    const response = new Response(null, { status: 200 });
    expect(() => {
      // @ts-expect-error
      expect(response).toHaveStatus("200");
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("toHaveHeader", () => {
  describe("when expected value is provided", () => {
    it("passes when the response/request has the expected header and value", () => {
      const response = new Response(null, {
        headers: { "Content-Type": "application/json" },
      });
      expect(response).toHaveHeader("Content-Type", "application/json");
      expect(() => {
        expect(response).not.toHaveHeader("Content-Type", "application/json");
      }).toThrowErrorMatchingSnapshot("response");

      const request = new Request("https://example.com", {
        headers: { "Content-Type": "application/json" },
      });
      expect(request).toHaveHeader("Content-Type", "application/json");
      expect(() => {
        expect(request).not.toHaveHeader("Content-Type", "application/json");
      }).toThrowErrorMatchingSnapshot("request");
    });

    it("fails when the response/request does not have the expected header and value", () => {
      const response = new Response(null, {
        headers: { "Content-Type": "text/html" },
      });
      expect(() => {
        expect(response).toHaveHeader("Content-Type", "application/json");
      }).toThrowErrorMatchingSnapshot("response");
      expect(response).not.toHaveHeader("Content-Type", "application/json");

      const request = new Request("https://example.com", {
        headers: { "Content-Type": "text/html" },
      });
      expect(() => {
        expect(request).toHaveHeader("Content-Type", "application/json");
      }).toThrowErrorMatchingSnapshot("request");
      expect(request).not.toHaveHeader("Content-Type", "application/json");
    });
  });

  describe("when expected value is not provided", () => {
    it("passes when the response/request has the expected header", () => {
      const response = new Response(null, {
        headers: { "Content-Type": "application/json" },
      });
      expect(response).toHaveHeader("Content-Type");
      expect(() => {
        expect(response).not.toHaveHeader("Content-Type");
      }).toThrowErrorMatchingSnapshot("response");

      const request = new Request("https://example.com", {
        headers: { "Content-Type": "application/json" },
      });
      expect(request).toHaveHeader("Content-Type");
      expect(() => {
        expect(request).not.toHaveHeader("Content-Type");
      }).toThrowErrorMatchingSnapshot("request");
    });

    it("fails when the response/request does not have the expected header", () => {
      const response = new Response(null, {
        headers: { "Content-Type": "text/html" },
      });
      expect(() => {
        expect(response).toHaveHeader("Authorization");
      }).toThrowErrorMatchingSnapshot("response");
      expect(response).not.toHaveHeader("Authorization");

      const request = new Request("https://example.com", {
        headers: { "Content-Type": "text/html" },
      });
      expect(() => {
        expect(request).toHaveHeader("Authorization");
      }).toThrowErrorMatchingSnapshot("request");
    });
  });

  it("fails when the received value is not a Response or Request", () => {
    expect(() => {
      expect({}).toHaveHeader("Content-Type", "application/json");
    }).toThrowErrorMatchingSnapshot();
  });

  describe.each(["Response", "Request"])("when %s is not defined in the global scope", (type) => {
    it("fails", () => {
      using _ = type === "Response" ? withoutGlobalResponse() : withoutGlobalRequest();
      expect(() => {
        expect({}).toHaveHeader("Content-Type", "application/json");
      }).toThrowErrorMatchingSnapshot(type.toLowerCase());
    });
  });

  it("fails when the header name is not a string", () => {
    const response = new Response(null, {
      headers: { "Content-Type": "application/json" },
    });
    expect(() => {
      // @ts-expect-error
      expect(response).toHaveHeader(123, "application/json");
    }).toThrowErrorMatchingSnapshot("response");

    const request = new Request("https://example.com", {
      headers: { "Content-Type": "application/json" },
    });
    expect(() => {
      // @ts-expect-error
      expect(request).toHaveHeader(123, "application/json");
    }).toThrowErrorMatchingSnapshot("request");
  });

  it("fails when the expected value is not a string or undefined", () => {
    const response = new Response(null, {
      headers: { "Content-Type": "application/json" },
    });
    expect(() => {
      // @ts-expect-error
      expect(response).toHaveHeader("Content-Type", 123);
    }).toThrowErrorMatchingSnapshot("response");

    const request = new Request("https://example.com", {
      headers: { "Content-Type": "application/json" },
    });
    expect(() => {
      // @ts-expect-error
      expect(request).toHaveHeader("Content-Type", 123);
    }).toThrowErrorMatchingSnapshot("request");
  });
});

describe("toHaveMethod", () => {
  it("passes when the request has the expected method", () => {
    const request = new Request("https://example.com", { method: "POST" });
    expect(request).toHaveMethod("POST");
    expect(() => {
      expect(request).not.toHaveMethod("POST");
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when the request does not have the expected method", () => {
    const request = new Request("https://example.com", { method: "GET" });
    expect(() => {
      expect(request).toHaveMethod("POST");
    }).toThrowErrorMatchingSnapshot();
    expect(request).not.toHaveMethod("POST");
  });

  it("fails when the received value is not a Request", () => {
    expect(() => {
      expect({}).toHaveMethod("POST");
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when Request is not defined in the global scope", () => {
    using _ = withoutGlobalRequest();

    expect(() => {
      expect({}).toHaveMethod("POST");
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("toHaveURL", () => {
  it("passes when the request has the expected URL", () => {
    const request = new Request("https://example.com/api");
    expect(request).toHaveURL("https://example.com/api");
    expect(() => {
      expect(request).not.toHaveURL("https://example.com/api");
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when the request does not have the expected URL", () => {
    const request = new Request("https://example.com/other");
    expect(() => {
      expect(request).toHaveURL("https://example.com/api");
    }).toThrowErrorMatchingSnapshot();
    expect(request).not.toHaveURL("https://example.com/api");
  });

  it("fails when the received value is not a Request", () => {
    expect(() => {
      expect({}).toHaveURL("https://example.com/api");
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when Request is not defined in the global scope", () => {
    using _ = withoutGlobalRequest();

    expect(() => {
      expect({}).toHaveURL("https://example.com/api");
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("toHaveBodyText", () => {
  it("passes when the response/request has the expected body text", async () => {
    const response = new Response("Hello, world!");
    await expect(response).toHaveBodyText("Hello, world!");
    await expect(async () => {
      await expect(response).not.toHaveBodyText("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot("response");

    const request = new Request("https://example.com", {
      body: "Hello, world!",
      method: "POST",
    });
    await expect(request).toHaveBodyText("Hello, world!");
    await expect(async () => {
      await expect(request).not.toHaveBodyText("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot("request");
  });

  it("fails when the response/request does not have the expected body text", async () => {
    const response = new Response("Goodbye, world!");
    await expect(async () => {
      await expect(response).toHaveBodyText("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot("response");
    await expect(response).not.toHaveBodyText("Hello, world!");

    const request = new Request("https://example.com", {
      body: "Goodbye, world!",
      method: "POST",
    });
    await expect(async () => {
      await expect(request).toHaveBodyText("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot("request");
    await expect(request).not.toHaveBodyText("Hello, world!");
  });

  it("fails when the received value is not a Response or Request", async () => {
    await expect(async () => {
      await expect({}).toHaveBodyText("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  describe.each(["Response", "Request"])("when %s is not defined in the global scope", (type) => {
    it("fails", async () => {
      using _ = type === "Response" ? withoutGlobalResponse() : withoutGlobalRequest();
      await expect(async () => {
        await expect({}).toHaveBodyText("Hello, world!");
      }).rejects.toThrowErrorMatchingSnapshot(type.toLowerCase());
    });
  });

  it("fails when the body has already been used", async () => {
    const response = new Response("Hello, world!");
    await response.text(); // Consume the body
    await expect(async () => {
      await expect(response).toHaveBodyText("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot("response");

    const request = new Request("https://example.com", {
      body: "Hello, world!",
      method: "POST",
    });
    await request.text(); // Consume the body
    await expect(async () => {
      await expect(request).toHaveBodyText("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot("request");
  });

  it("clones to avoid consuming the body, so it can be read again later", async () => {
    const response = new Response("Hello, world!");
    await expect(response).toHaveBodyText("Hello, world!");
    await expect(response.text()).resolves.toBe("Hello, world!"); // Body can still be read

    const request = new Request("https://example.com", {
      body: "Hello, world!",
      method: "POST",
    });
    await expect(request).toHaveBodyText("Hello, world!");
    await expect(request.text()).resolves.toBe("Hello, world!"); // Body can still be read
  });
});

function jsonRequest(body: any): Request {
  return new Request("https://example.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe.each(["toHaveBodyJSON", "toHaveBodyJSONStrict"] as const)("%s", (matcherName) => {
  it("passes when the response/request has the expected JSON body", async () => {
    const response = Response.json({ message: "Hello, world!" });
    await expect(response)[matcherName]({ message: "Hello, world!" });
    await expect(async () => {
      await expect(response).not[matcherName]({ message: "Hello, world!" });
    }).rejects.toThrowErrorMatchingSnapshot("response");

    const request = jsonRequest({ message: "Hello, world!" });
    await expect(request)[matcherName]({ message: "Hello, world!" });
    await expect(async () => {
      await expect(request).not[matcherName]({ message: "Hello, world!" });
    }).rejects.toThrowErrorMatchingSnapshot("request");
  });

  it("fails when the response/request does not have the expected JSON body", async () => {
    const response = Response.json({ message: "Goodbye, world!" });
    await expect(async () => {
      await expect(response)[matcherName]({ message: "Hello, world!" });
    }).rejects.toThrowErrorMatchingSnapshot("response");
    await expect(response).not[matcherName]({ message: "Hello, world!" });

    const request = jsonRequest({ message: "Goodbye, world!" });
    await expect(async () => {
      await expect(request)[matcherName]({ message: "Hello, world!" });
    }).rejects.toThrowErrorMatchingSnapshot("request");
    await expect(request).not[matcherName]({ message: "Hello, world!" });
  });

  it("fails when the received value is not a Response or Request", async () => {
    await expect(async () => {
      await expect({})[matcherName]({ message: "Hello, world!" });
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  describe.each(["Response", "Request"])("when %s is not defined in the global scope", (type) => {
    it("fails", async () => {
      using _ = type === "Response" ? withoutGlobalResponse() : withoutGlobalRequest();
      await expect(async () => {
        await expect({})[matcherName]({ message: "Hello, world!" });
      }).rejects.toThrowErrorMatchingSnapshot(type.toLowerCase());
    });
  });

  it("fails when the body has already been used", async () => {
    const response = Response.json({ message: "Hello, world!" });
    await response.json(); // Consume the body
    await expect(async () => {
      await expect(response)[matcherName]({ message: "Hello, world!" });
    }).rejects.toThrowErrorMatchingSnapshot("response");

    const request = jsonRequest({ message: "Hello, world!" });
    await request.json(); // Consume the body
    await expect(async () => {
      await expect(request)[matcherName]({ message: "Hello, world!" });
    }).rejects.toThrowErrorMatchingSnapshot("request");
  });

  it("clones to avoid consuming the body, so it can be read again later", async () => {
    const response = Response.json({ message: "Hello, world!" });
    await expect(response)[matcherName]({ message: "Hello, world!" });
    await expect(response.json()).resolves.toEqual({
      message: "Hello, world!",
    }); // Body can still be read

    const request = jsonRequest({ message: "Hello, world!" });
    await expect(request)[matcherName]({ message: "Hello, world!" });
    await expect(request.json()).resolves.toEqual({
      message: "Hello, world!",
    }); // Body can still be read
  });
});
