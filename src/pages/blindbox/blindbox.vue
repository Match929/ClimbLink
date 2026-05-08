<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="header">
      <view class="back-btn" @click="navigateBack">
        <text>‹</text>
      </view>
      <text class="header-title">Mystery Match</text>
    </view>

    <!-- 主内容区 -->
    <view class="content">
      <!-- 盲盒图标和标题 -->
      <view class="intro">
        <view class="gift-icon" :class="{ spinning: isMatching }">
          <text>🎁</text>
        </view>
        <text class="intro-title">Random Partner Match</text>
        <text class="intro-desc">Based on your skill level and preferences</text>
        <text class="intro-desc">We'll match you with like-minded climbing partners</text>
      </view>

      <!-- 匹配前显示 -->
      <view v-if="!matchResult" class="match-section">
        <!-- 匹配按钮 -->
        <view class="match-btn" @click="handleMatch" :class="{ disabled: isMatching }">
          <text v-if="isMatching">🔄 Finding your match...</text>
          <text v-else>✨ Open Mystery Box</text>
        </view>

        <!-- 匹配规则 -->
        <view class="rules-card">
          <text class="rules-title">Matching Rules</text>
          <view class="rules-list">
            <view class="rule-item">
              <text class="rule-check">✓</text>
              <text class="rule-text">System will match based on your climbing level</text>
            </view>
            <view class="rule-item">
              <text class="rule-check">✓</text>
              <text class="rule-text">Priority match with climbers in the same city and gym</text>
            </view>
            <view class="rule-item">
              <text class="rule-check">✓</text>
              <text class="rule-text">Each match is a new surprise experience</text>
            </view>
            <view class="rule-item">
              <text class="rule-check">✓</text>
              <text class="rule-text">Unsatisfied? Re-match</text>
            </view>
          </view>
        </view>

        <!-- 历史匹配记录 -->
        <view v-if="!isMatching" class="history-section">
          <text class="history-title">Recent Matches</text>
          <view class="history-list">
            <view v-for="(record, index) in matchHistory" :key="index" class="history-item">
              <view class="history-left">
                <image :src="record.avatar" class="history-avatar"></image>
                <view class="history-info">
                  <text class="history-name">{{ record.name }}</text>
                  <text class="history-level">{{ record.level }}</text>
                </view>
              </view>
              <text class="history-date">{{ record.date }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 匹配结果显示 -->
      <view v-else class="result-section">
        <!-- 匹配成功提示 -->
        <view class="match-success">
          <view class="success-icon">❤️</view>
          <text>Match Found!</text>
        </view>

        <!-- 用户信息卡片 -->
        <view class="user-card">
          <view class="user-header">
            <image :src="matchResult.user.avatar" class="result-avatar"></image>
            <view class="user-details">
              <view class="user-name-row">
                <text class="result-name">{{ matchResult.user.name }}</text>
                <text class="user-age-gender">{{ matchResult.user.age }} years old · {{ matchResult.user.gender }}</text>
              </view>
              <view class="user-level-exp">
                <text>📈</text>
                <text>{{ matchResult.user.level }}</text>
                <text>·</text>
                <text>{{ matchResult.user.experience }} experience</text>
              </view>
              <view class="compatibility">
                <view class="compatibility-bar">
                  <view class="compatibility-fill" :style="{ width: matchResult.compatibility + '%' }"></view>
                </view>
                <text class="compatibility-text">{{ matchResult.compatibility }}%</text>
              </view>
            </view>
          </view>

          <view class="user-intro">
            <text>"{{ matchResult.introduction }}"</text>
          </view>

          <view class="climb-info">
            <view class="info-item">
              <text>📍</text>
              <text>{{ matchResult.venue }}</text>
            </view>
            <view class="info-item">
              <text>✨</text>
              <text>Suggested climbing time: {{ matchResult.time }}</text>
            </view>
          </view>

          <view class="interests">
            <text class="interests-title">Common Interests</text>
            <view class="interests-list">
              <view v-for="(interest, index) in matchResult.commonInterests" :key="index" class="interest-tag">
                <text>{{ interest }}</text>
              </view>
            </view>
          </view>

          <view class="action-buttons">
            <view class="action-btn secondary" @click="rematch">
              <text>🔄 Re-match</text>
            </view>
            <view class="action-btn primary" @click="acceptMatch">
              <text>❤️ Accept Match</text>
            </view>
          </view>
        </view>

        <!-- 提示信息 -->
        <view class="tip-card">
          <text>💡 After accepting the match, the system will generate a climbing card and notify the other party</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const isMatching = ref(false)
const matchResult = ref(null)

const matchHistory = ref([
  { name: "XiaoZhang", level: "V2-V4", date: "March 20th", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoZhang" },
  { name: "Ami", level: "V3-V5", date: "March 18th", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ami" },
])

function navigateBack() {
  uni.navigateBack()
}

function handleMatch() {
  if (isMatching.value) return
  
  isMatching.value = true
  matchResult.value = null
  
  setTimeout(() => {
    matchResult.value = {
      user: {
        name: "XiaoWang",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoWang",
        level: "V3-V4",
        experience: "1.5 years",
        age: 26,
        gender: "Male",
      },
      venue: "Rock Time Gym",
      time: "Tomorrow 3:00 PM",
      compatibility: 88,
      commonInterests: ["Bouldering", "Outdoors", "Photography"],
      introduction: "Love challenging new routes and helping beginners. Looking for a partner to progress together!",
    }
    isMatching.value = false
  }, 2000)
}

function rematch() {
  matchResult.value = null
  handleMatch()
}

function acceptMatch() {
  uni.showToast({
    title: 'Match accepted!',
    icon: 'success'
  })
  setTimeout(() => {
    navigateBack()
  }, 1500)
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #d4e7c5 0%, #f5f9f5 100%);
}

.header {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: transparent;
}

.back-btn {
  font-size: 32px;
  color: #374151;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #111827;
  margin-left: 8px;
}

.content {
  padding: 0 16px;
  padding-top: 24px;
}

.intro {
  text-align: center;
  margin-bottom: 32px;
}

.gift-icon {
  width: 128px;
  height: 128px;
  background: linear-gradient(135deg, #7eb662 0%, #6a9b54 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  margin: 0 auto 16px;
  box-shadow: 0 4px 12px rgba(126, 182, 98, 0.25);
}

.gift-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.intro-title {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 8px;
}

.intro-desc {
  display: block;
  font-size: 16px;
  color: #4b5563;
  line-height: 1.5;
}

.match-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.match-btn {
  width: 100%;
  padding: 24px;
  background: linear-gradient(135deg, #7eb662 0%, #6a9b54 100%);
  border-radius: 16px;
  text-align: center;
  color: white;
  font-size: 18px;
  font-weight: 500;
  box-sizing: border-box;
}

.match-btn.disabled {
  opacity: 0.5;
}

.rules-card {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 16px;
}

.rules-title {
  font-size: 16px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 12px;
  display: block;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.rule-check {
  color: #7eb662;
  font-size: 16px;
  flex-shrink: 0;
}

.rule-text {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
}

.history-section {
  margin-top: 32px;
}

.history-title {
  font-size: 16px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 12px;
  display: block;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.history-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.history-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.history-name {
  font-size: 15px;
  font-weight: 500;
  color: #111827;
}

.history-level {
  font-size: 12px;
  color: #6b7280;
}

.history-date {
  font-size: 12px;
  color: #6b7280;
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.match-success {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: white;
  padding: 8px 16px;
  border-radius: 20px;
  align-self: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.success-icon {
  font-size: 20px;
}

.match-success text:last-child {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.user-card {
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.user-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.result-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.user-details {
  flex: 1;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.result-name {
  font-size: 20px;
  font-weight: bold;
  color: #111827;
}

.user-age-gender {
  font-size: 13px;
  color: #6b7280;
}

.user-level-exp {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 8px;
}

.compatibility {
  display: flex;
  align-items: center;
  gap: 8px;
}

.compatibility-bar {
  flex: 1;
  height: 8px;
  background-color: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.compatibility-fill {
  height: 100%;
  background: linear-gradient(90deg, #7eb662 0%, #6a9b54 100%);
  border-radius: 4px;
}

.compatibility-text {
  font-size: 14px;
  font-weight: 500;
  color: #7eb662;
}

.user-intro {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.user-intro text {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
}

.climb-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4b5563;
}

.interests {
  margin-bottom: 24px;
}

.interests-title {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
  display: block;
}

.interests-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.interest-tag {
  padding: 6px 12px;
  background-color: #d4e7c5;
  color: #5a8a3f;
  border-radius: 16px;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.action-btn.secondary {
  border: 1px solid #d1d5db;
  color: #374151;
}

.action-btn.primary {
  background: linear-gradient(135deg, #7eb662 0%, #6a9b54 100%);
  color: white;
}

.tip-card {
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 12px;
  padding: 12px;
}

.tip-card text {
  font-size: 13px;
  color: #92400e;
  line-height: 1.5;
}
</style>
