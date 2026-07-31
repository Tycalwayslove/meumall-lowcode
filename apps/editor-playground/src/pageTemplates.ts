import { createLowcodePageSchema, type LowcodePageSchema } from "@meumall/lowcode-schema";

export interface PageTemplate {
  id: string;
  title: string;
  description: string;
  schema: LowcodePageSchema;
}

const productItems = [
  {
    id: "sku_001",
    title: "轻盈通勤手提包",
    priceText: "¥199",
    desc: "活动价",
    imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sku_002",
    title: "夏季舒适凉鞋",
    priceText: "¥129",
    desc: "限时补贴",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sku_003",
    title: "防晒轻薄衬衫",
    priceText: "¥159",
    desc: "热卖单品",
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80",
  },
];

export const pageTemplates: PageTemplate[] = [
  {
    id: "summer-campaign",
    title: "大促活动页",
    description: "适合节日促销、平台大促和主题营销。",
    schema: createLowcodePageSchema({
      pageId: "summer-campaign-demo",
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
          id: "summer_hero",
          componentName: "ActivityHero",
          materialVersion: "0.1.0",
          props: {
            title: "夏日好物节",
            subtitle: "精选爆品限时补贴，运营可直接组合物料生成页面。",
            imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
            backgroundColor: "#ffffff",
            titleColor: "#111827",
            titleSize: 24,
          },
        },
        {
          id: "summer_notice",
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
          id: "summer_coupon",
          componentName: "CouponSection",
          materialVersion: "0.1.0",
          props: {
            title: "新人专享券",
            buttonText: "立即领取",
            backgroundColor: "#fff7ed",
            buttonColor: "#111827",
          },
        },
        {
          id: "summer_container",
          componentName: "SectionContainer",
          materialVersion: "0.1.0",
          props: {
            title: "精选专区",
            subtitle: "容器中可以继续添加物料。",
            backgroundColor: "#ffffff",
            padding: 12,
            radius: 10,
          },
          children: [
            {
              id: "summer_action",
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
            },
            {
              id: "summer_banner",
              componentName: "ImageBanner",
              materialVersion: "0.1.0",
              props: {
                imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
                alt: "",
                radius: 8,
              },
            },
          ],
        },
        {
          id: "summer_products",
          componentName: "ProductList",
          materialVersion: "0.1.0",
          props: {
            items: productItems.slice(0, 2),
          },
          dataBinding: {
            items: "products",
          },
        },
        {
          id: "summer_spacer",
          componentName: "SpacerBlock",
          materialVersion: "0.1.0",
          props: {
            height: 16,
            backgroundColor: "#f3f4f6",
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
      publishMeta: {
        environment: "test",
      },
    }),
  },
  {
    id: "new-user-coupon",
    title: "新人券领取页",
    description: "适合投放拉新、注册礼和首单优惠。",
    schema: createLowcodePageSchema({
      pageId: "new-user-coupon-demo",
      title: "新人专享礼",
      pageType: "promotion",
      targetPlatforms: ["h5"],
      layout: {
        safeArea: true,
        backgroundColor: "#fff7ed",
        maxWidth: 430,
      },
      nodes: [
        {
          id: "new_user_hero",
          componentName: "ActivityHero",
          materialVersion: "0.1.0",
          props: {
            title: "新人专享礼",
            subtitle: "注册即领新人券，首单下单更划算。",
            imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
            backgroundColor: "#ffffff",
            titleColor: "#111827",
            titleSize: 24,
          },
        },
        {
          id: "new_user_coupon",
          componentName: "CouponSection",
          materialVersion: "0.1.0",
          props: {
            title: "新人 30 元礼包",
            buttonText: "一键领取",
            backgroundColor: "#ffedd5",
            buttonColor: "#ea580c",
          },
        },
        {
          id: "new_user_notice",
          componentName: "NoticeBar",
          materialVersion: "0.1.0",
          props: {
            label: "规则",
            content: "优惠券领取后 7 天内有效，每个用户限领一次。",
            backgroundColor: "#fff7ed",
            textColor: "#9a3412",
          },
        },
        {
          id: "new_user_action",
          componentName: "ActionButton",
          materialVersion: "0.1.0",
          props: {
            text: "去挑选首单好物",
            linkUrl: "",
            backgroundColor: "#ea580c",
            textColor: "#ffffff",
            wrapperBackgroundColor: "#fff7ed",
            radius: 8,
            paddingY: 14,
          },
        },
        {
          id: "new_user_text",
          componentName: "RichTextBlock",
          materialVersion: "0.1.0",
          props: {
            html: "<p><strong>使用说明：</strong>新人券可在指定商品下单时抵扣，具体以结算页展示为准。</p>",
          },
        },
      ],
      publishMeta: {
        environment: "test",
      },
    }),
  },
  {
    id: "product-topic",
    title: "商品专题页",
    description: "适合品类专题、达人推荐和爆品集合。",
    schema: createLowcodePageSchema({
      pageId: "product-topic-demo",
      title: "通勤好物专题",
      pageType: "topic",
      targetPlatforms: ["h5"],
      layout: {
        safeArea: true,
        backgroundColor: "#f3f4f6",
        maxWidth: 430,
      },
      nodes: [
        {
          id: "topic_banner",
          componentName: "ImageBanner",
          materialVersion: "0.1.0",
          props: {
            imageUrl: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=900&q=80",
            alt: "通勤好物专题",
            radius: 0,
          },
        },
        {
          id: "topic_notice",
          componentName: "NoticeBar",
          materialVersion: "0.1.0",
          props: {
            label: "专题",
            content: "精选通勤穿搭与包履单品，适合工作日快速选购。",
            backgroundColor: "#eff6ff",
            textColor: "#1d4ed8",
          },
        },
        {
          id: "topic_container",
          componentName: "SectionContainer",
          materialVersion: "0.1.0",
          props: {
            title: "编辑精选",
            subtitle: "商品数据可绑定活动、商品 ID 或专题配置。",
            backgroundColor: "#ffffff",
            padding: 12,
            radius: 10,
          },
          children: [
            {
              id: "topic_products",
              componentName: "ProductList",
              materialVersion: "0.1.0",
              props: {
                items: productItems,
              },
              dataBinding: {
                items: "products",
              },
            },
          ],
        },
        {
          id: "topic_action",
          componentName: "ActionButton",
          materialVersion: "0.1.0",
          props: {
            text: "查看更多专题商品",
            linkUrl: "",
            backgroundColor: "#111827",
            textColor: "#ffffff",
            wrapperBackgroundColor: "#f3f4f6",
            radius: 8,
            paddingY: 14,
          },
        },
      ],
      dataSources: [
        {
          id: "ds_products",
          type: "product.byActivity",
          bindTo: "products",
          params: {
            activityId: "product-topic-demo",
            limit: 20,
          },
          cache: {
            ttlSeconds: 60,
            scope: "public",
          },
        },
      ],
      publishMeta: {
        environment: "test",
      },
    }),
  },
];

export function cloneTemplateSchema(template: PageTemplate): LowcodePageSchema {
  return JSON.parse(JSON.stringify(template.schema)) as LowcodePageSchema;
}
