<template>
  <view class="container">
    <!-- Header -->
    <view class="header">
      <view class="header-top">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="header-text">
          <text class="header-title">Smart Partner</text>
          <text class="header-subtitle">Find your perfect climbing match</text>
        </view>
        <view class="header-icon-box">
          <text class="header-icon">✨</text>
        </view>
      </view>
      
      <!-- Venue info -->
      <view v-if="currentVenue" class="venue-indicator">
        <text class="venue-icon">📍</text>
        <text class="venue-name">{{ currentVenue.name }}</text>
      </view>

      <!-- Search bar -->
      <view class="search-box">
        <text class="search-icon">🔍</text>
        <input 
          type="text" 
          placeholder="Search by name or venue..."
          :value="searchQuery"
          @input="onSearchInput"
          class="search-input"
        />
      </view>
    </view>

    <!-- Smart Match Toggle -->
    <view class="smart-match-section">
      <view 
        class="smart-match-btn"
        :class="{ active: showSmartMatch }"
        @click="toggleSmartMatch"
      >
        <view class="smart-match-left">
          <view class="smart-match-icon-box" :class="{ active: showSmartMatch }">
            <text class="smart-match-icon">📈</text>
          </view>
          <view class="smart-match-texts">
            <text class="smart-match-title">AI Smart Match</text>
            <text class="smart-match-subtitle" :class="{ active: showSmartMatch }">
              {{ showSmartMatch ? 'Enabled - Showing best matches' : 'Click to enable smart sorting' }}
            </text>
          </view>
        </view>
        <view class="smart-match-toggle" :class="{ active: showSmartMatch }">
          <view class="toggle-dot" :class="{ active: showSmartMatch }"></view>
        </view>
      </view>
    </view>

    <!-- Level Filter -->
    <view class="filter-section">
      <text class="filter-title">Filter by Level</text>
      <scroll-view class="level-scroll" scroll-x>
        <view class="level-list">
          <view 
            v-for="(level, index) in levels" 
            :key="index"
            class="level-item"
            :class="{ active: selectedLevel === level.value }"
            @click="selectLevel(level.value)"
          >
            <text>{{ level.label }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- Time Filter -->
    <view class="filter-section">
      <text class="filter-title">Filter by Time</text>
      <view 
        class="time-select-btn"
        @click="showTimePicker = true"
      >
        <text class="time-select-label">{{ getTimeDisplayText() }}</text>
        <text class="time-select-arrow">▼</text>
      </view>
    </view>

    <!-- Tag Filter -->
    <view class="filter-section">
      <text class="filter-title">Filter by Tags</text>
      <view class="tag-list">
        <view 
          v-for="tag in availableTags" 
          :key="tag.id"
          class="tag-item"
          :class="{ active: selectedTags.includes(tag.id) }"
          @click="toggleTag(tag.id)"
        >
          <text>{{ tag.icon }} {{ tag.name }}</text>
        </view>
      </view>
    </view>

    <!-- Loading -->
    <view v-if="loading || smartMatchingLoading" class="loading-container">
      <text class="loading-text">{{ smartMatchingLoading ? 'Calculating matches...' : 'Loading...' }}</text>
    </view>

    <!-- Normal state -->
    <view v-else>
      <!-- Results count -->
      <view class="results-count">
        <text>Found </text>
        <text class="count-number">{{ displayRequests.length }}</text>
        <text> climbing {{ displayRequests.length === 1 ? 'request' : 'requests' }}</text>
      </view>

      <!-- Climb Requests List -->
      <view class="requests-list">
        <view 
          v-for="request in displayRequests" 
          :key="request._id"
          class="request-card"
        >
          <view class="card-content">
            <!-- User info -->
            <view class="user-info-row">
              <view class="user-left">
                <image 
                  :src="request.user?.avatarUrl" 
                  class="user-avatar"
                  mode="aspectFill"
                />
                <view class="user-details">
                  <view class="user-name-row">
                    <text class="user-name">{{ request.user?.name || 'Unknown' }}</text>
                    <view class="level-badge">
                      <text>{{ request.level_requirement || 'V0' }}</text>
                    </view>
                  </view>
                </view>
              </view>

              <!-- Match score -->
              <view v-if="showSmartMatch" class="match-score">
                <text>{{ request.match_score ? request.match_score.percentage : 0 }}% Match</text>
              </view>
            </view>

            <!-- Description -->
            <text class="request-description">{{ request.description }}</text>

            <!-- Venue and time -->
            <view class="request-meta">
              <view class="meta-item">
                <text>📍</text>
                <text>{{ request.venue_name }}</text>
              </view>
              <view class="meta-item">
                <text>📅</text>
                <text>{{ request.climb_date }}</text>
              </view>
              <view class="meta-item">
                <text>⏰</text>
                <text>{{ request.climb_time }}</text>
              </view>
              <view class="meta-item">
                <text>👥</text>
                <text>{{ request.participant_count || 0 }}/{{ request.max_participants || 4 }} participants</text>
              </view>
            </view>

            <!-- Tags -->
            <view class="request-tags">
              <view 
                v-for="tag in (request.tags || [])" 
                :key="tag"
                class="request-tag"
              >
                <text>{{ tagNames[tag] || tag }}</text>
              </view>
            </view>

            <!-- Action button -->
            <view 
              class="join-btn" 
              :class="{ disabled: request.participant_count >= (request.max_participants || 4) }"
              @click="request.participant_count < (request.max_participants || 4) ? handleRequestToJoin(request) : null">
              <text>{{ request.participant_count >= (request.max_participants || 4) ? 'Full' : 'Request to Join' }}</text>
            </view>
          </view>
        </view>

        <!-- Empty state -->
        <view v-if="displayRequests.length === 0" class="empty-state">
          <view class="empty-icon-box">
            <text class="empty-icon">🔍</text>
          </view>
          <text class="empty-title">No matches found</text>
          <text class="empty-text">Try adjusting your filters or search criteria</text>
        </view>
      </view>
    </view>

    <view class="bottom-padding"></view>
  </view>

  <!-- Time Picker Popup -->
  <view v-if="showTimePicker" class="time-picker-mask" @click="showTimePicker = false">
    <view class="time-picker-popup" @click.stop>
      <view class="time-picker-header">
        <text class="time-picker-title">Select Time</text>
        <text class="time-picker-close" @click="showTimePicker = false">✕</text>
      </view>
      
      <view class="time-picker-body">
        <!-- Any Time -->
        <view 
          class="time-option"
          :class="{ active: selectedTimeType === 'any' }"
          @click="selectAnyTime"
        >
          <text class="time-option-label">Any Time</text>
          <view v-if="selectedTimeType === 'any'" class="time-option-check">✓</view>
        </view>

        <!-- Quick Time Options -->
        <view class="quick-time-section">
          <text class="quick-time-title">Quick Select</text>
          <view class="quick-time-grid">
            <view 
              v-for="time in quickTimeOptions" 
              :key="time.value"
              class="quick-time-item"
              :class="{ active: selectedTimeType === 'quick' && selectedQuickTime === time.value }"
              @click="selectQuickTime(time.value)"
            >
              <text>{{ time.label }}</text>
            </view>
          </view>
        </view>

        <!-- Custom Time Range -->
        <view class="custom-time-section">
          <text class="custom-time-title">Custom Time</text>
          <view class="custom-time-row">
            <view class="time-input-wrap">
              <text class="time-input-label">From</text>
              <picker 
                mode="time" 
                :value="customStartTime"
                @change="onStartTimeChange"
              >
                <view class="time-input">
                  <text>{{ customStartTime || '09:00' }}</text>
                </view>
              </picker>
            </view>
            <text class="time-separator">-</text>
            <view class="time-input-wrap">
              <text class="time-input-label">To</text>
              <picker 
                mode="time" 
                :value="customEndTime"
                @change="onEndTimeChange"
              >
                <view class="time-input">
                  <text>{{ customEndTime || '18:00' }}</text>
                </view>
              </picker>
            </view>
          </view>
          <view 
            class="use-custom-btn"
            :class="{ active: selectedTimeType === 'custom' }"
            @click="selectCustomTime"
          >
            <text>Use Custom Time</text>
            <view v-if="selectedTimeType === 'custom'" class="time-option-check">✓</view>
          </view>
        </view>
      </view>

      <view class="time-picker-footer">
        <view class="time-picker-cancel" @click="showTimePicker = false">
          <text>Cancel</text>
        </view>
        <view class="time-picker-confirm" @click="confirmTimeSelection">
          <text>Confirm</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import cloud from '@/utils/cloud.js'

const searchQuery = ref('')
const selectedLevel = ref('all')
const showSmartMatch = ref(false)
const selectedTags = ref([])
const climbRequests = ref([])
const loading = ref(false)
const smartMatchingLoading = ref(false)
const matchedRequests = ref([])

// Go back
const goBack = () => {
  uni.navigateBack()
}

// Venue related
const currentVenueId = ref('')
const currentVenue = ref(null)

// Time picker related
const showTimePicker = ref(false)
const selectedTimeType = ref('any') // 'any', 'quick', 'custom'
const selectedQuickTime = ref('morning')
const customStartTime = ref('09:00')
const customEndTime = ref('18:00')
const savedTimeSelection = ref({
  type: 'any',
  quickTime: 'morning',
  startTime: '09:00',
  endTime: '18:00'
})

const levels = [
  { value: 'all', label: 'All Levels (Use My Level)' },
  { value: 'V0', label: 'L1 (V0)' },
  { value: 'V1-V2', label: 'L2 (V1-V2)' },
  { value: 'V3-V4', label: 'L3 (V3-V4)' },
  { value: 'V5-V6', label: 'L4 (V5-V6)' },
  { value: 'V7-V8', label: 'L5 (V7-V8)' },
  { value: 'V9+', label: 'L6 (V9+)' }
]

const quickTimeOptions = [
  { value: 'morning', label: 'Morning (6-12)' },
  { value: 'afternoon', label: 'Afternoon (12-18)' },
  { value: 'evening', label: 'Evening (18-22)' },
  { value: 'night', label: 'Night (22-6)' }
]

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

const tags = ['bouldering', 'ropes', 'lead', 'speed', 'beginner', 'social', 'training', 'project', 'relaxed', 'intense']

// Tag display name mapping
const tagNames = {
  'bouldering': 'Bouldering',
  'ropes': 'Top Rope',
  'lead': 'Lead Climbing',
  'speed': 'Speed Climbing',
  'beginner': 'Beginner Friendly',
  'social': 'Social Climb',
  'training': 'Training Focus',
  'project': 'Working on Project',
  'relaxed': 'Relaxed Pace',
  'intense': 'Intense Session'
}

// Get time display text
const getTimeDisplayText = () => {
  const sel = savedTimeSelection.value
  if (sel.type === 'any') {
    return 'Any Time'
  } else if (sel.type === 'quick') {
    const option = quickTimeOptions.find(t => t.value === sel.quickTime)
    return option ? option.label : 'Any Time'
  } else {
    return `${sel.startTime} - ${sel.endTime}`
  }
}

// Select any time
const selectAnyTime = () => {
  selectedTimeType.value = 'any'
}

// Select quick time
const selectQuickTime = (value) => {
  selectedTimeType.value = 'quick'
  selectedQuickTime.value = value
}

// Select custom time
const selectCustomTime = () => {
  selectedTimeType.value = 'custom'
}

// Start time change
const onStartTimeChange = (e) => {
  customStartTime.value = e.detail.value
}

// End time change
const onEndTimeChange = (e) => {
  customEndTime.value = e.detail.value
}

// Confirm time selection
const confirmTimeSelection = () => {
  savedTimeSelection.value = {
    type: selectedTimeType.value,
    quickTime: selectedQuickTime.value,
    startTime: customStartTime.value,
    endTime: customEndTime.value
  }
  showTimePicker.value = false
  // Trigger recalculate matches
  if (showSmartMatch.value) {
    computeSmartMatch()
  }
}

// Check if time matches
const matchesTime = (request, timeSelection) => {
  if (!timeSelection || timeSelection.type === 'any') return true
  
  const timeStr = request.climb_time || ''
  const requestMinutes = parseTimeToMinutes(timeStr)
  
  if (timeSelection.type === 'quick') {
    return matchesQuickTime(requestMinutes, timeSelection.quickTime)
  } else if (timeSelection.type === 'custom') {
    const startMinutes = parseTimeToMinutes(timeSelection.startTime)
    const endMinutes = parseTimeToMinutes(timeSelection.endTime)
    return matchesCustomTime(requestMinutes, startMinutes, endMinutes)
  }
  
  return true
}

// Parse time to minutes
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null
  
  // Try to match HH:MM format
  const match = timeStr.match(/(\d{1,2}):(\d{2})/)
  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2])
  }
  
  return null
}

