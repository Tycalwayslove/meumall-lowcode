import test from "node:test";
import assert from "node:assert/strict";

import {
  LOWCODE_H5_TOKENS,
  createLowcodeH5CssVars,
  createLowcodeH5TintColor,
  getLowcodeH5ToneColor,
  h5Tokens,
} from "../dist/index.js";

test("exports stable h5 tokens alias", () => {
  assert.equal(h5Tokens, LOWCODE_H5_TOKENS);
  assert.equal(h5Tokens.touch.minHeight, 44);
  assert.equal(h5Tokens.radius.md, 8);
});

test("resolves h5 tone colors", () => {
  assert.equal(getLowcodeH5ToneColor("neutral"), h5Tokens.color.text);
  assert.equal(getLowcodeH5ToneColor("accent"), h5Tokens.color.accent);
  assert.equal(getLowcodeH5ToneColor("danger"), h5Tokens.color.danger);
  assert.equal(getLowcodeH5ToneColor("inverse"), h5Tokens.color.inverseText);
});

test("creates rgb tint from hex color with fallback", () => {
  assert.equal(createLowcodeH5TintColor("#0f766e", 0.16), "rgba(15, 118, 110, 0.16)");
  assert.equal(createLowcodeH5TintColor("#fff", 0.32), "rgba(255, 255, 255, 0.32)");
  assert.equal(createLowcodeH5TintColor("var(--brand)", 0.08), "rgba(15, 118, 110, 0.08)");
});

test("creates css variable map for host injection", () => {
  const vars = createLowcodeH5CssVars();
  assert.equal(vars["--mlc-h5-color-accent"], h5Tokens.color.accent);
  assert.equal(vars["--mlc-h5-radius-md"], "8px");
  assert.equal(vars["--mlc-h5-touch-min-height"], "44px");
});
