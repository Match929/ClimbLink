<template>
  <view class="container">
    <view class="header">
      <text class="title">消息</text>
      <view class="add-btn" @click="goToAddFriend">
        <text class="add-icon">+</text>
      </view>
    </view>

    <scroll-view class="conversation-list" scroll-y>
      <view v-if="isLoading" class="loading-container">
        <text class="loading-text">加载中...</text>
      </view>

      <view v-else-if="conversations.length === 0" class="empty-container">
        <text class="empty-text">暂无消息</text>
      </view>

      <view v-else>
        <view 
          v-for="conv in conversations" 
          :key="conv._id"
          class="conversation-item"
          @click="goToChat(conv)"
        >
          <image 
            v-if="conv.otherMembers.length > 0"
            class="avatar" 
            :src="conv.otherMembers[0].avatar || getDefaultAvatar(conv.otherMembers[0]._id)" 
            mode="aspectFill"
          />
          <view class="content">
            <view class="header-row">
              <text class="name">
                {{ conv.otherMembers.length > 0 ? conv.otherMembers[0].name : '未知用户' }}
              </text>
              <text v-if="conv.lastMessage" class="time">
                {{ formatTime(conv.lastMessage.created_at) }}
              </text>
            </view>
            <text class="preview">
              {{ conv.lastMessage ? conv.lastMessage.content : '开始聊天吧' }}
            </text>
          </view>
        </view>
      </view>
    </scroll-view>

    <custom-tab-bar currentPath="pages/conversation-list/conversation-list" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import cloud from '@/utils/cloud.js'
import CustomTabBar from '@/components/custom-tab-bar/custom-tab-bar.vue'

const isLoading = ref(true)
const conversations = ref([])

const loadConversations = async () => {
  isLoading.value = true
  try {
    const data = await cloud.chat.getConversations()
    conversations.value = data
  } catch (err) {
    console.error('加载会话失败:', err)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    isLoading.value = false
  }
}

const getDefaultAvatar = (userId) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
}

const formatTime = (date) => {
  if (!date) return ''
  
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  const oneDay = 24 * 60 * 60 * 1000
  
  if (diff < oneDay) {
    let hours = d.getHours()
    let minutes = d.getMinutes()
    hours = hours < 10 ? '0' + hours : hours
    minutes = minutes < 10 ? '0' + minutes : minutes
    return `${hours}:${minutes}`
  } else if (diff < oneDay * 2) {
    return '昨天'
  } else {
    const month = d.getMonth() + 1
    const day = d.getDate()
    return `${month}/${day}`
  }
}

const goToChat = (conv) => {
  if (conv.otherMembers.length > 0) {
    uni.navigateTo({
      url: `/pages/chat/chat?conversationId=${conv._id}&otherUserId=${conv.otherMembers[0]._id}`
    })
  }
}

const goToAddFriend = () => {
  uni.navigateTo({
    url: '/pages/add-friend/add-friend'
  })
}

onMounted(() => {
  loadConversations()
})

</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f9f5;
  padding-bottom: 80rpx;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  padding-top: calc(30rpx + env(safe-area-inset-top));
  background: linear-gradient(to bottom right, #7eb662, #6a9b54);
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
}

.add-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.add-icon {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: bold;
}

.conversation-list {
  flex: 1;
  padding: 20rpx 0;
}

.loading-container,
.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.loading-text,
.empty-text {
  font-size: 28rpx;
  color: #999;
}

.conversation-item {
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

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  overflow: hidden;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.time {
  font-size: 22rpx;
  color: #999;
  flex-shrink: 0;
}

.preview {
  font-size: 26rpx;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