// Quick time match
const matchesQuickTime = (minutes, quickType) => {
  if (minutes === null) return false
  
  switch (quickType) {
    case 'morning':
      return minutes >= 6 * 60 && minutes < 12 * 60
    case 'afternoon':
      return minutes >= 12 * 60 && minutes < 18 * 60
    case 'evening':
      return minutes >= 18 * 60 && minutes < 22 * 60
    case 'night':
      return minutes >= 22 * 60 || minutes < 6 * 60
  }
  
  return false
}

// Custom time match
const matchesCustomTime = (minutes, startMinutes, endMinutes) => {
  if (minutes === null) return false
  
  if (startMinutes <= endMinutes) {
    // Not cross day
    return minutes >= startMinutes && minutes <= endMinutes
  } else {
    // Cross day
    return minutes >= startMinutes || minutes <= endMinutes
  }
}

// Get time info for smart match
const getTimeMatchInfo = () => {
  const sel = savedTimeSelection.value
  if (sel.type === 'any') {
    return { any: true }
  } else if (sel.type === 'quick') {
    // Convert to time range
    switch (sel.quickTime) {
      case 'morning':
        return { any: false, start: '06:00', end: '12:00' }
      case 'afternoon':
        return { any: false, start: '12:00', end: '18:00' }
      case 'evening':
        return { any: false, start: '18:00', end: '22:00' }
      case 'night':
        return { any: false, start: '22:00', end: '06:00' }
    }
  } else {
    return { any: false, start: sel.startTime, end: sel.endTime }
  }
  return { any: true }
}

