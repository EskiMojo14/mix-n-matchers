import { it, expect, describe } from "@globals";

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
    using _ = withoutGlobal("Request");

    expect(() => {
      expect({}).toHaveMethod("POST");
    }).toThrowErrorMatchingSnapshot();
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

  describe.each(["Response", "Request"] as const)(
    "when %s is not defined in the global scope",
    (type) => {
      it("fails", async () => {
        using _ = withoutGlobal(type);
        await expect(async () => {
          await expect({}).toHaveBodyText("Hello, world!");
        }).rejects.toThrowErrorMatchingSnapshot(type.toLowerCase());
      });
    },
  );

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
});
