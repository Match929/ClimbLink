<template>
  <view class="container">
    <!-- Header -->
    <view class="header">
      <view class="header-top">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="header-texts">
          <text class="header-title">Climb Records</text>
          <text class="header-subtitle">Track your climbing journey</text>
        </view>
      </view>

      <!-- Quick stats -->
      <view class="quick-stats">
        <view class="stat-item">
          <text class="stat-value">{{ stats.totalCheckins }}</text>
          <text class="stat-label">Check-ins</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.totalHours }}</text>
          <text class="stat-label">Hours</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.routesCompleted }}</text>
          <text class="stat-label">Routes</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.currentStreak }}</text>
          <text class="stat-label">Day Streak</text>
        </view>
      </view>
    </view>

    <!-- Tab Navigation -->
    <view class="tabs-container">
      <view class="tabs">
        <view
          v-for="tab in tabs"
          :key="tab.value"
          class="tab"
          :class="{ active: selectedTab === tab.value }"
          @click="selectedTab = tab.value"
        >
          <text :class="{ 'tab-text': true, 'tab-text-active': selectedTab === tab.value }">{{ tab.label }}</text>
        </view>
      </view>
    </view>

    <!-- Content based on selected tab -->
    <scroll-view scroll-y class="content-container">
      <!-- Check-ins Tab -->
      <view v-if="selectedTab === 'checkins'" class="tab-content">
        <view v-for="checkin in checkins" :key="checkin.id" class="checkin-card">
          <view class="checkin-content">
            <image :src="checkin.image" class="checkin-image" mode="aspectFill" />
            <view class="checkin-details">
              <text class="checkin-venue">{{ checkin.venue }}</text>
              <view class="checkin-meta">
                <text class="meta-icon">📅</text>
                <text class="meta-text">{{ checkin.date }}</text>
              </view>
              <view class="checkin-meta">
                <text class="meta-icon">⏱️</text>
                <text class="meta-text">{{ checkin.time }} · {{ checkin.duration }}</text>
              </view>
            </view>
            <text class="chevron">›</text>
          </view>
        </view>
      </view>

      <!-- Routes Tab -->
      <view v-if="selectedTab === 'routes'" class="tab-content">
        <view v-for="route in routes" :key="route.id" class="route-card">
          <view class="route-header">
            <view class="route-left">
              <view class="grade-badge" :class="getColorClass(route.color)">
                <text class="grade-text">{{ route.grade }}</text>
              </view>
              <view class="route-info">
                <text class="route-name">{{ route.name }}</text>
                <view class="route-venue">
                  <text class="venue-icon">📍</text>
                  <text class="venue-text">{{ route.venue }}</text>
                </view>
              </view>
            </view>
            <text v-if="route.completed" class="check-icon">✓</text>
          </view>
          <view class="route-footer">
            <view class="footer-left">
              <view class="footer-item">
                <text class="footer-label">Attempts:</text>
                <text class="footer-value">{{ route.attempts }}</text>
              </view>
              <view class="footer-item">
                <text class="footer-label">Date:</text>
                <text class="footer-value">{{ route.date }}</text>
              </view>
            </view>
            <view class="footer-badge" :class="route.completed ? 'completed' : 'in-progress'">
              <text class="badge-text">{{ route.completed ? 'Completed' : 'In Progress' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Statistics Tab -->
      <view v-if="selectedTab === 'stats'" class="tab-content">
        <!-- Progress Chart -->
        <view class="stats-card">
          <view class="stats-card-header">
            <text class="stats-icon">📈</text>
            <text class="stats-title">Monthly Progress</text>
          </view>
          <view class="chart-container">
            <view class="bar-chart">
              <view v-for="(month, index) in stats.monthlyProgress" :key="index" class="bar-wrapper">
                <view class="bar-value">{{ month.routes }}</view>
                <view class="bar" :style="{ height: getBarHeight(month.routes) + '%' }"></view>
                <text class="bar-label">{{ month.month }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- Grade Distribution -->
        <view class="stats-card">
          <view class="stats-card-header">
            <text class="stats-icon">🎯</text>
            <text class="stats-title">Grade Distribution</text>
          </view>
          <view class="grade-list">
            <view v-for="(item, index) in stats.gradeDistribution" :key="index" class="grade-item">
              <view class="grade-row">
                <text class="grade-name">{{ item.grade }}</text>
                <text class="grade-count">{{ item.count }}</text>
              </view>
              <view class="grade-bar-bg">
                <view class="grade-bar" :style="{ width: getGradeWidth(item.count) + '%' }"></view>
              </view>
            </view>
          </view>
        </view>

        <!-- Additional Stats -->
        <view class="stats-grid">
          <view class="small-stats-card">
            <view class="small-stats-header">
              <text class="small-stats-icon">🏆</text>
              <text class="small-stats-label">Longest Streak</text>
            </view>
            <text class="small-stats-value">{{ stats.longestStreak }} days</text>
          </view>
          <view class="small-stats-card">
            <view class="small-stats-header">
              <text class="small-stats-icon">📈</text>
              <text class="small-stats-label">Average Grade</text>
            </view>
            <text class="small-stats-value">{{ stats.averageGrade }}</text>
          </view>
        </view>

        <view class="stats-card">
          <view class="stats-card-header">
            <text class="stats-icon">📍</text>
            <text class="stats-label">Favorite Venue</text>
          </view>
          <text class="favorite-venue">{{ stats.favoriteVenue }}</text>
        </view>
      </view>

      <view class="bottom-padding"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const selectedTab = ref('checkins')

const tabs = [
  { value: 'checkins', label: 'Check-ins' },
  { value: 'routes', label: 'Routes' },
  { value: 'stats', label: 'Statistics' }
]

// Mock data
const checkins = [
  {
    id: 1,
    venue: 'Rock Time Gym',
    date: '2026-04-18',
    time: '14:30',
    duration: '2h 30m',
    image: 'https://images.unsplash.com/photo-1721885876144-25863108be60?w=400',
  },
  {
    id: 2,
    venue: "Climber's Paradise",
    date: '2026-04-15',
    time: '10:00',
    duration: '3h 15m',
    image: 'https://images.unsplash.com/photo-1659666287295-7da26c3f80d4?w=400',
  },
  {
    id: 3,
    venue: 'Peak Climbing Center',
    date: '2026-04-12',
    time: '18:00',
    duration: '2h 00m',
    image: 'https://images.unsplash.com/photo-1731176116069-86205f376088?w=400',
  },
];

const routes = [
  {
    id: 1,
    name: 'Red Dragon',
    grade: 'V4',
    color: 'red',
    venue: 'Rock Time Gym',
    date: '2026-04-18',
    attempts: 3,
    completed: true,
  },
  {
    id: 2,
    name: 'Blue Steel',
    grade: 'V5',
    color: 'blue',
    venue: "Climber's Paradise",
    date: '2026-04-15',
    attempts: 5,
    completed: true,
  },
  {
    id: 3,
    name: 'Green Giant',
    grade: 'V6',
    color: 'green',
    venue: 'Peak Climbing Center',
    date: '2026-04-12',
    attempts: 8,
    completed: false,
  },
  {
    id: 4,
    name: 'Yellow Flash',
    grade: 'V3',
    color: 'yellow',
    venue: 'Rock Time Gym',
    date: '2026-04-10',
    attempts: 2,
    completed: true,
  },
];

const stats = {
  totalCheckins: 45,
  totalHours: 127,
  routesCompleted: 89,
  currentStreak: 7,
  longestStreak: 14,
  favoriteVenue: 'Rock Time Gym',
  averageGrade: 'V4.2',
  monthlyProgress: [
    { month: 'Jan', routes: 18 },
    { month: 'Feb', routes: 22 },
    { month: 'Mar', routes: 25 },
    { month: 'Apr', routes: 24 },
  ],
  gradeDistribution: [
    { grade: 'V0-V2', count: 15 },
    { grade: 'V3-V5', count: 48 },
    { grade: 'V6-V8', count: 22 },
    { grade: 'V9+', count: 4 },
  ],
};

const getColorClass = (color) => {
  const colors = {
    red: 'red',
    blue: 'blue',
    green: 'green',
    yellow: 'yellow',
    purple: 'purple',
    orange: 'orange',
    pink: 'pink'
  };
  return colors[color] || 'gray';
};

const getBarHeight = (routes) => {
  const maxRoutes = Math.max(...stats.monthlyProgress.map(m => m.routes));
  return (routes / maxRoutes) * 100;
};

const getGradeWidth = (count) => {
  const maxCount = Math.max(...stats.gradeDistribution.map(g => g.count));
  return (count / maxCount) * 100;
};

const goBack = () => {
  uni.navigateBack();
};
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
  padding-top: calc(24px + env(safe-area-inset-top));
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.header-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.back-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 20px;
  color: white;
}

.header-texts {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-title {
  font-size: 22px;
  font-weight: bold;
  color: white;
}

.header-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

/* Quick stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 12px 8px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
}

/* Tab Navigation */
.tabs-container {
  padding: 16px;
  display: flex;
  justify-content: center;
}

.tabs {
  max-width: 500px;
  width: 100%;
}

.tabs {
  background: white;
  border-radius: 16px;
  padding: 6px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.tab {
  padding: 10px 0;
  border-radius: 12px;
  text-align: center;
  transition: all 0.2s;
}

.tab.active {
  background: #7eb662;
  box-shadow: 0 1px 4px rgba(126, 182, 98, 0.2);
}

.tab-text {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.tab-text-active {
  color: white !important;
  font-weight: 600;
}

/* Content */
.content-container {
  padding: 0 16px;
  padding-bottom: 24px;
  height: calc(100vh - 280px);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
}

/* Check-in cards */
.checkin-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.checkin-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
}

.checkin-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  flex-shrink: 0;
}

.checkin-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.checkin-venue {
  font-size: 16px;
  font-weight: bold;
  color: #111827;
}

.checkin-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
}

.meta-icon {
  font-size: 14px;
}

.meta-text {
  font-size: 14px;
  color: #6b7280;
}

.chevron {
  font-size: 20px;
  color: #9ca3af;
}

/* Route cards */
.route-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  padding: 16px;
  box-sizing: border-box;
}

.route-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.route-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.grade-badge {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.grade-badge.red {
  background: #ef4444;
}

.grade-badge.blue {
  background: #3b82f6;
}

.grade-badge.green {
  background: #22c55e;
}

.grade-badge.yellow {
  background: #eab308;
}

.grade-badge.purple {
  background: #a855f7;
}

.grade-badge.orange {
  background: #f97316;
}

.grade-badge.pink {
  background: #ec4899;
}

.grade-badge.gray {
  background: #6b7280;
}

.grade-text {
  font-size: 14px;
  font-weight: bold;
  color: white;
}

.route-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.route-name {
  font-size: 16px;
  font-weight: bold;
  color: #111827;
}

.route-venue {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.venue-icon {
  font-size: 12px;
}

.venue-text {
  font-size: 12px;
  color: #6b7280;
}

.check-icon {
  font-size: 20px;
  color: #7eb662;
}

.route-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.footer-label {
  font-size: 14px;
  color: #6b7280;
}

.footer-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.footer-badge {
  padding: 4px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.footer-badge.completed {
  background: #dcfce7;
  color: #166534;
}

.footer-badge.in-progress {
  background: #ffedd5;
  color: #9a3412;
}

.badge-text {
  font-size: 12px;
  font-weight: 600;
}

/* Stats cards */
.stats-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  padding: 20px;
}

.stats-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.stats-icon {
  font-size: 20px;
}

.stats-title {
  font-size: 16px;
  font-weight: bold;
  color: #111827;
}

.stats-label {
  font-size: 12px;
  color: #6b7280;
}

/* Chart */
.chart-container {
  position: relative;
  height: 160px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  height: 100%;
  padding-top: 32px;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 100%;
  justify-content: flex-end;
}

.bar-value {
  font-size: 12px;
  font-weight: bold;
  color: #374151;
  background: white;
  padding: 2px 6px;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  margin-bottom: -16px;
}

.bar {
  width: 100%;
  background: rgba(212, 231, 197, 0.6);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  transition: background 0.2s;
}

.bar:hover {
  background: rgba(126, 182, 98, 0.6);
}

.bar-label {
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
}

/* Grade distribution */
.grade-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.grade-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.grade-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.grade-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.grade-count {
  font-size: 14px;
  font-weight: bold;
  color: #111827;
}

.grade-bar-bg {
  width: 100%;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.grade-bar {
  height: 100%;
  background: linear-gradient(90deg, #7eb662, #6a9b54);
  border-radius: 4px;
  transition: width 0.3s;
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.small-stats-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  padding: 16px;
}

.small-stats-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.small-stats-icon {
  font-size: 20px;
}

.small-stats-label {
  font-size: 12px;
  color: #6b7280;
}

.small-stats-value {
  font-size: 24px;
  font-weight: bold;
  color: #111827;
}

.favorite-venue {
  font-size: 18px;
  font-weight: bold;
  color: #111827;
}

.bottom-padding {
  height: 24px;
}
</style>
