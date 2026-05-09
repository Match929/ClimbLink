<template>
  <view class="container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <!-- 顶部绿色区域 -->
      <view class="card-top">
        <!-- 设置按钮 - 只在登录时显示 -->
        <view v-if="isLoggedIn" class="settings-btn">
          <text>⚙️</text>
        </view>

        <view class="user-info">
          <view class="avatar-container">
            <image :src="user.avatar" class="avatar"></image>
            <view v-if="isLoggedIn" class="level-badge">{{ user.level }}</view>
            <!-- 登录按钮 - 只在未登录时显示 -->
            <view v-if="!isLoggedIn" class="login-badge" @click="goToLogin">
              <text>Login</text>
            </view>
          </view>
          <view class="user-details">
            <text class="user-name">{{ user.name }}</text>
            <text class="user-bio">{{ user.bio }}</text>
            <text v-if="isLoggedIn" class="user-experience">Climbing Experience: {{ user.experience }}</text>
            <!-- 用户标签 - 只在登录时显示 -->
            <view v-if="isLoggedIn && user.labels && user.labels.length > 0" class="user-labels">
              <view v-for="(label, index) in user.labels" :key="index" class="user-label">
                <text>{{ label }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部白色区域 -->
      <view class="card-bottom">
        <!-- 数据统计 - 只在登录时显示 -->
        <view v-if="isLoggedIn" class="stats-grid">
          <view class="stat-item">
            <text class="stat-value">{{ user.stats.venues }}</text>
            <text class="stat-label">Checked-in Gyms</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ user.stats.partners }}</text>
            <text class="stat-label">My Partners</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ user.stats.activities }}</text>
            <text class="stat-label">Joined Activities</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ user.stats.posts }}</text>
            <text class="stat-label">Posted Updates</text>
          </view>
        </view>

        <!-- 编辑资料按钮 - 只在登录时显示 -->
        <view v-if="isLoggedIn" class="edit-btn" @click="navigateToPage('/pages/edit-profile/edit-profile')">
          <text>Edit Profile</text>
        </view>
      </view>
    </view>

    <!-- 成就徽章 - 只在登录时显示 -->
    <view v-if="isLoggedIn" class="section">
      <view class="section-header">
        <text class="section-title">Achievement Badges</text>
        <text class="section-subtitle">Earned {{ badges.length }} badges</text>
      </view>
      <view class="badges-grid">
        <view v-for="badge in badges" :key="badge.id" class="badge-item">
          <view class="badge-icon">{{ badge.icon }}</view>
          <text class="badge-name">{{ badge.name }}</text>
        </view>
      </view>
    </view>

    <!-- 攀岩记录 - 只在登录时显示 -->
    <view v-if="isLoggedIn" class="climb-records-card" @click="navigateToPage('/pages/climb-records/climb-records')">
      <view class="records-content">
        <view class="records-left">
          <view class="records-icon">📈</view>
          <view class="records-info">
            <text class="records-title">Climbing Records</text>
            <text class="records-subtitle">Track your progress & achievements</text>
          </view>
        </view>
        <view class="records-right">
          <text class="records-count">{{ user.stats.activities }}</text>
          <text class="records-label">Total Sessions</text>
        </view>
      </view>
      <view class="records-stats">
        <view class="records-stat">
          <text class="records-stat-value">12</text>
          <text class="records-stat-label">Venues</text>
        </view>
        <view class="records-stat">
          <text class="records-stat-value">127h</text>
          <text class="records-stat-label">Climbing</text>
        </view>
        <view class="records-stat">
          <text class="records-stat-value">7d</text>
          <text class="records-stat-label">Streak</text>
        </view>
      </view>
    </view>

    <!-- 最近活动 - 只在登录时显示 -->
    <view v-if="isLoggedIn" class="section">
      <text class="section-title">Recent Activities</text>
      <view class="activities-list">
        <view v-for="activity in recentActivities" :key="activity.id" class="activity-item">
          <view class="activity-icon">
            <text v-if="activity.type === 'climb'">🧗</text>
            <text v-else-if="activity.type === 'match'">👥</text>
            <text v-else>📍</text>
          </view>
          <view class="activity-content">
            <text class="activity-title">{{ activity.title }}</text>
            <text class="activity-meta">{{ activity.venue }} · {{ activity.date }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能菜单 - 只在登录时显示 -->
    <view v-if="isLoggedIn" class="menu-sections">
      <view v-for="section in menuItems" :key="section.section" class="menu-section">
        <text class="menu-section-title">{{ section.section }}</text>
        <view class="menu-items">
          <view v-for="item in section.items" :key="item.label" class="menu-item" @click="handleMenuItemClick(item)">
            <view class="menu-item-left">
              <text class="menu-item-icon">{{ item.icon }}</text>
              <text class="menu-item-label">{{ item.label }}</text>
            </view>
            <view class="menu-item-right">
              <view v-if="item.badge !== undefined && item.badge > 0" class="menu-item-badge">{{ item.badge }}</view>
              <text>›</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view v-if="isLoggedIn" class="logout-container">
      <view class="logout-button" @click="handleLogout">
        <text class="logout-icon">🚪</text>
        <text class="logout-text">Logout</text>
      </view>
    </view>

    <!-- 自定义底部导航栏 -->
    <custom-tab-bar currentPath="pages/profile/profile" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow as uniOnShow } from '@dcloudio/uni-app'