// Load venue info
const loadVenueInfo = async (venueId) => {
  try {
    console.log('Loading venue info, ID:', venueId)
    const venue = await cloud.venue.getVenueById(venueId)
    if (venue) {
      // Ensure we have an id field
      currentVenue.value = {
        ...venue,
        id: venue._id || venue.id
      }
      console.log('Loaded venue:', currentVenue.value)
      
      // Auto-select tags if venue has tags
      if (venue.tags && venue.tags.length > 0) {
        // Only select tags we support
        const supportedTags = venue.tags.filter(tag => 
          availableTags.some(availableTag => availableTag.id === tag)
        )
        selectedTags.value = supportedTags
      }
    } else {
      console.warn('Venue info not found, ID:', venueId)
    }
  } catch (err) {
    console.error('Failed to load venue info:', err)
  }
}

// Load climb requests list
const loadClimbRequests = async () => {
  loading.value = true
  try {
    const requests = await cloud.climb.getClimbRequests()
    // Process all avatar URLs
    for (const request of requests) {
      if (request.user) {
        request.user.avatarUrl = await cloud.getAvatarUrl(request.user.avatar, request.user_id)
      }
    }
    climbRequests.value = requests
  } catch (err) {
    console.error('Failed to load climb requests:', err)
  } finally {
    loading.value = false
  }
}

