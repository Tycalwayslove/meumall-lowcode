import { useEffect, useMemo, useState } from "react";
import {
  createDataSourceRegistry,
  createSafeActionExecutor,
  createSafeActionRegistry,
  loadLowcodeRuntimeSchema,
  resolveLowcodeDataSources,
  type ConfigPlatformPageRelease,
  type DataSourceResolutionRecord,
  type LowcodeConfigPlatformClient,
  type RuntimeSchemaSourceType,
} from "@meumall/lowcode-adapters";
import { createMaterialRegistry } from "@meumall/lowcode-core";
import { h5Materials } from "@meumall/lowcode-materials-h5";
import { LowcodeRenderer } from "@meumall/lowcode-renderer-h5";
import {
  createLowcodePageSchema,
  createMaterialManifest,
  validateLowcodePageSchema,
  type JsonObject,
  type JsonValue,
  type LowcodeEnvironment,
  type LowcodeDataSourceConfig,
  type LowcodePageSchema,
} from "@meumall/lowcode-schema";
import { createRuntimeConfigPlatformBinding } from "./configPlatformClient";

function BrokenBlock(): never {
  throw new Error("BrokenBlock render failed");
}

const sampleProducts = [
  {
    id: "sku_001",
    title: "轻盈通勤手提包",
    priceText: "¥199",
    originPriceText: "¥299",
    desc: "活动价",
    imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sku_002",
    title: "夏季舒适凉鞋",
    priceText: "¥129",
    originPriceText: "¥199",
    desc: "限时补贴",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sku_003",
    title: "防晒轻薄衬衫",
    priceText: "¥159",
    originPriceText: "¥239",
    desc: "热卖单品",
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80",
  },
];

const sampleStoreExperts = [
  {
    id: "store_jingan",
    typeText: "门店",
    title: "MeuMall 上海静安店",
    subtitle: "本周热卖搭配到店试穿",
    metricText: "4.9 分",
    desc: "距你 2.1km",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "expert_summer",
    typeText: "达人",
    title: "小夏的通勤穿搭",
    subtitle: "每日更新包袋和鞋履组合",
    metricText: "12.8w 粉丝",
    desc: "直播中",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  },
];

function resolveSampleProductDataSource(dataSource: LowcodeDataSourceConfig): JsonValue {
  const limit = typeof dataSource.params?.limit === "number" ? dataSource.params.limit : sampleProducts.length;
  return sampleProducts.slice(0, limit) as JsonValue;
}

