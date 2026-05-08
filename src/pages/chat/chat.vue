<template>
  <view class="container">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <view class="user-info">
        <image 
          class="user-avatar" 
          :src="chatPartner.avatar || getDefaultAvatar(chatPartner._id)" 
          mode="aspectFill" 
        />
        <view class="user-details">
          <text class="user-name">{{ chatPartner.name || '加载中...' }}</text>
        </view>
      </view>
      <view class="menu-btn" @click="showClimbInviteModal">
        <text class="menu-icon">🧗</text>
      </view>
    </view>
    
    <scroll-view 
      class="messages-container" 
      scroll-y 
      :scroll-into-view="scrollToView"
      scroll-with-animation
      :bounces="true"
      :enable-flex="true"
    >
      <view class="messages-list">
        <view 
          v-for="(msg, index) in messages" 
          :key="msg._id || index"
          :id="'msg-' + index"
          class="message-item"
          :class="{ self: msg.isSelf }"
        >
          <image 
            class="msg-avatar" 
            :src="msg.isSelf ? (selfUser.avatar || getDefaultAvatar(selfUser._id)) : (chatPartner.avatar || getDefaultAvatar(chatPartner._id))" 
            mode="aspectFill" 
          />
          <view class="msg-content">
            <!-- 约爬申请卡片 -->
            <view v-if="msg.type === 'climb_request' && msg.extra" class="climb-request-card">
              <view class="card-header">
                <text class="card-title">🧗 约爬申请</text>
              </view>
              <view class="card-body">
                <view class="card-info">
                  <text class="info-label">📍 场馆</text>
                  <text class="info-value">{{ msg.extra.venueName }}</text>
                </view>
                <view class="card-info">
                  <text class="info-label">📅 日期</text>
                  <text class="info-value">{{ msg.extra.climbDate }}</text>
                </view>
                <view class="card-info">
                  <text class="info-label">⏰ 时间</text>
                  <text class="info-value">{{ msg.extra.climbTime }}</text>
                </view>
                <view class="card-info">
                  <text class="info-label">👥 等级</text>
                  <text class="info-value">{{ msg.extra.levelRequirement }}</text>
                </view>
                <view class="card-info">
                  <text class="info-label">🎯 人数</text>
                  <text class="info-value">{{ msg.extra.maxParticipants }} 人</text>
                </view>
                <view v-if="msg.extra.tags && msg.extra.tags.length > 0" class="card-tags">
                  <view 
                    v-for="(tag, tagIdx) in msg.extra.tags" 
                    :key="tagIdx"
                    class="tag-item"
                  >
                    {{ tagNames[tag] || tag }}
                  </view>
                </view>
              </view>
              <view class="card-footer">
                <text class="card-text">{{ msg.content }}</text>
              </view>
              <!-- 只有对方能看到的按钮 -->
              <view v-if="!msg.isSelf && !msg.extra.status" class="card-actions">
                <view class="action-btn reject-btn" @click="handleRejectRequest(msg)">
                  <text class="action-btn-text">Reject</text>
                </view>
                <view class="action-btn accept-btn" @click="handleAcceptRequest(msg)">
                  <text class="action-btn-text">Accept</text>
                </view>
              </view>
              <!-- 状态显示 -->
              <view v-if="msg.extra.status" class="card-status">
                <text class="status-text" :class="msg.extra.status">
                  {{ msg.extra.status === 'accepted' ? '✅ Accepted' : '❌ Rejected' }}
                </text>
              </view>
            </view>
            <!-- 普通文本消息 -->
            <text v-else class="msg-text">{{ msg.content }}</text>
            <text class="msg-time">{{ formatTime(msg.created_at) }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view class="input-section">
      <view class="input-wrapper">
        <view class="add-btn">
          <text class="add-icon">+</text>
        </view>
        <input 
          class="message-input" 
          v-model="inputText"
          placeholder="Type a message..."
          @confirm="sendMessage"
        />
        <view class="emoji-btn">
          <text class="emoji-icon">😊</text>
        </view>
        <view 
          class="send-btn" 
          :class="{ active: inputText.trim() }"
          @click="sendMessage"
        >
          <text class="send-icon">➤</text>
        </view>
      </view>
    </view>
    
    <view class="safe-area-bottom"></view>
    
    <!-- 约爬邀请弹窗 -->
    <view v-if="showModal" class="modal-overlay" @click="closeModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">发送约爬邀请</text>
          <view class="modal-close" @click="closeModal">
            <text class="close-icon">×</text>
          </view>
        </view>
        
        <view class="modal-body">
          <!-- 选项卡 -->
          <view class="tab-bar">
            <view 
              v-for="tab in tabs" 
              :key="tab.id"
              class="tab-item"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <text class="tab-text">{{ tab.name }}</text>
            </view>
          </view>
          
          <!-- 选择已有约爬请求 -->
          <view v-if="activeTab === 'existing'" class="existing-requests">
            <view v-if="myRequests.length === 0" class="empty-state">
              <text class="empty-icon">📭</text>
              <text class="empty-text">暂无约爬请求</text>
            </view>
            <view v-else class="request-list">
              <view 
                v-for="req in myRequests" 
                :key="req._id"
                class="request-item"
                :class="{ selected: selectedRequest?._id === req._id }"
                @click="selectRequest(req)"
              >
                <view class="request-info">
                  <text class="request-venue">📍 {{ req.venueName }}</text>
                  <text class="request-date">📅 {{ req.climbDate }} {{ req.climbTime }}</text>
                  <text class="request-level">👥 {{ req.levelRequirement }}</text>
                </view>
                <view v-if="selectedRequest?._id === req._id" class="check-icon">✓</view>
              </view>
            </view>
          </view>
          
          <!-- 新建约爬邀请 -->
          <view v-if="activeTab === 'new'" class="new-invite">
            <view class="input-group">
              <text class="input-label">场馆</text>
              <picker 
                mode="selector" 
                :range="venueList" 
                range-key="name"
                @change="onVenueChange"
              >
                <view class="form-picker">
                  <text :class="{ 'placeholder': !newInvite.venueName }">
                    {{ newInvite.venueName || '请选择场馆' }}
                  </text>
                  <text class="picker-arrow">›</text>
                </view>
              </picker>
            </view>
            <view class="input-row">
              <view class="input-group half">
                <text class="input-label">日期</text>
                <picker 
                  mode="date" 
                  :value="newInvite.climbDate"
                  @change="onDateChange"
                >
                  <view class="form-picker">
                    <text :class="{ 'placeholder': !newInvite.climbDate }">
                      {{ newInvite.climbDate || '选择日期' }}
                    </text>
                    <text class="picker-arrow">›</text>
                  </view>
                </picker>
              </view>
              <view class="input-group half">
                <text class="input-label">时间</text>
                <picker 
                  mode="time" 
                  :value="newInvite.climbTime"
                  @change="onTimeChange"
                >
                  <view class="form-picker">
                    <text :class="{ 'placeholder': !newInvite.climbTime }">
                      {{ newInvite.climbTime || '选择时间' }}
                    </text>
                    <text class="picker-arrow">›</text>
                  </view>
                </picker>
              </view>
            </view>
            <view class="input-row">
              <view class="input-group half">
                <text class="input-label">等级要求</text>
                <picker 
                  mode="selector" 
                  :range="levelOptions" 
                  @change="onLevelChange"
                >
                  <view class="form-picker">
                    <text :class="{ 'placeholder': !newInvite.levelRequirement }">
                      {{ newInvite.levelRequirement || '选择等级' }}
                    </text>
                    <text class="picker-arrow">›</text>
                  </view>
                </picker>
              </view>
              <view class="input-group half">
                <text class="input-label">人数</text>
                <picker 
                  mode="selector" 
                  :range="participantOptions" 
                  @change="onParticipantChange"
                >
                  <view class="form-picker">
                    <text :class="{ 'placeholder': !newInvite.maxParticipants }">
                      {{ newInvite.maxParticipants ? newInvite.maxParticipants + ' 人' : '选择人数' }}
                    </text>
                    <text class="picker-arrow">›</text>
                  </view>
                </picker>
              </view>
            </view>
            <view class="input-group">
              <text class="input-label">备注</text>
              <input 
                class="form-input" 
                v-model="newInvite.notes"
                placeholder="说点什么..."
              />
            </view>
          </view>
        </view>
        
        <view class="modal-footer">
          <view class="btn cancel-btn" @click="closeModal">
            <text class="btn-text">取消</text>
          </view>
          <view 
            class="btn confirm-btn" 
            :class="{ disabled: !canSend }"
            @click="sendClimbInvite"
          >
            <text class="btn-text">发送</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import cloud from '@/utils/cloud.js'

const tagNames = {
  bouldering: '抱石',
  top_rope: '顶绳',
  lead_climbing: '先锋',
  speed_climbing: '速度',
  beginner_friendly: '新手友好',
  skill_share: '技术交流',
  casual_fun: '轻松娱乐',
  intense_training: '高强度训练',
  morning: '上午',
  afternoon: '下午',
  evening: '晚上',
  weekend: '周末',
  weekday: '工作日'
}

const scrollToView = ref('')
const inputText = ref('')
const conversationId = ref('')
const messages = ref([])
const isLoading = ref(true)

// 弹窗相关
const showModal = ref(false)
const activeTab = ref('existing')
const tabs = [
  { id: 'existing', name: '已有请求' },
  { id: 'new', name: '新建邀请' }
]
const myRequests = ref([])
const selectedRequest = ref(null)
const newInvite = ref({
  venueName: '',
  climbDate: '',
  climbTime: '',
  levelRequirement: '',
  maxParticipants: '',
  notes: ''
})

// 选择器选项
const venueList = ref([])
const levelOptions = ['不限', 'V0-V2', 'V2-V4', 'V4-V6', 'V6-V8', 'V8+']
const participantOptions = ['2', '3', '4', '5', '6']

const chatPartner = ref({
  _id: '',
  name: '',
  avatar: ''
})

const selfUser = ref({
  _id: '',
  name: '',
  avatar: ''
})

const getDefaultAvatar = (userId) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
}

