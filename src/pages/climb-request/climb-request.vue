<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">{{ isEditing ? 'Edit Request' : 'Find Partners' }}</text>
      <view 
        class="publish-btn" 
        :class="{ disabled: !selectedVenue || !formData.date || !formData.level }"
        @click="handlePublish"
      >
        <text>{{ isEditing ? 'Update' : 'Publish' }}</text>
      </view>
    </view>

    <scroll-view scroll-y="true" class="content">
      <!-- 选择场馆 -->
      <view class="section-card">
        <view class="section-header">
          <text class="icon">📍</text>
          <text class="section-title">Climbing Gym</text>
          <text class="required">*</text>
        </view>
        
        <view v-if="selectedVenue" class="venue-selected" @click="openVenueModal">
          <view class="venue-icon">
            <text>📍</text>
          </view>
          <view class="venue-info">
            <text class="venue-name">{{ selectedVenue.name }}</text>
            <text class="venue-address">{{ selectedVenue.address }}</text>
            <text v-if="selectedVenue.distance" class="venue-distance">{{ selectedVenue.distance }}</text>
          </view>
          <text class="chevron">›</text>
        </view>
        
        <view v-else class="venue-select" @click="openVenueModal">
          <text>📍</text>
          <text>Select Venue</text>
          <text>›</text>
        </view>
      </view>

      <!-- 选择日期 -->
      <view class="section-card">
        <view class="section-header">
          <text class="icon">📅</text>
          <text class="section-title">Climb Date</text>
          <text class="required">*</text>
        </view>
        <picker 
          mode="date" 
          :value="formData.date" 
          :start="today"
          @change="onDateChange"
        >
          <view class="picker">
            <text :class="{ 'placeholder': !formData.date }">
              {{ formData.date || 'Select Date' }}
            </text>
          </view>
        </picker>
      </view>

      <!-- 选择时间段 -->
      <view class="section-card">
        <view class="section-header">
          <text class="icon">⏰</text>
          <text class="section-title">Time Slot</text>
        </view>
        <view 
          class="time-select" 
          :class="{ 'time-selected': timeRange.start && timeRange.end }"
          @click="openTimePicker"
        >
          <text>{{ formatTimeRange() }}</text>
        </view>
      </view>

      <!-- 技能水平 -->
      <view class="section-card">
        <view class="section-header">
          <text class="icon">V</text>
          <text class="section-title">Skill Level</text>
          <text class="required">*</text>
        </view>
        <view class="levels-grid">
          <view 
            v-for="level in levels" 
            :key="level"
            class="level-btn"
            :class="{ 'level-selected': formData.level === level }"
            @click="selectLevel(level)"
          >
            <text>{{ level }}</text>
          </view>
        </view>
      </view>

      <!-- 寻找人数 -->
      <view class="section-card">
        <view class="section-header">
          <text class="icon">👥</text>
          <text class="section-title">Looking For Partners</text>
        </view>
        <view class="people-selector">
          <view class="people-btn minus" @click="decreasePeople">
            <text>−</text>
          </view>
          <view class="people-count">
            <text class="count-number">{{ formData.peopleCount }}</text>
            <text class="count-label">people</text>
          </view>
          <view class="people-btn plus" @click="increasePeople">
            <text>+</text>
          </view>
        </view>
      </view>

      <!-- 标签选择 -->
      <view class="section-card">
        <view class="section-header">
          <text class="icon">🏷️</text>
          <text class="section-title">Tags</text>
          <text class="optional">(optional)</text>
        </view>
        <view class="tags-grid">
          <view 
            v-for="tag in availableTags" 
            :key="tag.id"
            class="tag-btn"
            :class="{ 'tag-selected': formData.tags.includes(tag.id) }"
            @click="toggleTag(tag.id)"
          >
            <text>{{ tag.icon }} {{ tag.name }}</text>
          </view>
        </view>
      </view>

      <!-- 补充说明 -->
      <view class="section-card">
        <view class="section-header">
          <text class="section-title">Additional Notes</text>
          <text class="optional">(optional)</text>
        </view>
        <textarea 
          class="textarea" 
          :value="formData.description"
          @input="onDescriptionInput"
          placeholder="Share your climbing expectations, personal traits, etc..."
          maxlength="500"
        />
      </view>

      <!-- 匹配说明 -->
      <view class="info-card">
        <text class="info-title">Smart Matching Info</text>
        <view class="info-list">
          <view class="info-item">
            <text class="bullet">•</text>
            <text>System will auto-match based on time, location, and skill level</text>
          </view>
          <view class="info-item">
            <text class="bullet">•</text>
            <text>Both parties can view detailed info after matching</text>
          </view>
          <view class="info-item">
            <text class="bullet">•</text>
            <text>Generate AI memory card after climb completion</text>
          </view>
        </view>
      </view>

      <view class="bottom-space"></view>
    </scroll-view>

    <!-- 场馆选择弹窗 -->
    <view v-if="showVenueModal" class="modal-overlay" @click="closeVenueModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">Select Venue</text>
          <text class="modal-close" @click="closeVenueModal">×</text>
        </view>
        <scroll-view scroll-y="true" class="venue-list">
          <view 
            v-for="venue in venues" 
            :key="venue.id"
            class="venue-item"
            @click="selectVenue(venue)"
          >
            <view class="venue-item-info">
              <text class="venue-item-name">{{ venue.name }}</text>
              <text class="venue-item-address">{{ venue.address }}</text>
              <text v-if="venue.distance" class="venue-item-distance">{{ venue.distance }}</text>
            </view>
            <view v-if="selectedVenue?.id === venue.id" class="check-icon">
              <text>✓</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 时间选择弹窗 -->
    <view v-if="showTimePicker" class="modal-overlay" @click="closeTimePicker">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">Select Time Range</text>
          <text class="modal-close" @click="closeTimePicker">×</text>
        </view>
        <view class="time-picker">
          <view class="time-picker-section">
            <text class="time-picker-label">Start Time</text>
            <picker mode="time" :value="timeRange.start" @change="onStartTimeChange">
              <view class="time-picker-btn">
                <text>{{ timeRange.start || '09:00' }}</text>
              </view>
            </picker>
          </view>
          <view class="time-picker-divider">
            <text>−</text>
          </view>
          <view class="time-picker-section">
            <text class="time-picker-label">End Time</text>
            <picker mode="time" :value="timeRange.end" @change="onEndTimeChange">
              <view class="time-picker-btn">
                <text>{{ timeRange.end || '12:00' }}</text>
              </view>
            </picker>
          </view>
        </view>
        <view class="modal-footer">
          <view class="confirm-btn" @click="confirmTime">
            <text>Confirm</text>
          </view>
        </view>
      </view>
    </view>

    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import cloud from '@/utils/cloud.js'

