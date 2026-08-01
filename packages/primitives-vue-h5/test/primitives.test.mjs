import test from "node:test";
import assert from "node:assert/strict";

import {
  createMlcFormFieldDataAttributes,
  createMlcFormRequiredMessage,
  formatMlcFormFieldValue,
  isMlcFormFieldEmpty,
  MlcButton,
  MlcImage,
  MlcInput,
  MlcText,
  parseMlcFormFieldValue,
} from "../dist/index.js";

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

test("normalizes Vue primitive form field metadata", () => {
  assert.deepEqual(
    createMlcFormFieldDataAttributes({
      label: "人数",
      type: "number",
      required: true,
      requiredMessage: "请填写人数",
    }),
    {
      "data-mlc-form-field": "true",
      "data-mlc-form-field-label": "人数",
      "data-mlc-form-field-type": "number",
      "data-mlc-form-field-required": "true",
      "data-mlc-form-field-required-message": "请填写人数",
    },
  );
  assert.equal(formatMlcFormFieldValue(false), "false");
  assert.equal(formatMlcFormFieldValue(8), "8");
  assert.equal(parseMlcFormFieldValue("8", "number"), 8);
  assert.equal(parseMlcFormFieldValue("nope", "number"), null);
  assert.equal(parseMlcFormFieldValue("false", "boolean"), false);
  assert.equal(isMlcFormFieldEmpty("", "string"), true);
  assert.equal(isMlcFormFieldEmpty("NaN", "number"), true);
  assert.equal(isMlcFormFieldEmpty("false", "boolean"), true);
  assert.equal(createMlcFormRequiredMessage("", "协议", "确认"), "");
  assert.equal(createMlcFormRequiredMessage(undefined, "协议", "确认"), "请确认协议");
});