const sampleSchema = createLowcodePageSchema({
  pageId: "summer-campaign-demo",
  pageVersion: "prod-20260731-demo",
  status: "published",
  title: "夏日好物节",
  pageType: "activity",
  targetPlatforms: ["h5"],
  layout: {
    safeArea: true,
    backgroundColor: "#f3f4f6",
    maxWidth: 430,
  },
  nodes: [
    {
      id: "node_hero",
      componentName: "ActivityHero",
      materialVersion: "0.1.0",
      props: {
        title: "夏日好物节",
        subtitle: "React H5 runtime 正在消费低代码 Page Schema。",
        imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
        backgroundColor: "#ffffff",
        titleColor: "#111827",
        titleSize: 24,
      },
    },
    {
      id: "node_notice",
      componentName: "NoticeBar",
      materialVersion: "0.1.0",
      props: {
        label: "公告",
        content: "活动期间下单即享限时补贴，库存有限先到先得。",
        backgroundColor: "#fffbeb",
        textColor: "#92400e",
      },
    },
    {
      id: "node_basic_button",
      componentName: "BasicButton",
      materialVersion: "0.1.0",
      props: {
        text: "基础按钮示例",
        variant: "outline",
        size: "md",
        block: true,
        backgroundColor: "#0f766e",
        textColor: "#0f766e",
        borderColor: "#0f766e",
        wrapperBackgroundColor: "#f3f4f6",
        radius: 8,
        paddingY: 10,
      },
      events: {
        onClick: { actionId: "track_basic_button_click" },
      },
    },
    {
      id: "node_basic_input",
      componentName: "BasicInput",
      materialVersion: "0.1.0",
      props: {
        label: "基础输入框示例",
        placeholder: "请输入想看的活动品类",
        helperText: "单行输入框可作为后续表单物料的基础单元。",
        type: "text",
        wrapperBackgroundColor: "#f3f4f6",
        inputBackgroundColor: "#ffffff",
        labelColor: "#111827",
        textColor: "#111827",
        helperColor: "#64748b",
        borderColor: "#d1d5db",
        radius: 8,
        paddingY: 10,
      },
      events: {
        onChange: { actionId: "track_basic_input_change" },
      },
    },
    {
      id: "node_basic_text",
      componentName: "BasicText",
      materialVersion: "0.1.0",
      props: {
        text: "基础文本示例：用于普通说明、温馨提示和活动辅助文案。",
        as: "p",
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.7,
        align: "left",
        color: "#334155",
        backgroundColor: "#f3f4f6",
        paddingY: 8,
      },
    },
    {
      id: "node_divider",
      componentName: "DividerBlock",
      materialVersion: "0.1.0",
      props: {
        color: "#cbd5e1",
        thickness: 1,
        lineStyle: "dashed",
        inset: 16,
        paddingY: 8,
        backgroundColor: "#f3f4f6",
      },
    },
    {
      id: "node_basic_image",
      componentName: "BasicImage",
      materialVersion: "0.1.0",
      props: {
        imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
        alt: "基础图片示例",
        ratio: "16 / 9",
        fit: "cover",
        radius: 10,
        paddingY: 8,
        backgroundColor: "#f3f4f6",
      },
    },
    {
      id: "node_basic_tag",
      componentName: "BasicTag",
      materialVersion: "0.1.0",
      props: {
        text: "基础标签示例",
        tone: "accent",
        align: "left",
        textColor: "#0f766e",
        backgroundColor: "rgba(15, 118, 110, 0.1)",
        wrapperBackgroundColor: "#f3f4f6",
        radius: 999,
        fontSize: 12,
        fontWeight: 800,
        paddingY: 8,
      },
    },
    {
      id: "node_rules",
      componentName: "ActivityRuleModal",
      materialVersion: "0.1.0",
      props: {
        title: "活动规则",
        summary: "查看补贴时间、参与条件和优惠说明。",
        buttonText: "查看规则",
        modalTitle: "夏日好物节规则",
        primaryColor: "#111827",
        backgroundColor: "#ffffff",
        textColor: "#374151",
        rules: [
          { title: "活动时间", content: "2026-07-31 10:00 至 2026-08-07 23:59。" },
          { title: "参与条件", content: "活动商品数量有限，同一用户限享一次平台补贴。" },
          { title: "优惠说明", content: "优惠不可叠加，最终以结算页展示金额为准。" },
        ],
      },
      events: {
        onOpen: { actionId: "track_rule_open" },
      },
    },
    {
      id: "node_countdown",
      componentName: "CountdownTimer",
      materialVersion: "0.1.0",
      props: {
        title: "大促限时抢",
        subtitle: "距离本轮活动结束",
        days: "00",
        hours: "08",
        minutes: "30",
        seconds: "00",
        backgroundColor: "#dc2626",
        textColor: "#ffffff",
        numberColor: "#dc2626",
      },
    },
    {
      id: "node_live",
      componentName: "LiveEntry",
      materialVersion: "0.1.0",
      props: {
        title: "今晚 8 点直播专场",
        subtitle: "主播讲解夏日搭配和爆品清单，直播间同步发放限时券。",
        statusText: "直播中",
        viewerText: "12.8w 人正在看",
        buttonText: "进入直播",
        coverImageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=300&q=80",
        linkUrl: "",
        backgroundColor: "#111827",
        titleColor: "#ffffff",
        textColor: "#d1d5db",
        accentColor: "#ef4444",
      },
      events: {
        onEnter: { actionId: "track_live_enter" },
      },
    },
    {
      id: "node_floor_anchor",
      componentName: "FloorAnchorNav",
      materialVersion: "0.1.0",
      props: {
        title: "",
        sticky: true,
        smooth: true,
        offsetTop: 0,
        radius: 999,
        backgroundColor: "#ffffff",
        itemBackgroundColor: "#f3f4f6",
        textColor: "#111827",
        items: [
          { id: "anchor_coupon", title: "领券", targetId: "node_coupon" },
          { id: "anchor_live", title: "直播", targetId: "node_live" },
          { id: "anchor_brand", title: "品牌", targetId: "node_brand" },
          { id: "anchor_rank", title: "榜单", targetId: "node_rank" },
          { id: "anchor_recommend", title: "推荐", targetId: "node_store_expert" },
          { id: "anchor_flash", title: "限时秒杀", targetId: "node_flash_sale" },
          { id: "anchor_pick", title: "精选专区", targetId: "node_container" },
        ],
      },
      events: {
        onAnchorClick: { actionId: "track_anchor_click" },
      },
    },
    {
      id: "node_nav",
      componentName: "NavGrid",
      materialVersion: "0.1.0",
      props: {
        columns: 4,
        backgroundColor: "#ffffff",
        itemBackgroundColor: "#f8fafc",
        textColor: "#111827",
        radius: 8,
        items: [
          { id: "nav_coupon", title: "领券", subtitle: "新人礼" },
          { id: "nav_flash", title: "秒杀", subtitle: "限时抢" },
          { id: "nav_store", title: "门店", subtitle: "附近热推" },
          { id: "nav_new", title: "上新", subtitle: "新品" },
        ],
      },
    },
    {
      id: "node_section_title_pick",
      componentName: "SectionTitle",
      materialVersion: "0.1.0",
      props: {
        markerText: "今日主推",
        title: "先领券，再逛精选好物",
        subtitle: "用清晰楼层标题把优惠、品牌、榜单和推荐模块串起来。",
        align: "left",
        backgroundColor: "#f3f4f6",
        titleColor: "#111827",
        textColor: "#64748b",
        accentColor: "#0f766e",
        titleSize: 20,
        paddingY: 18,
      },
    },
    {
      id: "node_image_card_grid",
      componentName: "ImageCardGrid",
      materialVersion: "0.1.0",
      props: {
        title: "专题会场",
        subtitle: "按场景快速进入对应分会场，减少用户选择成本。",
        columns: 2,
        gap: 10,
        radius: 10,
        backgroundColor: "#f3f4f6",
        cardBackgroundColor: "#111827",
        titleColor: "#111827",
        textColor: "#64748b",
        accentColor: "#ef4444",
        items: [
          {
            id: "women",
            title: "女装会场",
            subtitle: "夏日通勤穿搭",
            badgeText: "热推",
            imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80",
            linkUrl: "",
          },
          {
            id: "shoes",
            title: "鞋包会场",
            subtitle: "轻盈出行装备",
            badgeText: "新品",
            imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80",
            linkUrl: "",
          },
        ],
      },
    },
    {
      id: "node_tabs_block",
      componentName: "TabsBlock",
      materialVersion: "0.1.0",
      props: {
        title: "活动信息",
        subtitle: "把活动亮点、参与方式和常见问题收纳在一个通用内容区块。",
        backgroundColor: "#f3f4f6",
        cardBackgroundColor: "#ffffff",
        navBackgroundColor: "#f8fafc",
        tabBackgroundColor: "#ffffff",
        titleColor: "#111827",
        textColor: "#64748b",
        contentColor: "#374151",
        activeTextColor: "#ffffff",
        accentColor: "#111827",
        borderColor: "#e5e7eb",
        radius: 12,
        paddingY: 14,
        items: [
          {
            id: "highlight",
            title: "活动亮点",
            subtitle: "本期主推",
            badgeText: "Hot",
            content: "精选爆品、组合券包、品牌专题和门店达人内容都可在本页完成搭建。",
          },
          {
            id: "guide",
            title: "参与方式",
            subtitle: "三步完成",
            badgeText: "",
            content: "先领取优惠券，再进入专题会场，最后选择商品或门店内容完成转化。",
          },
          {
            id: "faq",
            title: "常见问题",
            subtitle: "运营说明",
            badgeText: "FAQ",
            content: "活动时间、优惠门槛和售后规则可在这里统一说明，减少用户跳出。",
          },
        ],
      },
    },
    {
      id: "node_coupon",
      componentName: "CouponSection",
      materialVersion: "0.1.0",
      props: {
        title: "新人专享券",
        buttonText: "立即领取",
        backgroundColor: "#fff7ed",
        buttonColor: "#111827",
      },
      events: {
        onReceive: { actionId: "receive_coupon" },
      },
    },
    {
      id: "node_coupon_bundle",
      componentName: "CouponBundle",
      materialVersion: "0.1.0",
      props: {
        title: "大促组合券",
        subtitle: "平台券、品类券一次领，凑单更划算。",
        receiveAllText: "一键领取",
        receiveText: "领取",
        backgroundColor: "#fff7ed",
        titleColor: "#9a3412",
        amountColor: "#dc2626",
        buttonColor: "#ea580c",
        coupons: [
          { id: "coupon_platform_30", title: "满 199 减 30", thresholdText: "平台通用券", valueText: "¥30", expireText: "领取后 7 天有效" },
          { id: "coupon_category_80", title: "满 399 减 80", thresholdText: "包袋鞋履可用", valueText: "¥80", expireText: "每日限量" },
          { id: "coupon_shipping", title: "满 99 包邮", thresholdText: "指定区域可用", valueText: "包邮", expireText: "活动期内有效" },
        ],
      },
      events: {
        onReceive: { actionId: "receive_coupon" },
        onReceiveAll: { actionId: "receive_coupon_bundle" },
      },
    },
    {
      id: "node_brand",
      componentName: "BrandFeatureSection",
      materialVersion: "0.1.0",
      props: {
        brandName: "MeuMall Select",
        title: "夏日品牌馆",
        description: "精选品牌当季新品与平台补贴权益，帮助用户快速进入品牌导购场景。",
        badgeText: "品牌专题",
        buttonText: "进入品牌",
        coverImageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
        logoImageUrl: "",
        linkUrl: "",
        backgroundColor: "#f8fafc",
        cardBackgroundColor: "#ffffff",
        pointBackgroundColor: "#f8fafc",
        titleColor: "#111827",
        textColor: "#374151",
        accentColor: "#111827",
        sellingPoints: [
          { id: "point_member", title: "会员专享", desc: "品牌券叠加平台补贴" },
          { id: "point_new", title: "当季新品", desc: "通勤、度假和日常穿搭一次配齐" },
        ],
        items: [],
      },
      dataBinding: {
        items: "products",
      },
      events: {
        onEnter: { actionId: "track_brand_enter" },
        onProductClick: { actionId: "track_brand_product" },
      },
    },
    {
      id: "node_rank",
      componentName: "ProductRankList",
      materialVersion: "0.1.0",
      props: {
        title: "夏日热卖榜",
        subtitle: "按活动热度整理，帮助用户快速选爆品。",
        badgeText: "热卖榜",
        buttonText: "去看看",
        backgroundColor: "#ffffff",
        titleColor: "#111827",
        accentColor: "#ef4444",
        rankBackgroundColor: "#fff1f2",
        limit: 3,
        items: [],
      },
      dataBinding: {
        items: "products",
      },
      events: {
        onProductClick: { actionId: "track_rank_product" },
      },
    },
    {
      id: "node_store_expert",
      componentName: "StoreExpertSection",
      materialVersion: "0.1.0",
      props: {
        title: "门店/达人推荐",
        subtitle: "附近门店和热门达人帮你快速选好物。",
        badgeText: "本地热推",
        buttonText: "查看",
        backgroundColor: "#f8fafc",
        cardBackgroundColor: "#ffffff",
        titleColor: "#111827",
        accentColor: "#0f766e",
        items: sampleStoreExperts,
      },
      events: {
        onItemClick: { actionId: "track_store_expert" },
      },
    },
    {
      id: "node_flash_sale",
      componentName: "FlashSaleList",
      materialVersion: "0.1.0",
      props: {
        title: "限时秒杀",
        subtitle: "爆品限量抢购",
        badgeText: "秒杀中",
        backgroundColor: "#ffffff",
        items: [],
      },
      dataBinding: {
        items: "products",
      },
      events: {
        onProductClick: { actionId: "track_flash_product" },
      },
    },
    {
      id: "node_container",
      componentName: "SectionContainer",
      materialVersion: "0.1.0",
      props: {
        title: "精选专区",
        subtitle: "容器内可以嵌套 Banner、商品列表和富文本。",
        backgroundColor: "#ffffff",
        padding: 14,
        marginY: 12,
        gap: 10,
        radius: 12,
        borderColor: "#d1d5db",
        borderWidth: 1,
        shadow: true,
        titleColor: "#111827",
        subtitleColor: "#64748b",
        emptyText: "向精选专区中添加物料",
      },
      children: [
        {
          id: "node_action_nested",
          componentName: "ActionButton",
          materialVersion: "0.1.0",
          props: {
            text: "立即逛精选",
            linkUrl: "",
            backgroundColor: "#111827",
            textColor: "#ffffff",
            wrapperBackgroundColor: "#ffffff",
            radius: 8,
            paddingY: 8,
          },
          events: {
            onClick: { actionId: "go_topic" },
          },
        },
        {
          id: "node_banner_nested",
          componentName: "ImageBanner",
          materialVersion: "0.1.0",
          props: {
            imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
            alt: "",
            radius: 8,
          },
        },
        {
          id: "node_products_nested",
          componentName: "ProductList",
          materialVersion: "0.1.0",
          props: {
            items: [],
          },
          dataBinding: {
            items: "products",
          },
        },
      ],
    },
    {
      id: "node_lead_form",
      componentName: "LeadFormBlock",
      materialVersion: "0.1.0",
      props: {
        title: "预约专属搭配顾问",
        description: "填写基础信息，后续可对接真实表单提交服务。",
        submitText: "提交预约",
        successText: "已提交预约，本示例仅验证本地交互。",
        accentColor: "#0f766e",
        backgroundColor: "#f3f4f6",
        cardColor: "#ffffff",
      },
      events: {
        onSubmit: { actionId: "track_lead_submit" },
      },
    },
    {
      id: "node_spacer",
      componentName: "SpacerBlock",
      materialVersion: "0.1.0",
      props: {
        height: 16,
        backgroundColor: "#f3f4f6",
      },
    },
    {
      id: "node_rich_text",
      componentName: "RichTextBlock",
      materialVersion: "0.1.0",
      props: {
        html: "<p><strong>运营说明：</strong>这是一份发布后的 H5 schema 渲染示例，后续可替换为 Java 配置平台返回的数据。</p>",
      },
    },
    {
      id: "node_sticky_action",
      componentName: "StickyActionBar",
      materialVersion: "0.1.0",
      props: {
        title: "限时福利",
        subtitle: "领取优惠后立即逛活动精选",
        primaryText: "立即抢购",
        secondaryText: "领券",
        showSecondary: true,
        sticky: true,
        safeArea: true,
        primaryLinkUrl: "",
        secondaryLinkUrl: "",
        backgroundColor: "#ffffff",
        titleColor: "#111827",
        textColor: "#64748b",
        accentColor: "#111827",
        primaryTextColor: "#ffffff",
        secondaryBackgroundColor: "#ffffff",
        radius: 999,
      },
      events: {
        onPrimaryClick: { actionId: "track_sticky_primary" },
        onSecondaryClick: { actionId: "receive_coupon" },
      },
    },
  ],
  dataSources: [
    {
      id: "ds_products",
      type: "product.byActivity",
      bindTo: "products",
      params: {
        activityId: "summer-campaign-demo",
        limit: 20,
      },
      cache: {
        ttlSeconds: 60,
        scope: "public",
      },
    },
  ],
  actions: [
    {
      id: "go_topic",
      type: "navigate",
      params: {
        url: "/activity/summer-topic",
      },
    },
    {
      id: "receive_coupon",
      type: "coupon.receive",
      params: {
        couponId: "new-user-coupon",
      },
    },
    {
      id: "receive_coupon_bundle",
      type: "coupon.receive",
      params: {
        couponId: "summer-coupon-bundle",
      },
    },
    {
      id: "track_flash_product",
      type: "tracking.click",
      params: {
        eventName: "flash_sale_product_click",
      },
    },
    {
      id: "track_basic_button_click",
      type: "tracking.click",
      params: {
        eventName: "basic_button_click",
      },
    },
    {
      id: "track_basic_input_change",
      type: "tracking.click",
      params: {
        eventName: "basic_input_change",
      },
    },
    {
      id: "track_rank_product",
      type: "tracking.click",
      params: {
        eventName: "rank_product_click",
      },
    },
    {
      id: "track_brand_enter",
      type: "tracking.click",
      params: {
        eventName: "brand_feature_enter_click",
      },
    },
    {
      id: "track_brand_product",
      type: "tracking.click",
      params: {
        eventName: "brand_feature_product_click",
      },
    },
    {
      id: "track_sticky_primary",
      type: "tracking.click",
      params: {
        eventName: "sticky_action_primary_click",
      },
    },
    {
      id: "track_store_expert",
      type: "tracking.click",
      params: {
        eventName: "store_expert_click",
      },
    },
    {
      id: "track_live_enter",
      type: "tracking.click",
      params: {
        eventName: "live_entry_click",
      },
    },
    {
      id: "track_rule_open",
      type: "tracking.click",
      params: {
        eventName: "activity_rule_open",
      },
    },
    {
      id: "track_anchor_click",
      type: "tracking.click",
      params: {
        eventName: "floor_anchor_click",
      },
    },
    {
      id: "track_lead_submit",
      type: "tracking.click",
      params: {
        eventName: "lead_form_submit",
      },
    },
  ],
  publishMeta: {
    environment: "prod",
    publishedAt: "2026-07-31T00:00:00.000Z",
    operator: "local-admin",
  },
});

