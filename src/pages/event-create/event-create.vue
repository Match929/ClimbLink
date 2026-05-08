<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">Create Event</text>
      <view class="post-btn" @click="postEvent">
        <text>Post</text>
      </view>
    </view>
    
    <scroll-view class="content" scroll-y>
      <!-- 图片上传 -->
      <view class="upload-section">
        <view class="upload-placeholder">
          <text class="upload-icon">📷</text>
          <text class="upload-text">Add Event Photo</text>
        </view>
      </view>
      
      <!-- 表单部分 -->
      <view class="form-section">
        <view class="form-group">
          <text class="form-label">Event Title</text>
          <input class="form-input" placeholder="What's happening?" />
        </view>
        
        <view class="form-group">
          <text class="form-label">Date & Time</text>
          <picker mode="date">
            <view class="picker-display">
              <text>Select date</text>
              <text>›</text>
            </view>
          </picker>
        </view>
        
        <view class="form-group">
          <text class="form-label">Location</text>
          <picker mode="selector" :range="locations">
            <view class="picker-display">
              <text>{{ locations[0] }}</text>
              <text>›</text>
            </view>
          </picker>
        </view>
        
        <view class="form-group">
          <text class="form-label">Climbing Level</text>
          <picker mode="selector" :range="levels">
            <view class="picker-display">
              <text>{{ levels[0] }}</text>
              <text>›</text>
            </view>
          </picker>
        </view>
        
        <view class="form-group">
          <text class="form-label">Event Type</text>
          <view class="type-options">
            <view 
              v-for="(type, index) in types" 
              :key="index"
              class="type-option"
              :class="{ active: activeType === index }"
              @click="activeType = index"
            >
              <text>{{ type.icon }}</text>
              <text>{{ type.name }}</text>
            </view>
          </view>
        </view>
        
        <view class="form-group">
          <text class="form-label">Description</text>
          <textarea class="form-textarea" placeholder="Tell people about your event..." />
        </view>
      </view>
    </scroll-view>
    
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const activeType = ref(0)

const locations = ['Rock Time Gym', 'Climber\'s Paradise', 'Peak Gym', 'Other']
const levels = ['All levels', 'V0-V1', 'V1-V2', 'V2-V3', 'V3-V4', 'V4-V5', 'V5+']
const types = [
  { icon: '🧗', name: 'Climb' },
  { icon: '💪', name: 'Workout' },
  { icon: '🎉', name: 'Social' }
]

const goBack = () => {
  uni.navigateBack()
}

const postEvent = () => {
  uni.showToast({
    title: 'Event created!',
    icon: 'success'
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  padding-top: calc(30rpx + env(safe-area-inset-top));
  background-color: #ffffff;
  border-bottom: 2rpx solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
  overflow: hidden;
}

.back-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 40rpx;
  color: #333;
}

.header-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.post-btn {
  padding: 12rpx 28rpx;
  background-color: #7eb662;
  border-radius: 30rpx;
}

.post-btn text {
  font-size: 26rpx;
  font-weight: 500;
  color: #ffffff;
}

.content {
  flex: 1;
}

/* 图片上传 */
.upload-section {
  padding: 40rpx 30rpx;
  background-color: #ffffff;
  margin-bottom: 20rpx;
}

.upload-placeholder {
  width: 100%;
  height: 300rpx;
  background-color: #f5f9f5;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  border: 2rpx dashed #d4e7c5;
}

.upload-icon {
  font-size: 60rpx;
}

.upload-text {
  font-size: 26rpx;
  color: #7eb662;
}

/* 表单 */
.form-section {
  background-color: #ffffff;
  padding: 30rpx;
}

.form-group {
  margin-bottom: 40rpx;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

.form-input {
  width: 100%;
  padding: 24rpx;
  background-color: #f5f9f5;
  border-radius: 16rpx;
  font-size: 28rpx;
}

.form-textarea {
  width: 100%;
  min-height: 200rpx;
  padding: 24rpx;
  background-color: #f5f9f5;
  border-radius: 16rpx;
  font-size: 28rpx;
}

.picker-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background-color: #f5f9f5;
  border-radius: 16rpx;
}

.picker-display text:first-child {
  font-size: 28rpx;
  color: #666;
}

.picker-display text:last-child {
  font-size: 32rpx;
  color: #999;
}

.type-options {
  display: flex;
  gap: 20rpx;
}

.type-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 24rpx 16rpx;
  background-color: #f5f9f5;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
}

.type-option.active {
  background-color: #e8f5e0;
  border-color: #7eb662;
}

.type-option text:first-child {
  font-size: 36rpx;
}

.type-option text:last-child {
  font-size: 22rpx;
  color: #666;
}

.type-option.active text:last-child {
  color: #5a8a3f;
  font-weight: 500;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
