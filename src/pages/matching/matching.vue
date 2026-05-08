<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">Find Your Climbing Partner</text>
      <view class="settings-btn" @click="goToSettings">
        <text>⚙️</text>
      </view>
    </view>
    
    <view class="content">
      <!-- 卡片栈 -->
      <view class="cards-stack" v-if="!isMatching && profiles.length > 0">
        <view 
          v-for="(profile, index) in profiles" 
          :key="profile.id"
          class="profile-card"
          :class="{ behind: index > 0 }"
          :style="{ transform: index > 0 ? 'translateY(' + (index * 10) + 'px) scale(' + (1 - index * 0.05) + ')' : 'none' }"
        >
          <image class="card-image" :src="profile.avatar" mode="aspectFill" />
          <view class="card-gradient"></view>
          <view class="card-info">
            <view class="name-level">
              <text class="card-name">{{ profile.name }}</text>
              <text class="card-level">{{ profile.level }}</text>
            </view>
            <text class="card-bio">{{ profile.bio }}</text>
            <view class="card-tags">
              <view 
                v-for="(tag, i) in profile.tags" 
                :key="i"
                class="card-tag"
              >
                <text>{{ tag }}</text>
              </view>
            </view>
          </view>
          
          <!-- 滑出提示 -->
          <view class="swipe-hint">
            <text class="hint-left" v-if="showLeft">👎</text>
            <text class="hint-right" v-if="showRight">❤️</text>
          </view>
        </view>
      </view>
      
      <!-- 底部操作 -->
      <view class="actions-section" v-if="!isMatching">
        <view class="action-btn pass" @click="pass">
          <text>👎</text>
        </view>
        <view class="action-btn super" @click="superLike">
          <text>⭐</text>
        </view>
        <view class="action-btn like" @click="like">
          <text>❤️</text>
        </view>
      </view>
      
      <!-- 匹配中动画 -->
      <view class="matching-state" v-if="isMatching">
        <text class="matching-icon">🎰</text>
        <text class="matching-text">Finding your perfect climbing partner...</text>
        <view class="matching-dots">
          <view class="dot" :class="{ active: dotIndex === 1 }"></view>
          <view class="dot" :class="{ active: dotIndex === 2 }"></view>
          <view class="dot" :class="{ active: dotIndex === 3 }"></view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-state" v-if="!isMatching && profiles.length === 0">
        <text class="empty-icon">🧗‍♂️</text>
        <text class="empty-text">No more climbers nearby</text>
        <text class="empty-subtext">Check back later or adjust your preferences!</text>
        <view class="refresh-btn" @click="refresh">
          <text>Refresh</text>
        </view>
      </view>
      
      <!-- 智能匹配按钮 -->
      <view class="smart-match-section" v-if="!isMatching && profiles.length > 0">
        <view class="smart-match-btn" @click="startSmartMatching">
          <text>🤖 Try Smart Match</text>
        </view>
      </view>
    </view>
    
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const isMatching = ref(false)
const showLeft = ref(false)
const showRight = ref(false)
const dotIndex = ref(1)

const profiles = ref([
  {
    id: 1,
    name: 'Alex',
    level: 'V2-V3',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    bio: 'I love bouldering and working on projects! Looking for a partner who\'s friendly and motivated.',
    tags: ['Bouldering', 'V2-V3', 'Weekend', 'Project focus']
  },
  {
    id: 2,
    name: 'Jordan',
    level: 'V1-V2',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan',
    bio: 'Getting back into climbing after a break. Looking for someone patient to have fun with!',
    tags: ['Top Rope', 'Beginner', 'Social', 'Evenings']
  },
  {
    id: 3,
    name: 'Taylor',
    level: 'V3-V4',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=taylor',
    bio: 'Training for comps! Looking for dedicated climbers to push each other.',
    tags: ['Bouldering', 'V3-V4', 'Training', 'Motivated']
  }
])

const goBack = () => {
  uni.navigateBack()
}

const goToSettings = () => {
  uni.showToast({
    title: 'Settings coming soon!',
    icon: 'none'
  })
}

const pass = () => {
  showLeft.value = true
  setTimeout(() => {
    profiles.value.shift()
    showLeft.value = false
  }, 300)
}

