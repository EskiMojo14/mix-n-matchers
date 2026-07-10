import { it, expect, describe } from "@globals";
import type { StatusGroup } from "./fetch";

function withoutGlobal(global: keyof typeof globalThis): Disposable {
  const original = globalThis[global];
  delete globalThis[global];
  return {
    [Symbol.dispose]() {
      // @ts-expect-error: Restore the original global value
      globalThis[global] = original;
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
    using _ = withoutGlobal("Response");

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
    using _ = withoutGlobal("Response");

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

  describe("with asymmetric matchers", () => {
    it("passes when the status matches", () => {
      const response = new Response(null, { status: 200 });
      expect(response).toHaveStatus(expect.oneOf([200, 201]));
      expect(() => {
        expect(response).not.toHaveStatus(expect.oneOf([200, 201]));
      }).toThrowErrorMatchingSnapshot();
    });

    it("fails when the status does not match", () => {
      const response = new Response(null, { status: 404 });
      expect(() => {
        expect(response).toHaveStatus(expect.oneOf([200, 201]));
      }).toThrowErrorMatchingSnapshot();
      expect(response).not.toHaveStatus(expect.oneOf([200, 201]));
    });
  });
});

describe("toHaveStatusGroup", () => {
  describe.each([
    ["num", 2],
    ["short", "2xx"],
    ["long", "successful"],
  ] as const)("%s", (_, expected) => {
    it("passes when the response has the expected status group", () => {
      const response = new Response(null, { status: 200 });
      expect(response).toHaveStatusGroup(expected);
      expect(() => {
        expect(response).not.toHaveStatusGroup(expected);
      }).toThrowErrorMatchingSnapshot();
    });

    it("fails when the response does not have the expected status group", () => {
      const response = new Response(null, { status: 404 });
      expect(() => {
        expect(response).toHaveStatusGroup(expected);
      }).toThrowErrorMatchingSnapshot();
      expect(response).not.toHaveStatusGroup(expected);
    });
  });

  it("fails when the received value is not a Response", () => {
    expect(() => {
      expect({}).toHaveStatusGroup(2);
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when Response is not defined in the global scope", () => {
    using _ = withoutGlobal("Response");

    expect(() => {
      expect({}).toHaveStatusGroup(2);
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when the expected status group is not valid", () => {
    const response = new Response(null, { status: 200 });
    expect(() => {
      // @ts-expect-error
      expect(response).toHaveStatusGroup("invalid");
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when the status is non-standard and does not match any group", () => {
    const response = Object.defineProperty(new Response(), "status", { value: 600 });
    expect(() => {
      expect(response).toHaveStatusGroup(2);
    }).toThrowErrorMatchingSnapshot();
    expect(response).not.toHaveStatusGroup(2);
  });

  describe("with asymmetric matchers", () => {
    describe.each([
      ["num", [2, 3]],
      ["short", ["2xx", "3xx"]],
      ["long", ["successful", "redirection"]],
    ] as const)("%s", (_, values) => {
      it("passes when the group matches", () => {
        const response = new Response(null, { status: 200 });
        expect(response).toHaveStatusGroup(expect.oneOf<StatusGroup>(values));
        expect(() => {
          expect(response).not.toHaveStatusGroup(expect.oneOf<StatusGroup>(values));
        }).toThrowErrorMatchingSnapshot();
      });
      it("fails when the group does not match", () => {
        const response = new Response(null, { status: 404 });
        expect(() => {
          expect(response).toHaveStatusGroup(expect.oneOf<StatusGroup>(values));
        }).toThrowErrorMatchingSnapshot();
        expect(response).not.toHaveStatusGroup(expect.oneOf<StatusGroup>(values));
      });
    });

    it("fails when the status is non-standard", () => {
      const response = Object.defineProperty(new Response(), "status", { value: 600 });
      expect(() => {
        expect(response).toHaveStatusGroup(expect.oneOf([2, 3]));
      }).toThrowErrorMatchingSnapshot();
      expect(response).not.toHaveStatusGroup(expect.oneOf([2, 3]));
    });
  });
});

describe("toHaveHeader", () => {
  describe("when expected value is provided", () => {
    it("passes when the response/request has the expected header and value", () => {
      const headers = new Headers({ "Content-Type": "application/json" });
      expect(headers).toHaveHeader("Content-Type", "application/json");
      expect(() => {
        expect(headers).not.toHaveHeader("Content-Type", "application/json");
      }).toThrowErrorMatchingSnapshot("headers");

      const response = new Response(null, { headers });
      expect(response).toHaveHeader("Content-Type", "application/json");
      expect(() => {
        expect(response).not.toHaveHeader("Content-Type", "application/json");
      }).toThrowErrorMatchingSnapshot("response");

      const request = new Request("https://example.com", { headers });
      expect(request).toHaveHeader("Content-Type", "application/json");
      expect(() => {
        expect(request).not.toHaveHeader("Content-Type", "application/json");
      }).toThrowErrorMatchingSnapshot("request");
    });

    it("fails when the response/request does not have the expected header and value", () => {
      const headers = new Headers({ "Content-Type": "text/html" });
      expect(() => {
        expect(headers).toHaveHeader("Content-Type", "application/json");
      }).toThrowErrorMatchingSnapshot("headers");
      expect(headers).not.toHaveHeader("Content-Type", "application/json");

      const response = new Response(null, { headers });
      expect(() => {
        expect(response).toHaveHeader("Content-Type", "application/json");
      }).toThrowErrorMatchingSnapshot("response");
      expect(response).not.toHaveHeader("Content-Type", "application/json");

      const request = new Request("https://example.com", { headers });
      expect(() => {
        expect(request).toHaveHeader("Content-Type", "application/json");
      }).toThrowErrorMatchingSnapshot("request");
      expect(request).not.toHaveHeader("Content-Type", "application/json");
    });
  });

  describe("when expected value is not provided", () => {
    it("passes when the response/request has the expected header", () => {
      const headers = new Headers({ "Content-Type": "application/json" });
      expect(headers).toHaveHeader("Content-Type");
      expect(() => {
        expect(headers).not.toHaveHeader("Content-Type");
      }).toThrowErrorMatchingSnapshot("headers");

      const response = new Response(null, { headers });
      expect(response).toHaveHeader("Content-Type");
      expect(() => {
        expect(response).not.toHaveHeader("Content-Type");
      }).toThrowErrorMatchingSnapshot("response");

      const request = new Request("https://example.com", { headers });
      expect(request).toHaveHeader("Content-Type");
      expect(() => {
        expect(request).not.toHaveHeader("Content-Type");
      }).toThrowErrorMatchingSnapshot("request");
    });

    it("fails when the response/request does not have the expected header", () => {
      const headers = new Headers({ "Content-Type": "text/html" });
      expect(() => {
        expect(headers).toHaveHeader("Authorization");
      }).toThrowErrorMatchingSnapshot("headers");
      expect(headers).not.toHaveHeader("Authorization");

      const response = new Response(null, { headers });
      expect(() => {
        expect(response).toHaveHeader("Authorization");
      }).toThrowErrorMatchingSnapshot("response");
      expect(response).not.toHaveHeader("Authorization");

      const request = new Request("https://example.com", { headers });
      expect(() => {
        expect(request).toHaveHeader("Authorization");
      }).toThrowErrorMatchingSnapshot("request");
    });
  });

  it("fails when the received value is not a Response, Request, or Headers", () => {
    expect(() => {
      expect({}).toHaveHeader("Content-Type", "application/json");
    }).toThrowErrorMatchingSnapshot();
  });

  describe.each(["Response", "Request", "Headers"] as const)(
    "when %s is not defined in the global scope",
    (type) => {
      it("fails", () => {
        using _ = withoutGlobal(type);
        expect(() => {
          expect({}).toHaveHeader("Content-Type", "application/json");
        }).toThrowErrorMatchingSnapshot(type.toLowerCase());
      });
    },
  );

  it("fails when the header name is not a string", () => {
    const headers = new Headers({ "Content-Type": "application/json" });
    expect(() => {
      // @ts-expect-error
      expect(headers).toHaveHeader(123, "application/json");
    }).toThrowErrorMatchingSnapshot("headers");

    const response = new Response(null, { headers });
    expect(() => {
      // @ts-expect-error
      expect(response).toHaveHeader(123, "application/json");
    }).toThrowErrorMatchingSnapshot("response");

    const request = new Request("https://example.com", { headers });
    expect(() => {
      // @ts-expect-error
      expect(request).toHaveHeader(123, "application/json");
    }).toThrowErrorMatchingSnapshot("request");
  });

  it("fails when the header name is invalid", () => {
    const headers = new Headers();
    expect(() => {
      expect(headers).toHaveHeader("Invalid Header Name");
    }).toThrowErrorMatchingSnapshot("headers");

    const response = new Response(null, { headers });
    expect(() => {
      expect(response).toHaveHeader("Invalid Header Name");
    }).toThrowErrorMatchingSnapshot("response");

    const request = new Request("https://example.com", { headers });
    expect(() => {
      expect(request).toHaveHeader("Invalid Header Name");
    }).toThrowErrorMatchingSnapshot("request");
  });

  it("fails when the expected value is not a string or undefined", () => {
    const headers = new Headers({ "Content-Type": "application/json" });
    expect(() => {
      // @ts-expect-error
      expect(headers).toHaveHeader("Content-Type", 123);
    }).toThrowErrorMatchingSnapshot("headers");

    const response = new Response(null, { headers });
    expect(() => {
      // @ts-expect-error
      expect(response).toHaveHeader("Content-Type", 123);
    }).toThrowErrorMatchingSnapshot("response");

    const request = new Request("https://example.com", { headers });
    expect(() => {
      // @ts-expect-error
      expect(request).toHaveHeader("Content-Type", 123);
    }).toThrowErrorMatchingSnapshot("request");
  });

  describe("with asymmetric matchers", () => {
    it("passes when the header value matches", () => {
      const headers = new Headers({ "Content-Type": "application/json" });
      expect(headers).toHaveHeader("Content-Type", expect.stringContaining("json"));
      expect(() => {
        expect(headers).not.toHaveHeader("Content-Type", expect.stringContaining("json"));
      }).toThrowErrorMatchingSnapshot("headers");

      const response = new Response(null, { headers });
      expect(response).toHaveHeader("Content-Type", expect.stringContaining("json"));
      expect(() => {
        expect(response).not.toHaveHeader("Content-Type", expect.stringContaining("json"));
      }).toThrowErrorMatchingSnapshot("response");

      const request = new Request("https://example.com", { headers });
      expect(request).toHaveHeader("Content-Type", expect.stringContaining("json"));
      expect(() => {
        expect(request).not.toHaveHeader("Content-Type", expect.stringContaining("json"));
      }).toThrowErrorMatchingSnapshot("request");
    });

    it("fails when the header value does not match", () => {
      const headers = new Headers({ "Content-Type": "text/html" });
      expect(() => {
        expect(headers).toHaveHeader("Content-Type", expect.stringContaining("json"));
      }).toThrowErrorMatchingSnapshot("headers");
      expect(headers).not.toHaveHeader("Content-Type", expect.stringContaining("json"));

      const response = new Response(null, { headers });
      expect(() => {
        expect(response).toHaveHeader("Content-Type", expect.stringContaining("json"));
      }).toThrowErrorMatchingSnapshot("response");
      expect(response).not.toHaveHeader("Content-Type", expect.stringContaining("json"));

      const request = new Request("https://example.com", { headers });
      expect(() => {
        expect(request).toHaveHeader("Content-Type", expect.stringContaining("json"));
      }).toThrowErrorMatchingSnapshot("request");
      expect(request).not.toHaveHeader("Content-Type", expect.stringContaining("json"));
    });
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

  it("is case insensitive", () => {
    const request = new Request("https://example.com", { method: "POST" });
    expect(request).toHaveMethod("post");
    expect(() => {
      expect(request).not.toHaveMethod("post");
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when the received value is not a Request", () => {
    expect(() => {
      expect({}).toHaveMethod("POST");
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when Request is not defined in the global scope", () => {
    using _ = withoutGlobal("Request");

    expect(() => {
      expect({}).toHaveMethod("POST");
    }).toThrowErrorMatchingSnapshot();
  });

  describe("with asymmetric matchers", () => {
    it("passes when the method matches", () => {
      const request = new Request("https://example.com", { method: "POST" });
      expect(request).toHaveMethod(expect.oneOf(["GET", "POST"]));
      expect(() => {
        expect(request).not.toHaveMethod(expect.oneOf(["GET", "POST"]));
      }).toThrowErrorMatchingSnapshot();
    });

    it("fails when the method does not match", () => {
      const request = new Request("https://example.com", { method: "DELETE" });
      expect(() => {
        expect(request).toHaveMethod(expect.oneOf(["GET", "POST"]));
      }).toThrowErrorMatchingSnapshot();
      expect(request).not.toHaveMethod(expect.oneOf(["GET", "POST"]));
    });
  });
});

function urlResponse(url: string): Response {
  // url doesn't allow being set directly, so we use defineProperty to mock it for testing purposes
  return Object.defineProperty(new Response(), "url", { value: url });
}

describe("toHaveURL", () => {
  it("passes when the response/request has the expected URL", () => {
    const response = urlResponse("https://example.com/api");
    expect(response).toHaveURL("https://example.com/api");
    expect(() => {
      expect(response).not.toHaveURL("https://example.com/api");
    }).toThrowErrorMatchingSnapshot("response");

    const request = new Request("https://example.com/api");
    expect(request).toHaveURL("https://example.com/api");
    expect(() => {
      expect(request).not.toHaveURL("https://example.com/api");
    }).toThrowErrorMatchingSnapshot("request");
  });

  it("fails when the response/request does not have the expected URL", () => {
    const response = urlResponse("https://example.com/other");
    expect(() => {
      expect(response).toHaveURL("https://example.com/api");
    }).toThrowErrorMatchingSnapshot("response");
    expect(response).not.toHaveURL("https://example.com/api");

    const request = new Request("https://example.com/other");
    expect(() => {
      expect(request).toHaveURL("https://example.com/api");
    }).toThrowErrorMatchingSnapshot("request");
    expect(request).not.toHaveURL("https://example.com/api");
  });

  it("fails when the received value is not a Request or Response", () => {
    expect(() => {
      expect({}).toHaveURL("https://example.com/api");
    }).toThrowErrorMatchingSnapshot();
  });

  describe.each(["Response", "Request"] as const)(
    "when %s is not defined in the global scope",
    (type) => {
      it("fails", () => {
        using _ = withoutGlobal(type);
        expect(() => {
          expect({}).toHaveURL("https://example.com/api");
        }).toThrowErrorMatchingSnapshot(type.toLowerCase());
      });
    },
  );

  it("fails when the expected URL is not a string", () => {
    const response = urlResponse("https://example.com/api");
    expect(() => {
      // @ts-expect-error
      expect(response).toHaveURL(123);
    }).toThrowErrorMatchingSnapshot("response");

    const request = new Request("https://example.com/api");
    expect(() => {
      // @ts-expect-error
      expect(request).toHaveURL(123);
    }).toThrowErrorMatchingSnapshot("request");
  });

  it("fails when the URL is invalid", () => {
    const response = urlResponse("");
    expect(() => {
      expect(response).toHaveURL("https://example.com/api");
    }).toThrowErrorMatchingSnapshot("response");
  });

  describe("with asymmetric matchers", () => {
    it("passes when the URL matches", () => {
      const response = urlResponse("https://example.com/api");
      expect(response).toHaveURL(expect.stringContaining("example.com"));
      expect(() => {
        expect(response).not.toHaveURL(expect.stringContaining("example.com"));
      }).toThrowErrorMatchingSnapshot("response");

      const request = new Request("https://example.com/api");
      expect(request).toHaveURL(expect.stringContaining("example.com"));
      expect(() => {
        expect(request).not.toHaveURL(expect.stringContaining("example.com"));
      }).toThrowErrorMatchingSnapshot("request");
    });

    it("fails when the URL does not match", () => {
      const response = urlResponse("https://other.com/api");
      expect(() => {
        expect(response).toHaveURL(expect.stringContaining("example.com"));
      }).toThrowErrorMatchingSnapshot("response");
      expect(response).not.toHaveURL(expect.stringContaining("example.com"));

      const request = new Request("https://other.com/api");
      expect(() => {
        expect(request).toHaveURL(expect.stringContaining("example.com"));
      }).toThrowErrorMatchingSnapshot("request");
      expect(request).not.toHaveURL(expect.stringContaining("example.com"));
    });
  });
});

function erroredStream(): ReadableStream {
  return new ReadableStream({
    start(controller) {
      controller.error(new Error("Stream error"));
    },
  });
}

function locked<T extends Response | Request>(object: T): T & AsyncDisposable {
  const reader = object.body?.getReader();

  return Object.assign(object, {
    async [Symbol.asyncDispose]() {
      await reader?.cancel();
    },
  });
}

describe("toHaveTextBody", () => {
  it("passes when the response/request has the expected body text", async () => {
    const response = new Response("Hello, world!");
    await expect(response).toHaveTextBody("Hello, world!");
    await expect(async () => {
      await expect(response).not.toHaveTextBody("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot("response");

    const request = new Request("https://example.com", {
      body: "Hello, world!",
      method: "POST",
    });
    await expect(request).toHaveTextBody("Hello, world!");
    await expect(async () => {
      await expect(request).not.toHaveTextBody("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot("request");
  });

  it("fails when the response/request does not have the expected body text", async () => {
    const response = new Response("Goodbye, world!");
    await expect(async () => {
      await expect(response).toHaveTextBody("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot("response");
    await expect(response).not.toHaveTextBody("Hello, world!");

    const request = new Request("https://example.com", {
      body: "Goodbye, world!",
      method: "POST",
    });
    await expect(async () => {
      await expect(request).toHaveTextBody("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot("request");
    await expect(request).not.toHaveTextBody("Hello, world!");
  });

  it("fails when the received value is not a Response or Request", async () => {
    await expect(async () => {
      await expect({}).toHaveTextBody("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot();
  });

  describe.each(["Response", "Request"] as const)(
    "when %s is not defined in the global scope",
    (type) => {
      it("fails", async () => {
        using _ = withoutGlobal(type);
        await expect(async () => {
          await expect({}).toHaveTextBody("Hello, world!");
        }).rejects.toThrowErrorMatchingSnapshot(type.toLowerCase());
      });
    },
  );

  it("fails when the body has already been used", async () => {
    const response = new Response("Hello, world!");
    await response.text(); // Consume the body
    await expect(async () => {
      await expect(response).toHaveTextBody("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot("response");

    const request = new Request("https://example.com", {
      body: "Hello, world!",
      method: "POST",
    });
    await request.text(); // Consume the body
    await expect(async () => {
      await expect(request).toHaveTextBody("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot("request");
  });

  it("clones to avoid consuming the body, so it can be read again later", async () => {
    const response = new Response("Hello, world!");
    await expect(response).toHaveTextBody("Hello, world!");
    await expect(response.text()).resolves.toBe("Hello, world!"); // Body can still be read

    const request = new Request("https://example.com", {
      body: "Hello, world!",
      method: "POST",
    });
    await expect(request).toHaveTextBody("Hello, world!");
    await expect(request.text()).resolves.toBe("Hello, world!"); // Body can still be read
  });

  it("fails when it cannot clone the body", async () => {
    await using response = locked(new Response("Hello, world!"));
    await expect(async () => {
      await expect(response).toHaveTextBody("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot("response");

    await using request = locked(
      new Request("https://example.com", {
        body: "Hello, world!",
        method: "POST",
      }),
    );
    await expect(async () => {
      await expect(request).toHaveTextBody("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot("request");
  });

  it("fails when it cannot read the body as text", async () => {
    const response = new Response(erroredStream());
    await expect(async () => {
      await expect(response).toHaveTextBody("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot("response");

    const request = new Request("https://example.com", {
      body: erroredStream(),
      method: "POST",
      duplex: "half",
    });
    await expect(async () => {
      await expect(request).toHaveTextBody("Hello, world!");
    }).rejects.toThrowErrorMatchingSnapshot("request");
  });

  describe("with asymmetric matchers", () => {
    it("passes when the body text matches", async () => {
      const response = new Response("Hello, world!");
      await expect(response).toHaveTextBody(expect.stringContaining("Hello"));
      await expect(async () => {
        await expect(response).not.toHaveTextBody(expect.stringContaining("Hello"));
      }).rejects.toThrowErrorMatchingSnapshot("response");

      const request = new Request("https://example.com", {
        body: "Hello, world!",
        method: "POST",
      });
      await expect(request).toHaveTextBody(expect.stringContaining("Hello"));
      await expect(async () => {
        await expect(request).not.toHaveTextBody(expect.stringContaining("Hello"));
      }).rejects.toThrowErrorMatchingSnapshot("request");
    });

    it("fails when the body text does not match", async () => {
      const response = new Response("Goodbye, world!");
      await expect(async () => {
        await expect(response).toHaveTextBody(expect.stringContaining("Hello"));
      }).rejects.toThrowErrorMatchingSnapshot("response");
      await expect(response).not.toHaveTextBody(expect.stringContaining("Hello"));

      const request = new Request("https://example.com", {
        body: "Goodbye, world!",
        method: "POST",
      });
      await expect(async () => {
        await expect(request).toHaveTextBody(expect.stringContaining("Hello"));
      }).rejects.toThrowErrorMatchingSnapshot("request");
      await expect(request).not.toHaveTextBody(expect.stringContaining("Hello"));
    });
  });
});

function jsonRequest(body: any): Request {
  return new Request("https://example.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe.each(["toHaveJSONBody", "toHaveJSONBodyStrict"] as const)("%s", (matcherName) => {
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

  describe.each(["Response", "Request"] as const)(
    "when %s is not defined in the global scope",
    (type) => {
      it("fails", async () => {
        using _ = withoutGlobal(type);
        await expect(async () => {
          await expect({})[matcherName]({ message: "Hello, world!" });
        }).rejects.toThrowErrorMatchingSnapshot(type.toLowerCase());
      });
    },
  );

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

  it("fails when it cannot clone the body", async () => {
    await using response = locked(Response.json({ message: "Hello, world!" }));
    await expect(async () => {
      await expect(response)[matcherName]({ message: "Hello, world!" });
    }).rejects.toThrowErrorMatchingSnapshot("response");

    await using request = locked(jsonRequest({ message: "Hello, world!" }));
    await expect(async () => {
      await expect(request)[matcherName]({ message: "Hello, world!" });
    }).rejects.toThrowErrorMatchingSnapshot("request");
  });

  it("fails when it cannot read the body as JSON", async () => {
    const response = new Response("Hello, world!");
    await expect(async () => {
      await expect(response)[matcherName]({ message: "Hello, world!" });
    }).rejects.toThrowErrorMatchingSnapshot("response");

    const request = new Request("https://example.com", {
      body: "Hello, world!",
      method: "POST",
    });
    await expect(async () => {
      await expect(request)[matcherName]({ message: "Hello, world!" });
    }).rejects.toThrowErrorMatchingSnapshot("request");
  });
});

function redirectedResponse(): Response {
  // redirected doesn't allow being set directly, so we use defineProperty to mock it for testing purposes
  return Object.defineProperty(new Response(), "redirected", { value: true });
}

describe("toBeRedirected", () => {
  it("passes when the response is redirected", () => {
    const response = redirectedResponse();
    expect(response).toBeRedirected();
    expect(() => {
      expect(response).not.toBeRedirected();
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when the response is not redirected", () => {
    const response = new Response();
    expect(() => {
      expect(response).toBeRedirected();
    }).toThrowErrorMatchingSnapshot();
    expect(response).not.toBeRedirected();
  });

  it("fails when the received value is not a Response", () => {
    expect(() => {
      expect({}).toBeRedirected();
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when Response is not defined in the global scope", () => {
    using _ = withoutGlobal("Response");

    expect(() => {
      expect({}).toBeRedirected();
    }).toThrowErrorMatchingSnapshot();
  });
});

function typedResponse(type: typeof Response.prototype.type): Response {
  // type doesn't allow being set directly, so we use defineProperty to mock it for testing purposes
  return Object.defineProperty(new Response(), "type", { value: type });
}
describe("toHaveResponseType", () => {
  it("passes when the response has the expected type", () => {
    const response = typedResponse("basic");
    expect(response).toHaveResponseType("basic");
    expect(() => {
      expect(response).not.toHaveResponseType("basic");
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when the response does not have the expected type", () => {
    const response = typedResponse("cors");
    expect(() => {
      expect(response).toHaveResponseType("basic");
    }).toThrowErrorMatchingSnapshot();
    expect(response).not.toHaveResponseType("basic");
  });

  it("fails when the received value is not a Response", () => {
    expect(() => {
      expect({}).toHaveResponseType("basic");
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when Response is not defined in the global scope", () => {
    using _ = withoutGlobal("Response");

    expect(() => {
      expect({}).toHaveResponseType("basic");
    }).toThrowErrorMatchingSnapshot();
  });

  describe("with asymmetric matchers", () => {
    it("passes when the response type matches", () => {
      const response = typedResponse("basic");
      expect(response).toHaveResponseType(expect.oneOf(["basic", "cors"]));
      expect(() => {
        expect(response).not.toHaveResponseType(expect.oneOf(["basic", "cors"]));
      }).toThrowErrorMatchingSnapshot();
    });

    it("fails when the response type does not match", () => {
      const response = typedResponse("opaque");
      expect(() => {
        expect(response).toHaveResponseType(expect.oneOf(["basic", "cors"]));
      }).toThrowErrorMatchingSnapshot();
      expect(response).not.toHaveResponseType(expect.oneOf(["basic", "cors"]));
    });
  });
});

describe("toHaveSearchParam", () => {
  describe("when expected value is provided", () => {
    it("passes when the URLSearchParams, URL, Response or Request has the expected search param and value", () => {
      const params = new URLSearchParams("foo=bar");
      expect(params).toHaveSearchParam("foo", "bar");
      expect(() => {
        expect(params).not.toHaveSearchParam("foo", "bar");
      }).toThrowErrorMatchingSnapshot("params");

      const url = new URL(`https://example.com?${params.toString()}`);
      expect(url).toHaveSearchParam("foo", "bar");
      expect(() => {
        expect(url).not.toHaveSearchParam("foo", "bar");
      }).toThrowErrorMatchingSnapshot("url");

      const request = new Request(url);
      expect(request).toHaveSearchParam("foo", "bar");
      expect(() => {
        expect(request).not.toHaveSearchParam("foo", "bar");
      }).toThrowErrorMatchingSnapshot("request");

      const response = urlResponse(url.toString());
      expect(response).toHaveSearchParam("foo", "bar");
      expect(() => {
        expect(response).not.toHaveSearchParam("foo", "bar");
      }).toThrowErrorMatchingSnapshot("response");
    });

    it("fails when the URLSearchParams, URL, Response or Request does not have the expected search param and value", () => {
      const params = new URLSearchParams("foo=baz");
      expect(() => {
        expect(params).toHaveSearchParam("foo", "bar");
      }).toThrowErrorMatchingSnapshot("params");
      expect(params).not.toHaveSearchParam("foo", "bar");

      const url = new URL(`https://example.com?${params.toString()}`);
      expect(() => {
        expect(url).toHaveSearchParam("foo", "bar");
      }).toThrowErrorMatchingSnapshot("url");
      expect(url).not.toHaveSearchParam("foo", "bar");

      const request = new Request(url);
      expect(() => {
        expect(request).toHaveSearchParam("foo", "bar");
      }).toThrowErrorMatchingSnapshot("request");
      expect(request).not.toHaveSearchParam("foo", "bar");

      const response = urlResponse(url.toString());
      expect(() => {
        expect(response).toHaveSearchParam("foo", "bar");
      }).toThrowErrorMatchingSnapshot("response");
      expect(response).not.toHaveSearchParam("foo", "bar");
    });
  });

  describe("when expected value is not provided", () => {
    it("passes when the URLSearchParams, URL, Response or Request has the expected search param", () => {
      const params = new URLSearchParams("foo=bar");
      expect(params).toHaveSearchParam("foo");
      expect(() => {
        expect(params).not.toHaveSearchParam("foo");
      }).toThrowErrorMatchingSnapshot("params");

      const url = new URL(`https://example.com?${params.toString()}`);
      expect(url).toHaveSearchParam("foo");
      expect(() => {
        expect(url).not.toHaveSearchParam("foo");
      }).toThrowErrorMatchingSnapshot("url");

      const request = new Request(url);
      expect(request).toHaveSearchParam("foo");
      expect(() => {
        expect(request).not.toHaveSearchParam("foo");
      }).toThrowErrorMatchingSnapshot("request");

      const response = urlResponse(url.toString());
      expect(response).toHaveSearchParam("foo");
      expect(() => {
        expect(response).not.toHaveSearchParam("foo");
      }).toThrowErrorMatchingSnapshot("response");
    });

    it("fails when the URLSearchParams, URL, Response or Request does not have the expected search param", () => {
      const params = new URLSearchParams();
      expect(() => {
        expect(params).toHaveSearchParam("foo");
      }).toThrowErrorMatchingSnapshot("params");
      expect(params).not.toHaveSearchParam("foo");

      const url = new URL("https://example.com");
      expect(() => {
        expect(url).toHaveSearchParam("foo");
      }).toThrowErrorMatchingSnapshot("url");
      expect(url).not.toHaveSearchParam("foo");

      const request = new Request(url);
      expect(() => {
        expect(request).toHaveSearchParam("foo");
      }).toThrowErrorMatchingSnapshot("request");
      expect(request).not.toHaveSearchParam("foo");

      const response = urlResponse(url.toString());
      expect(() => {
        expect(response).toHaveSearchParam("foo");
      }).toThrowErrorMatchingSnapshot("response");
      expect(response).not.toHaveSearchParam("foo");
    });
  });

  it("fails when the received value is not a URLSearchParams, URL, Response or Request", () => {
    expect(() => {
      expect({}).toHaveSearchParam("foo", "bar");
    }).toThrowErrorMatchingSnapshot();
  });

  describe.each(["URLSearchParams", "URL", "Response", "Request"] as const)(
    "when %s is not defined in the global scope",
    (type) => {
      it("fails", () => {
        using _ = withoutGlobal(type);
        expect(() => {
          expect({}).toHaveSearchParam("foo", "bar");
        }).toThrowErrorMatchingSnapshot(type.toLowerCase());
      });
    },
  );

  it("fails when the search param name is not a string", () => {
    const params = new URLSearchParams("foo=bar");
    expect(() => {
      // @ts-expect-error
      expect(params).toHaveSearchParam(123, "bar");
    }).toThrowErrorMatchingSnapshot("params");

    const url = new URL(`https://example.com?${params.toString()}`);
    expect(() => {
      // @ts-expect-error
      expect(url).toHaveSearchParam(123, "bar");
    }).toThrowErrorMatchingSnapshot("url");

    const request = new Request(url);
    expect(() => {
      // @ts-expect-error
      expect(request).toHaveSearchParam(123, "bar");
    }).toThrowErrorMatchingSnapshot("request");

    const response = urlResponse(url.toString());
    expect(() => {
      // @ts-expect-error
      expect(response).toHaveSearchParam(123, "bar");
    }).toThrowErrorMatchingSnapshot("response");
  });

  it("fails when the expected value is not a string or undefined", () => {
    const params = new URLSearchParams("foo=bar");
    expect(() => {
      // @ts-expect-error
      expect(params).toHaveSearchParam("foo", 123);
    }).toThrowErrorMatchingSnapshot("params");

    const url = new URL(`https://example.com?${params.toString()}`);
    expect(() => {
      // @ts-expect-error
      expect(url).toHaveSearchParam("foo", 123);
    }).toThrowErrorMatchingSnapshot("url");

    const request = new Request(url);
    expect(() => {
      // @ts-expect-error
      expect(request).toHaveSearchParam("foo", 123);
    }).toThrowErrorMatchingSnapshot("request");

    const response = urlResponse(url.toString());
    expect(() => {
      // @ts-expect-error
      expect(response).toHaveSearchParam("foo", 123);
    }).toThrowErrorMatchingSnapshot("response");
  });

  describe("with asymmetric matchers", () => {
    it("passes when the search param value matches", () => {
      const params = new URLSearchParams("foo=bar");
      expect(params).toHaveSearchParam("foo", expect.stringContaining("ba"));
      expect(() => {
        expect(params).not.toHaveSearchParam("foo", expect.stringContaining("ba"));
      }).toThrowErrorMatchingSnapshot("params");

      const url = new URL(`https://example.com?${params.toString()}`);
      expect(url).toHaveSearchParam("foo", expect.stringContaining("ba"));
      expect(() => {
        expect(url).not.toHaveSearchParam("foo", expect.stringContaining("ba"));
      }).toThrowErrorMatchingSnapshot("url");

      const request = new Request(url);
      expect(request).toHaveSearchParam("foo", expect.stringContaining("ba"));
      expect(() => {
        expect(request).not.toHaveSearchParam("foo", expect.stringContaining("ba"));
      }).toThrowErrorMatchingSnapshot("request");

      const response = urlResponse(url.toString());
      expect(response).toHaveSearchParam("foo", expect.stringContaining("ba"));
      expect(() => {
        expect(response).not.toHaveSearchParam("foo", expect.stringContaining("ba"));
      }).toThrowErrorMatchingSnapshot("response");
    });

    it("fails when the search param value does not match", () => {
      const params = new URLSearchParams("foo=baz");
      expect(() => {
        expect(params).toHaveSearchParam("foo", expect.stringContaining("bar"));
      }).toThrowErrorMatchingSnapshot("params");
      expect(params).not.toHaveSearchParam("foo", expect.stringContaining("bar"));

      const url = new URL(`https://example.com?${params.toString()}`);
      expect(() => {
        expect(url).toHaveSearchParam("foo", expect.stringContaining("bar"));
      }).toThrowErrorMatchingSnapshot("url");
      expect(url).not.toHaveSearchParam("foo", expect.stringContaining("bar"));

      const request = new Request(url);
      expect(() => {
        expect(request).toHaveSearchParam("foo", expect.stringContaining("bar"));
      }).toThrowErrorMatchingSnapshot("request");
      expect(request).not.toHaveSearchParam("foo", expect.stringContaining("bar"));

      const response = urlResponse(url.toString());
      expect(() => {
        expect(response).toHaveSearchParam("foo", expect.stringContaining("bar"));
      }).toThrowErrorMatchingSnapshot("response");
      expect(response).not.toHaveSearchParam("foo", expect.stringContaining("bar"));
    });
  });
});

describe("toBeAborted", () => {
  it("passes when the signal/request has been aborted", () => {
    const signal = AbortSignal.abort();
    expect(signal).toBeAborted();
    expect(() => {
      expect(signal).not.toBeAborted();
    }).toThrowErrorMatchingSnapshot("signal");

    const request = new Request("https://example.com", { signal });
    expect(request).toBeAborted();
    expect(() => {
      expect(request).not.toBeAborted();
    }).toThrowErrorMatchingSnapshot("request");
  });

  it("fails when the signal/request has not been aborted", () => {
    const controller = new AbortController();
    const signal = controller.signal;
    expect(() => {
      expect(signal).toBeAborted();
    }).toThrowErrorMatchingSnapshot("signal");
    expect(signal).not.toBeAborted();

    const request = new Request("https://example.com", { signal });
    expect(() => {
      expect(request).toBeAborted();
    }).toThrowErrorMatchingSnapshot("request");
    expect(request).not.toBeAborted();
  });

  it("fails when the received value is not an AbortSignal or Request", () => {
    expect(() => {
      expect({}).toBeAborted();
    }).toThrowErrorMatchingSnapshot();
  });

  describe.each(["AbortSignal", "Request"] as const)(
    "when %s is not defined in the global scope",
    (type) => {
      it("fails", () => {
        using _ = withoutGlobal(type);
        expect(() => {
          expect({}).toBeAborted();
        }).toThrowErrorMatchingSnapshot();
      });
    },
  );
});