const emptyDemoSchema = createLowcodePageSchema({
  pageId: "empty-runtime-demo",
  pageVersion: "demo-empty-20260801",
  status: "published",
  title: "空页面演示",
  pageType: "activity",
  targetPlatforms: ["h5"],
  layout: {
    safeArea: true,
    backgroundColor: "#f3f4f6",
    maxWidth: 430,
  },
  nodes: [],
  publishMeta: {
    environment: "test",
    publishedAt: "2026-08-01T00:00:00.000Z",
    operator: "runtime-demo",
  },
});

const brokenDemoSchema = createLowcodePageSchema({
  pageId: "broken-runtime-demo",
  pageVersion: "demo-broken-20260801",
  status: "published",
  title: "异常兜底演示",
  pageType: "activity",
  targetPlatforms: ["h5"],
  layout: {
    safeArea: true,
    backgroundColor: "#f3f4f6",
    maxWidth: 430,
  },
  nodes: [
    {
      id: "node_missing_material",
      componentName: "MissingMaterialBlock",
      materialVersion: "0.1.0",
      props: {},
    },
    {
      id: "node_broken_material",
      componentName: "BrokenBlock",
      materialVersion: "0.1.0",
      props: {},
    },
  ],
  publishMeta: {
    environment: "test",
    publishedAt: "2026-08-01T00:00:00.000Z",
    operator: "runtime-demo",
  },
});

