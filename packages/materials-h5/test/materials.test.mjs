import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ActivityHero,
  ActivityRuleModal,
  BasicAccordion,
  BasicAlert,
  BasicButton,
  BasicCard,
  BasicCarousel,
  BasicCheckbox,
  BasicForm,
  BasicImage,
  BasicInput,
  BasicLink,
  BasicList,
  BasicModal,
  BasicPrice,
  BasicRadioGroup,
  BasicSelect,
  BasicStepper,
  BasicSwitch,
  BasicTag,
  BasicText,
  BasicTimeline,
  BasicTextarea,
  BasicVideo,
  BrandFeatureSection,
  CouponBundle,
  CouponSection,
  CountdownTimer,
  DividerBlock,
  FlashSaleList,
  FloorAnchorNav,
  GridContainer,
  h5Materials,
  LeadFormBlock,
  LiveEntry,
  NavGrid,
  NoticeBar,
  ProductList,
  ProductRankList,
  RichTextBlock,
  SectionContainer,
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

function findMaterial(materials, componentName) {
  return materials.find((material) => material.manifest.componentName === componentName);
}

function optionValues(propSchema) {
  return (propSchema.options ?? []).map((option) => option.value);
}

function numberMeta(propSchema) {
  return {
    min: propSchema?.min,
    max: propSchema?.max,
    step: propSchema?.step,
    unit: propSchema?.unit,
  };
}

