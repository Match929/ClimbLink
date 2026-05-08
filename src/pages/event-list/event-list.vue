<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">Events</text>
      <view class="add-btn" @click="goToCreate">
        <text class="add-icon">+</text>
      </view>
    </view>
    
    <view class="content">
      <!-- 筛选标签 -->
      <scroll-view class="filter-scroll" scroll-x>
        <view class="filter-list">
          <view 
            v-for="(filter, index) in filters" 
            :key="index"
            class="filter-item"
            :class="{ active: activeFilter === index }"
            @click="activeFilter = index"
          >
            <text>{{ filter }}</text>
          </view>
        </view>
      </scroll-view>
      
      <!-- 活动列表 -->
      <view class="events-list">
        <view 
          v-for="(event, index) in events" 
          :key="index"
          class="event-card"
          @click="goToDetail"
        >
          <image class="event-image" :src="event.image" mode="aspectFill" />
          <view class="event-info">
            <view class="event-tag">
              <text>{{ event.tag }}</text>
            </view>
            <text class="event-title">{{ event.title }}</text>
            <view class="event-meta">
              <view class="meta-item">
                <text>📅</text>
                <text>{{ event.date }}</text>
              </view>
              <view class="meta-item">
                <text>📍</text>
                <text>{{ event.location }}</text>
              </view>
            </view>
            <view class="event-footer">
              <view class="attendees">
                <image 
                  v-for="(attendee, i) in event.attendees.slice(0, 3)" 
                  :key="i"
                  class="attendee-avatar"
                  :src="attendee.avatar"
                  mode="aspectFill"
                />
                <text class="attendees-count">{{ event.attendees.length }} going</text>
              </view>
              <view class="event-level">
                <text>{{ event.level }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const activeFilter = ref(0)

const filters = ['All', 'Climb', 'Workout', 'Social']

const events = ref([
  {
    id: 1,
    title: 'Saturday Bouldering Session',
    date: 'Sat, 2:00 PM',
    location: 'Rock Time Gym',
    image: 'https://images.unsplash.com/photo-1585950263799-4106e7687d05?w=800&h=400&fit=crop',
    tag: 'Climb',
    level: 'V2-V4',
    attendees: [
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=taylor' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=casey' }
    ]
  },
  {
    id: 2,
    title: 'Beginner Friendly Top Rope',
    date: 'Sun, 10:00 AM',
    location: 'Climber\'s Paradise',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=400&fit=crop',
    tag: 'Climb',
    level: 'V0-V2',
    attendees: [
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sam' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jamie' }
    ]
  },
  {
    id: 3,
    title: 'Climber Coffee Meetup',
    date: 'Mon, 9:00 AM',
    location: 'Cafe Climb',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=400&fit=crop',
    tag: 'Social',
    level: 'All levels',
    attendees: [
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=riley' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avery' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=quinn' },
      { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=morgan' }
    ]
  }
])

const goBack = () => {
  uni.navigateBack()
}

const goToCreate = () => {
  uni.navigateTo({
    url: '/pages/event-create/event-create'
  })
}

const goToDetail = () => {
  uni.navigateTo({
    url: '/pages/activity-detail/activity-detail'
  })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f9f5;
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
}

.back-btn,
.add-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon,
.add-icon {
  font-size: 40rpx;
  color: #333;
}

.header-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.content {
  padding: 30rpx;
  padding-bottom: 200rpx;
}

/* 筛选标签 */
.filter-scroll {
  margin-bottom: 30rpx;
}

.filter-list {
  display: flex;
  white-space: nowrap;
  gap: 20rpx;
}

.filter-item {
  display: inline-block;
  padding: 16rpx 30rpx;
  background-color: #ffffff;
  border-radius: 40rpx;
  border: 2rpx solid transparent;
}

.filter-item.active {
  background-color: #e8f5e0;
  border-color: #7eb662;
}

.filter-item text {
  font-size: 26rpx;
  color: #666;
}

.filter-item.active text {
  color: #5a8a3f;
  font-weight: 500;
}

/* 活动列表 */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.event-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 300rpx;
}

.event-info {
  padding: 24rpx;
}

.event-tag {
  display: inline-block;
  padding: 6rpx 16rpx;
  background-color: #e8f5e0;
  color: #5a8a3f;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: 500;
  margin-bottom: 12rpx;
}

.event-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.event-meta {
  display: flex;
  gap: 30rpx;
  margin-bottom: 20rpx;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.meta-item text:first-child {
  font-size: 24rpx;
}

.meta-item text:last-child {
  font-size: 24rpx;
  color: #666;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.attendees {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.attendee-avatar {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  border: 3rpx solid #ffffff;
  margin-left: -16rpx;
}

.attendee-avatar:first-child {
  margin-left: 0;
}

.attendees-count {
  font-size: 22rpx;
  color: #999;
}

.event-level {
  padding: 8rpx 16rpx;
  background-color: #f5f9f5;
  border-radius: 20rpx;
}

.event-level text {
  font-size: 22rpx;
  color: #666;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
