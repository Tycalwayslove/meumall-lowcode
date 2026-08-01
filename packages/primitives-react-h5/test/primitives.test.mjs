import test from "node:test";
import assert from "node:assert/strict";
import React from "react";

import {
  createMlcFormFieldDataAttributes,
  createMlcFormRequiredMessage,
  formatMlcFormFieldValue,
  isMlcFormFieldEmpty,
  MlcButton,
  MlcImage,
  MlcInput,
  MlcProgress,
  MlcStateBlock,
  MlcText,
  parseMlcFormFieldValue,
} from "../dist/index.js";

test("exports React H5 primitives as components", () => {
  assert.equal(typeof MlcButton, "function");
  assert.equal(typeof MlcImage, "function");
  assert.equal(typeof MlcInput, "function");
  assert.equal(typeof MlcProgress, "function");
  assert.equal(typeof MlcStateBlock, "function");
  assert.equal(typeof MlcText, "function");
});

test("creates React elements without material manifest coupling", () => {
  assert.equal(React.isValidElement(React.createElement(MlcButton, null, "提交")), true);
  assert.equal(React.isValidElement(React.createElement(MlcInput, { value: "hello" })), true);
  assert.equal(React.isValidElement(React.createElement(MlcProgress, { value: 60, max: 100 })), true);
  assert.equal(React.isValidElement(React.createElement(MlcStateBlock, { title: "暂无内容" })), true);
  assert.equal("manifest" in MlcButton, false);
  assert.equal("manifest" in MlcProgress, false);
  assert.equal("manifest" in MlcStateBlock, false);
});

test("normalizes React primitive form field metadata", () => {
  assert.deepEqual(
    createMlcFormFieldDataAttributes({
      label: "手机号",
      type: "string",
      required: true,
      requiredMessage: "请填写手机号",
    }),
    {
      "data-mlc-form-field": "true",
      "data-mlc-form-field-label": "手机号",
      "data-mlc-form-field-type": "string",
      "data-mlc-form-field-required": "true",
      "data-mlc-form-field-required-message": "请填写手机号",
    },
  );
  assert.equal(formatMlcFormFieldValue(true), "true");
  assert.equal(formatMlcFormFieldValue(3), "3");
  assert.equal(parseMlcFormFieldValue("3", "number"), 3);
  assert.equal(parseMlcFormFieldValue("oops", "number"), null);
  assert.equal(parseMlcFormFieldValue("true", "boolean"), true);
  assert.equal(isMlcFormFieldEmpty("", "string"), true);
  assert.equal(isMlcFormFieldEmpty("  ", "number"), true);
  assert.equal(isMlcFormFieldEmpty("false", "boolean"), true);
  assert.equal(createMlcFormRequiredMessage("", "协议", "确认"), "");
  assert.equal(createMlcFormRequiredMessage(undefined, "协议", "确认"), "请确认协议");
});