const formatTime = (date) => {
  if (!date) return ''
  
  const d = new Date(date)
  let hours = d.getHours()
  let minutes = d.getMinutes()
  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  return `${hours}:${minutes}`
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messages.value.length > 0) {
      scrollToView.value = 'msg-' + (messages.value.length - 1)
    }
  })
}

const loadMessages = async () => {
  if (!conversationId.value) return
  
  try {
    const data = await cloud.chat.getMessages(conversationId.value)
    const currentUserId = uni.getStorageSync('userId')
    
    messages.value = data.map(msg => ({
      ...msg,
      isSelf: msg.sender_id === currentUserId
    }))
  } catch (err) {
    console.error('加载消息失败:', err)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    isLoading.value = false
  }
}

const sendMessage = async () => {
  if (!inputText.value.trim() || !conversationId.value) return
  
  const content = inputText.value
  inputText.value = ''
  
  try {
    const newMsg = await cloud.chat.sendMessage(conversationId.value, content)
    
    if (newMsg) {
      newMsg.isSelf = true
      messages.value.push(newMsg)
      scrollToBottom()
    }
  } catch (err) {
    console.error('发送消息失败:', err)
    uni.showToast({
      title: '发送失败',
      icon: 'none'
    })
    inputText.value = content
  }
}