function cloneSchema(schema: LowcodePageSchema): LowcodePageSchema {
  return JSON.parse(JSON.stringify(schema)) as LowcodePageSchema;
}

function createPreviewDemoSchema(): LowcodePageSchema {
  const schema = cloneSchema(sampleSchema);
  schema.status = "preview";
  schema.pageVersion = "preview-20260801-demo";
  schema.title = "夏日好物节预览";
  schema.publishMeta = {
    ...schema.publishMeta,
    environment: "pre",
    publishedAt: "2026-08-01T00:00:00.000Z",
    operator: "runtime-preview",
  };
  const heroNode = schema.nodes.find((node) => node.id === "node_hero");
  if (heroNode) {
    heroNode.props = {
      ...heroNode.props,
      subtitle: "React H5 runtime 正在通过 releaseId 加载预览版本。",
    };
  }
  return schema;
}

const previewDemoSchema = createPreviewDemoSchema();

const previewDemoRelease: ConfigPlatformPageRelease = {
  id: "preview_demo",
  kind: "preview",
  pageId: previewDemoSchema.pageId,
  pageVersion: previewDemoSchema.pageVersion,
  title: previewDemoSchema.title,
  createdAt: "2026-08-01T00:00:00.000Z",
  schema: previewDemoSchema,
};

