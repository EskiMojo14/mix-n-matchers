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
    const notAResponse = {};
    expect(() => {
      expect(notAResponse).toBeOK();
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
    const notAResponse = {};
    expect(() => {
      expect(notAResponse).toHaveStatus(200);
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when Response is not defined in the global scope", () => {
    using _ = withoutGlobalResponse();

    expect(() => {
      expect({}).toHaveStatus(200);
    }).toThrowErrorMatchingSnapshot();
  });
});

describe("toHaveHeader", () => {
  describe("when expected value is provided", () => {
    it("passes when the response has the expected header and value", () => {
      const response = new Response(null, {
        headers: { "Content-Type": "application/json" },
      });
      expect(response).toHaveHeader("Content-Type", "application/json");
      expect(() => {
        expect(response).not.toHaveHeader("Content-Type", "application/json");
      }).toThrowErrorMatchingSnapshot();
    });

    it("fails when the response does not have the expected header and value", () => {
      const response = new Response(null, {
        headers: { "Content-Type": "text/html" },
      });
      expect(() => {
        expect(response).toHaveHeader("Content-Type", "application/json");
      }).toThrowErrorMatchingSnapshot();
      expect(response).not.toHaveHeader("Content-Type", "application/json");
    });
  });

  describe("when expected value is not provided", () => {
    it("passes when the response has the expected header", () => {
      const response = new Response(null, {
        headers: { "Content-Type": "application/json" },
      });
      expect(response).toHaveHeader("Content-Type");
      expect(() => {
        expect(response).not.toHaveHeader("Content-Type");
      }).toThrowErrorMatchingSnapshot();
    });

    it("fails when the response does not have the expected header", () => {
      const response = new Response(null, {
        headers: { "Content-Type": "text/html" },
      });
      expect(() => {
        expect(response).toHaveHeader("Authorization");
      }).toThrowErrorMatchingSnapshot();
      expect(response).not.toHaveHeader("Authorization");
    });
  });

  it("fails when the received value is not a Response", () => {
    const notAResponse = {};
    expect(() => {
      expect(notAResponse).toHaveHeader("Content-Type", "application/json");
    }).toThrowErrorMatchingSnapshot();
  });

  it("fails when Response is not defined in the global scope", () => {
    using _ = withoutGlobalResponse();

    expect(() => {
      expect({}).toHaveHeader("Content-Type", "application/json");
    }).toThrowErrorMatchingSnapshot();
  });
});