import CustomTabBar from '../../components/custom-tab-bar/custom-tab-bar.vue'
import cloud from '@/utils/cloud.js'

const isLoggedIn = ref(false)
const user = ref({
  name: "Climbing Enthusiast",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=myprofile",
  level: "V1",
  experience: "0 years",
  bio: "Love climbing, enjoy challenges 🧗‍♂️",
  labels: [],
  stats: {
    venues: 0,
    partners: 0,
    activities: 0,
    posts: 0,
  },
})

const badges = ref([
  { id: 1, name: "Gym Explorer", icon: "🏆", description: "Checked in 10 gyms" },
  { id: 2, name: "Social Butterfly", icon: "👥", description: "Added 20 partners" },
  { id: 3, name: "Advanced Climber", icon: "📈", description: "Completed V5 routes" },
  { id: 4, name: "Active Member", icon: "⭐", description: "Joined 30 events" },
])

const recentActivities = ref([
  {
    id: 1,
    type: "climb",
    title: "Completed V4 Red Route",
    venue: "Rock Time Gym",
    date: "2026-03-22",
  },
  {
    id: 2,
    type: "match",
    title: "Climbed with Lee",
    venue: "Climber's Paradise",
    date: "2026-03-20",
  },
  {
    id: 3,
    type: "checkin",
    title: "Checked in Peak Climbing Center",
    venue: "Peak Climbing Center",
    date: "2026-03-18",
  },
])

const menuItems = ref([
  {
    section: "My Activities",
    items: [
      { icon: "📅", label: "My Climb Dates", badge: 3 },
      { icon: "❤️", label: "Favorite Gyms", badge: 0 },
      { icon: "👥", label: "My Partners", badge: 0 },
      { icon: "🏆", label: "Achievement Badges", badge: 4 },
    ],
  },
  {
    section: "Data Statistics",
    items: [
      { icon: "🎯", label: "Training Goals" },
      { icon: "⭐", label: "Skill Assessment" },
    ],
  },
  {
    section: "Settings",
    items: [
      { icon: "⚙️", label: "Account Settings" },
    ],
  },
])

// Load user data
const loadUserData = async () => {
  try {
    const userId = localStorage.getItem('userId');
    console.log('loadUserData - userId:', userId);
    
    if (!userId) {
      console.log('User not logged in');
      isLoggedIn.value = false;
      // Reset to default data
      user.value = {
        name: "Please Login",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guest",
        level: "V0",
        experience: "0 years",
        bio: "Log in to start your climbing journey!",
        labels: [],
        stats: {
          venues: 0,
          partners: 0,
          activities: 0,
          posts: 0,
        },
      };
      return;
    }

    isLoggedIn.value = true;

    // Get user basic info
    const userData = await cloud.user.getCurrentUser();
    console.log('loadUserData - userData:', userData);
    
    if (userData) {
      user.value.name = userData.name || 'Climbing Enthusiast';
      user.value.level = userData.climbing_level || 'V1';
      user.value.bio = userData.bio || 'Love climbing, enjoy challenges 🧗‍♂️';
      user.value.avatar = await cloud.getAvatarUrl(userData.avatar, userId);
      user.value.labels = userData.labels || [];
      
      // Calculate years of experience (based on account creation time)
      if (userData.created_at) {
        const createdDate = new Date(userData.created_at);
        const now = new Date();
        const diffYears = (now - createdDate) / (1000 * 60 * 60 * 24 * 365);
        user.value.experience = diffYears.toFixed(1) + ' years';
      }
    } else {
      console.log('Failed to get user data');
    }

    // Get user statistics
    const stats = await cloud.user.getUserStats(userId);
    if (stats) {
      user.value.stats = {
        venues: stats.venues || 0,
        partners: stats.partners || 0,
        activities: stats.activities || 0,
        posts: stats.posts || 0,
      };
    }
  } catch (err) {
    console.error('Failed to load user data:', err);
  }
};