const publishedDemoRelease: ConfigPlatformPageRelease = {
  id: "published_demo",
  kind: "published",
  pageId: sampleSchema.pageId,
  pageVersion: sampleSchema.pageVersion,
  title: sampleSchema.title,
  createdAt: sampleSchema.publishMeta.publishedAt ?? "2026-07-31T00:00:00.000Z",
  schema: sampleSchema,
};

const localRuntimeConfigPlatformClient: LowcodeConfigPlatformClient = {
  saveDraft(schema) {
    return {
      id: "draft_demo",
      kind: "draft",
      pageId: schema.pageId,
      pageVersion: schema.pageVersion,
      title: schema.title,
      createdAt: new Date().toISOString(),
      schema,
    };
  },
  createPreview() {
    return previewDemoRelease;
  },
  publishPage() {
    return publishedDemoRelease;
  },
  listReleases(pageId) {
    const releases = [previewDemoRelease, publishedDemoRelease];
    return pageId ? releases.filter((release) => release.pageId === pageId) : releases;
  },
  getRelease(releaseId) {
    if (releaseId === previewDemoRelease.id || releaseId === publishedDemoRelease.id) {
      return releaseId === previewDemoRelease.id ? previewDemoRelease : publishedDemoRelease;
    }
    return undefined;
  },
  getDraft() {
    return undefined;
  },
  getPublished(pageId) {
    return pageId === sampleSchema.pageId ? sampleSchema : undefined;
  },
};

