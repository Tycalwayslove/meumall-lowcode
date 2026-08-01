import test from "node:test";
import assert from "node:assert/strict";
import React from "react";

import { MlcButton, MlcImage, MlcInput, MlcText } from "../dist/index.js";

test("exports React H5 primitives as components", () => {
  assert.equal(typeof MlcButton, "function");
  assert.equal(typeof MlcImage, "function");
  assert.equal(typeof MlcInput, "function");
  assert.equal(typeof MlcText, "function");
});

test("creates React elements without material manifest coupling", () => {
  assert.equal(React.isValidElement(React.createElement(MlcButton, null, "提交")), true);
  assert.equal(React.isValidElement(React.createElement(MlcInput, { value: "hello" })), true);
  assert.equal("manifest" in MlcButton, false);
});
