<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <view class="header-top">
        <text class="title">Community</text>
        <view class="header-right">
          <view class="notification-btn">
            <text>🔔</text>
            <view v-if="unreadNotifications > 0" class="dot"></view>
          </view>
          <view class="post-btn" @click="handlePostClick">
            <text class="post-icon">+</text>
            <text>Post</text>
          </view>
        </view>
      </view>

      <!-- Tab 导航 -->
      <view class="tabs">
        <view 
          v-for="tab in tabs" 
          :key="tab"
          :class="['tab-btn', { active: activeTab === tab }]"
          @click="activeTab = tab"
        >
          <text>{{ tab }}</text>
          <!-- List 标签的未读标记（pending 申请） -->
          <view v-if="tab === 'List' && listUnreadCount > 0" class="tab-unread-badge">
            <text>{{ listUnreadCount > 99 ? '99+' : listUnreadCount }}</text>
          </view>
          <!-- Messages 标签的未读标记 -->
          <view v-if="tab === 'Messages' && messagesUnreadCount > 0" class="tab-unread-badge">
            <text>{{ messagesUnreadCount > 99 ? '99+' : messagesUnreadCount }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Feed 内容 -->
    <view v-if="activeTab === 'Feed'" class="feed-content">
      <!-- 未登录状态 -->
      <view v-if="!isLoggedIn" class="empty-container">
        <text class="empty-icon">🔐</text>
        <text class="empty-title">Please login first</text>
        <text class="empty-text">Login to view and create posts</text>
        <view class="empty-btn" @click="navigateTo('/pages/login/login')">
          <text class="empty-btn-text">Login Now</text>
        </view>
      </view>
      
      <!-- 加载状态 -->
      <view v-else-if="postsLoading" class="loading-container">
        <text class="loading-text">Loading posts...</text>
      </view>
      
      <!-- 空状态 -->
      <view v-else-if="posts.length === 0" class="empty-container">
        <text class="empty-icon">📝</text>
        <text class="empty-title">No posts yet</text>
        <text class="empty-text">Be the first to post something!</text>
        <view class="empty-btn" @click="handlePostClick">
          <text class="empty-btn-text">Create Post</text>
        </view>
      </view>
      
      <!-- 帖子列表 -->
      <view v-else class="posts-list">
        <view 
          v-for="post in posts" 
          :key="post.id"
          class="post-card"
        >
          <!-- 用户信息 -->
          <view class="post-header">
            <image :src="post.user.avatar" class="post-avatar"></image>
            <view class="post-user-info">
              <text class="post-username">{{ post.user.name }}</text>
              <text class="post-meta">{{ post.time }} · {{ post.venue }}</text>
            </view>
            <view class="level-badge">{{ post.user.level }}</view>
          </view>

          <!-- 内容 -->
          <text class="post-text">{{ post.content }}</text>

          <!-- 图片 -->
          <view v-if="post.images && post.images.length > 0" class="post-image-container">
            <image :src="post.images[0]" class="post-image" mode="aspectFill"></image>
          </view>

          <!-- 约爬纪念卡标识 -->
          <view v-if="post.hasMemoryCard" class="memory-card">
            <text class="memory-text">✨ Includes Climb Memory Card</text>
            <view class="memory-badge">AI Generated</view>
          </view>

          <!-- 标签 -->
          <view class="post-tags">
            <text 
              v-for="tag in post.tags" 
              :key="tag"
              class="post-tag"
            >#{{ tag }}</text>
          </view>

          <!-- 互动按钮 -->
          <view class="interaction-bar">
            <view class="interaction-item" @click="likePost(post)">
              <text>{{ post.liked ? '❤️' : '🤍' }}</text>
              <text>{{ post.likes }}</text>
            </view>
            <view class="interaction-item" @click="openComments(post)">
              <text>💬</text>
              <text>{{ post.comments }}</text>
            </view>
            <view class="interaction-item share">
              <text>🔗</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- List 内容 -->
    <view v-if="activeTab === 'List'" class="list-content">
      <!-- 未登录状态 -->
      <view v-if="!isLoggedIn" class="empty-container">
        <text class="empty-icon">🔐</text>
        <text class="empty-title">Please login first</text>
        <text class="empty-text">Login to view and manage climb requests</text>
        <view class="empty-btn" @click="navigateTo('/pages/login/login')">
          <text class="empty-btn-text">Login Now</text>
        </view>
      </view>
      
      <!-- 已登录状态 -->
      <template v-else>
        <!-- Sub-tab -->
        <view class="sub-tabs">
          <view 
            v-for="option in listTabOptions" 
            :key="option.value"
            class="sub-tab"
            :class="{ active: listFilter === option.value }"
            @click="listFilter = option.value"
          >
            {{ option.label }}
          </view>
        </view>

        <!-- Loading -->
        <view v-if="listLoading" class="list-loading">
          <text>Loading...</text>
        </view>

        <!-- Incoming - 我发布的请求，别人申请的 -->
        <view v-else-if="listFilter === 'Incoming'" class="list-section">
        <view v-if="myRequests.length === 0" class="list-empty">
          <text>📭</text>
          <text class="empty-text">No incoming requests yet</text>
        </view>

        <view v-else>
          <view 
            v-for="request in myRequests" 
            :key="request._id"
            class="incoming-request-card"
          >
            <view class="request-header">
              <text class="venue-name">{{ request.venue_name }}</text>
              <text class="request-date">{{ request.climb_date }}</text>
              <view class="menu-btn" @click="toggleDropdown(request._id)">
                <text class="menu-icon">⋮</text>
                <!-- 下拉菜单 -->
                <view v-if="activeDropdown === request._id" class="dropdown-menu">
                  <view class="dropdown-item" @click="editRequest(request)">
                    <text>✏️ Edit</text>
                  </view>
                  <view class="dropdown-item delete" @click="deleteRequest(request._id)">
                    <text>🗑️ Delete</text>
                  </view>
                </view>
              </view>
            </view>

            <view class="request-info">
              <text class="info-text">📍 {{ request.venue_name }}</text>
              <text class="info-text">⏰ {{ request.climb_time }}</text>
              <text class="info-text">👥 {{ request.participant_count || 0 }}/{{ request.max_participants || 4 }} participants</text>
            </view>

            <!-- 申请者列表 -->
            <view v-if="request.applicants && request.applicants.length > 0" class="applicants-list">
              <view class="applicants-title">👋 Applicants ({{ request.applicants.length }})</view>
              
              <view 
                v-for="applicant in request.applicants" 
                :key="applicant._id"
                class="applicant-item"
              >
                <view class="applicant-info">
                  <image 
                    :src="applicant.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + applicant.user_id" 
                    class="applicant-avatar"
                  ></image>
                  <view class="applicant-details">
                    <text class="applicant-name">{{ applicant.user?.name || 'Unknown' }}</text>
                    <text class="applicant-time">{{ formatTime(applicant.joined_at) }}</text>
                  </view>
                </view>

                <!-- 根据状态显示 -->
                <view v-if="applicant.status === 'pending'" class="applicant-actions">
                  <view class="action-btn accept" @click="acceptApplication(applicant._id)">Accept</view>
                  <view class="action-btn decline" @click="rejectApplication(applicant._id)">Decline</view>
                </view>

                <view v-else class="status-badge" :class="applicant.status">
                  {{ applicant.status === 'accepted' ? '✓ Accepted' : '✕ Declined' }}
                </view>
              </view>
            </view>

            <view v-else class="no-applicants">
              <text>No applicants yet</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Outgoing - 我申请的 -->
      <view v-else-if="listFilter === 'Outgoing'" class="list-section">
        <view v-if="myApplications.length === 0" class="list-empty">
          <text>📭</text>
          <text class="empty-text">You haven't applied to any requests yet</text>
        </view>

        <view v-else>
          <view 
            v-for="application in myApplications" 
            :key="application._id"
            class="outgoing-request-card"
          >
            <view class="outgoing-header">
              <image 
                :src="application.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + application.user_id" 
                class="outgoing-avatar"
              ></image>
              <view class="outgoing-info">
                <text class="outgoing-username">{{ application.user?.name || 'Unknown' }}</text>
                <text class="outgoing-venue">{{ application.venue_name }}</text>
                <text class="outgoing-time">{{ application.climb_date }} · {{ application.climb_time }}</text>
              </view>
              <view class="outgoing-status" :class="application.my_status">
                {{ application.my_status === 'pending' ? '⏳ Pending' : 
                   application.my_status === 'accepted' ? '✓ Accepted' : '✕ Declined' }}
              </view>
            </view>
            
            <text class="outgoing-description">{{ application.description }}</text>
            <text class="outgoing-participants">👥 {{ application.participant_count || 0 }}/{{ application.max_participants || 4 }} participants</text>
          </view>
        </view>
      </view>

      <!-- My Posts - 我发布的帖子 -->
      <view v-else-if="listFilter === 'My Posts'" class="list-section">
        <view v-if="myPosts.length === 0" class="list-empty">
          <text>📝</text>
          <text class="empty-text">You haven't posted anything yet</text>
        </view>

        <view v-else>
          <view 
            v-for="post in myPosts" 
            :key="post._id"
            class="my-post-card"
          >
            <view class="post-header">
              <image :src="post.user?.avatar" class="post-avatar"></image>
              <view class="post-info">
                <text class="post-username">{{ post.user?.name || 'Unknown' }}</text>
                <text class="post-time">{{ formatPostTime(post.created_at) }}</text>
              </view>
              <view class="delete-post-btn" @click="deletePost(post._id)">
                <text>🗑️</text>
              </view>
            </view>
            
            <text class="post-content">{{ post.content }}</text>
            
            <view v-if="post.images && post.images.length > 0" class="post-images">
              <image 
                v-for="(img, idx) in post.images" 
                :key="idx"
                :src="img" 
                class="post-image"
                mode="aspectFill"
              ></image>
            </view>
            
            <view class="post-stats">
              <text>❤️ {{ post.likes || 0 }} likes</text>
              <text>💬 {{ post.comments?.length || 0 }} comments</text>
            </view>
          </view>
        </view>
      </view>
      </template>
    </view>



    <!-- Messages 内容 -->
    <view v-if="activeTab === 'Messages'" class="messages-content">
      <!-- 未登录状态 -->
      <view v-if="!isLoggedIn" class="empty-container">
        <text class="empty-icon">🔐</text>
        <text class="empty-title">Please login first</text>
        <text class="empty-text">Login to view and send messages</text>
        <view class="empty-btn" @click="navigateTo('/pages/login/login')">
          <text class="empty-btn-text">Login Now</text>
        </view>
      </view>
      
      <!-- 已登录状态 -->
      <template v-else>
        <!-- 顶部搜索和添加好友 -->
        <view class="messages-header">
          <view class="header-title-row">
            <text class="header-title">Messages</text>
            <view class="add-friend-btn" @click="handleAddFriendClick">
              <text class="add-icon">+</text>
            </view>
          </view>
          <!-- 搜索框 -->
          <view class="search-box">
            <text class="search-icon">🔍</text>
            <input 
              class="search-input" 
              placeholder="Search users or messages" 
              v-model="searchKeyword"
              @confirm="handleSearch"
              @input="onSearchInput"
            />
            <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">
              <text>×</text>
            </view>
          </view>
        </view>

      <!-- 对话列表或搜索结果 -->
      <scroll-view class="conversation-list" scroll-y @scrolltolower="loadMoreConversations">
        <view v-if="searchLoading" class="loading-container">
          <text class="loading-text">Searching...</text>
        </view>

        <!-- 搜索结果 -->
        <view v-else-if="isSearching && searchResults.length > 0">
          <view 
            v-for="result in searchResults" 
            :key="result._id"
            class="search-result-item"
            @click="goToSearchResult(result)"
          >
            <image 
              class="search-avatar" 
              :src="result.other_user?.avatar || getDefaultAvatar(result.other_user?._id)" 
              mode="aspectFill"
            />
            <view class="search-content">
              <view class="search-header">
                <text class="search-name">{{ result.other_user?.name || 'Unknown User' }}</text>
                <text class="search-time">{{ formatTime(result.created_at) }}</text>
              </view>
              <view class="search-preview">
                <text class="search-sender">{{ result.is_self ? '我' : result.other_user?.name }}: </text>
                <text class="search-message">{{ result.content }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 搜索无结果 -->
        <view v-else-if="isSearching && searchResults.length === 0" class="empty-container">
          <text class="empty-icon">🔍</text>
          <text class="empty-title">No results found</text>
          <text class="empty-text">Try a different search term</text>
        </view>

        <!-- 正常对话列表 -->
        <view v-else>
          <view v-if="loading" class="loading-container">
            <text class="loading-text">Loading...</text>
          </view>

          <view v-else-if="filteredConversations.length === 0" class="empty-container">
            <text class="empty-icon">💬</text>
            <text class="empty-title">No conversations yet</text>
            <text class="empty-text">Start a chat by searching and adding new friends</text>
            <view class="empty-btn" @click="navigateTo('/pages/add-friend/add-friend')">
              <text class="empty-btn-text">Add Friends</text>
            </view>
          </view>

          <view v-else>
            <view 
              v-for="conversation in filteredConversations" 
              :key="conversation._id"
              class="conversation-item"
              @click="goToChat(conversation)"
            >
              <image 
                class="avatar" 
                :src="conversation.otherMembers[0]?.avatar || getDefaultAvatar(conversation.otherMembers[0]?._id)" 
                mode="aspectFill"
              />
              <view class="content">
                <view class="header-row">
                  <text class="name">{{ conversation.otherMembers[0]?.name || 'Unknown User' }}</text>
                  <view class="time-badge-wrapper">
                    <text class="time">{{ formatTime(conversation.lastMessage?.created_at) }}</text>
                    <view v-if="conversation.unread_count > 0" class="unread-badge">
                      <text>{{ conversation.unread_count > 99 ? '99+' : conversation.unread_count }}</text>
                    </view>
                  </view>
                </view>
                <view class="preview-row">
                  <text class="preview">{{ conversation.lastMessage?.content || 'Start a conversation' }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      </template>
    </view>

    <!-- 自定义底部导航栏 -->
    <custom-tab-bar currentPath="pages/community/community"></custom-tab-bar>

    <!-- 编辑约爬请求弹窗 -->
    <view v-if="showEditRequestModal" class="modal-overlay" @click="closeEditModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">Edit Climb Request</text>
          <view class="modal-close" @click="closeEditModal">
            <text>×</text>
          </view>
        </view>

        <view v-if="editingRequest" class="modal-body">
          <view class="form-group">
            <text class="form-label">Venue Name</text>
            <input 
              class="form-input" 
              v-model="editingRequest.venue_name" 
              placeholder="Enter venue name"
            />
          </view>

          <view class="form-row">
            <view class="form-group half">
              <text class="form-label">Date</text>
              <picker 
                mode="date" 
                :value="editingRequest.climb_date" 
                @change="onEditDateChange"
              >
                <view class="form-picker">
                  <text :class="{ 'placeholder': !editingRequest.climb_date }">
                    {{ editingRequest.climb_date || 'Select date' }}
                  </text>
                  <text class="picker-arrow">›</text>
                </view>
              </picker>
            </view>

            <view class="form-group half">
              <text class="form-label">Time</text>
              <picker 
                mode="time" 
                :value="editingRequest.climb_time" 
                @change="onEditTimeChange"
              >
                <view class="form-picker">
                  <text :class="{ 'placeholder': !editingRequest.climb_time }">
                    {{ editingRequest.climb_time || 'Select time' }}
                  </text>
                  <text class="picker-arrow">›</text>
                </view>
              </picker>
            </view>
          </view>

          <view class="form-row">
            <view class="form-group half">
              <text class="form-label">Level</text>
              <picker 
                mode="selector" 
                :range="['不限', 'V0-V2', 'V2-V4', 'V4-V6', 'V6-V8', 'V8+']" 
                :value="getLevelIndex(editingRequest.level_requirement)" 
                @change="onEditLevelChange"
              >
                <view class="form-picker">
                  <text :class="{ 'placeholder': !editingRequest.level_requirement }">
                    {{ editingRequest.level_requirement || 'Select level' }}
                  </text>
                  <text class="picker-arrow">›</text>
                </view>
              </picker>
            </view>

            <view class="form-group half">
              <text class="form-label">Max Participants</text>
              <picker 
                mode="selector" 
                :range="['2', '3', '4', '5', '6']" 
                :value="getParticipantIndex(editingRequest.max_participants)" 
                @change="onEditParticipantChange"
              >
                <view class="form-picker">
                  <text>{{ editingRequest.max_participants || '2' }}</text>
                  <text class="picker-arrow">›</text>
                </view>
              </picker>
            </view>
          </view>

          <view class="form-group">
            <text class="form-label">Description</text>
            <textarea 
              class="form-textarea" 
              v-model="editingRequest.description" 
              placeholder="Add a description..."
              :maxlength="200"
            />
          </view>
        </view>

        <view class="modal-footer">
          <view class="btn cancel-btn" @click="closeEditModal">
            <text>Cancel</text>
          </view>
          <view class="btn confirm-btn" @click="saveEditRequest">
            <text>Save</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import CustomTabBar from '../../components/custom-tab-bar/custom-tab-bar.vue'
import cloud from '@/utils/cloud.js'

// uni-app 生命周期钩子
import { onShow as uniOnShow } from '@dcloudio/uni-app'

const activeTab = ref('Feed')
const listFilter = ref('Incoming')

const tabs = ['Feed', 'List', 'Messages']

const listTabOptions = [
  { value: 'Incoming', label: 'Incoming' },
  { value: 'Outgoing', label: 'Outgoing' },
  { value: 'My Posts', label: 'My Posts' }
]

// 约爬相关数据
const myRequests = ref([])
const myApplications = ref([])
const myPosts = ref([])
const listLoading = ref(false)

// 约爬请求编辑弹窗
const showEditRequestModal = ref(false)
const editingRequest = ref(null)

// 下拉菜单状态
const activeDropdown = ref(null)

// 消息相关数据
const conversations = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const searchResults = ref([])
const searchLoading = ref(false)
const searchDebounceTimer = ref(null)

// 计算是否在搜索模式
const isSearching = computed(() => {
  return searchKeyword.value.trim().length > 0
})

// List 标签的未读数量（Incoming 中的 pending 申请）
const listUnreadCount = computed(() => {
  let totalPending = 0;
  for (const request of myRequests.value) {
    if (request.applicants && request.applicants.length > 0) {
      for (const applicant of request.applicants) {
        if (applicant.status === 'pending') {
          totalPending++;
        }
      }
    }
  }
  return totalPending;
})

// Messages 标签的总未读数量
const messagesUnreadCount = computed(() => {
  let totalUnread = 0;
  for (const conv of conversations.value) {
    totalUnread += conv.unread_count || 0;
  }
  return totalUnread;
})

// 帖子相关数据
const posts = ref([])
const postsLoading = ref(false)

// 计算过滤后的对话列表（仅在非搜索模式使用）
const filteredConversations = computed(() => {
  if (!searchKeyword.value.trim()) {
    return conversations.value
  }
  
  const keyword = searchKeyword.value.toLowerCase().trim()
  
  return conversations.value.filter(conv => {
    // 搜索用户名
    const userName = conv.otherMembers[0]?.name?.toLowerCase() || ''
    if (userName.includes(keyword)) {
      return true
    }
    
    // 搜索最后一条消息
    const lastMsg = conv.lastMessage?.content?.toLowerCase() || ''
    if (lastMsg.includes(keyword)) {
      return true
    }
    
    return false
  })
})

// 判断是否登录
const isLoggedIn = computed(() => {
  return !!uni.getStorageSync('userId')
})

// 监听 Messages 标签页
watch(activeTab, async (newTab) => {
  if (newTab === 'Messages') {
    await loadConversations()
  }
  if (newTab === 'Feed') {
    if (isLoggedIn.value) {
      await loadPosts()
    }
  }
  if (newTab === 'List') {
    await loadClimbRequests()
  }
})

watch(listFilter, async (newFilter) => {
  if (newFilter === 'My Posts' && isLoggedIn.value) {
    await loadMyPosts()
  }
})

// 页面加载时获取所有数据
onMounted(async () => {
  const promises = []
  if (isLoggedIn.value) {
    promises.push(loadPosts())
  }
  promises.push(loadConversations())
  promises.push(loadClimbRequests())
  await Promise.all(promises)
})

// 页面显示时刷新会话列表（用于从聊天页面返回时更新未读计数）
uniOnShow(async () => {
  const promises = []
  promises.push(loadConversations())
  promises.push(loadClimbRequests())
  if (isLoggedIn.value && activeTab.value === 'Feed') {
    promises.push(loadPosts())
  }
  await Promise.all(promises)
})

// 加载帖子
const loadPosts = async () => {
  if (!isLoggedIn.value) {
    posts.value = []
    return
  }
  
  postsLoading.value = true
  try {
    const data = await cloud.post.getPosts()
    // 转换数据格式以匹配模板
    const currentUserId = uni.getStorageSync('userId')
    posts.value = data.map(post => ({
      id: post._id,
      user: {
        name: post.user?.name || 'Unknown User',
        avatar: post.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`,
        level: post.user?.climbing_level || 'V1'
      },
      content: post.content,
      images: post.images || [],
      venue: 'Rock Time Gym',
      time: formatPostTime(post.created_at),
      likes: post.likes || 0,
      comments: (post.comments || []).length,
      tags: post.tags || [],
      liked: post.liked_by && post.liked_by.includes(currentUserId),
      hasMemoryCard: false
    }))
  } catch (err) {
    console.error('加载帖子失败:', err)
  } finally {
    postsLoading.value = false
  }
}

// 格式化帖子时间
const formatPostTime = (date) => {
  if (!date) return ''
  
  const now = new Date()
  const postDate = new Date(date)
  const diffMs = now - postDate
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  
  return postDate.toLocaleDateString()
}

const listFilters = [
  { id: 'All', name: 'All Activity' },
  { id: 'requests', name: 'Climb Requests' },
  { id: 'posts', name: 'My Posts' }
]

const statusMap = {
  pending: '⏳ Pending',
  approved: '✅ Approved',
  completed: '✅ Completed'
}

const myClimbRequests = ref([
  {
    id: 1,
    type: 'applied',
    title: 'Intermediate Training',
    venue: 'Climber\'s Paradise',
    time: 'Sun, Apr 26, 10:00 AM',
    status: 'pending',
    applicants: 5
  },
  {
    id: 2,
    type: 'applied',
    title: 'Weekend Beginner Session',
    venue: 'Rock Time Gym',
    time: 'Sat, Apr 25, 2:00 PM',
    status: 'approved',
    applicants: 8
  },
  {
    id: 3,
    type: 'applied',
    title: 'Bouldering Workshop',
    venue: 'Climber\'s Paradise',
    time: 'Sat, Apr 25, 3:00 PM',
    status: 'completed',
    applicants: 6
  }
])

const myPostedRequests = ref([
  {
    id: 1,
    title: 'Looking for V3-V5 partners',
    venue: 'Rock Time Gym',
    time: 'Mon, Apr 27, 6:00 PM',
    applicants: 3,
    maxApplicants: 4,
    canEdit: true
  },
  {
    id: 2,
    title: 'Weekend climbing session',
    venue: 'Peak Climbing Center',
    time: 'Sat, Apr 25, 2:00 PM',
    applicants: 2,
    maxApplicants: 3,
    canEdit: true
  }
])

const receivedRequests = ref([
  {
    id: 1,
    user: {
      name: 'Emma Lee',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
      level: 'V3-V5'
    },
    message: 'Would love to join your climbing session!',
    time: '2 hours ago',
    status: 'pending'
  },
  {
    id: 2,
    user: {
      name: 'Mike Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      level: 'V2-V4'
    },
    message: 'Looking forward to climbing together',
    time: '5 hours ago',
    status: 'pending'
  }
])

const messages = ref([
  {
    id: 1,
    user: {
      name: 'Lee',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg1'
    },
    lastMessage: 'See you at Rock Time 3pm tomorrow!',
    time: '10 min ago',
    unread: 2,
    online: true
  },
  {
    id: 2,
    user: {
      name: 'AQiang',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg2'
    },
    lastMessage: 'This route is indeed challenging, let\'s study it together',
    time: '1 hour ago',
    unread: 0,
    online: true
  },
  {
    id: 3,
    user: {
      name: 'Amy',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg3'
    },
    lastMessage: 'Sounds good, see you this weekend!',
    time: 'Yesterday',
    unread: 0,
    online: false
  }
])

const notifications = ref([
  {
    id: 1,
    type: 'match',
    title: 'Partner Match Success',
    content: 'You matched with Zhang',
    time: '2 hours ago',
    unread: true
  },
  {
    id: 2,
    type: 'activity',
    title: 'Event Reminder',
    content: 'Weekend beginner class starts tomorrow',
    time: '5 hours ago',
    unread: true
  }
])

const unreadMessages = ref(2)
const unreadNotifications = ref(2)
const pendingRequestsCount = ref(2)

const likePost = async (post) => {
  if (!isLoggedIn.value) {
    uni.showModal({
      title: 'Login Required',
      content: 'Please login first to like posts',
      confirmText: 'Login',
      cancelText: 'Cancel',
      confirmColor: '#7eb662',
      success: (res) => {
        if (res.confirm) {
          navigateTo('/pages/login/login')
        }
      }
    })
    return
  }
  
  // 先更新本地状态
  const wasLiked = post.liked
  post.liked = !post.liked
  post.likes += post.liked ? 1 : -1
  
  // 调用云 API
  try {
    const result = await cloud.post.likePost(post.id)
    if (!result) {
      // 如果失败，回滚
      post.liked = wasLiked
      post.likes += wasLiked ? 1 : -1
      uni.showToast({
        title: 'Like failed',
        icon: 'none'
      })
    }
  } catch (err) {
    console.error('点赞失败:', err)
    // 回滚
    post.liked = wasLiked
    post.likes += wasLiked ? 1 : -1
    uni.showToast({
      title: 'Like failed',
      icon: 'none'
    })
  }
}

const openComments = (post) => {
  if (!isLoggedIn.value) {
    uni.showModal({
      title: 'Login Required',
      content: 'Please login first to view comments',
      confirmText: 'Login',
      cancelText: 'Cancel',
      confirmColor: '#7eb662',
      success: (res) => {
        if (res.confirm) {
          navigateTo('/pages/login/login')
        }
      }
    })
    return
  }
  
  uni.showToast({
    title: 'Comments feature coming soon!',
    icon: 'none'
  })
}

// ==================== 约爬相关功能 ====================
const loadClimbRequests = async () => {
  listLoading.value = true
  try {
    const [requests, applications] = await Promise.all([
      cloud.climb.getMyRequestsWithApplications(),
      cloud.climb.getMyApplications()
    ])
    myRequests.value = requests || []
    myApplications.value = applications || []
  } catch (err) {
    console.error('加载约爬请求失败:', err)
  } finally {
    listLoading.value = false
  }
}

const loadMyPosts = async () => {
  listLoading.value = true
  try {
    const posts = await cloud.post.getMyPosts()
    myPosts.value = posts || []
  } catch (err) {
    console.error('加载我的帖子失败:', err)
  } finally {
    listLoading.value = false
  }
}

const toggleDropdown = (requestId) => {
  activeDropdown.value = activeDropdown.value === requestId ? null : requestId
}

const editRequest = (request) => {
  activeDropdown.value = null
  // 跳转到 climb-request 页面并传递数据
  uni.navigateTo({
    url: `/pages/climb-request/climb-request?requestId=${request._id}`
  })
}

const closeEditModal = () => {
  showEditRequestModal.value = false
  editingRequest.value = null
}

const getLevelIndex = (level) => {
  const levels = ['不限', 'V0-V2', 'V2-V4', 'V4-V6', 'V6-V8', 'V8+']
  return levels.indexOf(level)
}

const getParticipantIndex = (count) => {
  const counts = ['2', '3', '4', '5', '6']
  const index = counts.indexOf(String(count))
  return index >= 0 ? index : 0
}

const onEditDateChange = (e) => {
  editingRequest.value.climb_date = e.detail.value
}

const onEditTimeChange = (e) => {
  editingRequest.value.climb_time = e.detail.value
}

const onEditLevelChange = (e) => {
  const levels = ['不限', 'V0-V2', 'V2-V4', 'V4-V6', 'V6-V8', 'V8+']
  editingRequest.value.level_requirement = levels[e.detail.value]
}

const onEditParticipantChange = (e) => {
  const counts = ['2', '3', '4', '5', '6']
  editingRequest.value.max_participants = parseInt(counts[e.detail.value])
}

const saveEditRequest = async () => {
  if (!editingRequest.value.venue_name || !editingRequest.value.climb_date || !editingRequest.value.climb_time) {
    uni.showToast({
      title: 'Please fill in all required fields',
      icon: 'none'
    })
    return
  }

  try {
    const result = await cloud.climb.updateClimbRequest(editingRequest.value._id, {
      venue_name: editingRequest.value.venue_name,
      climb_date: editingRequest.value.climb_date,
      climb_time: editingRequest.value.climb_time,
      level_requirement: editingRequest.value.level_requirement,
      max_participants: editingRequest.value.max_participants,
      description: editingRequest.value.description || '',
      tags: []
    })

    if (result?.success !== false) {
      uni.showToast({
        title: 'Updated successfully!',
        icon: 'success'
      })
      closeEditModal()
      await loadClimbRequests()
    } else {
      uni.showToast({
        title: result?.message || 'Update failed',
        icon: 'none'
      })
    }
  } catch (err) {
    console.error('更新约爬请求失败:', err)
    uni.showToast({
      title: 'Update failed',
      icon: 'none'
    })
  }
}

const deleteRequest = (requestId) => {
  activeDropdown.value = null
  
  uni.showModal({
    title: 'Confirm Delete',
    content: 'Are you sure you want to delete this climb request?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmColor: '#ef4444',
    success: async (res) => {
      if (res.confirm) {
        try {
          const result = await cloud.climb.deleteClimbRequest(requestId)
          
          if (result?.success !== false) {
            uni.showToast({
              title: 'Deleted successfully!',
              icon: 'success'
            })
            await loadClimbRequests()
          } else {
            uni.showToast({
              title: result?.message || 'Delete failed',
              icon: 'none'
            })
          }
        } catch (err) {
          console.error('删除约爬请求失败:', err)
          uni.showToast({
            title: 'Delete failed',
            icon: 'none'
          })
        }
      }
    }
  })
}

const deletePost = (postId) => {
  uni.showModal({
    title: 'Confirm Delete',
    content: 'Are you sure you want to delete this post?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmColor: '#ef4444',
    success: async (res) => {
      if (res.confirm) {
        try {
          const result = await cloud.post.deletePost(postId)
          
          if (result?.success !== false) {
            uni.showToast({
              title: 'Deleted successfully!',
              icon: 'success'
            })
            await loadMyPosts()
          } else {
            uni.showToast({
              title: result?.message || 'Delete failed',
              icon: 'none'
            })
          }
        } catch (err) {
          console.error('删除帖子失败:', err)
          uni.showToast({
            title: 'Delete failed',
            icon: 'none'
          })
        }
      }
    }
  })
}

const acceptApplication = (participantId) => {
  if (!isLoggedIn.value) {
    uni.showModal({
      title: 'Login Required',
      content: 'Please login first to manage requests',
      confirmText: 'Login',
      cancelText: 'Cancel',
      confirmColor: '#7eb662',
      success: (res) => {
        if (res.confirm) {
          navigateTo('/pages/login/login')
        }
      }
    })
    return
  }
  
  uni.showModal({
    title: 'Confirm Accept',
    content: 'Are you sure you want to accept this climb request?',
    confirmText: 'Accept',
    cancelText: 'Cancel',
    confirmColor: '#7eb662',
    success: (res) => {
      if (res.confirm) {
        doAcceptApplication(participantId)
      }
    }
  })
}

const doAcceptApplication = async (participantId) => {
  try {
    await cloud.climb.acceptApplication(participantId)
    uni.showToast({
      title: 'Accepted!',
      icon: 'success'
    })
    await loadClimbRequests()
  } catch (err) {
    console.error('接受申请失败:', err)
    uni.showToast({
      title: 'Failed to accept',
      icon: 'none'
    })
  }
}

const rejectApplication = (participantId) => {
  if (!isLoggedIn.value) {
    uni.showModal({
      title: 'Login Required',
      content: 'Please login first to manage requests',
      confirmText: 'Login',
      cancelText: 'Cancel',
      confirmColor: '#7eb662',
      success: (res) => {
        if (res.confirm) {
          navigateTo('/pages/login/login')
        }
      }
    })
    return
  }
  
  uni.showModal({
    title: 'Confirm Reject',
    content: 'Are you sure you want to reject this climb request?',
    confirmText: 'Reject',
    cancelText: 'Cancel',
    confirmColor: '#ef4444',
    success: (res) => {
      if (res.confirm) {
        doRejectApplication(participantId)
      }
    }
  })
}

const doRejectApplication = async (participantId) => {
  try {
    await cloud.climb.rejectApplication(participantId)
    uni.showToast({
      title: 'Rejected!',
      icon: 'success'
    })
    await loadClimbRequests()
  } catch (err) {
    console.error('拒绝申请失败:', err)
    uni.showToast({
      title: 'Failed to reject',
      icon: 'none'
    })
  }
}

const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  
  // 小于 1 分钟
  if (diff < 60000) return 'Just now'
  // 小于 1 小时
  if (diff < 3600000) return Math.floor(diff / 60000) + ' min ago'
  // 小于 1 天
  if (diff < 86400000) return Math.floor(diff / 3600000) + ' hours ago'
  // 大于等于 1 天
  return `${d.getMonth() + 1}/${d.getDate()}`
}

const navigateTo = (url) => {
  uni.navigateTo({
    url,
    fail: (err) => {
      console.error('Navigation failed:', err)
      uni.showToast({
        title: 'Navigation failed',
        icon: 'none'
      })
    }
  })
}

const handlePostClick = () => {
  if (!isLoggedIn.value) {
    uni.showModal({
      title: 'Login Required',
      content: 'Please login first to create a post',
      confirmText: 'Login',
      cancelText: 'Cancel',
      confirmColor: '#7eb662',
      success: (res) => {
        if (res.confirm) {
          navigateTo('/pages/login/login')
        }
      }
    })
  } else {
    navigateTo('/pages/post-create/post-create')
  }
}

const handleAddFriendClick = () => {
  if (!isLoggedIn.value) {
    uni.showModal({
      title: 'Login Required',
      content: 'Please login first to add friends',
      confirmText: 'Login',
      cancelText: 'Cancel',
      confirmColor: '#7eb662',
      success: (res) => {
        if (res.confirm) {
          navigateTo('/pages/login/login')
        }
      }
    })
  } else {
    navigateTo('/pages/add-friend/add-friend')
  }
}

// ==================== 消息相关功能 ====================
const loadConversations = async () => {
  loading.value = true
  try {
    const data = await cloud.chat.getConversations()
    conversations.value = data || []
  } catch (err) {
    console.error('Load conversations failed:', err)
  } finally {
    loading.value = false
  }
}

const loadMoreConversations = async () => {
  // 可以在这里实现加载更多
}

const goToChat = (conversation) => {
  if (!isLoggedIn.value) {
    uni.showModal({
      title: 'Login Required',
      content: 'Please login first to view messages',
      confirmText: 'Login',
      cancelText: 'Cancel',
      confirmColor: '#7eb662',
      success: (res) => {
        if (res.confirm) {
          navigateTo('/pages/login/login')
        }
      }
    })
    return
  }
  
  const otherUserId = conversation.otherMembers[0]?._id
  uni.navigateTo({
    url: `/pages/chat/chat?conversationId=${conversation._id}&otherUserId=${otherUserId}`
  })
}

const getDefaultAvatar = (userId) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId || 'default'}`
}



// 搜索相关函数
const onSearchInput = () => {
  // 防抖处理
  if (searchDebounceTimer.value) {
    clearTimeout(searchDebounceTimer.value)
  }
  
  if (!searchKeyword.value.trim()) {
    searchResults.value = []
    return
  }
  
  if (!isLoggedIn.value) {
    return
  }
  
  searchDebounceTimer.value = setTimeout(() => {
    performSearch()
  }, 500)
}

const handleSearch = async () => {
  if (!isLoggedIn.value) {
    uni.showModal({
      title: 'Login Required',
      content: 'Please login first to search messages',
      confirmText: 'Login',
      cancelText: 'Cancel',
      confirmColor: '#7eb662',
      success: (res) => {
        if (res.confirm) {
          navigateTo('/pages/login/login')
        }
      }
    })
    return
  }
  
  if (!searchKeyword.value.trim()) {
    searchResults.value = []
    return
  }
  await performSearch()
}

const performSearch = async () => {
  if (!isLoggedIn.value) {
    return
  }
  
  searchLoading.value = true
  
  try {
    // 搜索所有历史消息
    const results = await cloud.post.searchMessages(searchKeyword.value)
    searchResults.value = results
  } catch (err) {
    console.error('搜索失败:', err)
    searchResults.value = []
  } finally {
    searchLoading.value = false
  }
}

const clearSearch = () => {
  searchKeyword.value = ''
  searchResults.value = []
  
  if (searchDebounceTimer.value) {
    clearTimeout(searchDebounceTimer.value)
    searchDebounceTimer.value = null
  }
}

const goToSearchResult = (result) => {
  // 跳转到对应的会话
  const otherUserId = result.other_user?._id
  
  uni.navigateTo({
    url: `/pages/chat/chat?conversationId=${result.conversation_id}&otherUserId=${otherUserId}`
  })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f0f7ec, #f5f9f5);
  padding-bottom: 80px;
}

.header {
  background: #ffffff;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
}

.post-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #7eb662;
  padding: 8px 16px;
  border-radius: 12px;
}

.post-icon {
  font-size: 16px;
  font-weight: 300;
}

.post-btn text {
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}

.tabs {
  display: flex;
  gap: 4px;
  background: #f0f0f0;
  border-radius: 12px;
  padding: 4px;
}

.tab-btn {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  text-align: center;
  position: relative;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tab-btn.active text {
  color: #7eb662;
  font-weight: 500;
}

.tab-btn text {
  color: #666;
  font-size: 14px;
}

.tab-unread-badge {
  position: absolute;
  top: 2px;
  right: 8px;
  background: linear-gradient(to right, #ff6b6b, #ee5a5a);
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.badge {
  position: absolute;
  top: 4px;
  right: 8px;
  background: #ef4444;
  color: #ffffff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

.feed-content,
.list-content,
.messages-content {
  padding: 16px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.post-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.post-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.post-user-info {
  flex: 1;
}

.post-username {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 2px;
}

.post-meta {
  font-size: 12px;
  color: #999;
  display: block;
}

.level-badge {
  background: linear-gradient(to right, #d4e7c5, #c8e1b8);
  color: #5a8a3f;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 10px;
}

.post-text {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 12px;
  display: block;
}

.post-image-container {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
}

.post-image {
  width: 100%;
  height: 224px;
}

.memory-card {
  background: linear-gradient(to right, #e8f5e0, #d4e7c5);
  border: 1px solid #c8e1b8;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.memory-text {
  font-size: 14px;
  color: #5a8a3f;
  font-weight: 500;
}

.memory-badge {
  background: #ffffff;
  color: #5a8a3f;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 10px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.post-tag {
  font-size: 12px;
  color: #7eb662;
  font-weight: 500;
}

.interaction-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.interaction-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
}

.interaction-item.share {
  margin-left: auto;
}

.filter-tabs {
  white-space: nowrap;
  margin-bottom: 16px;
}

.filter-tabs-inner {
  display: inline-flex;
  gap: 8px;
}

.filter-tab {
  padding: 10px 16px;
  border-radius: 12px;
  background: #ffffff;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-tab.active {
  background: #7eb662;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(126, 182, 98, 0.2);
}

.list-section {
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.section-header .badge {
  position: static;
  margin-left: auto;
}

.section-content {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.request-item,
.posted-request-item,
.received-request-item,
.my-post-item {
  padding: 12px;
  border-radius: 12px;
  background: #f5f5f5;
  margin-bottom: 12px;
}

.request-item:last-child,
.posted-request-item:last-child,
.received-request-item:last-child,
.my-post-item:last-child {
  margin-bottom: 0;
}

.request-header,
.posted-request-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.request-info,
.posted-request-info {
  flex: 1;
}

.request-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 4px;
}

.request-meta {
  font-size: 12px;
  color: #999;
  display: block;
  margin-bottom: 8px;
}

.applicants-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.approved,
.status-badge.completed {
  background: #dcfce7;
  color: #16a34a;
}

.edit-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(126, 182, 98, 0.1);
}

.posted-request-item {
  background: linear-gradient(to right, #f0f7ec, #ffffff);
  border: 1px solid #d4e7c5;
}

.received-request-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.received-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.received-info {
  flex: 1;
}

.received-user {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.received-username {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.received-level {
  background: #f0f7ec;
  color: #5a8a3f;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 8px;
}

.received-message {
  font-size: 13px;
  color: #666;
  display: block;
  margin-bottom: 4px;
}

.received-time {
  font-size: 11px;
  color: #999;
}

.received-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.action-btn.accept {
  background: #7eb662;
  color: #ffffff;
}

.action-btn.decline {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #e5e5e5;
}

.my-post-item {
  display: flex;
  gap: 12px;
}

.my-post-image-container {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.my-post-image {
  width: 100%;
  height: 100%;
}

.my-post-content {
  flex: 1;
  min-width: 0;
}

.my-post-text {
  font-size: 13px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 8px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.my-post-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.my-post-time {
  font-size: 11px;
  color: #999;
}

.my-post-stats {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  display: block;
}

.empty-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.empty-text {
  font-size: 14px;
  color: #999;
  line-height: 1.6;
  display: block;
}

.notifications-card {
  background: linear-gradient(to right, #d4e7c5, #e8f5e0);
  border: 1px solid #c8e1b8;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.notifications-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.notifications-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.notifications-header .badge {
  margin-left: auto;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notification-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.notification-content {
  flex: 1;
  margin-right: 12px;
}

.notification-title {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  display: block;
  margin-bottom: 4px;
}

.notification-text {
  font-size: 12px;
  color: #666;
  display: block;
}

.notification-time {
  font-size: 11px;
  color: #999;
  flex-shrink: 0;
}

.search-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-icon {
  margin-right: 8px;
}

.search-input {
  flex: 1;
  font-size: 14px;
  border: none;
  outline: none;
  background: transparent;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-item {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid transparent;
  transition: all 0.2s;
}

.message-item:active {
  border-color: #d4e7c5;
  background: #f8faf6;
}

.message-avatar-container {
  position: relative;
}

.message-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.online-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 14px;
  height: 14px;
  background: #22c55e;
  border: 2px solid #ffffff;
  border-radius: 50%;
}

.message-info {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.message-username {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-text {
  flex: 1;
  font-size: 13px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
}

.unread-badge {
  background: #ef4444;
  color: #ffffff;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
  font-weight: 500;
}

/* ==================== 搜索框样式 ==================== */
.search-box {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 12px 16px;
  gap: 10px;
  margin-top: 12px;
}

.search-icon {
  font-size: 18px;
}

.search-input {
  flex: 1;
  font-size: 15px;
  border: none;
  background: transparent;
  outline: none;
}

.clear-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn text {
  color: white;
  font-size: 18px;
  line-height: 1;
}

/* ==================== 搜索结果样式 ==================== */
.search-result-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
  margin-bottom: 10px;
  gap: 12px;
}

.search-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  flex-shrink: 0;
}

.search-content {
  flex: 1;
  min-width: 0;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.search-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.search-time {
  font-size: 12px;
  color: #999;
}

.search-preview {
  display: flex;
  align-items: flex-start;
}

.search-sender {
  font-size: 14px;
  color: #666;
  flex-shrink: 0;
}

.search-message {
  font-size: 14px;
  color: #666;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.messages-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}

.placeholder-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.placeholder-icon {
  font-size: 72px;
  margin-bottom: 16px;
}

.placeholder-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.placeholder-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  background: linear-gradient(to right, #7eb662, #6a9b54);
  color: #ffffff;
  padding: 20px 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(126, 182, 98, 0.3);
  margin-bottom: 24px;
}

.placeholder-btn-text {
  font-size: 16px;
  font-weight: 600;
}

.placeholder-btn-arrow {
  font-size: 24px;
}

.placeholder-tips {
  background: #f0f7ec;
  border: 1px solid #d4e7c5;
  border-radius: 12px;
  padding: 16px;
  width: 100%;
  max-width: 400px;
}

.placeholder-tips-text {
  font-size: 13px;
  color: #5a8a3f;
  line-height: 1.6;
}

/* ==================== 消息列表样式 ==================== */
.messages-header {
  margin-bottom: 16px;
}

.header-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.add-friend-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(to right, #7eb662, #6a9b54);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(126, 182, 98, 0.3);
}

.add-icon {
  color: white;
  font-size: 24px;
  font-weight: 300;
  line-height: 1;
}

.conversation-list {
  max-height: calc(100vh - 280px);
}

.loading-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
}

.loading-text {
  font-size: 14px;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.empty-text {
  font-size: 14px;
  color: #999;
  margin-bottom: 24px;
}

.empty-btn {
  background: linear-gradient(to right, #7eb662, #6a9b54);
  color: white;
  padding: 12px 32px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
}

.empty-btn-text {
  color: white;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #ffffff;
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  gap: 12px;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  flex-shrink: 0;
}

.content {
  flex: 1;
  min-width: 0;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.time-badge-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.time {
  font-size: 12px;
  color: #999;
}

.unread-badge {
  background: linear-gradient(to right, #ff6b6b, #ee5a5a);
  color: white;
  font-size: 11px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

.preview-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview {
  flex: 1;
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
}

/* ==================== List 标签页新增样式 ==================== */
.sub-tabs {
  display: flex;
  gap: 4px;
  background: #f0f0f0;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 16px;
}

.sub-tab {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  text-align: center;
  transition: all 0.2s;
  font-size: 14px;
  color: #666;
}

.sub-tab.active {
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  color: #7eb662;
  font-weight: 500;
}

.list-loading {
  display: flex;
  justify-content: center;
  padding: 48px 24px;
  color: #999;
}

.list-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 24px;
  text-align: center;
}

.list-empty text {
  font-size: 64px;
  margin-bottom: 16px;
}

.list-empty .empty-text {
  font-size: 14px;
  color: #999;
}

.incoming-request-card,
.outgoing-request-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.request-header,
.outgoing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.venue-name,
.outgoing-username {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.request-date {
  font-size: 14px;
  color: #666;
}

.request-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}

.info-text {
  font-size: 14px;
  color: #666;
}

.applicants-list {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.applicants-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.applicant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f9f9f9;
}

.applicant-item:last-child {
  border-bottom: none;
}

.applicant-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.applicant-avatar,
.outgoing-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
}

.applicant-details {
  flex: 1;
  min-width: 0;
}

.applicant-name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.applicant-time {
  display: block;
  font-size: 12px;
  color: #999;
}

.applicant-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.action-btn.accept {
  background: #7eb662;
  color: white;
}

.action-btn.decline {
  background: #ef4444;
  color: white;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.accepted {
  background: #f0f7ec;
  color: #5a8a3f;
}

.status-badge.declined {
  background: #fee2e2;
  color: #dc2626;
}

.no-applicants {
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 20px 0;
}

.outgoing-info {
  flex: 1;
  min-width: 0;
  margin-left: 12px;
}

.outgoing-venue {
  display: block;
  font-size: 13px;
  color: #666;
  margin-top: 2px;
}

.outgoing-time {
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.outgoing-status {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.outgoing-status.pending {
  background: #fff7ed;
  color: #ea580c;
}

.outgoing-status.accepted {
  background: #f0f7ec;
  color: #5a8a3f;
}

.outgoing-status.declined {
  background: #fee2e2;
  color: #dc2626;
}

.outgoing-description {
  display: block;
  font-size: 14px;
  color: #666;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.outgoing-participants {
  display: block;
  font-size: 13px;
  color: #7eb662;
  margin-top: 8px;
}

/* ==================== 新增样式 ==================== */

/* 约爬请求卡片菜单按钮 */
.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.venue-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.request-date {
  font-size: 14px;
  color: #7eb662;
  font-weight: 500;
}

.menu-btn {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f5f5f5;
}

.menu-icon {
  font-size: 18px;
  color: #666;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 100;
  min-width: 140px;
}

.dropdown-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
  transition: all 0.2s;
}

.dropdown-item:active {
  background: #f5f5f5;
}

.dropdown-item.delete {
  color: #ef4444;
}

/* My Posts 卡片 */
.my-post-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.my-post-card .post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.my-post-card .post-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.my-post-card .post-info {
  flex: 1;
}

.my-post-card .post-username {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.my-post-card .post-time {
  display: block;
  font-size: 12px;
  color: #999;
}

.delete-post-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fef2f2;
  font-size: 18px;
}

.my-post-card .post-content {
  font-size: 15px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 12px;
}

.my-post-card .post-images {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.my-post-card .post-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
}

.my-post-card .post-stats {
  display: flex;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 13px;
  color: #999;
}

/* 编辑弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #666;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 16px;
}

.form-group.half {
  width: calc(50% - 8px);
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  background: #ffffff;
  box-sizing: border-box;
}

.form-textarea {
  min-height: 100px;
  resize: none;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #7eb662;
}

.form-picker {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.form-picker .placeholder {
  color: #999;
}

.picker-arrow {
  color: #999;
  font-size: 18px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
}

.modal-footer .btn {
  flex: 1;
  padding: 14px 20px;
  border-radius: 12px;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
}

.modal-footer .cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.modal-footer .confirm-btn {
  background: linear-gradient(to right, #7eb662, #6a9b54);
  color: #ffffff;
}
</style>