const runtimeConfigPlatformBinding = createRuntimeConfigPlatformBinding(localRuntimeConfigPlatformClient);

const registry = createMaterialRegistry([
  ...h5Materials,
  {
    component: BrokenBlock,
    manifest: createMaterialManifest({
      componentName: "BrokenBlock",
      materialVersion: "0.1.0",
      title: "异常演示物料",
      category: "content",
      platforms: ["h5"],
      defaultProps: {},
      propsSchema: {},
    }),
  },
]);
const dataSourceRegistry = createDataSourceRegistry({
  "product.byActivity": resolveSampleProductDataSource,
  "product.byIds": resolveSampleProductDataSource,
  "custom.http": (dataSource) => dataSource.params ?? {},
});

interface RuntimeSchemaSource {
  schema: LowcodePageSchema;
  source: RuntimeSchemaSourceType;
  error?: string;
}

type RuntimeRequestedSource = "schema" | "releaseId" | "pageId" | "emptyDemo" | "brokenDemo" | "none";

interface RuntimeSchemaInputInfo {
  encodedSchema?: string;
  releaseId?: string;
  pageId?: string;
  requestedSource: RuntimeRequestedSource;
  requestedLabel: string;
  requestedValue: string;
  fallbackSchema: LowcodePageSchema;
}

function getRuntimeSchemaInputInfo(): RuntimeSchemaInputInfo {
  const params = new URLSearchParams(window.location.search);
  const encodedSchema = params.get("schema") ?? undefined;
  const releaseId = params.get("releaseId") ?? undefined;
  const pageId = params.get("pageId") ?? undefined;
  const demo = params.get("demo");
  if (demo === "empty") {
    return {
      requestedSource: "emptyDemo",
      requestedLabel: "empty demo",
      requestedValue: "?demo=empty",
      fallbackSchema: emptyDemoSchema,
    };
  }
  if (demo === "broken") {
    return {
      requestedSource: "brokenDemo",
      requestedLabel: "broken demo",
      requestedValue: "?demo=broken",
      fallbackSchema: brokenDemoSchema,
    };
  }
  if (encodedSchema) {
    return {
      encodedSchema,
      requestedSource: "schema",
      requestedLabel: "schema url",
      requestedValue: "schema 参数",
      fallbackSchema: sampleSchema,
    };
  }
  if (releaseId) {
    return {
      releaseId,
      requestedSource: "releaseId",
      requestedLabel: "releaseId",
      requestedValue: releaseId,
      fallbackSchema: sampleSchema,
    };
  }
  if (pageId) {
    return {
      pageId,
      requestedSource: "pageId",
      requestedLabel: "pageId",
      requestedValue: pageId,
      fallbackSchema: sampleSchema,
    };
  }
  return {
    requestedSource: "none",
    requestedLabel: "sample fallback",
    requestedValue: "无 URL 参数",
    fallbackSchema: sampleSchema,
  };
}