const formData = ref({
  date: '',
  time: '',
  level: '',
  peopleCount: '1',
  description: '',
  tags: [],
})

const selectedVenue = ref(null)
const showTimePicker = ref(false)
const showVenueModal = ref(false)
const timeRange = ref({ start: '09:00', end: '12:00' })

// 编辑模式相关
const isEditing = ref(false)
const editingRequestId = ref(null)

const today = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

const levels = [
  'V0-V2 Beginner',
  'V3-V5 Intermediate',
  'V6-V8 Advanced',
  'V9+ Expert',
]

const venues = ref([])

// 加载场馆数据
const loadVenues = async () => {
  try {
    const data = await cloud.venue.getVenues()
    // 确保每个场馆都有 id 字段
    venues.value = data.map(venue => ({
      ...venue,
      id: venue.id || venue._id,
      distance: venue.distance || 'Unknown'
    }))
  } catch (err) {
    console.error('加载场馆数据失败:', err)
  }
}

// 加载请求数据用于编辑
const loadRequestData = async (requestId) => {
  try {
    const res = await cloud.climb.getClimbRequestById(requestId)
    if (res) {
      isEditing.value = true
      editingRequestId.value = requestId
      
      // 填充表单数据
      formData.value.date = res.climb_date || ''
      formData.value.level = res.level_requirement || ''
      formData.value.peopleCount = String(res.max_participants || '1')
      formData.value.description = res.description || ''
      formData.value.tags = res.tags || []
      
      // 解析时间
      if (res.climb_time) {
        const timeParts = res.climb_time.split(' - ')
        if (timeParts.length === 2) {
          timeRange.value.start = timeParts[0]
          timeRange.value.end = timeParts[1]
        }
      }
      
      // 查找对应的场馆
      if (venues.value.length > 0) {
        const venue = venues.value.find(v => v.id === res.venue_id || v._id === res.venue_id || v.name === res.venue_name)
        if (venue) {
          selectedVenue.value = venue
        }
      }
    }
  } catch (err) {
    console.error('加载请求数据失败:', err)
  }
}

