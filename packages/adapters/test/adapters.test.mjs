import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createLowcodePageSchema } from "../../schema/dist/index.js";
import {
  createDataSourceRegistry,
  createHttpActionHandler,
  createHttpDataSourceHandler,
  createHttpConfigPlatformClient,
  createStaticResourceLibraryClient,
  createStaticTemplateLibraryClient,
  createSafeActionExecutor,
  createSafeActionRegistry,
  decodePageSchemaFromUrlParam,
  encodePageSchemaToUrlParam,
  loadLowcodeRuntimeSchema,
  resolveLowcodeDataSources,
} from "../dist/index.js";

describe("@meumall/lowcode-adapters", () => {
  it("resolves data source handlers by type", async () => {
    const registry = createDataSourceRegistry({
      mock(config) {
        return { bindTo: config.bindTo ?? "default", items: [config.params] };
      },
    });

    registry.register("empty", () => ({ items: [] }));

    await assert.rejects(
      () => registry.resolve({ id: "missing", type: "unknown" }),
      /data source handler not found/,
    );
    assert.deepEqual(registry.listTypes(), ["mock", "empty"]);
    assert.deepEqual(await registry.resolve({ id: "products", type: "mock", bindTo: "products", params: { limit: 3 } }), {
      bindTo: "products",
      items: [{ limit: 3 }],
    });
  });

  it("resolves schema data sources into runtime data with records", async () => {
    const registry = createDataSourceRegistry({
      "product.byIds"(config) {
        const limit = Number(config.params?.limit ?? 2);
        return [
          { id: "sku_001", title: "商品 1" },
          { id: "sku_002", title: "商品 2" },
          { id: "sku_003", title: "商品 3" },
        ].slice(0, limit);
      },
      passthrough(config) {
        return config.params ?? {};
      },
    });

    const result = await resolveLowcodeDataSources(
      [
        { id: "ds_products", type: "product.byIds", bindTo: "products", params: { limit: 2 } },
        { id: "ds_context", type: "passthrough", bindTo: "context", params: { channel: "h5" } },
      ],
      registry,
      { initialData: { staticText: "保留" } },
    );

    assert.deepEqual(result.data, {
      staticText: "保留",
      products: [
        { id: "sku_001", title: "商品 1" },
        { id: "sku_002", title: "商品 2" },
      ],
      context: { channel: "h5" },
    });
    assert.deepEqual(result.records, [
      { id: "ds_products", type: "product.byIds", bindTo: "products", status: "resolved" },
      { id: "ds_context", type: "passthrough", bindTo: "context", status: "resolved" },
    ]);
  });

  it("keeps rendering data stable when data source resolution fails", async () => {
    const errors = [];
    const registry = createDataSourceRegistry({
      broken() {
        throw new Error("接口异常");
      },
    });

    const result = await resolveLowcodeDataSources(
      [
        { id: "ds_skip", type: "broken", params: { limit: 1 } },
        { id: "ds_error", type: "missing", bindTo: "missingData" },
        { id: "ds_broken", type: "broken", bindTo: "brokenData" },
      ],
      registry,
      {
        initialData: { products: [] },
        onError(error, config) {
          errors.push(`${config.id}:${error.message}`);
        },
      },
    );

    assert.deepEqual(result.data, { products: [] });
    assert.deepEqual(errors, [
      "ds_error:Lowcode data source handler not found: missing",
      "ds_broken:接口异常",
    ]);
    assert.deepEqual(result.records, [
      { id: "ds_skip", type: "broken", status: "skipped", error: "bindTo is empty" },
      {
        id: "ds_error",
        type: "missing",
        bindTo: "missingData",
        status: "error",
        error: "Lowcode data source handler not found: missing",
      },
      { id: "ds_broken", type: "broken", bindTo: "brokenData", status: "error", error: "接口异常" },
    ]);
  });

  it("creates HTTP data source handlers for whitelisted GET endpoints", async () => {
    const calls = [];
    const handler = createHttpDataSourceHandler({
      baseUrl: "https://data.example.com/",
      endpoint: "api/products/by-ids",
      responseDataPath: "data.items",
      headers: { authorization: "Bearer token" },
      fetcher: async (input, init = {}) => {
        calls.push({ input, init });
        return {
          ok: true,
          status: 200,
          json: async () => ({
            data: {
              items: [
                { id: "sku_001", title: "商品 1" },
                { id: "sku_002", title: "商品 2" },
              ],
            },
          }),
        };
      },
    });
    const registry = createDataSourceRegistry({ "product.byIds": handler });

    const result = await resolveLowcodeDataSources(
      [
        {
          id: "ds_products",
          type: "product.byIds",
          bindTo: "products",
          params: { ids: ["sku_001", "sku_002"], limit: 2 },
        },
      ],
      registry,
    );

    assert.equal(calls[0].input, "https://data.example.com/api/products/by-ids?ids=sku_001&ids=sku_002&limit=2");
    assert.equal(calls[0].init.method, "GET");
    assert.equal(calls[0].init.headers.authorization, "Bearer token");
    assert.equal(calls[0].init.body, undefined);
    assert.deepEqual(result.data.products, [
      { id: "sku_001", title: "商品 1" },
      { id: "sku_002", title: "商品 2" },
    ]);
    assert.deepEqual(result.records, [
      { id: "ds_products", type: "product.byIds", bindTo: "products", status: "resolved" },
    ]);
  });

  it("creates HTTP data source handlers for POST endpoints with response transforms", async () => {
    const calls = [];
    const handler = createHttpDataSourceHandler({
      baseUrl: "https://data.example.com",
      endpoint: "/api/coupons/by-activity",
      method: "POST",
      transformResponse(payload) {
        return payload.result.items;
      },
      fetcher: async (input, init = {}) => {
        calls.push({ input, init });
        return {
          ok: true,
          status: 200,
          json: async () => ({
            result: {
              items: [{ id: "coupon_30", title: "满 199 减 30" }],
            },
          }),
        };
      },
    });
    const registry = createDataSourceRegistry({ "coupon.byActivity": handler });

    const result = await resolveLowcodeDataSources(
      [
        {
          id: "ds_coupons",
          type: "coupon.byActivity",
          bindTo: "coupons",
          params: { activityId: "activity_001", limit: 3 },
        },
      ],
      registry,
    );

    assert.equal(calls[0].input, "https://data.example.com/api/coupons/by-activity");
    assert.equal(calls[0].init.method, "POST");
    assert.deepEqual(JSON.parse(calls[0].init.body), { activityId: "activity_001", limit: 3 });
    assert.deepEqual(result.data.coupons, [{ id: "coupon_30", title: "满 199 减 30" }]);
  });

  it("records HTTP data source failures without throwing through the resolver", async () => {
    assert.throws(
      () =>
        createHttpDataSourceHandler({
          baseUrl: "https://data.example.com",
          endpoint: "https://unsafe.example.com/api/products",
        }),
      /endpoint must be a path/,
    );

    const errors = [];
    const registry = createDataSourceRegistry({
      "custom.http": createHttpDataSourceHandler({
        baseUrl: "https://data.example.com",
        endpoint: "/api/custom-data",
        fetcher: async () => ({
          ok: false,
          status: 502,
          json: async () => ({ message: "bad gateway" }),
        }),
      }),
    });

    const result = await resolveLowcodeDataSources(
      [{ id: "ds_custom", type: "custom.http", bindTo: "customData", params: { scene: "preview" } }],
      registry,
      {
        initialData: { products: [] },
        onError(error, config) {
          errors.push(`${config.id}:${error.message}`);
        },
      },
    );

    assert.deepEqual(result.data, { products: [] });
    assert.deepEqual(errors, ["ds_custom:HTTP data source request failed: 502"]);
    assert.deepEqual(result.records, [
      {
        id: "ds_custom",
        type: "custom.http",
        bindTo: "customData",
        status: "error",
        error: "HTTP data source request failed: 502",
      },
    ]);
  });

  it("searches static image assets and products through a resource library client", () => {
    const client = createStaticResourceLibraryClient({
      imageAssets: [
        {
          id: "asset_hero",
          title: "活动横幅",
          category: "活动横幅",
          url: "https://example.com/hero.png",
          tags: ["大促", "首屏"],
        },
        {
          id: "asset_coupon",
          title: "优惠券视觉",
          category: "优惠券",
          url: "https://example.com/coupon.png",
          tags: ["新人"],
        },
      ],
      videoAssets: [
        {
          id: "video_brand",
          title: "品牌宣传视频",
          category: "品牌视频",
          url: "https://example.com/brand.mp4",
          posterUrl: "https://example.com/brand.jpg",
          durationText: "00:18",
          tags: ["品牌", "首屏"],
        },
        {
          id: "video_try_on",
          title: "导购试穿视频",
          category: "导购视频",
          url: "https://example.com/try-on.mp4",
          posterUrl: "https://example.com/try-on.jpg",
          durationText: "00:32",
          tags: ["导购", "穿搭"],
        },
      ],
      products: [
        {
          id: "sku_001",
          title: "轻盈通勤手提包",
          priceText: "¥199",
          desc: "活动价",
          imageUrl: "https://example.com/bag.png",
          tags: ["包袋", "精选"],
        },
        {
          id: "sku_002",
          title: "夏季舒适凉鞋",
          priceText: "¥129",
          desc: "限时补贴",
          imageUrl: "https://example.com/shoes.png",
          tags: ["鞋履"],
        },
      ],
      coupons: [
        {
          id: "coupon_30",
          title: "满 199 减 30",
          thresholdText: "平台通用券",
          valueText: "¥30",
          expireText: "领取后 7 天有效",
          tags: ["新人", "平台"],
        },
        {
          id: "coupon_shipping",
          title: "满 99 包邮",
          thresholdText: "指定区域可用",
          valueText: "包邮",
          expireText: "活动期内有效",
          tags: ["物流"],
        },
      ],
      storeExperts: [
        {
          id: "store_jingan",
          kind: "store",
          typeText: "门店",
          title: "MeuMall 上海静安店",
          subtitle: "本周热卖搭配到店试穿",
          metricText: "4.9 分",
          desc: "距你 2.1km",
          imageUrl: "https://example.com/store.png",
          tags: ["上海", "门店"],
        },
        {
          id: "expert_summer",
          kind: "expert",
          typeText: "达人",
          title: "小夏的通勤穿搭",
          subtitle: "每日更新包袋和鞋履组合",
          metricText: "12.8w 粉丝",
          desc: "直播中",
          imageUrl: "https://example.com/expert.png",
          tags: ["达人", "直播"],
        },
      ],
    });

    const bannerResult = client.searchImageAssets({ category: "活动横幅", keyword: "首屏" });
    const couponResult = client.searchImageAssets({ ids: ["asset_coupon"] });
    const videoResult = client.searchVideoAssets({ category: "品牌视频", keyword: "首屏" });
    const taggedVideoResult = client.searchVideoAssets({ tags: ["穿搭"], limit: 1 });
    const productResult = client.searchProducts({ keyword: "sku_00", limit: 1 });
    const taggedProductResult = client.searchProducts({ tags: ["鞋履"] });
    const couponSearchResult = client.searchCoupons({ keyword: "包邮" });
    const taggedCouponResult = client.searchCoupons({ tags: ["新人"], limit: 1 });
    const storeResult = client.searchStoreExperts({ category: "门店" });
    const expertResult = client.searchStoreExperts({ keyword: "直播" });

    assert.equal(bannerResult.total, 1);
    assert.equal(bannerResult.items[0].id, "asset_hero");
    assert.equal(couponResult.items[0].url, "https://example.com/coupon.png");
    assert.equal(videoResult.total, 1);
    assert.equal(videoResult.items[0].posterUrl, "https://example.com/brand.jpg");
    assert.equal(taggedVideoResult.items[0].id, "video_try_on");
    assert.equal(productResult.total, 2);
    assert.equal(productResult.items.length, 1);
    assert.equal(productResult.items[0].id, "sku_001");
    assert.equal(taggedProductResult.items[0].id, "sku_002");
    assert.equal(couponSearchResult.items[0].id, "coupon_shipping");
    assert.equal(taggedCouponResult.items[0].id, "coupon_30");
    assert.equal(storeResult.items[0].id, "store_jingan");
    assert.equal(expertResult.items[0].id, "expert_summer");
  });

  it("searches and clones static page templates through a template library client", async () => {
    const campaignSchema = createLowcodePageSchema({
      pageId: "tpl_campaign",
      title: "大促活动页",
      nodes: [{ id: "hero", componentName: "ActivityHero", props: { title: "大促" } }],
    });
    const topicSchema = createLowcodePageSchema({
      pageId: "tpl_topic",
      title: "商品专题页",
      nodes: [{ id: "banner", componentName: "ImageBanner", props: { imageUrl: "https://example.com/banner.png" } }],
    });
    const client = createStaticTemplateLibraryClient({
      templates: [
        {
          id: "campaign",
          title: "大促活动页",
          description: "适合平台大促",
          category: "活动营销",
          status: "published",
          tags: ["大促", "首屏"],
          version: "1.0.0",
          schema: campaignSchema,
        },
        {
          id: "topic",
          title: "商品专题页",
          description: "适合单品集合",
          category: "商品运营",
          status: "draft",
          tags: ["商品"],
          version: "0.1.0",
          schema: topicSchema,
        },
      ],
    });

    const categoryResult = await client.searchTemplates({ category: "活动营销", status: "published" });
    const keywordResult = await client.searchTemplates({ keyword: "商品", limit: 1 });
    const taggedResult = await client.searchTemplates({ tags: ["首屏"] });
    const template = await client.getTemplate("campaign");
    assert.equal(categoryResult.total, 1);
    assert.equal(categoryResult.items[0].id, "campaign");
    assert.equal(keywordResult.total, 1);
    assert.equal(keywordResult.items[0].id, "topic");
    assert.equal(taggedResult.items[0].id, "campaign");
    assert.equal(template?.schema.pageId, "tpl_campaign");

    categoryResult.items[0].schema.title = "被编辑后的页面";
    const nextResult = await client.searchTemplates({ ids: ["campaign"] });
    assert.equal(nextResult.items[0].schema.title, "大促活动页");
  });

  it("executes safe action handlers by type", async () => {
    const calls = [];
    const registry = createSafeActionRegistry({
      navigate(config, context) {
        calls.push({ params: config.params, pageId: context?.schema?.pageId });
      },
    });

    registry.register("noop", () => undefined);
    await registry.execute(
      { id: "go", type: "navigate", params: { url: "/topic" } },
      { schema: createLowcodePageSchema({ pageId: "action_page", title: "动作页" }) },
    );

    assert.deepEqual(calls, [{ params: { url: "/topic" }, pageId: "action_page" }]);
    assert.deepEqual(registry.listTypes(), ["navigate", "noop"]);
    assert.throws(() => registry.execute({ id: "bad", type: "unsafe" }), /action handler not found/);
  });

  it("creates HTTP action handlers for whitelisted POST endpoints", async () => {
    const calls = [];
    const registry = createSafeActionRegistry({
      "tracking.click": createHttpActionHandler({
        baseUrl: "https://bff.example.com/",
        endpoint: "api/lowcode/actions/tracking-click",
        headers: { authorization: "Bearer token" },
        fetcher: async (input, init = {}) => {
          calls.push({ input, init });
          return {
            ok: true,
            status: 200,
            json: async () => ({ success: true }),
          };
        },
      }),
    });
    const schema = createLowcodePageSchema({
      pageId: "action_http_page",
      title: "HTTP 动作页",
      actions: [{ id: "track_button", type: "tracking.click", params: { eventName: "button_click" } }],
    });
    const executor = createSafeActionExecutor(registry);

    await executor.execute(
      { actionId: "track_button", params: { nodeId: "node_button" } },
      { schema, data: { channel: "h5" } },
    );

    assert.equal(calls[0].input, "https://bff.example.com/api/lowcode/actions/tracking-click");
    assert.equal(calls[0].init.method, "POST");
    assert.equal(calls[0].init.headers.authorization, "Bearer token");
    assert.deepEqual(JSON.parse(calls[0].init.body), {
      actionId: "track_button",
      type: "tracking.click",
      params: { eventName: "button_click" },
      refParams: { nodeId: "node_button" },
      pageId: "action_http_page",
    });
  });

  it("creates HTTP action handlers for GET endpoints with response transforms", async () => {
    const calls = [];
    const transformed = [];
    const registry = createSafeActionRegistry({
      "coupon.receive": createHttpActionHandler({
        baseUrl: "https://bff.example.com",
        endpoint: "/api/lowcode/actions/coupon-receive",
        method: "GET",
        buildQuery(action, context) {
          return {
            actionId: action.id,
            couponId: action.params?.couponId ?? "",
            pageId: context?.schema?.pageId ?? "",
          };
        },
        transformResponse(payload, action, context) {
          transformed.push({ payload, actionId: action.id, pageId: context?.schema?.pageId });
        },
        fetcher: async (input, init = {}) => {
          calls.push({ input, init });
          return {
            ok: true,
            status: 200,
            json: async () => ({ result: { received: true } }),
          };
        },
      }),
    });
    const schema = createLowcodePageSchema({
      pageId: "coupon_page",
      title: "领券页",
      actions: [{ id: "receive_coupon", type: "coupon.receive", params: { couponId: "coupon_001" } }],
    });
    const executor = createSafeActionExecutor(registry);

    await executor.execute({ actionId: "receive_coupon" }, { schema, data: {} });

    assert.equal(
      calls[0].input,
      "https://bff.example.com/api/lowcode/actions/coupon-receive?actionId=receive_coupon&couponId=coupon_001&pageId=coupon_page",
    );
    assert.equal(calls[0].init.method, "GET");
    assert.equal(calls[0].init.body, undefined);
    assert.deepEqual(transformed, [
      {
        payload: { result: { received: true } },
        actionId: "receive_coupon",
        pageId: "coupon_page",
      },
    ]);
  });

  it("reports HTTP action failures through the safe action executor", async () => {
    assert.throws(
      () =>
        createHttpActionHandler({
          baseUrl: "https://bff.example.com",
          endpoint: "https://unsafe.example.com/api/action",
        }),
      /endpoint must be a path/,
    );

    const errors = [];
    const schema = createLowcodePageSchema({
      pageId: "action_error_page",
      title: "动作错误页",
      actions: [{ id: "track_button", type: "tracking.click", params: { eventName: "button_click" } }],
    });
    const registry = createSafeActionRegistry({
      "tracking.click": createHttpActionHandler({
        baseUrl: "https://bff.example.com",
        endpoint: "/api/lowcode/actions/tracking-click",
        fetcher: async () => ({
          ok: false,
          status: 502,
          json: async () => ({ message: "bad gateway" }),
        }),
      }),
    });
    const executor = createSafeActionExecutor(registry, {
      onError(error, ref) {
        errors.push(`${ref.actionId}:${error.message}`);
      },
    });

    await assert.rejects(
      () => executor.execute({ actionId: "track_button" }, { schema, data: {} }),
      /HTTP action request failed: 502/,
    );
    assert.deepEqual(errors, ["track_button:HTTP action request failed: 502"]);
  });

  it("adapts safe action registry to renderer action executor", async () => {
    const calls = [];
    const schema = createLowcodePageSchema({
      pageId: "executor_page",
      title: "执行器页面",
      actions: [{ id: "go", type: "navigate", params: { url: "/activity" } }],
    });
    const registry = createSafeActionRegistry({
      navigate(config, context) {
        calls.push({
          actionId: config.id,
          url: config.params?.url,
          refActionId: context?.ref?.actionId,
          dataChannel: context?.data?.channel,
          pageId: context?.schema?.pageId,
        });
      },
    });
    const errors = [];
    const executor = createSafeActionExecutor(registry, {
      onError(error, ref) {
        errors.push(`${ref.actionId}:${error.message}`);
      },
    });

    await executor.execute({ actionId: "go" }, { schema, data: { channel: "h5" } });

    assert.deepEqual(calls, [
      {
        actionId: "go",
        url: "/activity",
        refActionId: "go",
        dataChannel: "h5",
        pageId: "executor_page",
      },
    ]);
    assert.throws(
      () => executor.execute({ actionId: "missing" }, { schema, data: {} }),
      /Lowcode action not found: missing/,
    );
    assert.deepEqual(errors, ["missing:Lowcode action not found: missing"]);
  });

  it("round-trips a valid schema through URL safe encoding", () => {
    const schema = createLowcodePageSchema({
      pageId: "url_schema_page",
      title: "URL Schema 页面",
      nodes: [],
    });

    const encoded = encodePageSchemaToUrlParam(schema);
    const decoded = decodePageSchemaFromUrlParam(encoded);

    assert.equal(encoded.includes("+"), false);
    assert.equal(encoded.includes("/"), false);
    assert.equal(decoded.pageId, "url_schema_page");
    assert.equal(decoded.title, "URL Schema 页面");
  });

  it("rejects invalid encoded schema payloads", () => {
    const invalid = encodePageSchemaToUrlParam({ schemaVersion: "1.0.0" });

    assert.throws(() => decodePageSchemaFromUrlParam(invalid), /Invalid lowcode page schema/);
  });

  it("calls config platform HTTP endpoints through a typed client", async () => {
    const calls = [];
    const schema = createLowcodePageSchema({
      pageId: "platform_page",
      title: "配置平台页面",
    });
    const release = {
      id: "rel_001",
      kind: "draft",
      pageId: schema.pageId,
      pageVersion: schema.pageVersion,
      title: schema.title,
      note: "首版草稿",
      createdAt: "2026-07-31T00:00:00.000Z",
      schema,
    };
    const workflow = {
      pageId: schema.pageId,
      lock: {
        status: "locked-by-me",
        holder: { id: "op_001", name: "运营 A" },
        expiresAt: "2026-08-01T10:00:00.000Z",
      },
      approval: {
        status: "pending",
        submitter: { id: "op_001", name: "运营 A" },
        submittedAt: "2026-08-01T09:30:00.000Z",
      },
      updatedAt: "2026-08-01T09:30:00.000Z",
    };
    const draftSnapshot = {
      pageId: schema.pageId,
      schema,
      updatedAt: "2026-08-01T09:31:00.000Z",
      operator: { id: "op_001", name: "运营 A" },
    };
    const fetcher = async (input, init = {}) => {
      calls.push({ input, init });
      if (input.endsWith("/editor-draft-snapshot")) {
        return { ok: true, status: 200, json: async () => draftSnapshot };
      }
      if (input.endsWith("/draft")) {
        return { ok: true, status: 200, json: async () => schema };
      }
      if (input.includes("/workflow") || input.includes("/locks/") || input.includes("/approval/")) {
        return { ok: true, status: 200, json: async () => workflow };
      }
      if (input.includes("/releases?")) {
        return { ok: true, status: 200, json: async () => [release] };
      }
      return { ok: true, status: 200, json: async () => release };
    };
    const client = createHttpConfigPlatformClient({
      baseUrl: "https://platform.example.com/",
      fetcher,
      headers: { authorization: "Bearer token" },
    });

    assert.deepEqual(
      await client.saveDraft(schema, {
        note: "首版草稿",
        operator: { id: "op_001", name: "运营 A" },
      }),
      release,
    );
    assert.deepEqual(await client.listReleases("platform_page"), [release]);
    assert.deepEqual(await client.getDraft("platform_page"), schema);
    assert.deepEqual(await client.getEditorWorkflowState("platform_page"), workflow);
    assert.deepEqual(
      await client.acquireEditorLock({
        pageId: "platform_page",
        operator: { id: "op_001", name: "运营 A" },
        ttlSeconds: 120,
      }),
      workflow,
    );
    assert.deepEqual(
      await client.submitApproval({
        pageId: "platform_page",
        operator: { id: "op_001", name: "运营 A" },
        comment: "活动页待审核",
      }),
      workflow,
    );
    assert.deepEqual(
      await client.saveEditorDraftSnapshot({
        pageId: "platform_page",
        schema,
        operator: { id: "op_001", name: "运营 A" },
      }),
      draftSnapshot,
    );
    assert.deepEqual(await client.getEditorDraftSnapshot("platform_page"), draftSnapshot);

    assert.equal(calls[0].input, "https://platform.example.com/api/lowcode/pages/drafts");
    assert.equal(calls[0].init.method, "POST");
    assert.equal(calls[0].init.headers.authorization, "Bearer token");
    assert.equal(JSON.parse(calls[0].init.body).pageStatus, "draft");
    assert.equal(JSON.parse(calls[0].init.body).note, "首版草稿");
    assert.equal(JSON.parse(calls[0].init.body).operator.id, "op_001");
    assert.equal(calls[1].input, "https://platform.example.com/api/lowcode/pages/releases?pageId=platform_page");
    assert.equal(calls[2].input, "https://platform.example.com/api/lowcode/pages/platform_page/draft");
    assert.equal(calls[3].input, "https://platform.example.com/api/lowcode/pages/platform_page/workflow");
    assert.equal(calls[4].input, "https://platform.example.com/api/lowcode/pages/platform_page/locks/acquire");
    assert.equal(JSON.parse(calls[4].init.body).ttlSeconds, 120);
    assert.equal(calls[5].input, "https://platform.example.com/api/lowcode/pages/platform_page/approval/submit");
    assert.equal(JSON.parse(calls[5].init.body).comment, "活动页待审核");
    assert.equal(calls[6].input, "https://platform.example.com/api/lowcode/pages/platform_page/editor-draft-snapshot");
    assert.equal(calls[6].init.method, "PUT");
    assert.equal(JSON.parse(calls[6].init.body).schema.pageId, "platform_page");
    assert.equal(calls[7].input, "https://platform.example.com/api/lowcode/pages/platform_page/editor-draft-snapshot");
    assert.equal(calls[7].init.method, "GET");
  });

  it("surfaces config platform HTTP errors", async () => {
    const client = createHttpConfigPlatformClient({
      baseUrl: "https://platform.example.com",
      fetcher: async () => ({ ok: false, status: 500, json: async () => ({ message: "failed" }) }),
    });

    await assert.rejects(
      () => client.publishPage(createLowcodePageSchema({ pageId: "bad", title: "错误页" })),
      /Config platform request failed: 500/,
    );
  });

  it("loads runtime schema from encoded URL schema", async () => {
    const schema = createLowcodePageSchema({
      pageId: "encoded_runtime_page",
      title: "Encoded Runtime 页面",
    });
    const encodedSchema = encodePageSchemaToUrlParam(schema);

    const result = await loadLowcodeRuntimeSchema({ encodedSchema });

    assert.equal(result.source, "encoded");
    assert.equal(result.schema.pageId, "encoded_runtime_page");
    assert.equal(result.error, undefined);
  });

  it("loads runtime schema from releaseId or pageId through config platform client", async () => {
    const releaseSchema = createLowcodePageSchema({
      pageId: "release_page",
      title: "预览页面",
    });
    const publishedSchema = createLowcodePageSchema({
      pageId: "published_page",
      title: "线上页面",
    });
    const client = {
      saveDraft: async () => {
        throw new Error("unused");
      },
      createPreview: async () => {
        throw new Error("unused");
      },
      publishPage: async () => {
        throw new Error("unused");
      },
      listReleases: async () => [],
      getRelease: async (releaseId) => ({
        id: releaseId,
        kind: "preview",
        pageId: releaseSchema.pageId,
        pageVersion: releaseSchema.pageVersion,
        title: releaseSchema.title,
        createdAt: "2026-07-31T00:00:00.000Z",
        schema: releaseSchema,
      }),
      getDraft: async () => undefined,
      getPublished: async () => publishedSchema,
    };

    const releaseResult = await loadLowcodeRuntimeSchema({ releaseId: "rel_preview", configPlatformClient: client });
    const publishedResult = await loadLowcodeRuntimeSchema({ pageId: "published_page", configPlatformClient: client });

    assert.equal(releaseResult.source, "release");
    assert.equal(releaseResult.schema.pageId, "release_page");
    assert.equal(publishedResult.source, "published");
    assert.equal(publishedResult.schema.pageId, "published_page");
  });

  it("falls back when runtime schema loading fails", async () => {
    const fallbackSchema = createLowcodePageSchema({
      pageId: "fallback_page",
      title: "兜底页面",
    });
    const badEncodedSchema = encodePageSchemaToUrlParam({ schemaVersion: "1.0.0" });

    const invalidResult = await loadLowcodeRuntimeSchema({ encodedSchema: badEncodedSchema, fallbackSchema });
    const missingClientResult = await loadLowcodeRuntimeSchema({ pageId: "page_without_client", fallbackSchema });

    assert.equal(invalidResult.source, "fallback");
    assert.equal(invalidResult.schema.pageId, "fallback_page");
    assert.match(invalidResult.error, /Invalid lowcode page schema/);
    assert.equal(missingClientResult.source, "fallback");
    assert.equal(missingClientResult.schema.pageId, "fallback_page");
    assert.match(missingClientResult.error, /Config platform client is required/);
  });
});