const goBack = () => {
  uni.navigateBack()
}

// 弹窗相关函数
const showClimbInviteModal = () => {
  showModal.value = true
  activeTab.value = 'existing'
  selectedRequest.value = null
  resetNewInvite()
  loadMyRequests()
  loadVenues()
}

const loadVenues = async () => {
  try {
    console.log('开始加载场馆...')
    const venues = await cloud.venue.getVenues()
    console.log('获取到的场馆:', venues)
    venueList.value = venues || []
    if (venueList.value.length === 0) {
      console.log('使用备用场馆数据')
      venueList.value = [
        { name: 'Rock Time Gym' },
        { name: 'Climb Zone' },
        { name: 'Peak Climbing Gym' }
      ]
    }
  } catch (err) {
    console.error('加载场馆失败:', err)
    venueList.value = [
      { name: 'Rock Time Gym' },
      { name: 'Climb Zone' },
      { name: 'Peak Climbing Gym' }
    ]
  }
}

// 选择器事件处理
const onVenueChange = (e) => {
  const index = e.detail.value
  newInvite.value.venueName = venueList.value[index]?.name || ''
}

const onDateChange = (e) => {
  newInvite.value.climbDate = e.detail.value
}

const onTimeChange = (e) => {
  newInvite.value.climbTime = e.detail.value
}

