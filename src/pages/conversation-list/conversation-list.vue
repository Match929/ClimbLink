<template>
  <view class="container">
    <view class="header">
      <text class="title">Messages</text>
      <view class="add-btn" @click="goToAddFriend">
        <text class="add-icon">+</text>
      </view>
    </view>

    <view class="search-section">
      <view class="search-box">
        <text class="search-icon">🔍</text>
        <input 
          v-model="searchKeyword" 
          class="search-input" 
          placeholder="Search users or chat content"
          @confirm="handleSearch"
        />
        <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">
          <text class="clear-icon">✕</text>
        </view>
      </view>
    </view>

    <scroll-view class="conversation-list" scroll-y>
      <view v-if="isSearching" class="loading-container">
        <text class="loading-text">Searching...</text>
      </view>

      <view v-else-if="searchKeyword && searchResults.length === 0" class="empty-container">
        <text class="empty-text">No results found</text>
      </view>

      <view v-else-if="!searchKeyword && isLoading" class="loading-container">
        <text class="loading-text">Loading...</text>
      </view>

      <view v-else-if="!searchKeyword && conversations.length === 0" class="empty-container">
        <text class="empty-text">No messages yet</text>
      </view>

      <view v-else>
        <view 
          v-for="item in (searchKeyword ? searchResults : conversations)" 
          :key="item._id || item.conversation_id"
          class="conversation-item"
          @click="searchKeyword ? goToSearchResult(item) : goToChat(item)"
        >
          <image 
            v-if="getAvatarUser(item)"
            class="avatar" 
            :src="getAvatarUrl(item)" 
            mode="aspectFill"
          />
          <view class="content">
            <view class="header-row">
              <text class="name">
                {{ getName(item) }}
              </text>
              <text v-if="getTime(item)" class="time">
                {{ formatTime(getTime(item)) }}
              </text>
            </view>
            <text class="preview">
              {{ getPreview(item) }}
            </text>
            <view v-if="item.is_matched_message" class="search-hint">
              <text class="search-hint-text">Matched chat history</text>
            </view>
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
const isSearching = ref(false)
const conversations = ref([])
const searchKeyword = ref('')
const searchResults = ref([])

const loadConversations = async () => {
  isLoading.value = true
  try {
    const data = await cloud.chat.getConversations()
    conversations.value = data
  } catch (err) {
    console.error('Failed to load conversations:', err)
    uni.showToast({
      title: 'Failed to load',
      icon: 'none'
    })
  } finally {
    isLoading.value = false
  }
}

const handleSearch = async () => {
  const keyword = searchKeyword.value.trim()
  if (!keyword) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  try {
    const results = []
    const currentUserId = localStorage.getItem('userId')

    // 1. First search for users in conversation list
    conversations.value.forEach(conv => {
      if (conv.otherMembers.length > 0) {
        const otherUser = conv.otherMembers[0]
        if (otherUser.name && otherUser.name.toLowerCase().includes(keyword.toLowerCase())) {
          results.push({
            ...conv,
            is_matched_user: true
          })
        }
      }
    })

    // 2. Then search chat history
    const messages = await cloud.chat.searchMessages(keyword)
    
    messages.forEach(msg => {
      // Avoid showing multiple messages from the same conversation
      const existingConv = results.find(r => r._id === msg.conversation_id || r.conversation_id === msg.conversation_id)
      if (!existingConv) {
        results.push({
          conversation_id: msg.conversation_id,
          other_user: msg.other_user,
          lastMessage: {
            content: msg.content,
            created_at: msg.created_at,
            sender_id: msg.sender_id
          },
          is_matched_message: true
        })
      }
    })

    searchResults.value = results
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
  searchResults.value = []
}

const getAvatarUser = (item) => {
  if (item.is_matched_message) {
    return item.other_user
  } else if (item.otherMembers && item.otherMembers.length > 0) {
    return item.otherMembers[0]
  }
  return null
}

const getAvatarUrl = (item) => {
  const user = getAvatarUser(item)
  if (!user) return getDefaultAvatar('default')
  return user.avatarUrl || user.avatar || getDefaultAvatar(user._id)
}

const getName = (item) => {
  const user = getAvatarUser(item)
  return user ? user.name : 'Unknown User'
}

const getTime = (item) => {
  return item.lastMessage?.created_at
}

const getPreview = (item) => {
  return item.lastMessage?.content || 'Start chatting'
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
    return 'Yesterday'
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

const goToSearchResult = (item) => {
  const conversationId = item._id || item.conversation_id
  const user = getAvatarUser(item)
  if (conversationId && user) {
    uni.navigateTo({
      url: `/pages/chat/chat?conversationId=${conversationId}&otherUserId=${user._id}`
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

.search-section {
  padding: 20rpx 30rpx;
  background-color: #ffffff;
}

.search-box {
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

.search-hint {
  margin-top: 4rpx;
}

.search-hint-text {
  font-size: 22rpx;
  color: #7eb662;
}
</style>
