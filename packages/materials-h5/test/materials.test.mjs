import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ActivityRuleModal,
  BasicButton,
  BasicInput,
  BasicText,
  BrandFeatureSection,
  CouponBundle,
  CouponSection,
  CountdownTimer,
  DividerBlock,
  FlashSaleList,
  FloorAnchorNav,
  h5Materials,
  LeadFormBlock,
  LiveEntry,
  NavGrid,
  ProductRankList,
  SpacerBlock,
  StickyActionBar,
  StoreExpertSection,
  TabsBlock,
} from "../dist/index.js";
import { h5VueMaterials } from "../../materials-vue-h5/dist/index.js";
import { validateLowcodeMaterialManifest } from "../../schema/dist/index.js";

function manifestNames(materials) {
  return materials.map((material) => material.manifest.componentName);
}

function elementTypeNames(element, names = new Set()) {
  if (!element || typeof element !== "object") return names;

  if (typeof element.type === "function") {
    names.add(element.type.displayName || element.type.name);
  } else if (typeof element.type === "string") {
    names.add(element.type);
  }

  const children = element.props?.children;
  if (Array.isArray(children)) {
    for (const child of children) elementTypeNames(child, names);
  } else {
    elementTypeNames(children, names);
  }

  return names;
}

function functionSourceIncludes(fn, names) {
  const source = Function.prototype.toString.call(fn);

  for (const name of names) {
    assert.equal(source.includes(name), true, `${fn.name} should compose ${name}`);
  }
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

  it("keeps runtime primitives out of material registries", () => {
    const primitiveNames = [
      "MlcButton",
      "MlcImage",
      "MlcTag",
      "MlcText",
      "MlcPrice",
      "MlcInput",
      "MlcTextarea",
      "MlcSwitch",
      "MlcStepper",
      "MlcOverlay",
      "MlcModal",
      "MlcCountdownText",
      "MlcTabs",
      "MlcSpacer",
      "MlcDivider",
    ];

    for (const name of primitiveNames) {
      assert.equal(manifestNames(h5Materials).includes(name), false, `${name} should not be a React material`);
      assert.equal(manifestNames(h5VueMaterials).includes(name), false, `${name} should not be a Vue material`);
    }
  });

  it("composes migrated business materials from runtime primitives", () => {
    const baseNode = { id: "node_1", componentName: "TestNode", props: {} };
    const productRankTypes = elementTypeNames(ProductRankList({ props: {}, node: baseNode }));
    const couponBundleTypes = elementTypeNames(CouponBundle({ props: {}, node: baseNode }));
    const stickyActionTypes = elementTypeNames(StickyActionBar({ props: {}, node: baseNode }));
    const brandFeatureTypes = elementTypeNames(BrandFeatureSection({ props: {}, node: baseNode }));
    const liveEntryTypes = elementTypeNames(LiveEntry({ props: { coverImageUrl: "https://example.com/live.jpg" }, node: baseNode }));
    const storeExpertTypes = elementTypeNames(StoreExpertSection({ props: {}, node: baseNode }));
    const couponSectionTypes = elementTypeNames(CouponSection({ props: {}, node: baseNode }));
    const countdownTypes = elementTypeNames(CountdownTimer({ props: {}, node: baseNode }));
    const navGridTypes = elementTypeNames(NavGrid({ props: { items: [{ id: "nav_1", title: "会场", subtitle: "精选" }] }, node: baseNode }));
    const floorAnchorTypes = elementTypeNames(FloorAnchorNav({ props: { title: "楼层导航" }, node: baseNode }));
    const flashSaleTypes = elementTypeNames(
      FlashSaleList({
        props: {
          items: [{ id: "sku_1", title: "秒杀商品", priceText: "¥99", originPriceText: "¥199", imageUrl: "https://example.com/sku.jpg" }],
        },
        node: baseNode,
      }),
    );

    assert.equal(productRankTypes.has("MlcButton"), true);
    assert.equal(productRankTypes.has("MlcImage"), true);
    assert.equal(productRankTypes.has("MlcTag"), true);
    assert.equal(productRankTypes.has("MlcText"), true);
    assert.equal(productRankTypes.has("MlcPrice"), true);
    assert.equal(couponBundleTypes.has("MlcButton"), true);
    assert.equal(couponBundleTypes.has("MlcTag"), true);
    assert.equal(couponBundleTypes.has("MlcText"), true);
    assert.equal(couponBundleTypes.has("MlcPrice"), true);
    assert.equal(stickyActionTypes.has("MlcButton"), true);
    assert.equal(stickyActionTypes.has("MlcText"), true);
    assert.equal(brandFeatureTypes.has("MlcButton"), true);
    assert.equal(brandFeatureTypes.has("MlcImage"), true);
    assert.equal(brandFeatureTypes.has("MlcTag"), true);
    assert.equal(brandFeatureTypes.has("MlcText"), true);
    assert.equal(brandFeatureTypes.has("MlcPrice"), true);
    assert.equal(liveEntryTypes.has("MlcButton"), true);
    assert.equal(liveEntryTypes.has("MlcImage"), true);
    assert.equal(liveEntryTypes.has("MlcTag"), true);
    assert.equal(liveEntryTypes.has("MlcText"), true);
    assert.equal(storeExpertTypes.has("MlcButton"), true);
    assert.equal(storeExpertTypes.has("MlcImage"), true);
    assert.equal(storeExpertTypes.has("MlcTag"), true);
    assert.equal(storeExpertTypes.has("MlcText"), true);
    assert.equal(couponSectionTypes.has("MlcButton"), true);
    assert.equal(couponSectionTypes.has("MlcText"), true);
    functionSourceIncludes(ActivityRuleModal, ["MlcButton", "MlcModal", "MlcText"]);
    assert.equal(countdownTypes.has("MlcCountdownText"), true);
    assert.equal(navGridTypes.has("MlcButton"), true);
    assert.equal(navGridTypes.has("MlcText"), true);
    assert.equal(floorAnchorTypes.has("MlcButton"), true);
    assert.equal(floorAnchorTypes.has("MlcText"), true);
    functionSourceIncludes(TabsBlock, ["MlcTabs", "MlcTag", "MlcText"]);
    functionSourceIncludes(SpacerBlock, ["MlcSpacer"]);
    functionSourceIncludes(BasicButton, ["MlcButton"]);
    functionSourceIncludes(BasicInput, ["MlcInput", "MlcText"]);
    functionSourceIncludes(BasicText, ["MlcText"]);
    functionSourceIncludes(DividerBlock, ["MlcDivider"]);
    assert.equal(flashSaleTypes.has("MlcButton"), true);
    assert.equal(flashSaleTypes.has("MlcImage"), true);
    assert.equal(flashSaleTypes.has("MlcTag"), true);
    assert.equal(flashSaleTypes.has("MlcText"), true);
    assert.equal(flashSaleTypes.has("MlcPrice"), true);
    functionSourceIncludes(LeadFormBlock, ["MlcInput", "MlcTextarea", "MlcSwitch", "MlcStepper", "MlcButton", "MlcText"]);
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

  it("registers the basic button material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicButton");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础按钮");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.text, "基础按钮");
    assert.equal(material.manifest.propsSchema.block.setter, "switch");
    assert.equal(material.manifest.propsSchema.backgroundColor.setter, "color");
    assert.equal(material.manifest.events?.[0]?.name, "onClick");
  });

  it("registers the basic input material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicInput");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础输入框");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.placeholder, "请输入内容");
    assert.equal(material.manifest.propsSchema.disabled.setter, "switch");
    assert.equal(material.manifest.propsSchema.helperText.setter, "textarea");
    assert.equal(material.manifest.events?.[0]?.name, "onChange");
  });

  it("registers the basic text material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicText");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础文本");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.as, "p");
    assert.equal(material.manifest.propsSchema.text.setter, "textarea");
    assert.equal(material.manifest.propsSchema.color.setter, "color");
  });

  it("registers the divider block material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "DividerBlock");

    assert.ok(material);
    assert.equal(material.manifest.title, "分割线");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.lineStyle, "solid");
    assert.equal(material.manifest.propsSchema.color.setter, "color");
    assert.equal(material.manifest.propsSchema.thickness.setter, "number");
  });

  it("registers the image card grid material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "ImageCardGrid");

    assert.ok(material);
    assert.equal(material.manifest.title, "图片卡片宫格");
    assert.equal(material.manifest.category, "marketing");
    assert.equal(material.manifest.defaultProps.title, "专题会场");
    assert.equal(material.manifest.propsSchema.items.setter, "textarea");
    assert.equal(material.manifest.events?.[0]?.name, "onItemClick");
  });

  it("registers the lead form block material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "LeadFormBlock");

    assert.ok(material);
    assert.equal(material.manifest.title, "留资表单");
    assert.equal(material.manifest.category, "form");
    assert.equal(material.manifest.defaultProps.submitText, "提交预约");
    assert.equal(material.manifest.propsSchema.showAgreement.setter, "switch");
    assert.equal(material.manifest.propsSchema.quantityMax.setter, "number");
    assert.equal(material.manifest.events?.[0]?.name, "onSubmit");
  });

  it("registers the tabs block material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "TabsBlock");

    assert.ok(material);
    assert.equal(material.manifest.title, "标签内容切换");
    assert.equal(material.manifest.category, "content");
    assert.equal(material.manifest.defaultProps.title, "活动信息");
    assert.equal(material.manifest.propsSchema.items.setter, "textarea");
    assert.equal(material.manifest.propsSchema.accentColor.setter, "color");
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
