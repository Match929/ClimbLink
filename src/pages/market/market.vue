<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">Climbing Market</text>
      <view class="add-btn" @click="uni.navigateTo({url: '/pages/market-item-create/market-item-create'})">
        <text class="add-icon">+</text>
      </view>
    </view>
    
    <view class="content">
      <!-- 搜索栏 -->
      <view class="search-section">
        <input class="search-input" placeholder="Search equipment..." />
      </view>
      
      <!-- 分类筛选 -->
      <view class="category-section">
        <scroll-view class="category-scroll" scroll-x>
          <view 
            v-for="(category, index) in categories" 
            :key="index"
            class="category-item"
            :class="{ active: activeCategory === index }"
            @click="activeCategory = index"
          >
            <text>{{ category.icon }}</text>
            <text>{{ category.name }}</text>
          </view>
        </scroll-view>
      </view>
      
      <!-- 商品网格 -->
      <view class="items-grid">
        <view 
          v-for="(item, index) in filteredItems" 
          :key="index"
          class="item-card"
          @click="viewItem(item)"
        >
          <image class="item-image" :src="item.image" mode="aspectFill" />
          <view class="item-info">
            <text class="item-title">{{ item.title }}</text>
            <text class="item-price">${{ item.price }}</text>
            <view class="item-bottom">
              <text class="item-location">{{ item.location }}</text>
              <text class="item-date">{{ item.date }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <view class="empty-state" v-if="filteredItems.length === 0">
        <text class="empty-icon">🛒</text>
        <text class="empty-text">No items found</text>
        <text class="empty-subtext">Try a different search term!</text>
      </view>
    </view>
    
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeCategory = ref(0)

const categories = [
  { icon: '👟', name: 'Shoes' },
  { icon: '🎒', name: 'Chalk' },
  { icon: '🎯', name: 'Holds' },
  { icon: '🧗', name: 'Ropes' },
  { icon: '👕', name: 'Apparel' },
  { icon: '📦', name: 'All' }
]

const items = ref([
  {
    id: 1,
    title: 'La Sportiva Solution - Size 42',
    price: 85,
    location: 'Rock Time Gym',
    date: 'Today',
    image: 'https://images.unsplash.com/photo-1585950263799-4106e7687d05?w=400&h=400&fit=crop',
    category: 0
  },
  {
    id: 2,
    title: 'Friction Labs Chalk Bucket',
    price: 25,
    location: 'Peak Gym',
    date: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: 1
  },
  {
    id: 3,
    title: 'Black Diamond Momentum Harness',
    price: 55,
    location: 'Climber\'s Paradise',
    date: '2 days ago',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
    category: 3
  },
  {
    id: 4,
    title: 'Climbing Brush Set',
    price: 18,
    location: 'Rock Time Gym',
    date: '3 days ago',
    image: 'https://images.unsplash.com/photo-1626291543912-80491b201013?w=400&h=400&fit=crop',
    category: 1
  },
  {
    id: 5,
    title: 'Mammut 60m Rope - 9.8mm',
    price: 150,
    location: 'Climber\'s Paradise',
    date: '4 days ago',
    image: 'https://images.unsplash.com/photo-1630246836281-f18e174ce8a9?w=400&h=400&fit=crop',
    category: 3
  },
  {
    id: 6,
    title: 'Prana Climbing Pants - M',
    price: 45,
    location: 'Peak Gym',
    date: '5 days ago',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop',
    category: 4
  }
])

const filteredItems = computed(() => {
  if (activeCategory.value === categories.length - 1) {
    return items.value
  }
  return items.value.filter(item => item.category === activeCategory.value)
})

const goBack = () => {
  uni.navigateBack()
}

const viewItem = (item) => {
  uni.navigateTo({
    url: '/pages/market-item-detail/market-item-detail?id=' + item.id
  })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f9f5;
}

/* 顶部导航 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  padding-top: calc(30rpx + env(safe-area-inset-top));
  background-color: #ffffff;
  border-bottom: 2rpx solid #eee;
}

.back-btn,
.add-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon,
.add-icon {
  font-size: 40rpx;
  color: #333;
}

.header-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.content {
  padding: 30rpx;
  padding-bottom: 200rpx;
}

/* 搜索栏 */
.search-section {
  margin-bottom: 30rpx;
}

.search-input {
  width: 100%;
  padding: 28rpx 32rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  font-size: 28rpx;
}

/* 分类筛选 */
.category-section {
  margin-bottom: 30rpx;
}

.category-scroll {
  white-space: nowrap;
}

.category-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 20rpx 28rpx;
  margin-right: 20rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  border: 2rpx solid transparent;
}

.category-item.active {
  background-color: #e8f5e0;
  border-color: #7eb662;
}

.category-item text:first-child {
  font-size: 36rpx;
}

.category-item text:last-child {
  font-size: 22rpx;
  color: #666;
}

.category-item.active text:last-child {
  color: #5a8a3f;
  font-weight: 500;
}

/* 商品网格 */
.items-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}

.item-card {
  width: calc(50% - 12rpx);
  background-color: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
}

.item-image {
  width: 100%;
  height: 300rpx;
}

.item-info {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.item-title {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
  line-height: 1.3;
}

.item-price {
  font-size: 30rpx;
  font-weight: bold;
  color: #7eb662;
}

.item-bottom {
  display: flex;
  justify-content: space-between;
  margin-top: 6rpx;
}

.item-location,
.item-date {
  font-size: 22rpx;
  color: #999;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.empty-subtext {
  font-size: 24rpx;
  color: #999;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
