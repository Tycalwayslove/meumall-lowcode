import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ActivityRuleModal,
  BasicButton,
  BasicCard,
  BasicCarousel,
  BasicCheckbox,
  BasicImage,
  BasicInput,
  BasicRadioGroup,
  BasicSelect,
  BasicSwitch,
  BasicTag,
  BasicText,
  BasicTextarea,
  BasicVideo,
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
      ["BasicInput", "type", ["text", "tel", "email", "number"]],
      ["BasicText", "as", ["span", "p", "strong", "h1", "h2", "h3"]],
      ["BasicText", "align", ["left", "center", "right"]],
      ["DividerBlock", "lineStyle", ["solid", "dashed", "dotted"]],
      ["BasicImage", "fit", ["cover", "contain", "fill", "none", "scale-down"]],
      ["BasicTag", "tone", ["neutral", "accent", "danger", "inverse"]],
      ["BasicTag", "align", ["left", "center", "right"]],
      ["BasicCard", "fit", ["cover", "contain", "fill", "none", "scale-down"]],
      ["BasicCarousel", "fit", ["cover", "contain", "fill", "none", "scale-down"]],
      ["BasicCarousel", "indicator", ["dots", "counter", "none"]],
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
      ["BasicButton", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicTextarea", "rows", { min: 2, max: 8, step: 1, unit: undefined }],
      ["BasicTextarea", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicSelect", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicRadioGroup", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicCheckbox", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicText", "lineHeight", { min: 1, max: 2.5, step: 0.1, unit: "倍" }],
      ["DividerBlock", "thickness", { min: 0, max: 8, step: 1, unit: "px" }],
      ["BasicTag", "fontWeight", { min: 100, max: 900, step: 100, unit: undefined }],
      ["BasicCard", "buttonRadius", { min: 0, max: 999, step: 1, unit: "px" }],
      ["BasicCarousel", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicCarousel", "interval", { min: 1000, max: 10000, step: 500, unit: "ms" }],
      ["BasicVideo", "radius", { min: 0, max: 48, step: 1, unit: "px" }],
      ["BasicVideo", "titleSize", { min: 10, max: 48, step: 1, unit: "px" }],
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
      ["BasicButton", "backgroundColor"],
      ["BasicButton", "wrapperBackgroundColor"],
      ["BasicInput", "borderColor"],
      ["BasicTextarea", "borderColor"],
      ["BasicSelect", "borderColor"],
      ["BasicRadioGroup", "activeColor"],
      ["BasicSwitch", "activeColor"],
      ["BasicCheckbox", "checkedColor"],
      ["BasicText", "backgroundColor"],
      ["DividerBlock", "color"],
      ["BasicTag", "backgroundColor"],
      ["BasicCard", "accentColor"],
      ["BasicCarousel", "indicatorColor"],
      ["BasicVideo", "accentColor"],
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
    functionSourceIncludes(BasicTextarea, ["MlcTextarea", "MlcText"]);
    functionSourceIncludes(BasicSelect, ["MlcSelect", "MlcText"]);
    functionSourceIncludes(BasicRadioGroup, ["MlcRadioGroup", "MlcText"]);
    functionSourceIncludes(BasicSwitch, ["MlcSwitch", "MlcText"]);
    functionSourceIncludes(BasicCheckbox, ["MlcCheckbox", "MlcText"]);
    functionSourceIncludes(BasicText, ["MlcText"]);
    functionSourceIncludes(DividerBlock, ["MlcDivider"]);
    functionSourceIncludes(BasicImage, ["MlcImage"]);
    functionSourceIncludes(BasicTag, ["MlcTag"]);
    functionSourceIncludes(BasicCard, ["MlcImage", "MlcTag", "MlcText", "MlcButton"]);
    functionSourceIncludes(BasicCarousel, ["MlcImage", "MlcTag", "MlcText"]);
    functionSourceIncludes(BasicVideo, ["MlcImage", "MlcTag", "MlcText"]);
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
