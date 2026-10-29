import assert from "node:assert/strict";
import { test } from "node:test";

import { CONTACT_EMAIL, INSTAGRAM_URL, feedbackMailto } from "./contact.ts";

test("mailto de sugestão leva assunto e corpo codificados", () => {
  const url = new URL(feedbackMailto());
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, CONTACT_EMAIL);
  assert.equal(url.searchParams.get("subject"), "Sugestão para o VOcare");
  assert.match(url.searchParams.get("body") ?? "", /^Oi, equipe VOcare!\n/);
});

test("link do Instagram aponta para @vocare.hub", () => {
  assert.equal(INSTAGRAM_URL, "https://www.instagram.com/vocare.hub/");
});
