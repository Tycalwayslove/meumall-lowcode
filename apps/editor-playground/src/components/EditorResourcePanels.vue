<script setup lang="ts">
import { Database, Image, Search, Video } from "@lucide/vue";
import type {
  LowcodeCouponResource,
  LowcodeImageAssetResource,
  LowcodeProductResource,
  LowcodeStoreExpertResource,
  LowcodeVideoAssetResource,
} from "@meumall/lowcode-adapters";

interface ImagePropOption {
  name: string;
  label: string;
}

defineProps<{
  canUseAssetLibrary: boolean;
  imagePropOptions: readonly ImagePropOption[];
  assetTargetPropName: string;
  assetKeyword: string;
  assetCategory: string;
  assetCategories: readonly string[];
  filteredAssets: readonly LowcodeImageAssetResource[];
  isAssetSearching: boolean;
  canUseVideoLibrary: boolean;
  videoPropOptions: readonly ImagePropOption[];
  videoTargetPropName: string;
  videoKeyword: string;
  videoCategory: string;
  videoCategories: readonly string[];
  filteredVideos: readonly LowcodeVideoAssetResource[];
  isVideoSearching: boolean;
  isProductMaterialSelected: boolean;
  productKeyword: string;
  filteredProducts: readonly LowcodeProductResource[];
  selectedProductIds: readonly string[];
  selectedProductCount: number;
  isProductSearching: boolean;
  hasProductDataBinding: boolean;
  canUseCouponLibrary: boolean;
  isCouponSectionSelected: boolean;
  couponKeyword: string;
  filteredCoupons: readonly LowcodeCouponResource[];
  selectedCouponIds: readonly string[];
  selectedCouponCount: number;
  isCouponSearching: boolean;
  isStoreExpertMaterialSelected: boolean;
  storeExpertKeyword: string;
  storeExpertCategory: string;
  storeExpertCategories: readonly string[];
  filteredStoreExperts: readonly LowcodeStoreExpertResource[];
  selectedStoreExpertIds: readonly string[];
  selectedStoreExpertCount: number;
  isStoreExpertSearching: boolean;
  hasStoreExpertDataBinding: boolean;
}>();

const emit = defineEmits<{
  "update:assetTargetPropName": [value: string];
  "update:assetKeyword": [value: string];
  "update:assetCategory": [value: string];
  "apply-asset": [asset: LowcodeImageAssetResource];
  "update:videoTargetPropName": [value: string];
  "update:videoKeyword": [value: string];
  "update:videoCategory": [value: string];
  "apply-video": [asset: LowcodeVideoAssetResource];
  "update:productKeyword": [value: string];
  "toggle-product": [productId: string];
  "apply-sample-products": [];
  "apply-products": [];
  "bind-products-data-source": [];
  "clear-products": [];
  "update:couponKeyword": [value: string];
  "toggle-coupon": [couponId: string];
  "apply-coupons": [];
  "clear-coupons": [];
  "update:storeExpertKeyword": [value: string];
  "update:storeExpertCategory": [value: string];
  "toggle-store-expert": [itemId: string];
  "apply-store-experts": [];
  "bind-store-experts-data-source": [];
  "clear-store-experts": [];
}>();
</script>