function formatRuntimeSource(source: RuntimeSchemaSourceType): string {
  const sourceLabel: Record<RuntimeSchemaSourceType, string> = {
    encoded: "schema URL",
    release: "release schema",
    published: "published schema",
    fallback: "fallback schema",
  };
  return sourceLabel[source];
}

function formatEnvironment(environment: LowcodeEnvironment): string {
  const label: Record<LowcodeEnvironment, string> = {
    test: "test",
    pre: "pre",
    prod: "prod",
  };
  return label[environment];
}

function createRuntimeSourceNote(input: RuntimeSchemaInputInfo, runtimeSchema: RuntimeSchemaSource, loading: boolean): string {
  if (loading) return "正在解析 schema 来源。";
  if (runtimeSchema.error) return `已启用 fallback：${runtimeSchema.error}`;
  if (input.requestedSource === "none") return "当前无 URL 参数，使用本地 sample schema 作为 H5 runtime 默认演示。";
  if (input.requestedSource === "emptyDemo") return "当前使用空页面演示 schema，用于验证 H5 runtime 空态不白屏。";
  if (input.requestedSource === "brokenDemo") return "当前使用异常兜底演示 schema，用于验证未知物料和组件异常不白屏。";
  if (runtimeSchema.source === "encoded") return "当前 schema 来自编辑器 URL handoff，仅适合本地演示和排障。";
  return "当前 schema 已按请求入口加载。";
}

function countNodes(schema: LowcodePageSchema): number {
  const walk = (nodes: LowcodePageSchema["nodes"]): number => {
    return nodes.reduce((total, node) => total + 1 + walk(node.children ?? []), 0);
  };
  return walk(schema.nodes);
}