// Compute smart matches
const computeSmartMatch = async () => {
  if (!showSmartMatch.value) {
    matchedRequests.value = []
    return
  }
  
  smartMatchingLoading.value = true
  try {
    const timeInfo = getTimeMatchInfo()
    const anyTime = timeInfo.any
    // If "All Levels" selected, use user's own level, otherwise use selected level
    const overrideLevel = selectedLevel.value === 'all' ? null : selectedLevel.value
    
    // Build user request with time range and tags
    const myRequest = {
      climb_time: timeInfo.any ? null : `${timeInfo.start} - ${timeInfo.end}`,
      tags: selectedTags.value.length > 0 ? selectedTags.value : null
    }
    
    const results = await cloud.smartMatch.smartMatchRequests(
      climbRequests.value,
      myRequest,
      anyTime,
      overrideLevel
    )
    matchedRequests.value = results
  } catch (err) {
    console.error('Smart match failed:', err)
  } finally {
    smartMatchingLoading.value = false
  }
}

// Check if user is logged in
const checkLogin = () => {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    uni.showModal({
      title: 'Notice',
      content: 'Please login first to use Smart Partner',
      showCancel: false,
      confirmText: 'OK',
      success: () => {
        uni.navigateTo({
          url: '/pages/login/login'
        })
      }
    })
    return false
  }
  return true
}