<template>
  <div v-if="canUseAssetLibrary" class="resource-panel">
    <div class="resource-panel-head">
      <div>
        <strong>
          <Image :size="15" />
          <span>素材库</span>
        </strong>
        <small>选择图片后写入当前节点</small>
      </div>
      <select
        :value="assetTargetPropName"
        aria-label="素材写入字段"
        @change="emit('update:assetTargetPropName', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="option in imagePropOptions" :key="option.name" :value="option.name">
          {{ option.label }}
        </option>
      </select>
    </div>
    <div class="resource-filters">
      <label class="search-field">
        <Search :size="14" />
        <input
          :value="assetKeyword"
          placeholder="搜索素材"
          @input="emit('update:assetKeyword', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <select
        :value="assetCategory"
        aria-label="素材分类"
        @change="emit('update:assetCategory', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="category in assetCategories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>
    <div class="asset-library">
      <button
        v-for="asset in filteredAssets"
        :key="asset.id"
        type="button"
        class="asset-card"
        @click="emit('apply-asset', asset)"
      >
        <img :src="asset.url" alt="" />
        <span>
          <strong>{{ asset.title }}</strong>
          <small>{{ asset.category }}</small>
        </span>
      </button>
    </div>
    <div v-if="isAssetSearching" class="mini-empty">素材搜索中</div>
    <div v-else-if="!filteredAssets.length" class="mini-empty">没有匹配素材</div>
  </div>

  <div v-if="canUseVideoLibrary" class="resource-panel video-resource-panel">
    <div class="resource-panel-head">
      <div>
        <strong>
          <Video :size="15" />
          <span>视频素材库</span>
        </strong>
        <small>选择视频后写入当前节点</small>
      </div>
      <select
        :value="videoTargetPropName"
        aria-label="视频写入字段"
        @change="emit('update:videoTargetPropName', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="option in videoPropOptions" :key="option.name" :value="option.name">
          {{ option.label }}
        </option>
      </select>
    </div>
    <div class="resource-filters">
      <label class="search-field">
        <Search :size="14" />
        <input
          :value="videoKeyword"
          placeholder="搜索视频素材"
          @input="emit('update:videoKeyword', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <select
        :value="videoCategory"
        aria-label="视频分类"
        @change="emit('update:videoCategory', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="category in videoCategories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>
    <div class="asset-library video-asset-library">
      <button
        v-for="video in filteredVideos"
        :key="video.id"
        type="button"
        class="asset-card video-asset-card"
        @click="emit('apply-video', video)"
      >
        <img v-if="video.posterUrl" :src="video.posterUrl" alt="" />
        <span v-else class="video-empty-cover">
          <Video :size="18" />
        </span>
        <span>
          <strong>{{ video.title }}</strong>
          <small>{{ video.category }}{{ video.durationText ? ` · ${video.durationText}` : "" }}</small>
        </span>
      </button>
    </div>
    <div v-if="isVideoSearching" class="mini-empty">视频搜索中</div>
    <div v-else-if="!filteredVideos.length" class="mini-empty">没有匹配视频</div>
  </div>

  <div v-if="isProductMaterialSelected" class="resource-panel">
    <div class="resource-panel-head">
      <div>
        <strong>
          <Database :size="15" />
          <span>商品选择器</span>
        </strong>
        <small>已选 {{ selectedProductCount }} 个商品</small>
      </div>
      <button type="button" class="mini-button" @click="emit('apply-sample-products')">示例商品</button>
    </div>
    <label class="search-field product-search">
      <Search :size="14" />
      <input
        :value="productKeyword"
        placeholder="搜索商品名称、SKU 或标签"
        @input="emit('update:productKeyword', ($event.target as HTMLInputElement).value)"
      />
    </label>
    <div v-if="hasProductDataBinding" class="resource-hint">
      当前节点正在绑定数据源 products，写入静态商品会取消本节点 items 绑定。
    </div>
    <div class="product-picker">
      <label
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-option"
        :class="{ selected: selectedProductIds.includes(product.id) }"
      >
        <input
          type="checkbox"
          :checked="selectedProductIds.includes(product.id)"
          @change="emit('toggle-product', product.id)"
        />
        <img :src="product.imageUrl" alt="" />
        <span>
          <strong>{{ product.title }}</strong>
          <small>{{ product.id }} / {{ product.desc }}</small>
          <em>{{ product.priceText }}</em>
        </span>
      </label>
    </div>
    <div v-if="isProductSearching" class="mini-empty">商品搜索中</div>
    <div v-else-if="!filteredProducts.length" class="mini-empty">没有匹配商品</div>
    <div class="resource-actions">
      <button type="button" @click="emit('apply-products')">应用选中商品</button>
      <button type="button" @click="emit('bind-products-data-source')">绑定数据源 products</button>
      <button type="button" class="ghost-danger" @click="emit('clear-products')">清空静态商品</button>
    </div>
  </div>

  <div v-if="canUseCouponLibrary" class="resource-panel">
    <div class="resource-panel-head">
      <div>
        <strong>
          <Database :size="15" />
          <span>优惠券库</span>
        </strong>
        <small>{{ isCouponSectionSelected ? "选择 1 张主券" : `已选 ${selectedCouponCount} 张优惠券` }}</small>
      </div>
    </div>
    <label class="search-field product-search">
      <Search :size="14" />
      <input
        :value="couponKeyword"
        placeholder="搜索优惠券名称、门槛或标签"
        @input="emit('update:couponKeyword', ($event.target as HTMLInputElement).value)"
      />
    </label>
    <div class="product-picker">
      <label
        v-for="coupon in filteredCoupons"
        :key="coupon.id"
        class="product-option coupon-option"
        :class="{ selected: selectedCouponIds.includes(coupon.id) }"
      >
        <input
          :type="isCouponSectionSelected ? 'radio' : 'checkbox'"
          name="coupon-resource"
          :checked="selectedCouponIds.includes(coupon.id)"
          @change="emit('toggle-coupon', coupon.id)"
        />
        <span>
          <strong>{{ coupon.title }}</strong>
          <small>{{ coupon.id }} / {{ coupon.thresholdText }}</small>
          <em>{{ coupon.valueText }} · {{ coupon.expireText }}</em>
        </span>
      </label>
    </div>
    <div v-if="isCouponSearching" class="mini-empty">优惠券搜索中</div>
    <div v-else-if="!filteredCoupons.length" class="mini-empty">没有匹配优惠券</div>
    <div class="resource-actions">
      <button type="button" @click="emit('apply-coupons')">{{ isCouponSectionSelected ? "应用主券" : "应用选中券" }}</button>
      <button type="button" class="ghost-danger" @click="emit('clear-coupons')">清空选择</button>
    </div>
  </div>

  <div v-if="isStoreExpertMaterialSelected" class="resource-panel">
    <div class="resource-panel-head">
      <div>
        <strong>
          <Database :size="15" />
          <span>门店/达人库</span>
        </strong>
        <small>已选 {{ selectedStoreExpertCount }} 个推荐项</small>
      </div>
    </div>
    <div class="resource-filters">
      <label class="search-field">
        <Search :size="14" />
        <input
          :value="storeExpertKeyword"
          placeholder="搜索门店、达人或标签"
          @input="emit('update:storeExpertKeyword', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <select
        :value="storeExpertCategory"
        aria-label="门店达人分类"
        @change="emit('update:storeExpertCategory', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="category in storeExpertCategories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>
    <div v-if="hasStoreExpertDataBinding" class="resource-hint">
      当前节点正在绑定数据源 stores，写入静态推荐会取消本节点 items 绑定。
    </div>
    <div class="product-picker">
      <label
        v-for="item in filteredStoreExperts"
        :key="item.id"
        class="product-option"
        :class="{ selected: selectedStoreExpertIds.includes(item.id) }"
      >
        <input
          type="checkbox"
          :checked="selectedStoreExpertIds.includes(item.id)"
          @change="emit('toggle-store-expert', item.id)"
        />
        <img :src="item.imageUrl" alt="" />
        <span>
          <strong>{{ item.title }}</strong>
          <small>{{ item.typeText }} / {{ item.subtitle }}</small>
          <em>{{ item.metricText }} {{ item.desc }}</em>
        </span>
      </label>
    </div>
    <div v-if="isStoreExpertSearching" class="mini-empty">门店/达人搜索中</div>
    <div v-else-if="!filteredStoreExperts.length" class="mini-empty">没有匹配推荐项</div>
    <div class="resource-actions">
      <button type="button" @click="emit('apply-store-experts')">应用选中推荐</button>
      <button type="button" @click="emit('bind-store-experts-data-source')">绑定数据源 stores</button>
      <button type="button" class="ghost-danger" @click="emit('clear-store-experts')">清空静态推荐</button>
    </div>
  </div>
</template>