// Navigate to login page
const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login'
  });
};

function navigateToPage(path) {
  try {
    uni.navigateTo({
      url: path
    })
  } catch (error) {
    console.error('Navigation error:', error)
    uni.showToast({
      title: 'Page coming soon',
      icon: 'none'
    })
  }
}

function handleMenuItemClick(item) {
  if (item.path) {
    navigateToPage(item.path)
  } else {
    uni.showToast({
      title: 'Feature coming soon',
      icon: 'none'
    })
  }
}

const handleLogout = () => {
  uni.showModal({
    title: 'Confirm Logout',
    content: 'Are you sure you want to logout?',
    confirmText: 'Logout',
    cancelText: 'Cancel',
    confirmColor: '#ef4444',
    success: (res) => {
      if (res.confirm) {
        // 清除登录状态
        localStorage.removeItem('userId');
        localStorage.removeItem('userInfo');
        // 刷新页面
        loadUserData();
        uni.showToast({
          title: 'Logged out successfully',
          icon: 'success'
        });
      }
    }
  });
};

onMounted(() => {
  loadUserData();
});

uniOnShow(() => {
  loadUserData();
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f9f5;
  padding-bottom: 80px;
}

.user-card {
  margin: 0 16px;
  margin-top: 24px;
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-top {
  background: linear-gradient(135deg, #7eb662 0%, #6a9b54 100%);
  padding: 24px;
  padding-bottom: 32px;
  position: relative;
}

.settings-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  color: white;
  font-size: 20px;
}

.user-info {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.level-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background-color: white;
  color: #7eb662;
  font-size: 10px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.login-badge {
  position: absolute;
  bottom: -8px;
  right: -8px;
  background-color: #7eb662;
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.user-details {
  flex: 1;
}

.user-name {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 4px;
}

.user-bio {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 8px;
}

.user-experience {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 8px;
}

.user-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.user-label {
  padding: 4px 12px;
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  font-size: 11px;
  color: white;
}

.card-bottom {
  background-color: white;
  padding: 24px;
  padding-top: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #111827;
}

.stat-label {
  display: block;
  font-size: 10px;
  color: #6b7280;
  margin-top: 4px;
}

.edit-btn {
  width: 100%;
  height: 3rem;
  padding: 12px;
  border: 1px solid #7eb662;
  border-radius: 12px;
  text-align: center;
  color: #7eb662;
  font-size: 14px;
  font-weight: 500;
  box-sizing: border-box;
}

.section {
  margin: 0 16px;
  margin-top: 16px;
  background-color: white;
  border-radius: 16px;
  padding: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #111827;
}

.section-subtitle {
  font-size: 12px;
  color: #6b7280;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.badge-item {
  text-align: center;
}

.badge-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #d4e7c5 0%, #e8f5e0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 8px;
}

.badge-name {
  font-size: 11px;
  color: #374151;
  font-weight: 500;
}

.climb-records-card {
  margin: 0 16px;
  margin-top: 16px;
  background: linear-gradient(135deg, #7eb662 0%, #6a9b54 50%, #5a8a3f 100%);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(126, 182, 98, 0.25);
}

.records-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.records-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.records-icon {
  width: 56px;
  height: 56px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.records-info {
  flex: 1;
}

.records-title {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin-bottom: 4px;
}

.records-subtitle {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.records-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.records-count {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.records-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
}

.records-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.records-stat {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 8px;
  text-align: center;
}

.records-stat-value {
  display: block;
  font-size: 14px;
  font-weight: bold;
  color: white;
}

.records-stat-label {
  display: block;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 12px;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background-color: #d4e7c5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.activity-meta {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.menu-sections {
  margin: 0 16px;
  margin-top: 16px;
}

.menu-section {
  background-color: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.menu-section-title {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 12px;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 12px;
}

.menu-item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-item-icon {
  font-size: 20px;
}

.menu-item-label {
  font-size: 15px;
  color: #111827;
}

.menu-item-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-item-badge {
  background-color: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 8px;
}

.menu-item-right text {
  font-size: 20px;
  color: #9ca3af;
}

.logout-container {
  margin: 0 16px;
  margin-top: 16px;
  margin-bottom: 100px;
}

.logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 1px solid #fecaca;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
}

.logout-icon {
  font-size: 20px;
}

.logout-text {
  font-size: 15px;
  font-weight: 600;
  color: #dc2626;
}
</style>
