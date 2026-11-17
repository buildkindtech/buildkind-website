import assert from "node:assert/strict";
import test from "node:test";

import {
  buildNotificationContent,
  escapeHtml,
  validateContactPayload,
} from "./contact.ts";

const validPayload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  message: "Please review our site.",
  interest: "Website redesign",
  website: "",
};

test("rejects oversized fields", () => {
  for (const [field, value] of [
    ["name", "a".repeat(201)],
    ["email", `${"a".repeat(243)}@example.com`],
    ["company", "a".repeat(201)],
    ["message", "a".repeat(5001)],
    ["interest", "a".repeat(201)],
  ]) {
    const result = validateContactPayload({ ...validPayload, [field]: value });
    assert.deepEqual(result, { ok: false, error: "Field is too long" }, field);
  }
});

test("rejects non-string fields", () => {
  for (const [field, value] of [["company", 42], ["interest", null], ["website", null]]) {
    const result = validateContactPayload({ ...validPayload, [field]: value });
    assert.deepEqual(result, { ok: false, error: "Invalid field type" }, field);
  }
});

test("rejects malformed email addresses", () => {
  const result = validateContactPayload({ ...validPayload, email: "not-an-email" });
  assert.deepEqual(result, { ok: false, error: "Invalid email address" });
});

test("escapes HTML metacharacters from submitted values", () => {
  const escaped = escapeHtml('<script title="x">\'&</script>');
  assert.equal(escaped, "&lt;script title=&quot;x&quot;&gt;&#39;&amp;&lt;/script&gt;");
  assert.doesNotMatch(escaped, /[<>"]/);

  const validation = validateContactPayload({
    ...validPayload,
    name: '<b title="x">Ada</b>',
    message: '<img src="x">',
  });
  assert.equal(validation.ok && validation.honeypot, false);
  if (!validation.ok || validation.honeypot) throw new Error("Expected a valid submission");

  const notification = buildNotificationContent(validation.submission);
  assert.doesNotMatch(notification.html, /<b title="x">|<img src="x">/);
  assert.match(notification.html, /&lt;b title=&quot;x&quot;&gt;Ada&lt;\/b&gt;/);
  assert.match(notification.html, /&lt;img src=&quot;x&quot;&gt;/);
});

test("identifies honeypot submissions before email handling", () => {
  const result = validateContactPayload({ ...validPayload, website: "https://spam.example" });
  assert.deepEqual(result, { ok: true, honeypot: true });
});