const onLevelChange = (e) => {
  newInvite.value.levelRequirement = levelOptions[e.detail.value]
}

const onParticipantChange = (e) => {
  newInvite.value.maxParticipants = participantOptions[e.detail.value]
}

const closeModal = () => {
  showModal.value = false
}

const resetNewInvite = () => {
  newInvite.value = {
    venueName: '',
    climbDate: '',
    climbTime: '',
    levelRequirement: '',
    maxParticipants: '',
    notes: ''
  }
}

const loadMyRequests = async () => {
  try {
    const requests = await cloud.climb.getMyRequests()
    myRequests.value = requests || []
  } catch (err) {
    console.error('加载约爬请求失败:', err)
    myRequests.value = []
  }
}

const selectRequest = (req) => {
  if (selectedRequest.value?._id === req._id) {
    selectedRequest.value = null
  } else {
    selectedRequest.value = req
  }
}

const canSend = () => {
  if (activeTab.value === 'existing') {
    return selectedRequest.value !== null
  } else {
    return newInvite.value.venueName && 
           newInvite.value.climbDate && 
           newInvite.value.climbTime
  }
}

const sendClimbInvite = async () => {
  if (!canSend()) return
  
  let inviteData
  let createdRequestId = null
  
  if (activeTab.value === 'existing') {
    const req = selectedRequest.value
    inviteData = {
      venueName: req.venueName,
      climbDate: req.climbDate,
      climbTime: req.climbTime,
      levelRequirement: req.levelRequirement,
      maxParticipants: req.maxParticipants,
      tags: req.tags || [],
      requestId: req._id
    }
    createdRequestId = req._id
  } else {
    // 先创建约爬请求，再发送邀请
    const requestData = {
      venue_name: newInvite.value.venueName,
      climb_date: newInvite.value.climbDate,
      climb_time: newInvite.value.climbTime,
      level_requirement: newInvite.value.levelRequirement || '不限',
      max_participants: parseInt(newInvite.value.maxParticipants) || 2,
      description: newInvite.value.notes || '',
      tags: []
    }
    
    try {
      const result = await cloud.climb.createClimbRequest(requestData)
      if (result && result.success) {
        createdRequestId = result.requestId
      }
    } catch (err) {
      console.error('创建约爬请求失败:', err)
    }
    
    inviteData = {
      venueName: newInvite.value.venueName,
      climbDate: newInvite.value.climbDate,
      climbTime: newInvite.value.climbTime,
      levelRequirement: newInvite.value.levelRequirement || '不限',
      maxParticipants: parseInt(newInvite.value.maxParticipants) || 2,
      tags: [],
      requestId: createdRequestId
    }
  }
  
  const content = activeTab.value === 'existing' 
    ? '我发起了一个约爬请求，一起去吗？' 
    : (newInvite.value.notes || '要不要一起去攀岩？')
  
  try {
    const newMsg = await cloud.chat.sendMessage(
      conversationId.value, 
      content, 
      'climb_request', 
      inviteData
    )
    
    if (newMsg) {
      newMsg.isSelf = true
      messages.value.push(newMsg)
      scrollToBottom()
      closeModal()
      uni.showToast({
        title: '发送成功',
        icon: 'success'
      })
    }
  } catch (err) {
    console.error('发送约爬邀请失败:', err)
    uni.showToast({
      title: '发送失败',
      icon: 'none'
    })
  }
}

