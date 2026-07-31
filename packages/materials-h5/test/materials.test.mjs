import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { h5Materials } from "../dist/index.js";
import { h5VueMaterials } from "../../materials-vue-h5/dist/index.js";
import { validateLowcodeMaterialManifest } from "../../schema/dist/index.js";

function manifestNames(materials) {
  return materials.map((material) => material.manifest.componentName);
}

describe("MeuMall H5 material manifests", () => {
  it("keeps React and Vue material component names aligned", () => {
    assert.deepEqual(manifestNames(h5Materials), manifestNames(h5VueMaterials));
  });

  it("keeps all React and Vue material manifests valid", () => {
    for (const material of [...h5Materials, ...h5VueMaterials]) {
      const result = validateLowcodeMaterialManifest(material.manifest);

      assert.equal(result.valid, true, `${material.manifest.componentName}: ${result.errors.join("; ")}`);
    }
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

  it("registers the section title material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "SectionTitle");

    assert.ok(material);
    assert.equal(material.manifest.title, "区块标题");
    assert.equal(material.manifest.category, "content");
    assert.equal(material.manifest.defaultProps.title, "今日主推");
    assert.equal(material.manifest.propsSchema.markerText.setter, "input");
    assert.equal(material.manifest.propsSchema.subtitle.setter, "textarea");
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

  it("registers the product rank list material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "ProductRankList");

    assert.ok(material);
    assert.equal(material.manifest.title, "商品榜单");
    assert.equal(material.manifest.category, "commerce");
    assert.equal(material.manifest.defaultProps.badgeText, "热卖榜");
    assert.equal(material.manifest.propsSchema.items.setter, "dataSourceSelector");
    assert.deepEqual(material.manifest.dataSourceSlots?.[0]?.acceptedTypes, ["product.byIds", "product.byActivity"]);
    assert.equal(material.manifest.events?.[0]?.name, "onProductClick");
  });

  it("registers the brand feature section material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BrandFeatureSection");

    assert.ok(material);
    assert.equal(material.manifest.title, "品牌专题");
    assert.equal(material.manifest.category, "marketing");
    assert.equal(material.manifest.defaultProps.brandName, "MeuMall Select");
    assert.equal(material.manifest.propsSchema.coverImageUrl.setter, "image");
    assert.equal(material.manifest.propsSchema.items.setter, "dataSourceSelector");
    assert.deepEqual(material.manifest.dataSourceSlots?.[0]?.acceptedTypes, ["product.byIds", "product.byActivity"]);
    assert.equal(material.manifest.events?.[0]?.name, "onEnter");
    assert.equal(material.manifest.events?.[1]?.name, "onProductClick");
  });

  it("registers the sticky action bar material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "StickyActionBar");

    assert.ok(material);
    assert.equal(material.manifest.title, "底部转化条");
    assert.equal(material.manifest.category, "marketing");
    assert.equal(material.manifest.defaultProps.primaryText, "立即抢购");
    assert.equal(material.manifest.propsSchema.safeArea.setter, "switch");
    assert.equal(material.manifest.propsSchema.primaryLinkUrl.setter, "input");
    assert.equal(material.manifest.events?.[0]?.name, "onPrimaryClick");
    assert.equal(material.manifest.events?.[1]?.name, "onSecondaryClick");
  });

  it("registers the live entry material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "LiveEntry");

    assert.ok(material);
    assert.equal(material.manifest.title, "直播入口");
    assert.equal(material.manifest.category, "marketing");
    assert.equal(material.manifest.defaultProps.buttonText, "进入直播");
    assert.equal(material.manifest.propsSchema.coverImageUrl.setter, "image");
    assert.equal(material.manifest.propsSchema.linkUrl.setter, "input");
    assert.equal(material.manifest.events?.[0]?.name, "onEnter");
  });
});
