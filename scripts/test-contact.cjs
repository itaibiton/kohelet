// Exercise the real route with an injected email provider; never sends email.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const source = ts.transpileModule(readFileSync(join(__dirname, "../app/api/contact/route.ts"), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const valid = { name: "Alex", email: "alex@example.com", message: "An AI workflow for our business" };

function handler(result, configured = true) {
  const calls = [];
  const mod = { exports: {} };
  class FakeResend {
    emails = { send: async (payload) => {
      calls.push(payload);
      if (result instanceof Error) throw result;
      return result;
    } };
  }
  vm.runInNewContext(source, {
    exports: mod.exports,
    require: (name) => name === "resend" ? { Resend: FakeResend } : require(name),
    process: { env: configured ? { RESEND_API_KEY: "test-no-network" } : {} },
    console: { error() {} },
  });
  return { post: mod.exports.POST, calls };
}
function request(body, raw = false) {
  return new Request("http://localhost/api/contact", {
    method: "POST", headers: { "content-type": "application/json" },
    body: raw ? body : JSON.stringify(body),
  });
}

test("provider acceptance is required for success and fields are trimmed", async () => {
  const { post, calls } = handler({ data: { id: "accepted-id" }, error: null });
  const response = await post(request({ ...valid, name: " Alex ", service: " Consulting " }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].replyTo, valid.email);
  assert.match(calls[0].text, /^Name: Alex\n/);
  assert.match(calls[0].subject, / - Consulting$/);
});
test("provider rejection or missing receipt never reports success", async () => {
  for (const result of [{ data: null, error: { message: "rejected" } }, { data: null, error: null }]) {
    const { post } = handler(result);
    const response = await post(request(valid));
    assert.equal(response.status, 502);
    assert.equal((await response.json()).success, undefined);
  }
});
test("invalid inputs never reach the email provider", async () => {
  const { post, calls } = handler({ data: { id: "unused" } });
  for (const body of [null, [], {}, { ...valid, name: "  " }, { ...valid, name: 42 }, { ...valid, email: "bad" }, { ...valid, phone: {} }, { ...valid, message: "x".repeat(5001) }]) {
    assert.equal((await post(request(body))).status, 400);
  }
  assert.equal((await post(request("{bad-json", true))).status, 400);
  assert.equal(calls.length, 0);
});
test("missing configuration and thrown provider errors return failure", async () => {
  const absent = handler({}, false);
  assert.equal((await absent.post(request(valid))).status, 500);
  assert.equal(absent.calls.length, 0);
  const thrown = handler(new Error("provider unavailable"));
  assert.equal((await thrown.post(request(valid))).status, 500);
});