// 页面加载时
onMounted(() => {
  loadVenues()
  // 使用 setTimeout 来延迟获取页面参数
  setTimeout(() => {
    const pages = getCurrentPages()
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1]
      const options = currentPage.options || {}
      if (options.requestId) {
        editingRequestId.value = options.requestId
        loadVenues().then(() => {
          loadRequestData(options.requestId)
        })
      }
    }
  }, 100)
})


const availableTags = [
  { id: 'bouldering', name: 'Bouldering', icon: '🧗' },
  { id: 'ropes', name: 'Top Rope', icon: '🪢' },
  { id: 'lead', name: 'Lead Climbing', icon: '⛓️' },
  { id: 'speed', name: 'Speed Climbing', icon: '⚡' },
  { id: 'beginner', name: 'Beginner Friendly', icon: '🆕' },
  { id: 'social', name: 'Social Climb', icon: '🎉' },
  { id: 'training', name: 'Training Focus', icon: '💪' },
  { id: 'project', name: 'Working on Project', icon: '🎯' },
  { id: 'relaxed', name: 'Relaxed Pace', icon: '😌' },
  { id: 'intense', name: 'Intense Session', icon: '🔥' },
]

const goBack = () => {
  uni.navigateBack()
}

const handlePublish = async () => {
  if (!selectedVenue.value || !formData.value.date || !formData.value.level) {
    uni.showToast({
      title: '请填写必填项',
      icon: 'none'
    })
    return
  }

  uni.showLoading({
    title: isEditing.value ? '更新中...' : '发布中...'
  })

  const requestData = {
    venue_id: selectedVenue.value.id,
    venue_name: selectedVenue.value.name,
    climb_date: formData.value.date,
    climb_time: `${timeRange.value.start} - ${timeRange.value.end}`,
    level_requirement: formData.value.level,
    max_participants: parseInt(formData.value.peopleCount),
    description: formData.value.description,
    tags: formData.value.tags
  }

  let result
  if (isEditing.value && editingRequestId.value) {
    result = await cloud.climb.updateClimbRequest(editingRequestId.value, requestData)
  } else {
    result = await cloud.climb.createClimbRequest(requestData)
  }

  uni.hideLoading()

  if (result && result.success) {
    uni.showToast({
      title: isEditing.value ? '更新成功!' : '发布成功!',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } else {
    uni.showToast({
      title: result?.message || (isEditing.value ? '更新失败，请重试' : '发布失败，请重试'),
      icon: 'none'
    })
  }
}

const formatTimeRange = () => {
  if (!timeRange.value.start || !timeRange.value.end) return 'Select Time Range'
  return `${timeRange.value.start} - ${timeRange.value.end}`
}

const openVenueModal = () => {
  showVenueModal.value = true
}

const closeVenueModal = () => {
  showVenueModal.value = false
}

const selectVenue = (venue) => {
  selectedVenue.value = venue
  closeVenueModal()
}

const openTimePicker = () => {
  showTimePicker.value = true
}

const closeTimePicker = () => {
  showTimePicker.value = false
}

const confirmTime = () => {
  formData.value.time = `${timeRange.value.start} - ${timeRange.value.end}`
  closeTimePicker()
}

const onDateChange = (e) => {
  formData.value.date = e.detail.value
}

const onStartTimeChange = (e) => {
  timeRange.value.start = e.detail.value
}

const onEndTimeChange = (e) => {
  timeRange.value.end = e.detail.value
}

const selectLevel = (level) => {
  formData.value.level = level
}

const decreasePeople = () => {
  const count = Number(formData.value.peopleCount)
  if (count > 1) {
    formData.value.peopleCount = String(count - 1)
  }
}

const increasePeople = () => {
  const count = Number(formData.value.peopleCount)
  if (count < 10) {
    formData.value.peopleCount = String(count + 1)
  }
}

const onDescriptionInput = (e) => {
  formData.value.description = e.detail.value
}

const toggleTag = (tagId) => {
  const index = formData.value.tags.indexOf(tagId)
  if (index === -1) {
    // 添加标签
    formData.value.tags.push(tagId)
  } else {
    // 移除标签
    formData.value.tags.splice(index, 1)
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f0f7ec, #f5f9f5);
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
  border-bottom: 2rpx solid #f1f1f1;
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
  font-weight: bold;
  color: #111;
}

.publish-btn {
  padding: 16rpx 32rpx;
  background-color: #7eb662;
  border-radius: 16rpx;
}

.publish-btn.disabled {
  opacity: 0.5;
}

.publish-btn text {
  font-size: 26rpx;
  font-weight: 600;
  color: #ffffff;
}

.content {
  flex: 1;
  padding: 30rpx;
  box-sizing: border-box;
}

.section-card {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.icon {
  font-size: 32rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #111;
}

.required {
  font-size: 24rpx;
  color: #ef4444;
}

.optional {
  font-size: 22rpx;
  color: #999;
  margin-left: 8rpx;
}

/* 场馆选择 */
.venue-select {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 30rpx;
  background-color: #f9fafb;
  border: 2rpx solid #f1f1f1;
  border-radius: 20rpx;
}

.venue-select text {
  font-size: 26rpx;
  color: #4b5563;
}

.venue-selected {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  padding: 30rpx;
  background-color: #ffffff;
  border: 2rpx solid #f1f1f1;
  border-radius: 20rpx;
}

.venue-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(to bottom right, #7eb662, #6a9b54);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.venue-icon text {
  font-size: 32rpx;
}

.venue-info {
  flex: 1;
  min-width: 0;
}

.venue-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #111;
  display: block;
  margin-bottom: 8rpx;
}

.venue-address {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.venue-distance {
  font-size: 22rpx;
  color: #7eb662;
  font-weight: 500;
  display: block;
  margin-top: 8rpx;
}

.chevron {
  font-size: 40rpx;
  color: #999;
  flex-shrink: 0;
}

/* 日期选择 */
.picker {
  padding: 24rpx;
  background-color: #f9fafb;
  border: 2rpx solid #f1f1f1;
  border-radius: 20rpx;
}

.picker text {
  font-size: 26rpx;
  color: #111;
}

.picker .placeholder {
  color: #999;
}

/* 时间选择 */
.time-select {
  padding: 24rpx;
  background-color: #f9fafb;
  border: 2rpx solid #f1f1f1;
  border-radius: 20rpx;
  text-align: center;
}

.time-select.time-selected {
  background-color: #7eb662;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(126, 182, 98, 0.3);
}

.time-select text {
  font-size: 26rpx;
  font-weight: 500;
  color: #4b5563;
}

.time-select.time-selected text {
  color: #ffffff;
}

/* 技能水平 */
.levels-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.level-btn {
  padding: 24rpx;
  background-color: #f9fafb;
  border: 2rpx solid #f1f1f1;
  border-radius: 20rpx;
  text-align: center;
}

.level-btn.level-selected {
  background-color: #7eb662;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(126, 182, 98, 0.3);
}

.level-btn text {
  font-size: 24rpx;
  font-weight: 500;
  color: #4b5563;
}

.level-btn.level-selected text {
  color: #ffffff;
}

/* 人数选择 */
.people-selector {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.people-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.people-btn.minus {
  background-color: #f3f4f6;
}

.people-btn.plus {
  background-color: #7eb662;
}

.people-btn text {
  font-size: 40rpx;
  font-weight: bold;
}

.people-btn.minus text {
  color: #374151;
}

.people-btn.plus text {
  color: #ffffff;
}

.people-count {
  flex: 1;
  text-align: center;
}

.count-number {
  font-size: 60rpx;
  font-weight: bold;
  color: #7eb662;
  display: block;
}

.count-label {
  font-size: 22rpx;
  color: #666;
  display: block;
  margin-top: 8rpx;
}

/* 标签选择 */
.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.tag-btn {
  padding: 16rpx 24rpx;
  background-color: #f9fafb;
  border: 2rpx solid #f1f1f1;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  transition: all 0.2s ease;
}

.tag-btn.tag-selected {
  background-color: #7eb662;
  border-color: #7eb662;
  box-shadow: 0 4rpx 12rpx rgba(126, 182, 98, 0.3);
}

.tag-btn text {
  font-size: 24rpx;
  font-weight: 500;
  color: #4b5563;
}

.tag-btn.tag-selected text {
  color: #ffffff;
}

/* 文本域 */
.textarea {
  width: 100%;
  min-height: 200rpx;
  padding: 24rpx;
  background-color: #f9fafb;
  border: 2rpx solid #f1f1f1;
  border-radius: 20rpx;
  font-size: 26rpx;
  line-height: 1.5;
  box-sizing: border-box;
}

/* 信息卡片 */
.info-card {
  background: linear-gradient(to bottom right, #e8f5e0, #d4e7c5);
  border: 2rpx solid #c8e1b8;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
}

.info-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #111;
  display: block;
  margin-bottom: 20rpx;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.bullet {
  font-size: 28rpx;
  color: #7eb662;
  margin-top: 2rpx;
  flex-shrink: 0;
}

.info-item text:last-child {
  font-size: 24rpx;
  color: #374151;
  flex: 1;
  line-height: 1.5;
}

.bottom-space {
  height: 40rpx;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 100;
}

.modal-content {
  width: 100%;
  max-height: 70vh;
  background-color: #ffffff;
  border-radius: 32rpx 32rpx 0 0;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 2rpx solid #f1f1f1;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #111;
}

.modal-close {
  font-size: 50rpx;
  color: #999;
  line-height: 1;
}

.venue-list {
  flex: 1;
  max-height: 60vh;
}

.venue-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 2rpx solid #f1f1f1;
}

.venue-item-info {
  flex: 1;
}

.venue-item-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #111;
  display: block;
  margin-bottom: 8rpx;
}

.venue-item-address {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.venue-item-distance {
  font-size: 22rpx;
  color: #7eb662;
  font-weight: 500;
  display: block;
  margin-top: 8rpx;
}

.check-icon {
  width: 50rpx;
  height: 50rpx;
  background-color: #7eb662;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.check-icon text {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: bold;
}

/* 时间选择器 */
.time-picker {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 30rpx;
}

.time-picker-section {
  flex: 1;
}

.time-picker-label {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 12rpx;
  text-align: center;
}

.time-picker-btn {
  padding: 24rpx;
  background-color: #f9fafb;
  border: 2rpx solid #f1f1f1;
  border-radius: 16rpx;
  text-align: center;
}

.time-picker-btn text {
  font-size: 28rpx;
  font-weight: 600;
  color: #111;
}

.time-picker-divider {
  padding: 0 20rpx;
}

.time-picker-divider text {
  font-size: 40rpx;
  color: #999;
}

.modal-footer {
  padding: 30rpx;
  border-top: 2rpx solid #f1f1f1;
}

.confirm-btn {
  padding: 28rpx;
  background-color: #7eb662;
  border-radius: 20rpx;
  text-align: center;
}

.confirm-btn text {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
