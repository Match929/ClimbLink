<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <view class="empty-spacer"></view>
      <view class="more-btn">
        <text>⋮</text>
      </view>
    </view>
    
    <scroll-view class="content" scroll-y>
      <!-- 商品图片 -->
      <image class="item-image" :src="item.image" mode="aspectFill" />
      
      <!-- 商品信息 -->
      <view class="item-info">
        <view class="price-row">
          <text class="item-price">${{ item.price }}</text>
          <text class="item-status">Available</text>
        </view>
        <text class="item-title">{{ item.title }}</text>
        <view class="item-meta">
          <text class="item-location">{{ item.location }}</text>
          <text class="item-date">{{ item.date }}</text>
        </view>
      </view>
      
      <!-- 卖家信息 -->
      <view class="seller-section">
        <view class="seller-info">
          <image class="seller-avatar" :src="item.seller.avatar" mode="aspectFill" />
          <view class="seller-details">
            <text class="seller-name">{{ item.seller.name }}</text>
            <text class="seller-level">{{ item.seller.level }}</text>
          </view>
        </view>
        <view class="seller-actions">
          <view class="message-btn" @click="contactSeller">
            <text>Message</text>
          </view>
        </view>
      </view>
      
      <!-- 商品描述 -->
      <view class="description-section">
        <text class="section-title">Description</text>
        <text class="description-text">{{ item.description }}</text>
      </view>
      
      <!-- 商品规格 -->
      <view class="specs-section">
        <text class="section-title">Details</text>
        <view class="specs-list">
          <view class="spec-item" v-for="(spec, index) in item.specs" :key="index">
            <text class="spec-label">{{ spec.label }}</text>
            <text class="spec-value">{{ spec.value }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-btn" @click="goBack">
        <text>Back</text>
      </view>
      <view class="primary-btn" @click="contactSeller">
        <text>Contact Seller</text>
      </view>
    </view>
    
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const item = ref({
  id: 1,
  title: 'La Sportiva Solution - Size 42',
  price: 85,
  location: 'Rock Time Gym',
  date: 'Today',
  image: 'https://images.unsplash.com/photo-1585950263799-4106e7687d05?w=800&h=800&fit=crop',
  seller: {
    name: 'Chris Sharma',
    level: 'V10+',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris'
  },
  description: 'Selling my trusted La Sportiva Solutions. Size 42 EU (9 US men). Used but in excellent condition - still plenty of rubber left. Only selling because I sized down.',
  specs: [
    { label: 'Condition', value: 'Excellent' },
    { label: 'Size', value: '42 EU / 9 US' },
    { label: 'Age', value: '6 months' },
    { label: 'Resoles', value: '0' }
  ]
})

const goBack = () => {
  uni.navigateBack()
}

const contactSeller = () => {
  uni.navigateTo({
    url: '/pages/chat/chat'
  })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f9f5;
  display: flex;
  flex-direction: column;
}

/* 顶部导航 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  padding-top: calc(30rpx + env(safe-area-inset-top));
  z-index: 100;
}

.back-btn,
.more-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
}

.back-icon {
  font-size: 40rpx;
  color: #333;
}

.more-btn text {
  font-size: 40rpx;
  color: #333;
}

.empty-spacer {
  width: 80rpx;
}

.content {
  flex: 1;
  margin-bottom: 180rpx;
}

/* 商品图片 */
.item-image {
  width: 100%;
  height: 600rpx;
}

/* 商品信息 */
.item-info {
  padding: 30rpx;
  background-color: #ffffff;
  margin-bottom: 20rpx;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.item-price {
  font-size: 48rpx;
  font-weight: bold;
  color: #7eb662;
}

.item-status {
  padding: 8rpx 16rpx;
  background-color: #e8f5e0;
  color: #5a8a3f;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 500;
}

.item-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.item-meta {
  display: flex;
  gap: 20rpx;
}

.item-location,
.item-date {
  font-size: 24rpx;
  color: #999;
}

/* 卖家信息 */
.seller-section {
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.seller-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.seller-details {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.seller-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.seller-level {
  font-size: 22rpx;
  color: #999;
}

.message-btn {
  padding: 16rpx 30rpx;
  border: 2rpx solid #7eb662;
  border-radius: 30rpx;
}

.message-btn text {
  font-size: 24rpx;
  color: #7eb662;
  font-weight: 500;
}

/* 描述和规格 */
.description-section,
.specs-section {
  background-color: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.description-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.specs-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.spec-item:last-child {
  border-bottom: none;
}

.spec-label {
  font-size: 24rpx;
  color: #999;
}

.spec-value {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

/* 底部操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 24rpx 30rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background-color: #ffffff;
  border-top: 2rpx solid #eee;
}

.action-btn {
  flex: 1;
  padding: 28rpx;
  background-color: #f5f5f5;
  border-radius: 16rpx;
  text-align: center;
}

.action-btn text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.primary-btn {
  flex: 2;
  padding: 28rpx;
  background-color: #7eb662;
  border-radius: 16rpx;
  text-align: center;
}

.primary-btn text {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 600;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