function swatches(propSchema) {
  return propSchema?.swatches ?? [];
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

  it("keeps generic material enum props selectable and aligned", () => {
    const enumProps = [
      ["BasicButton", "variant", ["solid", "outline", "ghost"]],
      ["BasicButton", "size", ["sm", "md", "lg"]],
      ["BasicLink", "variant", ["plain", "bar", "card"]],
      ["BasicAccordion", "mode", ["single", "multiple"]],
      ["BasicAccordion", "icon", ["chevron", "plus", "none"]],
      ["BasicAlert", "tone", ["info", "success", "warning", "danger", "neutral"]],
      ["BasicAlert", "variant", ["soft", "outline", "solid"]],
      ["BasicAlert", "actionAlign", ["left", "center", "right"]],
      ["BasicInput", "type", ["text", "tel", "email", "number"]],
      ["BasicText", "as", ["span", "p", "strong", "h1", "h2", "h3"]],
      ["BasicText", "align", ["left", "center", "right"]],
      ["BasicPrice", "align", ["left", "center", "right"]],
      ["DividerBlock", "lineStyle", ["solid", "dashed", "dotted"]],
      ["BasicImage", "fit", ["cover", "contain", "fill", "none", "scale-down"]],
      ["BasicTag", "tone", ["neutral", "accent", "danger", "inverse"]],
      ["BasicTag", "align", ["left", "center", "right"]],
      ["BasicCard", "fit", ["cover", "contain", "fill", "none", "scale-down"]],
      ["BasicCarousel", "fit", ["cover", "contain", "fill", "none", "scale-down"]],
      ["BasicCarousel", "indicator", ["dots", "counter", "none"]],
      ["BasicList", "marker", ["dot", "number", "badge", "none"]],
      ["BasicTimeline", "marker", ["dot", "number", "badge"]],
      ["BasicModal", "placement", ["center", "bottom"]],
      ["SectionTitle", "align", ["left", "center", "right"]],
    ];

    for (const [componentName, propName, values] of enumProps) {
      const reactProp = findMaterial(h5Materials, componentName)?.manifest.propsSchema[propName];
      const vueProp = findMaterial(h5VueMaterials, componentName)?.manifest.propsSchema[propName];

      assert.equal(reactProp?.setter, "select", `${componentName}.${propName} should use select in React manifest`);
      assert.equal(vueProp?.setter, "select", `${componentName}.${propName} should use select in Vue manifest`);
      assert.deepEqual(optionValues(reactProp), values);
      assert.deepEqual(optionValues(vueProp), values);
    }
  });

  it("keeps generic material number prop constraints aligned", () => {
    const numberProps = [
      ["SectionContainer", "padding", { min: 0, max: 80, step: 1, unit: "px" }],
      ["SectionContainer", "borderWidth", { min: 0, max: 8, step: 1, unit: "px" }],
      ["GridContainer", "columns", { min: 2, max: 3, step: 1, unit: undefined }],
      ["GridContainer", "gap", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicForm", "padding", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicForm", "gap", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicForm", "buttonRadius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicList", "padding", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicList", "itemPadding", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicList", "gap", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicList", "markerRadius", { min: 0, max: 999, step: 1, unit: "px" }],
      ["BasicAccordion", "padding", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicAccordion", "itemPadding", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicAccordion", "gap", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicAccordion", "badgeRadius", { min: 0, max: 999, step: 1, unit: "px" }],
      ["BasicTimeline", "padding", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicTimeline", "itemPadding", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicTimeline", "gap", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicTimeline", "markerRadius", { min: 0, max: 999, step: 1, unit: "px" }],
      ["BasicAlert", "padding", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicAlert", "gap", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicAlert", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicAlert", "badgeRadius", { min: 0, max: 999, step: 1, unit: "px" }],
      ["BasicAlert", "actionRadius", { min: 0, max: 999, step: 1, unit: "px" }],
      ["BasicAlert", "titleSize", { min: 10, max: 48, step: 1, unit: "px" }],
      ["BasicLink", "padding", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicLink", "gap", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicLink", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicLink", "prefixRadius", { min: 0, max: 999, step: 1, unit: "px" }],
      ["BasicLink", "fontSize", { min: 10, max: 48, step: 1, unit: "px" }],
      ["BasicButton", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicTextarea", "rows", { min: 2, max: 8, step: 1, unit: undefined }],
      ["BasicTextarea", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicSelect", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicRadioGroup", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicStepper", "defaultValue", { min: 0, max: 999, step: 1, unit: undefined }],
      ["BasicStepper", "step", { min: 1, max: 20, step: 1, unit: undefined }],
      ["BasicStepper", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicCheckbox", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicText", "lineHeight", { min: 1, max: 2.5, step: 0.1, unit: "倍" }],
      ["BasicPrice", "size", { min: 10, max: 48, step: 1, unit: "px" }],
      ["DividerBlock", "thickness", { min: 0, max: 8, step: 1, unit: "px" }],
      ["BasicTag", "fontWeight", { min: 100, max: 900, step: 100, unit: undefined }],
      ["BasicCard", "buttonRadius", { min: 0, max: 999, step: 1, unit: "px" }],
      ["BasicCarousel", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicCarousel", "interval", { min: 1000, max: 10000, step: 500, unit: "ms" }],
      ["BasicVideo", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicVideo", "titleSize", { min: 10, max: 48, step: 1, unit: "px" }],
      ["BasicModal", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicModal", "paddingY", { min: 0, max: 80, step: 1, unit: "px" }],
      ["BasicModal", "contentPadding", { min: 0, max: 80, step: 1, unit: "px" }],
      ["ActivityHero", "titleSize", { min: 10, max: 48, step: 1, unit: "px" }],
      ["ActivityHero", "imageRadius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["ActivityHero", "paddingY", { min: 0, max: 80, step: 1, unit: "px" }],
      ["ActivityHero", "titleLineHeight", { min: 1, max: 2.5, step: 0.1, unit: "倍" }],
      ["ActivityHero", "subtitleLineHeight", { min: 1, max: 2.5, step: 0.1, unit: "倍" }],
      ["NoticeBar", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["NoticeBar", "paddingY", { min: 0, max: 80, step: 1, unit: "px" }],
      ["RichTextBlock", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["RichTextBlock", "padding", { min: 0, max: 80, step: 1, unit: "px" }],
      ["RichTextBlock", "fontSize", { min: 10, max: 48, step: 1, unit: "px" }],
      ["RichTextBlock", "lineHeight", { min: 1, max: 2.5, step: 0.1, unit: "倍" }],
      ["ProductList", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["ProductList", "imageRadius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["ProductList", "paddingY", { min: 0, max: 80, step: 1, unit: "px" }],
      ["SectionTitle", "titleSize", { min: 10, max: 48, step: 1, unit: "px" }],
      ["ImageCardGrid", "columns", { min: 1, max: 3, step: 1, unit: undefined }],
    ];

    for (const [componentName, propName, meta] of numberProps) {
      const reactProp = findMaterial(h5Materials, componentName)?.manifest.propsSchema[propName];
      const vueProp = findMaterial(h5VueMaterials, componentName)?.manifest.propsSchema[propName];

      assert.equal(reactProp?.setter, "number", `${componentName}.${propName} should use number in React manifest`);
      assert.equal(vueProp?.setter, "number", `${componentName}.${propName} should use number in Vue manifest`);
      assert.deepEqual(numberMeta(reactProp), meta);
      assert.deepEqual(numberMeta(vueProp), meta);
    }
  });

  it("keeps generic material color swatches aligned", () => {
    const colorProps = [
      ["SectionContainer", "backgroundColor"],
      ["SectionContainer", "borderColor"],
      ["SectionContainer", "titleColor"],
      ["SectionContainer", "subtitleColor"],
      ["GridContainer", "backgroundColor"],
      ["GridContainer", "borderColor"],
      ["GridContainer", "titleColor"],
      ["GridContainer", "subtitleColor"],
      ["BasicForm", "backgroundColor"],
      ["BasicForm", "cardBackgroundColor"],
      ["BasicForm", "titleColor"],
      ["BasicForm", "buttonColor"],
      ["BasicList", "backgroundColor"],
      ["BasicList", "cardBackgroundColor"],
      ["BasicList", "itemBackgroundColor"],
      ["BasicList", "itemTitleColor"],
      ["BasicList", "markerColor"],
      ["BasicAccordion", "backgroundColor"],
      ["BasicAccordion", "cardBackgroundColor"],
      ["BasicAccordion", "itemBackgroundColor"],
      ["BasicAccordion", "itemTitleColor"],
      ["BasicAccordion", "contentColor"],
      ["BasicAccordion", "badgeColor"],
      ["BasicAccordion", "iconColor"],
      ["BasicTimeline", "backgroundColor"],
      ["BasicTimeline", "cardBackgroundColor"],
      ["BasicTimeline", "itemBackgroundColor"],
      ["BasicTimeline", "itemTitleColor"],
      ["BasicTimeline", "markerColor"],
      ["BasicTimeline", "lineColor"],
      ["BasicTimeline", "timeColor"],
      ["BasicAlert", "backgroundColor"],
      ["BasicAlert", "titleColor"],
      ["BasicAlert", "contentColor"],
      ["BasicAlert", "accentColor"],
      ["BasicAlert", "borderColor"],
      ["BasicAlert", "actionBackgroundColor"],
      ["BasicLink", "backgroundColor"],
      ["BasicLink", "textColor"],
      ["BasicLink", "subtitleColor"],
      ["BasicLink", "prefixColor"],
      ["BasicLink", "arrowColor"],
      ["BasicButton", "backgroundColor"],
      ["BasicButton", "wrapperBackgroundColor"],
      ["BasicInput", "borderColor"],
      ["BasicTextarea", "borderColor"],
      ["BasicSelect", "borderColor"],
      ["BasicRadioGroup", "activeColor"],
      ["BasicStepper", "accentColor"],
      ["BasicSwitch", "activeColor"],
      ["BasicCheckbox", "checkedColor"],
      ["BasicText", "backgroundColor"],
      ["BasicPrice", "color"],
      ["BasicPrice", "wrapperBackgroundColor"],
      ["DividerBlock", "color"],
      ["BasicTag", "backgroundColor"],
      ["BasicCard", "accentColor"],
      ["BasicCarousel", "indicatorColor"],
      ["BasicVideo", "accentColor"],
      ["BasicModal", "buttonColor"],
      ["BasicModal", "modalBackgroundColor"],
      ["ActivityHero", "backgroundColor"],
      ["ActivityHero", "textColor"],
      ["NoticeBar", "borderColor"],
      ["NoticeBar", "labelBackgroundColor"],
      ["RichTextBlock", "backgroundColor"],
      ["RichTextBlock", "borderColor"],
      ["ProductList", "cardBackgroundColor"],
      ["ProductList", "priceColor"],
      ["SectionTitle", "accentColor"],
      ["ImageCardGrid", "cardBackgroundColor"],
    ];

    for (const [componentName, propName] of colorProps) {
      const reactProp = findMaterial(h5Materials, componentName)?.manifest.propsSchema[propName];
      const vueProp = findMaterial(h5VueMaterials, componentName)?.manifest.propsSchema[propName];

      assert.equal(reactProp?.setter, "color", `${componentName}.${propName} should use color in React manifest`);
      assert.equal(vueProp?.setter, "color", `${componentName}.${propName} should use color in Vue manifest`);
      assert.deepEqual(swatches(reactProp), swatches(vueProp));
      assert.equal(swatches(reactProp).includes("#111827"), true);
      assert.equal(swatches(reactProp).includes("transparent"), true);
    }
  });

  it("keeps generic material image props using asset picker setters", () => {
    const imageProps = [
      ["BasicImage", "imageUrl"],
      ["BasicCard", "imageUrl"],
      ["BasicVideo", "posterUrl"],
      ["ActivityHero", "imageUrl"],
      ["BrandFeatureSection", "coverImageUrl"],
      ["LiveEntry", "coverImageUrl"],
    ];

    for (const [componentName, propName] of imageProps) {
      const reactProp = findMaterial(h5Materials, componentName)?.manifest.propsSchema[propName];
      const vueProp = findMaterial(h5VueMaterials, componentName)?.manifest.propsSchema[propName];

      assert.equal(reactProp?.setter, "image", `${componentName}.${propName} should use image in React manifest`);
      assert.equal(vueProp?.setter, "image", `${componentName}.${propName} should use image in Vue manifest`);
      assert.equal(reactProp?.type, "string");
      assert.equal(vueProp?.type, "string");
    }
  });

  it("keeps generic material video props using video asset picker setters", () => {
    const reactProp = findMaterial(h5Materials, "BasicVideo")?.manifest.propsSchema.videoUrl;
    const vueProp = findMaterial(h5VueMaterials, "BasicVideo")?.manifest.propsSchema.videoUrl;

    assert.equal(reactProp?.setter, "video");
    assert.equal(vueProp?.setter, "video");
    assert.equal(reactProp?.type, "string");
    assert.equal(vueProp?.type, "string");
  });

  it("keeps runtime primitives out of material registries", () => {
    const primitiveNames = [
      "MlcButton",
      "MlcImage",
      "MlcTag",
      "MlcText",
      "MlcPrice",
      "MlcInput",
      "MlcSelect",
      "MlcRadioGroup",
      "MlcTextarea",
      "MlcSwitch",
      "MlcCheckbox",
      "MlcStepper",
      "MlcOverlay",
      "MlcModal",
      "MlcCountdownText",
      "MlcTabs",
      "MlcSpacer",
      "MlcDivider",
      "MlcNoticeBar",
      "MlcRichText",
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
    const activityHeroTypes = elementTypeNames(ActivityHero({ props: { imageUrl: "https://example.com/hero.jpg" }, node: baseNode }));
    const productListTypes = elementTypeNames(
      ProductList({
        props: {
          items: [{ id: "sku_1", title: "商品", priceText: "¥99", imageUrl: "https://example.com/sku.jpg" }],
        },
        node: baseNode,
      }),
    );
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
    assert.equal(activityHeroTypes.has("MlcImage"), true);
    assert.equal(activityHeroTypes.has("MlcText"), true);
    assert.equal(productListTypes.has("MlcButton"), true);
    assert.equal(productListTypes.has("MlcImage"), true);
    assert.equal(productListTypes.has("MlcText"), true);
    assert.equal(productListTypes.has("MlcPrice"), true);
    functionSourceIncludes(ActivityRuleModal, ["MlcButton", "MlcModal", "MlcText"]);
    assert.equal(countdownTypes.has("MlcCountdownText"), true);
    assert.equal(navGridTypes.has("MlcButton"), true);
    assert.equal(navGridTypes.has("MlcText"), true);
    assert.equal(floorAnchorTypes.has("MlcButton"), true);
    assert.equal(floorAnchorTypes.has("MlcText"), true);
    functionSourceIncludes(TabsBlock, ["MlcTabs", "MlcTag", "MlcText"]);
    functionSourceIncludes(SpacerBlock, ["MlcSpacer"]);
    functionSourceIncludes(BasicButton, ["MlcButton"]);
    functionSourceIncludes(BasicLink, ["MlcText", "MlcTag"]);
    functionSourceIncludes(BasicInput, ["MlcInput", "MlcText"]);
    functionSourceIncludes(BasicTextarea, ["MlcTextarea", "MlcText"]);
    functionSourceIncludes(BasicSelect, ["MlcSelect", "MlcText"]);
    functionSourceIncludes(BasicRadioGroup, ["MlcRadioGroup", "MlcText"]);
    functionSourceIncludes(BasicStepper, ["MlcStepper", "MlcText"]);
    functionSourceIncludes(BasicSwitch, ["MlcSwitch", "MlcText"]);
    functionSourceIncludes(BasicCheckbox, ["MlcCheckbox", "MlcText"]);
    functionSourceIncludes(BasicText, ["MlcText"]);
    functionSourceIncludes(BasicPrice, ["MlcPrice"]);
    functionSourceIncludes(DividerBlock, ["MlcDivider"]);
    functionSourceIncludes(BasicImage, ["MlcImage"]);
    functionSourceIncludes(BasicTag, ["MlcTag"]);
    functionSourceIncludes(BasicCard, ["MlcImage", "MlcTag", "MlcText", "MlcButton"]);
    functionSourceIncludes(BasicCarousel, ["MlcImage", "MlcTag", "MlcText"]);
    functionSourceIncludes(BasicVideo, ["MlcImage", "MlcTag", "MlcText"]);
    functionSourceIncludes(BasicModal, ["MlcButton", "MlcModal", "MlcText"]);
    functionSourceIncludes(NoticeBar, ["MlcNoticeBar"]);
    functionSourceIncludes(RichTextBlock, ["MlcRichText"]);
    functionSourceIncludes(SectionContainer, ["MlcText"]);
    functionSourceIncludes(GridContainer, ["MlcText"]);
    functionSourceIncludes(BasicForm, ["MlcButton", "MlcText"]);
    functionSourceIncludes(BasicList, ["MlcText", "MlcTag"]);
    functionSourceIncludes(BasicAccordion, ["MlcText", "MlcTag"]);
    functionSourceIncludes(BasicTimeline, ["MlcText", "MlcTag"]);
    functionSourceIncludes(BasicAlert, ["MlcButton", "MlcText", "MlcTag"]);
    assert.equal(flashSaleTypes.has("MlcButton"), true);
    assert.equal(flashSaleTypes.has("MlcImage"), true);
    assert.equal(flashSaleTypes.has("MlcTag"), true);
    assert.equal(flashSaleTypes.has("MlcText"), true);
    assert.equal(flashSaleTypes.has("MlcPrice"), true);
    functionSourceIncludes(LeadFormBlock, ["MlcInput", "MlcTextarea", "MlcSwitch", "MlcStepper", "MlcButton", "MlcText"]);
  });

  it("registers the basic video material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicVideo");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础视频");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.controls, true);
    assert.equal(material.manifest.defaultProps.muted, true);
    assert.equal(material.manifest.propsSchema.videoUrl.setter, "video");
    assert.equal(material.manifest.propsSchema.posterUrl.setter, "image");
    assert.equal(material.manifest.propsSchema.autoPlay.setter, "switch");
    assert.equal(material.manifest.events?.[0]?.name, "onPlay");
  });

  it("registers the basic modal material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicModal");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础弹窗");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.defaultOpen, false);
    assert.equal(material.manifest.defaultProps.closeOnBackdrop, true);
    assert.equal(material.manifest.propsSchema.placement.setter, "select");
    assert.equal(material.manifest.propsSchema.content.setter, "textarea");
    assert.equal(material.manifest.propsSchema.defaultOpen.setter, "switch");
    assert.equal(material.manifest.propsSchema.buttonColor.setter, "color");
    assert.equal(material.manifest.propsSchema.radius.setter, "number");
    assert.equal(material.manifest.events?.[0]?.name, "onOpen");
  });

  it("registers the enhanced notice bar material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "NoticeBar");

    assert.ok(material);
    assert.equal(material.manifest.title, "公告条");
    assert.equal(material.manifest.category, "marketing");
    assert.equal(material.manifest.defaultProps.showIcon, true);
    assert.equal(material.manifest.defaultProps.iconText, "!");
    assert.equal(material.manifest.defaultProps.label, "公告");
    assert.equal(material.manifest.propsSchema.showIcon.setter, "switch");
    assert.equal(material.manifest.propsSchema.content.setter, "textarea");
    assert.equal(material.manifest.propsSchema.labelBackgroundColor.setter, "color");
    assert.equal(material.manifest.propsSchema.borderColor.setter, "color");
    assert.equal(material.manifest.propsSchema.radius.setter, "number");
    assert.equal(material.manifest.propsSchema.paddingY.setter, "number");
  });

  it("registers the enhanced rich text material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "RichTextBlock");

    assert.ok(material);
    assert.equal(material.manifest.title, "富文本");
    assert.equal(material.manifest.category, "content");
    assert.equal(material.manifest.defaultProps.html, "<p>请输入富文本内容</p>");
    assert.equal(material.manifest.defaultProps.padding, 16);
    assert.equal(material.manifest.propsSchema.html.setter, "richText");
    assert.equal(material.manifest.propsSchema.backgroundColor.setter, "color");
    assert.equal(material.manifest.propsSchema.borderColor.setter, "color");
    assert.equal(material.manifest.propsSchema.radius.setter, "number");
    assert.equal(material.manifest.propsSchema.padding.setter, "number");
    assert.equal(material.manifest.propsSchema.fontSize.setter, "number");
    assert.equal(material.manifest.propsSchema.lineHeight.setter, "number");
  });

  it("registers the enhanced product list material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "ProductList");

    assert.ok(material);
    assert.equal(material.manifest.title, "商品列表");
    assert.equal(material.manifest.category, "commerce");
    assert.equal(material.manifest.defaultProps.items.length, 2);
    assert.equal(material.manifest.defaultProps.radius, 10);
    assert.equal(material.manifest.propsSchema.items.setter, "dataSourceSelector");
    assert.equal(material.manifest.propsSchema.cardBackgroundColor.setter, "color");
    assert.equal(material.manifest.propsSchema.priceColor.setter, "color");
    assert.equal(material.manifest.propsSchema.radius.setter, "number");
    assert.equal(material.manifest.propsSchema.imageRadius.setter, "number");
    assert.equal(material.manifest.propsSchema.paddingY.setter, "number");
    assert.equal(material.manifest.dataSourceSlots?.[0]?.name, "items");
    assert.equal(material.manifest.events?.[0]?.name, "onProductClick");
  });

  it("registers the enhanced activity hero material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "ActivityHero");

    assert.ok(material);
    assert.equal(material.manifest.title, "活动头图");
    assert.equal(material.manifest.category, "marketing");
    assert.equal(material.manifest.defaultProps.textColor, "#64748b");
    assert.equal(material.manifest.defaultProps.imageRadius, 8);
    assert.equal(material.manifest.defaultProps.paddingY, 18);
    assert.equal(material.manifest.propsSchema.imageUrl.setter, "image");
    assert.equal(material.manifest.propsSchema.backgroundColor.setter, "color");
    assert.equal(material.manifest.propsSchema.textColor.setter, "color");
    assert.equal(material.manifest.propsSchema.titleSize.setter, "number");
    assert.equal(material.manifest.propsSchema.imageRadius.setter, "number");
    assert.equal(material.manifest.propsSchema.paddingY.setter, "number");
    assert.equal(material.manifest.propsSchema.titleLineHeight.setter, "number");
    assert.equal(material.manifest.propsSchema.subtitleLineHeight.setter, "number");
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

  it("registers the enhanced section container material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "SectionContainer");

    assert.ok(material);
    assert.equal(material.manifest.title, "容器区块");
    assert.equal(material.manifest.category, "layout");
    assert.equal(material.manifest.defaultProps.gap, 10);
    assert.equal(material.manifest.defaultProps.shadow, false);
    assert.equal(material.manifest.propsSchema.gap.setter, "number");
    assert.equal(material.manifest.propsSchema.borderColor.setter, "color");
    assert.equal(material.manifest.propsSchema.shadow.setter, "switch");
    assert.equal(material.manifest.propsSchema.emptyText.setter, "input");
  });

  it("registers the grid container material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "GridContainer");

    assert.ok(material);
    assert.equal(material.manifest.title, "网格容器");
    assert.equal(material.manifest.category, "layout");
    assert.equal(material.manifest.defaultProps.columns, 2);
    assert.equal(material.manifest.defaultProps.gap, 10);
    assert.equal(material.manifest.propsSchema.columns.setter, "number");
    assert.equal(material.manifest.propsSchema.gap.setter, "number");
    assert.equal(material.manifest.propsSchema.backgroundColor.setter, "color");
    assert.equal(material.manifest.propsSchema.shadow.setter, "switch");
    assert.equal(material.manifest.propsSchema.emptyText.setter, "input");
  });

  it("registers the basic form material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicForm");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础表单");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.submitText, "提交");
    assert.equal(material.manifest.defaultProps.showSuccessMessage, true);
    assert.equal(material.manifest.propsSchema.description.setter, "textarea");
    assert.equal(material.manifest.propsSchema.showSuccessMessage.setter, "switch");
    assert.equal(material.manifest.propsSchema.buttonColor.setter, "color");
    assert.equal(material.manifest.propsSchema.gap.setter, "number");
    assert.equal(material.manifest.events?.[0]?.name, "onSubmit");
  });

  it("registers the basic list material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicList");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础列表");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.marker, "dot");
    assert.equal(material.manifest.defaultProps.items.length, 3);
    assert.equal(material.manifest.propsSchema.items.setter, "textarea");
    assert.equal(material.manifest.propsSchema.marker.setter, "select");
    assert.equal(material.manifest.propsSchema.itemPadding.setter, "number");
    assert.equal(material.manifest.propsSchema.markerColor.setter, "color");
    assert.equal(material.manifest.events?.[0]?.name, "onItemClick");
  });

  it("renders basic list items and item click payloads in React H5", () => {
    const clicks = [];
    const element = BasicList({
      node: { id: "list_1", componentName: "BasicList", props: {} },
      props: {
        title: "列表测试",
        marker: "badge",
        items: [
          { id: "item_1", title: "第一项", description: "第一条说明", badgeText: "A", metaText: "已读" },
          { id: "item_2", title: "第二项", description: "第二条说明", badgeText: "B", metaText: "未读" },
        ],
        onItemClick: (payload) => clicks.push(payload),
      },
    });

    assert.equal(element.props.className, "mlc-material mlc-basic-list");
    const card = element.props.children;
    const itemsWrapper = card.props.children.find((child) => child?.props?.className === "mlc-basic-list__items");
    assert.ok(itemsWrapper);
    assert.equal(itemsWrapper.props.children.length, 2);
    assert.equal(itemsWrapper.props.children[0].props.role, "button");
    assert.equal(itemsWrapper.props.children[0].props.children[0].type.name, "MlcTag");

    itemsWrapper.props.children[1].props.onClick();
    assert.equal(clicks.length, 1);
    assert.equal(clicks[0].index, 1);
    assert.equal(clicks[0].item.title, "第二项");
  });

  it("registers the basic accordion material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicAccordion");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础折叠面板");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.mode, "single");
    assert.equal(material.manifest.defaultProps.icon, "chevron");
    assert.equal(material.manifest.defaultProps.defaultOpenFirst, true);
    assert.equal(material.manifest.defaultProps.items.length, 3);
    assert.equal(material.manifest.propsSchema.items.setter, "textarea");
    assert.equal(material.manifest.propsSchema.mode.setter, "select");
    assert.equal(material.manifest.propsSchema.icon.setter, "select");
    assert.equal(material.manifest.propsSchema.defaultOpenFirst.setter, "switch");
    assert.equal(material.manifest.propsSchema.defaultOpenIds.setter, "textarea");
    assert.equal(material.manifest.propsSchema.itemPadding.setter, "number");
    assert.equal(material.manifest.propsSchema.badgeColor.setter, "color");
    assert.equal(material.manifest.events?.[0]?.name, "onItemToggle");
  });

  it("registers the basic timeline material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicTimeline");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础时间线");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.marker, "dot");
    assert.equal(material.manifest.defaultProps.showTime, true);
    assert.equal(material.manifest.defaultProps.showConnector, true);
    assert.equal(material.manifest.defaultProps.items.length, 3);
    assert.equal(material.manifest.propsSchema.items.setter, "textarea");
    assert.equal(material.manifest.propsSchema.marker.setter, "select");
    assert.equal(material.manifest.propsSchema.showTime.setter, "switch");
    assert.equal(material.manifest.propsSchema.showConnector.setter, "switch");
    assert.equal(material.manifest.propsSchema.itemPadding.setter, "number");
    assert.equal(material.manifest.propsSchema.markerColor.setter, "color");
    assert.equal(material.manifest.events?.[0]?.name, "onItemClick");
  });

  it("renders basic timeline items and item click payloads in React H5", () => {
    const clicks = [];
    const element = BasicTimeline({
      node: { id: "timeline_1", componentName: "BasicTimeline", props: {} },
      props: {
        title: "时间线测试",
        marker: "badge",
        items: [
          { id: "timeline_item_1", title: "第一步", description: "第一步说明", timeText: "阶段一", badgeText: "A", status: "done" },
          { id: "timeline_item_2", title: "第二步", description: "第二步说明", timeText: "阶段二", badgeText: "B", status: "active" },
        ],
        onItemClick: (payload) => clicks.push(payload),
      },
    });

    assert.equal(element.props.className, "mlc-material mlc-basic-timeline");
    const card = element.props.children;
    const itemsWrapper = card.props.children.find((child) => child?.props?.className === "mlc-basic-timeline__items");
    assert.ok(itemsWrapper);
    assert.equal(itemsWrapper.type, "ol");
    assert.equal(itemsWrapper.props.children.length, 2);
    assert.equal(itemsWrapper.props.children[0].props.className.includes("mlc-basic-timeline__item--done"), true);
    assert.equal(itemsWrapper.props.children[0].props.children[0].props.children[0].type.name, "MlcTag");
    assert.equal(itemsWrapper.props.children[1].props.children[1].type, "button");

    itemsWrapper.props.children[1].props.children[1].props.onClick();
    assert.equal(clicks.length, 1);
    assert.equal(clicks[0].index, 1);
    assert.equal(clicks[0].item.title, "第二步");
  });

  it("registers the basic alert material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicAlert");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础提示");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.tone, "info");
    assert.equal(material.manifest.defaultProps.variant, "soft");
    assert.equal(material.manifest.defaultProps.showIcon, true);
    assert.equal(material.manifest.defaultProps.showAction, true);
    assert.equal(material.manifest.propsSchema.content.setter, "textarea");
    assert.equal(material.manifest.propsSchema.tone.setter, "select");
    assert.equal(material.manifest.propsSchema.variant.setter, "select");
    assert.equal(material.manifest.propsSchema.showIcon.setter, "switch");
    assert.equal(material.manifest.propsSchema.actionAlign.setter, "select");
    assert.equal(material.manifest.propsSchema.accentColor.setter, "color");
    assert.equal(material.manifest.propsSchema.radius.setter, "number");
    assert.equal(material.manifest.events?.[0]?.name, "onActionClick");
  });

  it("renders basic alert props and action clicks in React H5", () => {
    let clicks = 0;
    const element = BasicAlert({
      node: { id: "alert_1", componentName: "BasicAlert", props: {} },
      props: {
        title: "提示测试",
        content: "这是一条测试提示",
        badgeText: "Info",
        actionText: "知道了",
        tone: "success",
        variant: "solid",
        onActionClick: () => {
          clicks += 1;
        },
      },
    });

    assert.equal(element.props.className.includes("mlc-basic-alert--success"), true);
    assert.equal(element.props.className.includes("mlc-basic-alert--solid"), true);
    const card = element.props.children;
    assert.equal(card.props.role, "note");
    const contentWrapper = card.props.children[1];
    assert.ok(contentWrapper);
    const action = contentWrapper.props.children[2];
    assert.equal(action.props.className, "mlc-basic-alert__action");
    const button = action.props.children;
    button.props.onClick();
    assert.equal(clicks, 1);
  });

  it("renders section container layout props in React H5", () => {
    const element = SectionContainer({
      node: { id: "container_1", componentName: "SectionContainer", props: {} },
      props: {
        title: "增强容器",
        subtitle: "用于组合基础物料",
        marginY: 12,
        padding: 14,
        gap: 10,
        radius: 12,
        borderColor: "#d1d5db",
        borderWidth: 1,
        shadow: true,
        titleColor: "#111827",
        subtitleColor: "#64748b",
        emptyText: "添加内容",
      },
      children: "子节点",
    });

    assert.equal(element.props.className, "mlc-material mlc-section-container");
    assert.equal(element.props.style.margin, "12px 0");
    assert.equal(element.props.style.padding, 14);
    assert.equal(element.props.style.border, "1px solid #d1d5db");
    assert.equal(element.props.style.borderRadius, 12);
    assert.equal(element.props.style.boxShadow.includes("rgba"), true);

    const body = element.props.children.find((child) => child?.props?.className === "mlc-section-container__body");
    assert.ok(body);
    assert.equal(body.props.style.gap, 10);
    assert.equal(body.props.children, "子节点");

    const title = element.props.children.find((child) => child?.props?.className === "mlc-section-container__title");
    const subtitle = element.props.children.find((child) => child?.props?.className === "mlc-section-container__subtitle");
    assert.ok(title);
    assert.ok(subtitle);
    assert.equal(title.type.name, "MlcText");
    assert.equal(subtitle.type.name, "MlcText");
  });

  it("renders grid container children in React H5", () => {
    const element = GridContainer({
      node: { id: "grid_1", componentName: "GridContainer", props: {} },
      props: {
        title: "网格测试",
        columns: 3,
        gap: 12,
        borderWidth: 1,
        borderColor: "#d1d5db",
      },
      children: ["A", "B", "C"],
    });

    assert.equal(element.props.className, "mlc-material mlc-grid-container");
    assert.equal(element.props.style.border, "1px solid #d1d5db");

    const body = element.props.children.find((child) => child?.props?.className === "mlc-grid-container__body");
    assert.ok(body);
    assert.equal(body.props.style.gridTemplateColumns, "repeat(3, minmax(0, 1fr))");
    assert.equal(body.props.style.gap, 12);
    assert.equal(body.props.children.length, 3);
  });

  it("renders section container empty state through React H5 primitives", () => {
    const element = SectionContainer({
      node: { id: "container_empty", componentName: "SectionContainer", props: {} },
      props: { emptyText: "拖入内容" },
    });

    const empty = element.props.children.find((child) => child?.props?.className === "mlc-section-container__empty");
    assert.ok(empty);
    assert.equal(empty.type.name, "MlcText");
    assert.equal(empty.props.children, "拖入内容");
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

  it("registers the basic link material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicLink");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础链接");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.text, "查看详情");
    assert.equal(material.manifest.defaultProps.variant, "bar");
    assert.equal(material.manifest.propsSchema.linkUrl.setter, "input");
    assert.equal(material.manifest.propsSchema.targetBlank.setter, "switch");
    assert.equal(material.manifest.propsSchema.variant.setter, "select");
    assert.equal(material.manifest.propsSchema.backgroundColor.setter, "color");
    assert.equal(material.manifest.propsSchema.radius.setter, "number");
    assert.equal(material.manifest.events?.[0]?.name, "onClick");
  });

  it("renders basic link props and click payloads in React H5", () => {
    const clicks = [];
    const element = BasicLink({
      node: { id: "link_1", componentName: "BasicLink", props: {} },
      props: {
        text: "链接测试",
        subtitle: "辅助说明",
        prefixText: "入口",
        linkUrl: "/test-link",
        variant: "card",
        onClick: (payload) => clicks.push(payload),
      },
    });

    assert.equal(element.props.className, "mlc-material mlc-basic-link");
    const link = element.props.children;
    assert.equal(link.type, "a");
    assert.equal(link.props.href, "/test-link");
    assert.equal(link.props.className.includes("mlc-basic-link__inner--card"), true);
    assert.equal(link.props.children[0].type.name, "MlcTag");

    link.props.onClick({ preventDefault: () => clicks.push({ prevented: true }) });
    assert.equal(clicks.length, 1);
    assert.deepEqual(clicks[0], { linkUrl: "/test-link" });
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

  it("registers the basic textarea material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicTextarea");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础多行输入");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.placeholder, "请输入多行内容");
    assert.equal(material.manifest.defaultProps.rows, 3);
    assert.equal(material.manifest.propsSchema.defaultValue.setter, "textarea");
    assert.equal(material.manifest.propsSchema.rows.setter, "number");
    assert.equal(material.manifest.propsSchema.disabled.setter, "switch");
    assert.equal(material.manifest.events?.[0]?.name, "onChange");
  });

  it("registers the basic select material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicSelect");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础选择框");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.placeholder, "请选择");
    assert.equal(material.manifest.defaultProps.options[0].value, "women");
    assert.equal(material.manifest.propsSchema.options.setter, "textarea");
    assert.equal(material.manifest.propsSchema.disabled.setter, "switch");
    assert.equal(material.manifest.events?.[0]?.name, "onChange");
  });

  it("registers the basic radio group material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicRadioGroup");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础单选组");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.defaultValue, "women");
    assert.equal(material.manifest.defaultProps.options[0].value, "women");
    assert.equal(material.manifest.propsSchema.options.setter, "textarea");
    assert.equal(material.manifest.propsSchema.disabled.setter, "switch");
    assert.equal(material.manifest.propsSchema.activeColor.setter, "color");
    assert.equal(material.manifest.propsSchema.radius.setter, "number");
    assert.equal(material.manifest.events?.[0]?.name, "onChange");
  });

  it("registers the basic stepper material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicStepper");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础步进器");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.defaultValue, 2);
    assert.equal(material.manifest.defaultProps.min, 0);
    assert.equal(material.manifest.defaultProps.max, 10);
    assert.equal(material.manifest.propsSchema.defaultValue.setter, "number");
    assert.equal(material.manifest.propsSchema.step.setter, "number");
    assert.equal(material.manifest.propsSchema.disabled.setter, "switch");
    assert.equal(material.manifest.propsSchema.accentColor.setter, "color");
    assert.equal(material.manifest.propsSchema.radius.setter, "number");
    assert.equal(material.manifest.events?.[0]?.name, "onChange");
  });

  it("registers the basic switch material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicSwitch");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础开关");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.defaultChecked, true);
    assert.equal(material.manifest.defaultProps.checkedText, "已开启");
    assert.equal(material.manifest.propsSchema.defaultChecked.setter, "switch");
    assert.equal(material.manifest.propsSchema.disabled.setter, "switch");
    assert.equal(material.manifest.propsSchema.activeColor.setter, "color");
    assert.equal(material.manifest.events?.[0]?.name, "onChange");
  });

  it("registers the basic checkbox material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicCheckbox");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础复选框");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.defaultChecked, false);
    assert.equal(material.manifest.defaultProps.label, "基础复选框");
    assert.equal(material.manifest.propsSchema.defaultChecked.setter, "switch");
    assert.equal(material.manifest.propsSchema.disabled.setter, "switch");
    assert.equal(material.manifest.propsSchema.checkedColor.setter, "color");
    assert.equal(material.manifest.propsSchema.radius.setter, "number");
    assert.equal(material.manifest.events?.[0]?.name, "onChange");
  });

  it("keeps basic form required validation props aligned", () => {
    const components = ["BasicInput", "BasicTextarea", "BasicSelect", "BasicRadioGroup", "BasicStepper", "BasicSwitch", "BasicCheckbox"];

    for (const componentName of components) {
      const reactMaterial = findMaterial(h5Materials, componentName);
      const vueMaterial = findMaterial(h5VueMaterials, componentName);

      assert.equal(reactMaterial?.manifest.defaultProps.required, false, `${componentName} React required default`);
      assert.equal(vueMaterial?.manifest.defaultProps.required, false, `${componentName} Vue required default`);
      assert.equal(reactMaterial?.manifest.propsSchema.required.setter, "switch", `${componentName} React required setter`);
      assert.equal(vueMaterial?.manifest.propsSchema.required.setter, "switch", `${componentName} Vue required setter`);
      assert.equal(reactMaterial?.manifest.propsSchema.requiredMessage.setter, "input", `${componentName} React requiredMessage setter`);
      assert.equal(vueMaterial?.manifest.propsSchema.requiredMessage.setter, "input", `${componentName} Vue requiredMessage setter`);
    }

    const reactForm = findMaterial(h5Materials, "BasicForm");
    const vueForm = findMaterial(h5VueMaterials, "BasicForm");
    assert.equal(reactForm?.manifest.propsSchema.validationErrorText.setter, "input");
    assert.equal(vueForm?.manifest.propsSchema.validationErrorText.setter, "input");
    assert.equal(reactForm?.manifest.propsSchema.errorColor.setter, "color");
    assert.equal(vueForm?.manifest.propsSchema.errorColor.setter, "color");
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

  it("registers the basic price material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicPrice");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础价格");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.amountText, "99");
    assert.equal(material.manifest.defaultProps.prefix, "¥");
    assert.equal(material.manifest.defaultProps.suffix, "起");
    assert.equal(material.manifest.propsSchema.amountText.setter, "input");
    assert.equal(material.manifest.propsSchema.align.setter, "select");
    assert.equal(material.manifest.propsSchema.size.setter, "number");
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

  it("registers the basic image material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicImage");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础图片");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.ratio, "16 / 9");
    assert.equal(material.manifest.propsSchema.imageUrl.setter, "image");
    assert.equal(material.manifest.propsSchema.backgroundColor.setter, "color");
  });

  it("registers the basic tag material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicTag");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础标签");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.text, "基础标签");
    assert.equal(material.manifest.propsSchema.textColor.setter, "color");
    assert.equal(material.manifest.propsSchema.fontSize.setter, "number");
  });

  it("registers the basic card material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicCard");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础图文卡片");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.title, "基础图文卡片");
    assert.equal(material.manifest.defaultProps.showButton, true);
    assert.equal(material.manifest.propsSchema.imageUrl.setter, "image");
    assert.equal(material.manifest.propsSchema.description.setter, "textarea");
    assert.equal(material.manifest.propsSchema.showButton.setter, "switch");
    assert.equal(material.manifest.propsSchema.shadow.setter, "switch");
    assert.equal(material.manifest.events?.[0]?.name, "onClick");
  });

  it("registers the basic carousel material", () => {
    const material = h5Materials.find((item) => item.manifest.componentName === "BasicCarousel");

    assert.ok(material);
    assert.equal(material.manifest.title, "基础图片轮播");
    assert.equal(material.manifest.category, "basic");
    assert.equal(material.manifest.defaultProps.indicator, "dots");
    assert.equal(material.manifest.defaultProps.autoPlay, true);
    assert.equal(material.manifest.propsSchema.items.setter, "textarea");
    assert.equal(material.manifest.propsSchema.autoPlay.setter, "switch");
    assert.equal(material.manifest.propsSchema.indicator.setter, "select");
    assert.equal(material.manifest.propsSchema.interval.setter, "number");
    assert.equal(material.manifest.defaultProps.items[0].imageUrl.includes("images.unsplash.com"), true);
    assert.equal(material.manifest.events?.[0]?.name, "onItemClick");
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
