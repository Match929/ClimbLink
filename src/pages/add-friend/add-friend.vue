<template>
  <view class="container">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="title">Add Friends</text>
      <view class="placeholder"></view>
    </view>

    <view class="search-section">
      <view class="search-box">
        <text class="search-icon">🔍</text>
        <input 
          v-model="searchKeyword" 
          class="search-input" 
          placeholder="Search user name..."
          @confirm="handleSearch"
        />
        <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">
          <text class="clear-icon">✕</text>
        </view>
      </view>
      <view class="search-btn" @click="handleSearch">
        <text class="search-btn-text">Search</text>
      </view>
    </view>

    <scroll-view class="user-list" scroll-y>
      <view v-if="isSearching" class="loading-container">
        <text class="loading-text">Searching...</text>
      </view>

      <view v-else-if="hasSearched && searchResults.length === 0" class="empty-container">
        <text class="empty-text">No users found</text>
      </view>

      <view v-else-if="searchResults.length > 0">
        <view 
          v-for="user in searchResults" 
          :key="user._id"
          class="user-item"
          @click="startChat(user)"
        >
          <image 
            class="avatar" 
            :src="user.avatar || getDefaultAvatar(user._id)" 
            mode="aspectFill"
          />
          <view class="user-info">
            <text class="name">{{ user.name }}</text>
            <text v-if="user.climbing_level" class="level">{{ user.climbing_level }}</text>
            <text v-else class="bio">{{ user.bio || 'No bio' }}</text>
          </view>
          <view class="chat-btn">
            <text class="chat-btn-text">Start Chat</text>
          </view>
        </view>
      </view>

      <view v-else class="tips-container">
        <text class="tips-text">Enter user name to search</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import cloud from '@/utils/cloud.js'

const searchKeyword = ref('')
const isSearching = ref(false)
const hasSearched = ref(false)
const searchResults = ref([])

const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    uni.showToast({
      title: 'Please enter search keyword',
      icon: 'none'
    })
    return
  }

  isSearching.value = true
  hasSearched.value = true

  try {
    const currentUserId = localStorage.getItem('userId')
    const results = await cloud.chat.searchUsers(searchKeyword.value.trim())
    
    // Filter out self
    searchResults.value = results.filter(user => user._id !== currentUserId)
  } catch (err) {
    console.error('Search failed:', err)
    uni.showToast({
      title: 'Search failed',
      icon: 'none'
    })
  } finally {
    isSearching.value = false
  }
}

const clearSearch = () => {
  searchKeyword.value = ''
  hasSearched.value = false
  searchResults.value = []
}

const getDefaultAvatar = (userId) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
}

const startChat = async (user) => {
  try {
    uni.showLoading({ title: 'Creating conversation...' })
    const conversation = await cloud.chat.getOrCreateSingleConversation(user._id)
    
    if (conversation) {
      uni.hideLoading()
      uni.redirectTo({
        url: `/pages/chat/chat?conversationId=${conversation._id}&otherUserId=${user._id}`
      })
    } else {
      uni.hideLoading()
      uni.showToast({
        title: 'Failed to create conversation',
        icon: 'none'
      })
    }
  } catch (err) {
    uni.hideLoading()
    console.error('Failed to create conversation:', err)
    uni.showToast({
      title: 'Failed to create conversation',
      icon: 'none'
    })
  }
}

const goBack = () => {
  uni.navigateBack()
}

</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f9f5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  padding-top: calc(30rpx + env(safe-area-inset-top));
  background: linear-gradient(to bottom right, #7eb662, #6a9b54);
}

.back-btn,
.placeholder {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 40rpx;
  color: #ffffff;
}

.title {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.search-section {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  gap: 20rpx;
  background-color: #ffffff;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background-color: #f5f5f5;
  border-radius: 40rpx;
  gap: 16rpx;
}

.search-icon {
  font-size: 28rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  background: transparent;
}

.clear-btn {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-icon {
  font-size: 24rpx;
  color: #999;
}

.search-btn {
  padding: 16rpx 32rpx;
  background: linear-gradient(to bottom right, #7eb662, #6a9b54);
  border-radius: 40rpx;
}

.search-btn-text {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

.user-list {
  flex: 1;
  padding: 20rpx 0;
}

.loading-container,
.empty-container,
.tips-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.loading-text,
.empty-text,
.tips-text {
  font-size: 28rpx;
  color: #999;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #f0f0f0;
  gap: 20rpx;
}

.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.level,
.bio {
  font-size: 24rpx;
  color: #999;
}

.chat-btn {
  padding: 12rpx 28rpx;
  background: linear-gradient(to bottom right, #7eb662, #6a9b54);
  border-radius: 40rpx;
  flex-shrink: 0;
}

.chat-btn-text {
  font-size: 24rpx;
  color: #ffffff;
}
</style>