// 处理同意约爬请求
const handleAcceptRequest = (msg) => {
  uni.showModal({
    title: 'Confirm Accept',
    content: 'Are you sure you want to accept this climb request?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmColor: '#7eb662',
    success: async (res) => {
      if (res.confirm) {
        try {
          const requestId = msg.extra.requestId
          const result = await cloud.climb.respondClimbInvite(requestId, 'accepted', msg._id)
          
          if (result?.success) {
            // 更新本地消息状态
            msg.extra.status = 'accepted'
            uni.showToast({
              title: 'Accepted',
              icon: 'success'
            })
          } else {
            uni.showToast({
              title: result?.message || 'Operation failed',
              icon: 'none'
            })
          }
        } catch (err) {
          console.error('Accept climb failed:', err)
          uni.showToast({
            title: 'Operation failed',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 处理拒绝约爬请求
const handleRejectRequest = (msg) => {
  uni.showModal({
    title: 'Confirm Reject',
    content: 'Are you sure you want to reject this climb request?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmColor: '#ef4444',
    success: async (res) => {
      if (res.confirm) {
        try {
          const requestId = msg.extra.requestId
          const result = await cloud.climb.respondClimbInvite(requestId, 'rejected', msg._id)
          
          if (result?.success) {
            // 更新本地消息状态
            msg.extra.status = 'rejected'
            uni.showToast({
              title: 'Rejected',
              icon: 'success'
            })
          } else {
            uni.showToast({
              title: result?.message || 'Operation failed',
              icon: 'none'
            })
          }
        } catch (err) {
          console.error('Reject climb failed:', err)
          uni.showToast({
            title: 'Operation failed',
            icon: 'none'
          })
        }
      }
    }
  })
}

const loadChatPartner = async (userId) => {
  try {
    const user = await cloud.chat.getUserById(userId)
    if (user) {
      chatPartner.value = user
    }
  } catch (err) {
    console.error('加载用户信息失败:', err)
  }
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  
  if (options.conversationId) {
    conversationId.value = options.conversationId
    // 打开会话时清空未读计数
    cloud.chat.clearUnreadCount(options.conversationId)
  }
  
  if (options.otherUserId) {
    chatPartner.value._id = options.otherUserId
    loadChatPartner(options.otherUserId)
  }
  
  selfUser.value._id = uni.getStorageSync('userId')
  selfUser.value.name = uni.getStorageSync('userInfo')?.name || ''
  selfUser.value.avatar = uni.getStorageSync('userInfo')?.avatar || ''
  
  loadMessages().then(() => {
    scrollToBottom()
  })
})
</script>

<style scoped>
.container {
  height: 100vh;
  background-color: #f5f9f5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  padding-top: calc(30rpx + env(safe-area-inset-top));
  background-color: #ffffff;
  border-bottom: 2rpx solid #eee;
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

.user-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
  justify-content: center;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.user-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.menu-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  font-size: 40rpx;
  color: #666;
}

.messages-container {
  flex: 1;
  overflow: hidden;
  padding: 30rpx 10rpx;
  box-sizing: border-box;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-bottom: 30rpx;
  min-height: 100%;
}

.message-item {
  display: flex;
  align-items: flex-end;
  gap: 16rpx;
  margin-right: 72rpx;
}

.message-item.self {
  flex-direction: row-reverse;
  margin-left: 72rpx;
  margin-right: 0;
}

.msg-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.msg-content {
  width: fit-content;
  word-break: break-word;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.message-item.self .msg-content {
  align-items: flex-end;
}

.msg-text {
  padding: 20rpx 24rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  border-bottom-left-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
}

.message-item.self .msg-text {
  background-color: #7eb662;
  color: #ffffff;
  border-radius: 24rpx;
  border-bottom-right-radius: 8rpx;
}

/* 约爬申请卡片 */
.climb-request-card {
  width: 520rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  border-bottom-left-radius: 8rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.message-item.self .climb-request-card {
  border-bottom-left-radius: 24rpx;
  border-bottom-right-radius: 8rpx;
}

.card-header {
  background: linear-gradient(135deg, #7eb662, #6a9b54);
  padding: 20rpx 24rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #ffffff;
}

.card-body {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.info-label {
  font-size: 26rpx;
  color: #999;
  width: 120rpx;
  flex-shrink: 0;
}

.info-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 8rpx;
}

.tag-item {
  padding: 8rpx 20rpx;
  background-color: #f0f7ec;
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #5a8a3f;
}

.card-footer {
  padding: 16rpx 24rpx;
  border-top: 1rpx solid #f0f0f0;
}

.card-text {
  font-size: 26rpx;
  color: #666;
}

/* 约爬请求操作按钮 */
.card-actions {
  display: flex;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  border-top: 1rpx solid #f0f0f0;
}

.action-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 12rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: 500;
}

.reject-btn {
  background-color: #f5f5f5;
  color: #666;
}

.accept-btn {
  background: linear-gradient(135deg, #7eb662, #6a9b54);
  color: #ffffff;
}

.action-btn:active {
  opacity: 0.8;
}

/* 约爬请求状态显示 */
.card-status {
  padding: 16rpx 24rpx;
  border-top: 1rpx solid #f0f0f0;
  text-align: center;
}

.status-text {
  font-size: 26rpx;
  font-weight: 500;
}

.status-text.accepted {
  color: #7eb662;
}

.status-text.rejected {
  color: #ef4444;
}

.message-item.self .card-header {
  background: linear-gradient(135deg, #7eb662, #6a9b54);
}

.message-item.self .card-body {
  background-color: #ffffff;
}

.message-item.self .card-footer {
  background-color: #ffffff;
}

.msg-time {
  font-size: 20rpx;
  color: #999;
  padding: 0 8rpx;
}

.input-section {
  background-color: #ffffff;
  border-top: 2rpx solid #eee;
  padding: 24rpx 30rpx;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.add-btn,
.emoji-btn {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.add-icon,
.emoji-icon {
  font-size: 36rpx;
  color: #999;
}

.message-input {
  flex: 1;
  padding: 20rpx 28rpx;
  background-color: #f5f5f5;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.send-btn {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: #ddd;
  border-radius: 50%;
}

.send-btn.active {
  background-color: #7eb662;
}

.send-icon {
  font-size: 32rpx;
  color: #999;
}

.send-btn.active .send-icon {
  color: #ffffff;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  width: 90%;
  max-width: 600rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.modal-close {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  font-size: 40rpx;
  color: #999;
  line-height: 1;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 30rpx;
}

.tab-bar {
  display: flex;
  background-color: #f5f5f5;
  border-radius: 16rpx;
  padding: 6rpx;
  margin-bottom: 30rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16rpx;
  border-radius: 12rpx;
  transition: all 0.3s;
}

.tab-item.active {
  background-color: #7eb662;
}

.tab-text {
  font-size: 28rpx;
  color: #666;
}

.tab-item.active .tab-text {
  color: #ffffff;
  font-weight: 500;
}

/* 已有请求列表 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.request-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.request-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background-color: #f9f9f9;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s;
}

.request-item.selected {
  background-color: #f0f7ec;
  border-color: #7eb662;
}

.request-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.request-venue {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.request-date,
.request-level {
  font-size: 24rpx;
  color: #666;
}

.check-icon {
  font-size: 36rpx;
  color: #7eb662;
  font-weight: bold;
}

/* 新建邀请表单 */
.new-invite {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.input-group.half {
  width: 48%;
}

.input-row {
  display: flex;
  justify-content: space-between;
}

.input-label {
  font-size: 26rpx;
  color: #666;
}

.form-input {
  width: 100%;
  padding: 20rpx 24rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  font-size: 28rpx;
  border: none;
  box-sizing: border-box;
}

.form-picker {
  width: 100%;
  padding: 20rpx 24rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.form-picker text {
  font-size: 28rpx;
}

.form-picker .placeholder {
  color: #999;
}

.picker-arrow {
  font-size: 36rpx;
  color: #999;
  font-weight: 300;
}

/* 底部按钮 */
.modal-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 16rpx;
  text-align: center;
  transition: all 0.3s;
}

.cancel-btn {
  background-color: #f5f5f5;
}

.confirm-btn {
  background-color: #7eb662;
}

.confirm-btn.disabled {
  background-color: #ddd;
}

.btn-text {
  font-size: 28rpx;
  font-weight: 500;
}

.cancel-btn .btn-text {
  color: #666;
}

.confirm-btn .btn-text {
  color: #ffffff;
}

.confirm-btn.disabled .btn-text {
  color: #999;
}
</style>
