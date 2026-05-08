<template>
  <view class="container">
    <!-- 顶部图片区域 -->
    <view class="image-section">
      <image class="activity-image" :src="activity.image" mode="aspectFill" />
      <!-- 返回按钮 -->
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <!-- 收藏按钮 -->
      <view class="favorite-btn" @click="toggleFavorite">
        <text class="favorite-icon">{{ isFavorite ? '❤️' : '🤍' }}</text>
      </view>
    </view>
    
    <!-- 基本信息 -->
    <view class="info-section">
      <view class="activity-header">
        <view>
          <text class="activity-title">{{ activity.title }}</text>
          <view class="activity-tags">
            <view class="activity-tag">{{ activity.type }}</view>
            <view class="activity-tag">{{ activity.level }}</view>
          </view>
        </view>
      </view>
      
      <!-- 主办方信息 -->
      <view class="organizer-section">
        <image class="organizer-avatar" :src="activity.organizer.avatar" mode="aspectFill" />
        <view class="organizer-info">
          <text class="organizer-name">{{ activity.organizer.name }}</text>
          <text class="organizer-label">Organizer</text>
        </view>
      </view>
      
      <!-- 活动详情信息 -->
      <view class="detail-list">
        <view class="detail-item">
          <view class="detail-icon-wrap">
            <text class="detail-icon">📍</text>
          </view>
          <view class="detail-content">
            <text class="detail-label">Location</text>
            <text class="detail-value">{{ activity.location }}</text>
          </view>
        </view>
        
        <view class="detail-item">
          <view class="detail-icon-wrap">
            <text class="detail-icon">📅</text>
          </view>
          <view class="detail-content">
            <text class="detail-label">Date</text>
            <text class="detail-value">{{ activity.date }}</text>
          </view>
        </view>
        
        <view class="detail-item">
          <view class="detail-icon-wrap">
            <text class="detail-icon">⏰</text>
          </view>
          <view class="detail-content">
            <text class="detail-label">Time</text>
            <text class="detail-value">{{ activity.time }}</text>
          </view>
        </view>
        
        <view class="detail-item">
          <view class="detail-icon-wrap">
            <text class="detail-icon">👥</text>
          </view>
          <view class="detail-content">
            <text class="detail-label">Participants</text>
            <text class="detail-value">{{ activity.currentParticipants }}/{{ activity.maxParticipants }} people</text>
          </view>
        </view>
        
        <view class="detail-item">
          <view class="detail-icon-wrap">
            <text class="detail-icon">💰</text>
          </view>
          <view class="detail-content">
            <text class="detail-label">Price</text>
            <text class="detail-value price">{{ activity.price }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 活动介绍 -->
    <view class="about-section">
      <text class="section-title">About</text>
      <text class="about-text">{{ activity.description }}</text>
    </view>
    
    <!-- 装备要求 -->
    <view class="equipment-section">
      <text class="section-title">Equipment</text>
      <view class="equipment-list">
        <view class="equipment-item" v-for="(item, index) in activity.equipment" :key="index">
          <text class="equipment-check">✓</text>
          <text class="equipment-name">{{ item }}</text>
        </view>
      </view>
    </view>
    
    <!-- 参与者列表 -->
    <view class="participants-section">
      <view class="section-header">
        <text class="section-title">Participants ({{ activity.currentParticipants }})</text>
      </view>
      <view class="participants-list">
        <view class="participant-item" v-for="(participant, index) in activity.participants" :key="index">
          <image class="participant-avatar" :src="participant.avatar" mode="aspectFill" />
          <view class="participant-info">
            <text class="participant-name">{{ participant.name }}</text>
            <text class="participant-level">{{ participant.level }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="price-info">
        <text class="price-label">Price</text>
        <text class="price-value">{{ activity.price }}</text>
      </view>
      <view class="bottom-btn" @click="handleJoin">
        <text class="bottom-btn-text">Join Activity</text>
      </view>
    </view>
    
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const isFavorite = ref(false)

const activity = ref({
  id: 1,
  title: 'Weekend Beginner Bouldering Class',
  type: 'Beginner',
  level: 'V0-V2',
  image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800',
  location: 'Rock Time Gym, 328 Xinghu St',
  date: 'Saturday, March 28, 2026',
  time: '2:00 PM - 4:00 PM',
  currentParticipants: 8,
  maxParticipants: 12,
  price: '$25 per person',
  description: 'Join us for a fun and educational bouldering session perfect for beginners! Learn basic techniques, safety rules, and how to read routes with our experienced coaches. No prior experience needed.',
  equipment: ['Climbing shoes', 'Chalk bag', 'Comfortable clothing', 'Water bottle'],
  organizer: {
    name: 'Rock Time Coaches',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coaches'
  },
  participants: [
    { name: 'Xiao Ming', level: 'V0', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ming' },
    { name: 'Hong', level: 'V1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hong' },
    { name: 'Li', level: 'V1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li' },
    { name: 'Wang', level: 'V2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang' },
    { name: 'Zhang', level: 'V0', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang' },
    { name: 'Chen', level: 'V1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen' },
    { name: 'Liu', level: 'V2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liu' },
    { name: 'Zhou', level: 'V0', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhou' }
  ]
})

const goBack = () => {
  uni.navigateBack()
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const handleJoin = () => {
  uni.showToast({
    title: 'Joined successfully!',
    icon: 'success'
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f9f5;
  padding-bottom: 200rpx;
}

/* 图片区域 */
.image-section {
  position: relative;
  width: 100%;
  height: 480rpx;
}

.activity-image {
  width: 100%;
  height: 100%;
}

.back-btn {
  position: absolute;
  top: 40rpx;
  left: 30rpx;
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.back-icon {
  font-size: 36rpx;
  color: #333;
}

.favorite-btn {
  position: absolute;
  top: 40rpx;
  right: 30rpx;
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.favorite-icon {
  font-size: 36rpx;
}

/* 信息区域 */
.info-section {
  background-color: #ffffff;
  padding: 40rpx 30rpx;
  margin-top: -30rpx;
  border-radius: 30rpx 30rpx 0 0;
  position: relative;
  z-index: 5;
}

.activity-header {
  margin-bottom: 30rpx;
}

.activity-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

.activity-tags {
  display: flex;
  gap: 12rpx;
}

.activity-tag {
  padding: 8rpx 20rpx;
  background-color: #d4e7c5;
  color: #5a8a3f;
  border-radius: 30rpx;
  font-size: 22rpx;
}

/* 主办方 */
.organizer-section {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 30rpx;
  padding-bottom: 30rpx;
  border-bottom: 2rpx solid #eee;
}

.organizer-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.organizer-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.organizer-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.organizer-label {
  font-size: 22rpx;
  color: #999;
}

/* 详情列表 */
.detail-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
}

.detail-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  background-color: #f0f7ec;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-icon {
  font-size: 32rpx;
}

.detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.detail-label {
  font-size: 22rpx;
  color: #999;
}

.detail-value {
  font-size: 26rpx;
  color: #333;
}

.detail-value.price {
  font-size: 28rpx;
  font-weight: 600;
  color: #7eb662;
}

/* 通用区块 */
.about-section,
.equipment-section,
.participants-section {
  background-color: #ffffff;
  padding: 30rpx;
  margin-top: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

/* 活动介绍 */
.about-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.8;
  display: block;
}

/* 装备要求 */
.equipment-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.equipment-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.equipment-check {
  font-size: 24rpx;
  color: #7eb662;
}

.equipment-name {
  font-size: 26rpx;
  color: #666;
}

/* 参与者 */
.section-header {
  margin-bottom: 20rpx;
}

.participants-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.participant-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.participant-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.participant-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.participant-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.participant-level {
  font-size: 22rpx;
  color: #999;
}

/* 底部操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-top: 2rpx solid #eee;
  padding: 24rpx 30rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  gap: 30rpx;
  z-index: 100;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.price-label {
  font-size: 22rpx;
  color: #999;
}

.price-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #7eb662;
}

.bottom-btn {
  flex: 1;
  padding: 28rpx;
  background: linear-gradient(to right, #7eb662, #6a9b54);
  border-radius: 16rpx;
  text-align: center;
}

.bottom-btn-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #ffffff;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