function getParamString(params: JsonObject | undefined, key: string, fallback: string): string {
  const value = params?.[key];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

export function App() {
  const runtimeInput = useMemo(() => getRuntimeSchemaInputInfo(), []);
  const [renderErrors, setRenderErrors] = useState<string[]>([]);
  const [runtimeData, setRuntimeData] = useState<JsonObject>({});
  const [dataSourceRecords, setDataSourceRecords] = useState<DataSourceResolutionRecord[]>([]);
  const [dataResolving, setDataResolving] = useState(true);
  const [schemaLoading, setSchemaLoading] = useState(true);
  const [actionLogs, setActionLogs] = useState<string[]>([]);
  const [runtimeSchema, setRuntimeSchema] = useState<RuntimeSchemaSource>({
    schema: runtimeInput.fallbackSchema,
    source: "fallback",
  });
  const validation = useMemo(() => validateLowcodePageSchema(runtimeSchema.schema), [runtimeSchema.schema]);
  const nodeCount = useMemo(() => countNodes(runtimeSchema.schema), [runtimeSchema.schema]);
  const dataSourceErrors = dataSourceRecords.filter((record) => record.status === "error");
  const dataSourceResolvedCount = dataSourceRecords.filter((record) => record.status === "resolved").length;
  const runtimeSourceNote = createRuntimeSourceNote(runtimeInput, runtimeSchema, schemaLoading);
  const runtimeEntryLinks = [
    { label: "Sample", href: "/", desc: "无参数 fallback 演示" },
    { label: "PageId", href: "/?pageId=summer-campaign-demo", desc: "模拟生产 pageId 入口" },
    { label: "ReleaseId", href: "/?releaseId=preview_demo", desc: "模拟预览 release 入口" },
    { label: "Empty", href: "/?demo=empty", desc: "空页面降级演示" },
    { label: "Broken", href: "/?demo=broken", desc: "未知物料和渲染异常演示" },
  ];
  const actionExecutor = useMemo(() => {
    const actionRegistry = createSafeActionRegistry({
      navigate(action) {
        setActionLogs((current) => [`模拟跳转：${getParamString(action.params, "url", "/")}`, ...current].slice(0, 5));
      },
      "coupon.receive"(action) {
        setActionLogs((current) => [`模拟领券：${getParamString(action.params, "couponId", "coupon_demo")}`, ...current].slice(0, 5));
      },
      "tracking.click"(action) {
        setActionLogs((current) => [`模拟埋点：${getParamString(action.params, "eventName", "lowcode_click")}`, ...current].slice(0, 5));
      },
      noop(action) {
        setActionLogs((current) => [`已执行空动作：${action.id}`, ...current].slice(0, 5));
      },
    });
    return createSafeActionExecutor(actionRegistry, {
      onError(error) {
        setActionLogs((current) => [`动作执行失败：${error.message}`, ...current].slice(0, 5));
      },
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setSchemaLoading(true);
    loadLowcodeRuntimeSchema({
      ...runtimeInput,
      configPlatformClient: runtimeConfigPlatformBinding.client,
    })
      .then((result) => {
        if (cancelled) return;
        setRuntimeSchema({
          schema: result.schema ?? runtimeInput.fallbackSchema,
          source: result.source,
          error: result.error,
        });
      })
      .finally(() => {
        if (!cancelled) setSchemaLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [runtimeInput]);

  useEffect(() => {
    let cancelled = false;
    setDataResolving(true);
    resolveLowcodeDataSources(runtimeSchema.schema.dataSources ?? [], dataSourceRegistry)
      .then((result) => {
        if (cancelled) return;
        setRuntimeData(result.data);
        setDataSourceRecords(result.records);
      })
      .finally(() => {
        if (!cancelled) setDataResolving(false);
      });
    return () => {
      cancelled = true;
    };
  }, [runtimeSchema.schema]);

  return (
    <main className="runtime-shell">
      <section className="runtime-status" aria-label="运行时状态">
        <div className="runtime-status-head">
          <strong>React H5 Runtime</strong>
          <span>{schemaLoading ? "loading" : runtimeSchema.source}</span>
        </div>
        <p className="runtime-source-note">{runtimeSourceNote}</p>
        <dl>
          <div>
            <dt>请求入口</dt>
            <dd>{runtimeInput.requestedLabel}</dd>
          </div>
          <div>
            <dt>请求值</dt>
            <dd>{runtimeInput.requestedValue}</dd>
          </div>
          <div>
            <dt>实际来源</dt>
            <dd>{schemaLoading ? "loading" : formatRuntimeSource(runtimeSchema.source)}</dd>
          </div>
          <div>
            <dt>配置平台</dt>
            <dd>{runtimeConfigPlatformBinding.label}</dd>
          </div>
          <div>
            <dt>页面 ID</dt>
            <dd>{runtimeSchema.schema.pageId}</dd>
          </div>
          <div>
            <dt>页面版本</dt>
            <dd>{runtimeSchema.schema.pageVersion}</dd>
          </div>
          <div>
            <dt>环境</dt>
            <dd>{formatEnvironment(runtimeSchema.schema.publishMeta.environment)}</dd>
          </div>
          <div>
            <dt>Schema</dt>
            <dd>{validation.valid ? "valid" : "invalid"}</dd>
          </div>
          <div>
            <dt>节点数</dt>
            <dd>{nodeCount}</dd>
          </div>
          <div>
            <dt>数据源</dt>
            <dd>
              {dataResolving
                ? "resolving"
                : dataSourceErrors.length
                  ? `${dataSourceErrors.length} error`
                  : `${dataSourceResolvedCount} resolved`}
            </dd>
          </div>
        </dl>
        {runtimeSchema.error ? <p className="runtime-warning">{runtimeSchema.error}</p> : null}
        <div className="runtime-entry-list" aria-label="运行入口示例">
          <strong>本地入口</strong>
          {runtimeEntryLinks.map((item) => (
            <a key={item.href} href={item.href}>
              <span>{item.label}</span>
              <small>{item.desc}</small>
            </a>
          ))}
        </div>
        {actionLogs.length ? (
          <div className="runtime-action-logs" aria-label="动作日志">
            {actionLogs.map((log, index) => (
              <p key={`${log}-${index}`}>{log}</p>
            ))}
          </div>
        ) : null}
        {dataSourceRecords.length ? (
          <div className="runtime-data-records" aria-label="数据源状态">
            {dataSourceRecords.map((record) => (
              <p key={record.id} className={`is-${record.status}`}>
                <strong>{record.id}</strong>
                <span>{record.status === "resolved" ? `绑定到 ${record.bindTo}` : record.error}</span>
              </p>
            ))}
          </div>
        ) : null}
      </section>

      <section className="phone-frame" aria-label="H5 页面">
        <div className="phone-status">
          <span>{runtimeSchema.schema.title}</span>
          <span>React H5</span>
        </div>
        <LowcodeRenderer
          schema={runtimeSchema.schema}
          registry={registry}
          data={runtimeData}
          actionExecutor={actionExecutor}
          fallback={<div className="runtime-empty">页面暂无内容，H5 runtime 已进入安全空态</div>}
          onRenderError={(error, node) => {
            setRenderErrors((current) => [...current, `${node?.id ?? "unknown"}: ${error.message}`]);
          }}
        />
      </section>

      {renderErrors.length ? (
        <section className="runtime-errors" aria-label="渲染错误">
          {renderErrors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </section>
      ) : null}
    </main>
  );
}
