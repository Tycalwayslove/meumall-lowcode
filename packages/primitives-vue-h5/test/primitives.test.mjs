import test from "node:test";
import assert from "node:assert/strict";

import { MlcButton, MlcImage, MlcInput, MlcText } from "../dist/index.js";

test("exports Vue H5 primitives as components", () => {
  assert.equal(MlcButton.name, "MlcButton");
  assert.equal(MlcImage.name, "MlcImage");
  assert.equal(MlcInput.name, "MlcInput");
  assert.equal(MlcText.name, "MlcText");
});

test("keeps Vue primitives outside material manifest semantics", () => {
  assert.equal("manifest" in MlcButton, false);
  assert.equal("props" in MlcButton, true);
});
