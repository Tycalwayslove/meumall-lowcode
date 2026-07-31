import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { h5Materials } from "../dist/index.js";
import { h5VueMaterials } from "../../materials-vue-h5/dist/index.js";

function manifestNames(materials) {
  return materials.map((material) => material.manifest.componentName);
}

describe("MeuMall H5 material manifests", () => {
  it("keeps React and Vue material component names aligned", () => {
    assert.deepEqual(manifestNames(h5Materials), manifestNames(h5VueMaterials));
  });

  it("registers the activity rule modal material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "ActivityRuleModal");

    assert.ok(material);
    assert.equal(material.manifest.title, "活动规则弹窗");
    assert.equal(material.manifest.defaultProps.buttonText, "查看规则");
    assert.equal(material.manifest.events?.[0]?.name, "onOpen");
  });

  it("registers the floor anchor navigation material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "FloorAnchorNav");

    assert.ok(material);
    assert.equal(material.manifest.title, "楼层锚点");
    assert.equal(material.manifest.defaultProps.sticky, true);
    assert.equal(material.manifest.propsSchema.items.setter, "textarea");
    assert.equal(material.manifest.events?.[0]?.name, "onAnchorClick");
  });

  it("registers the coupon bundle material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "CouponBundle");

    assert.ok(material);
    assert.equal(material.manifest.title, "组合券包");
    assert.equal(material.manifest.defaultProps.receiveAllText, "一键领取");
    assert.equal(material.manifest.propsSchema.coupons.setter, "textarea");
    assert.equal(material.manifest.events?.[0]?.name, "onReceive");
    assert.equal(material.manifest.events?.[1]?.name, "onReceiveAll");
  });

  it("registers the store expert section material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "StoreExpertSection");

    assert.ok(material);
    assert.equal(material.manifest.title, "门店/达人推荐");
    assert.equal(material.manifest.category, "commerce");
    assert.equal(material.manifest.defaultProps.badgeText, "精选");
    assert.equal(material.manifest.propsSchema.items.setter, "textarea");
    assert.deepEqual(material.manifest.dataSourceSlots?.[0]?.acceptedTypes, ["store.byIds", "expert.byActivity"]);
    assert.equal(material.manifest.events?.[0]?.name, "onItemClick");
  });
});