const like = () => {
  showRight.value = true
  setTimeout(() => {
    profiles.value.shift()
    showRight.value = false
    if (Math.random() > 0.5) {
      uni.showToast({
        title: 'It\'s a match! 🎉',
        icon: 'success'
      })
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/chat/chat'
        })
      }, 1500)
    }
  }, 300)
}

const superLike = () => {
  uni.showToast({
    title: 'Super liked! ⭐',
    icon: 'none'
  })
  setTimeout(() => {
    profiles.value.shift()
  }, 500)
}

const startSmartMatching = () => {
  isMatching.value = true
  const interval = setInterval(() => {
    dotIndex.value = (dotIndex.value % 3) + 1
  }, 500)
  setTimeout(() => {
    clearInterval(interval)
    isMatching.value = false
    uni.showToast({
      title: 'Found a match! 🎉',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/chat/chat'
      })
    }, 1000)
  }, 3000)
}

const refresh = () => {
  isMatching.value = true
  const interval = setInterval(() => {
    dotIndex.value = (dotIndex.value % 3) + 1
  }, 500)
  setTimeout(() => {
    clearInterval(interval)
    isMatching.value = false
    profiles.value = [
      {
        id: Date.now(),
        name: 'Casey',
        level: 'V2-V3',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=casey',
        bio: 'Just looking to climb and have fun!',
        tags: ['Bouldering', 'Social', 'Weekend']
      }
    ]
  }, 2000)
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
}

.back-btn,
.settings-btn {
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

.settings-btn text {
  font-size: 40rpx;
}

.header-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.content {
  flex: 1;
  padding: 40rpx 30rpx;
  display: flex;
  flex-direction: column;
}

/* 卡片栈 */
.cards-stack {
  flex: 1;
  position: relative;
  min-height: 600rpx;
  margin-bottom: 40rpx;
}

.profile-card {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background-color: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.1);
}

.profile-card.behind {
  z-index: -1;
}

.card-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.card-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}

.card-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  z-index: 10;
}

.name-level {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.card-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #ffffff;
}

.card-level {
  font-size: 24rpx;
  color: #7eb662;
  font-weight: 600;
}

.card-bio {
  font-size: 26rpx;
  color: #ffffff;
  line-height: 1.5;
  margin-bottom: 20rpx;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.card-tag {
  padding: 8rpx 18rpx;
  background-color: rgba(255,255,255,0.2);
  border-radius: 20rpx;
}

.card-tag text {
  font-size: 22rpx;
  color: #ffffff;
}

/* 滑出提示 */
.swipe-hint {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 40rpx;
  z-index: 20;
  pointer-events: none;
}

.hint-left,
.hint-right {
  font-size: 100rpx;
  opacity: 0.8;
}

/* 底部操作 */
.actions-section {
  display: flex;
  justify-content: center;
  gap: 30rpx;
  margin-bottom: 30rpx;
}

.action-btn {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.action-btn text {
  font-size: 40rpx;
}

.action-btn.super {
  width: 80rpx;
  height: 80rpx;
}

.action-btn.like {
  background-color: #ff6b6b;
}

.action-btn.pass {
  background-color: #e0e0e0;
}

/* 智能匹配按钮 */
.smart-match-section {
  display: flex;
  justify-content: center;
}

.smart-match-btn {
  padding: 24rpx 50rpx;
  background: linear-gradient(to right, #7eb662, #6a9b54);
  border-radius: 50rpx;
  box-shadow: 0 4rpx 12rpx rgba(126, 182, 98, 0.3);
}

.smart-match-btn text {
  font-size: 26rpx;
  font-weight: 600;
  color: #ffffff;
}

/* 匹配中状态 */
.matching-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
}

.matching-icon {
  font-size: 120rpx;
}

.matching-text {
  font-size: 28rpx;
  color: #666;
  text-align: center;
}

.matching-dots {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
}

.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background-color: #e0e0e0;
}

.dot.active {
  background-color: #7eb662;
}

/* 空状态 */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.empty-subtext {
  font-size: 24rpx;
  color: #999;
  text-align: center;
  margin-bottom: 40rpx;
}

.refresh-btn {
  padding: 24rpx 50rpx;
  background-color: #7eb662;
  border-radius: 16rpx;
}

.refresh-btn text {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