// Called when page loads
onMounted(() => {
  // Check login first
  if (!checkLogin()) {
    return
  }
  
  let venueId = null
  
  try {
    const pages = getCurrentPages()
    if (pages && pages.length > 0) {
      const currentPage = pages[pages.length - 1]
      if (currentPage && currentPage.options) {
        venueId = currentPage.options.venueId
      }
    }
  } catch (err) {
    console.error('Failed to get parameters:', err)
  }
  
  console.log('Smart Partner - venueId:', venueId)
  
  if (venueId) {
    currentVenueId.value = venueId
    loadVenueInfo(venueId)
  }
  
  loadClimbRequests()
})

// Watch smart match toggle
watch(showSmartMatch, (newVal) => {
  if (newVal && climbRequests.value.length > 0) {
    computeSmartMatch()
  }
})

// Watch level filter change
watch(selectedLevel, () => {
  if (showSmartMatch.value) {
    computeSmartMatch()
  }
})

// Watch tag filter change
watch(selectedTags, () => {
  if (showSmartMatch.value) {
    computeSmartMatch()
  }
}, { deep: true })

// Watch climb requests list change
watch(climbRequests, () => {
  if (showSmartMatch.value) {
    computeSmartMatch()
  }
})

// Filter requests based on selection
const filteredRequests = computed(() => {
  let requests = climbRequests.value
  
  // If smart match enabled, use matched list
  if (showSmartMatch.value) {
    requests = matchedRequests.value
  }
  
  return requests.filter(request => {
    // In smart match mode, don't filter by level, time, tag, use smart match score instead
    let matchesLevel
    if (showSmartMatch.value) {
      matchesLevel = true
    } else {
      matchesLevel = selectedLevel.value === 'all' || request.level_requirement === selectedLevel.value
    }
    
    const matchesTimeVal = showSmartMatch.value ? true : matchesTime(request, savedTimeSelection.value)
    const matchesTags = showSmartMatch.value ? true : (
      selectedTags.value.length === 0 || 
      selectedTags.value.every(tag => (request.tags || []).includes(tag))
    )
    const matchesSearch = searchQuery.value === '' ||
      (request.user?.name?.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (request.venue_name?.toLowerCase().includes(searchQuery.value.toLowerCase()))

    return matchesLevel && matchesTimeVal && matchesTags && matchesSearch
  })
})

// Sort by match score if smart match is enabled
const displayRequests = computed(() => {
  if (showSmartMatch.value) {
    // In smart match mode, use already sorted list
    return filteredRequests.value
  }
  return filteredRequests.value
})

const onSearchInput = (e) => {
  searchQuery.value = e.detail.value
}

const selectLevel = (level) => {
  selectedLevel.value = level
  // Trigger smart match calculation
  if (showSmartMatch.value) {
    computeSmartMatch()
  }
}

const toggleTag = (tag) => {
  const idx = selectedTags.value.indexOf(tag)
  if (idx > -1) {
    selectedTags.value.splice(idx, 1)
  } else {
    selectedTags.value.push(tag)
  }
  // Trigger smart match calculation
  if (showSmartMatch.value) {
    computeSmartMatch()
  }
}

const toggleSmartMatch = () => {
  showSmartMatch.value = !showSmartMatch.value
}

const handleRequestToJoin = async (request) => {
  // Check login
  if (!checkLogin()) {
    return
  }

  uni.showLoading({
    title: 'Applying...'
  })

  // 1. First apply to join
  const applyResult = await cloud.climb.applyJoinRequest(request._id)

  if (!applyResult || !applyResult.success) {
    uni.hideLoading()
    uni.showToast({
      title: applyResult?.message || 'Failed to apply, please try again',
      icon: 'none'
    })
    return
  }

  // 2. Get or create conversation
  const conversation = await cloud.chat.getOrCreateSingleConversation(request.user_id)

  uni.hideLoading()

  if (!conversation) {
    uni.showToast({
      title: 'Failed to create conversation',
      icon: 'none'
    })
    return
  }

  // 3. Send card-style request message
  const messageContent = `I want to apply to join your climb request!`
  const extra = {
    type: 'climb_request_card',
    requestId: request._id,
    venueName: request.venue_name,
    climbDate: request.climb_date,
    climbTime: request.climb_time,
    levelRequirement: request.level_requirement,
    maxParticipants: request.max_participants || 4,
    tags: request.tags || []
  }
  await cloud.chat.sendMessage(conversation._id, messageContent, 'climb_request', extra)

  // 4. Navigate to chat page
  uni.navigateTo({
    url: `/pages/chat/chat?conversationId=${conversation._id}&otherUserId=${request.user_id}`
  })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f9f5;
}

/* Header */
.header {
  background: linear-gradient(135deg, #7eb662, #6a9b54);
  padding: 24px 16px;
  padding-top: calc(24px + env(safe-area-inset-top, 0px));
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
}

.back-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.back-icon {
  font-size: 24px;
  color: white;
  font-weight: bold;
}

.header-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.header-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.header-icon-box {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon {
  font-size: 24px;
}

.venue-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
  width: fit-content;
}

.venue-icon {
  font-size: 16px;
}

.venue-name {
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.search-box {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  padding-left: 44px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  font-size: 20px;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  font-size: 14px;
  color: #111827;
}

/* Smart Match Toggle */
.smart-match-section {
  padding: 16px;
}

.smart-match-btn {
  width: 100%;
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  box-sizing: border-box;
}

.smart-match-btn.active {
  background: linear-gradient(135deg, #a855f7, #9333ea);
}

.smart-match-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.smart-match-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f3e8ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.smart-match-icon-box.active {
  background: rgba(255, 255, 255, 0.2);
}

.smart-match-icon {
  font-size: 20px;
}

.smart-match-texts {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.smart-match-title {
  font-size: 16px;
  font-weight: bold;
  color: #111827;
}

.smart-match-btn.active .smart-match-title {
  color: white;
}

.smart-match-subtitle {
  font-size: 12px;
  color: #6b7280;
}

.smart-match-subtitle.active {
  color: rgba(255, 255, 255, 0.9);
}

.smart-match-toggle {
  width: 48px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  position: relative;
  transition: background 0.3s;
}

.smart-match-toggle.active {
  background: rgba(255, 255, 255, 0.3);
}

.toggle-dot {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.toggle-dot.active {
  transform: translateX(24px);
}

/* Filter Section */
.filter-section {
  padding: 0 16px;
  margin-top: 16px;
}

.filter-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.level-scroll {
  width: 100%;
}

.level-list {
  display: flex;
  gap: 8px;
  padding-right: 16px;
}

.level-item {
  padding: 8px 16px;
  background: white;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  transition: all 0.2s;
}

.level-item.active {
  background: #7eb662;
  color: white;
  box-shadow: 0 2px 8px rgba(126, 182, 98, 0.3);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  padding: 6px 12px;
  background: white;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.2s;
}

.tag-item.active {
  background: #7eb662;
  color: white;
  box-shadow: 0 1px 4px rgba(126, 182, 98, 0.2);
}

/* Time Select Button */
.time-select-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.time-select-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.time-select-arrow {
  font-size: 12px;
  color: #9ca3af;
}

/* Time Picker Mask */
.time-picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 999;
}

.time-picker-popup {
  width: 100%;
  background: white;
  border-radius: 24px 24px 0 0;
  padding: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
}

.time-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.time-picker-title {
  font-size: 18px;
  font-weight: bold;
  color: #111827;
}

.time-picker-close {
  font-size: 20px;
  color: #9ca3af;
  padding: 4px;
}

.time-picker-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.time-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 12px;
  border: 2px solid transparent;
}

.time-option.active {
  border-color: #7eb662;
  background: #f0f7ec;
}

.time-option-label {
  font-size: 16px;
  font-weight: 500;
  color: #111827;
}

.time-option-check {
  font-size: 18px;
  color: #7eb662;
  font-weight: bold;
}

.quick-time-section,
.custom-time-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quick-time-title,
.custom-time-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.quick-time-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.quick-time-item {
  padding: 12px;
  background: #f3f4f6;
  border-radius: 12px;
  text-align: center;
  border: 2px solid transparent;
}

.quick-time-item.active {
  border-color: #7eb662;
  background: #f0f7ec;
}

.quick-time-item text {
  font-size: 14px;
  color: #374151;
}

.quick-time-item.active text {
  color: #5a8a3f;
  font-weight: 500;
}

.custom-time-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-input-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-input-label {
  font-size: 12px;
  color: #6b7280;
}

.time-input {
  padding: 12px;
  background: #f3f4f6;
  border-radius: 8px;
  text-align: center;
}

.time-input text {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}

.time-separator {
  font-size: 16px;
  color: #9ca3af;
}

.use-custom-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f3f4f6;
  border-radius: 12px;
  border: 2px solid transparent;
  margin-top: 4px;
}

.use-custom-btn.active {
  border-color: #7eb662;
  background: #f0f7ec;
}

.use-custom-btn text {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.time-picker-footer {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.time-picker-cancel,
.time-picker-confirm {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  text-align: center;
}

.time-picker-cancel {
  background: #f3f4f6;
}

.time-picker-cancel text {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
}

.time-picker-confirm {
  background: linear-gradient(135deg, #7eb662, #6a9b54);
}

.time-picker-confirm text {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

/* Results Count */
.results-count {
  padding: 16px;
  font-size: 14px;
  color: #4b5563;
}

.count-number {
  font-weight: bold;
  color: #7eb662;
}

/* Requests List */
.requests-list {
  padding: 0 16px;
  padding-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
}

.request-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  box-sizing: border-box;
}

.card-content {
  padding: 16px;
}

.user-info-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.user-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #7eb662;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 16px;
  font-weight: bold;
  color: #111827;
}

.level-badge {
  background: #f0f7ec;
  padding: 2px 8px;
  border-radius: 8px;
}

.level-badge text {
  font-size: 10px;
  font-weight: 600;
  color: #5a8a3f;
}

.user-distance {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  color: #6b7280;
}

.match-score {
  background: linear-gradient(135deg, #a855f7, #9333ea);
  padding: 4px 12px;
  border-radius: 12px;
}

.match-score text {
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.request-description {
  display: block;
  font-size: 14px;
  color: #374151;
  margin-bottom: 12px;
  line-height: 1.5;
}

.request-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4b5563;
}

.request-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.request-tag {
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 6px;
}

.request-tag text {
  font-size: 11px;
  color: #4b5563;
}

.join-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #7eb662, #6a9b54);
  border-radius: 12px;
  text-align: center;
  box-sizing: border-box;
}

.join-btn.disabled {
  background: #d1d5db;
}

.join-btn text {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.join-btn.disabled text {
  color: #6b7280;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
}

.empty-icon-box {
  width: 80px;
  height: 80px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.empty-icon {
  font-size: 40px;
}

.empty-title {
  font-size: 18px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 8px;
}

.empty-text {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 24px;
}

.loading-text {
  font-size: 16px;
  color: #6b7280;
}

.bottom-padding {
  height: 24px;
}
</style>
