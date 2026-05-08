<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <view class="header-top">
        <view>
          <text class="title">ClimbLink</text>
          <text class="subtitle">Find partners, find gyms, climb together 🧗</text>
        </view>
        <view class="avatar" @click="navigateTo('/pages/profile/profile')">
          <image v-if="userAvatar" :src="userAvatar" class="avatar-img" mode="aspectFill" />
          <text v-else class="avatar-text">{{ userInitial }}</text>
        </view>
      </view>
    </view>

    <!-- 盲盒搭子超显眼入口 -->
    <view class="blind-box-section">
      <view class="blind-box-card" @click="navigateTo('/pages/blindbox/blindbox')">
        <view class="blind-box-content">
          <view class="blind-box-header">
            <text class="blind-box-title">✨ Mystery Match</text>
            <text class="hot-badge">🔥 HOT</text>
          </view>
          <text class="blind-box-desc">Random Matching · Endless Surprises</text>
          <text class="blind-box-sub">Make every climb an adventure ✨</text>
        </view>
        <view class="blind-box-icon">
          <text class="gift-icon">🎁</text>
        </view>
      </view>
    </view>

    <!-- 热门活动 - 横向拖拽式 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">📅 Popular Events</text>
        <text class="see-all" @click="navigateTo('/pages/event-list/event-list')">View All →</text>
      </view>

      <scroll-view scroll-x class="events-scroll" show-scrollbar="false">
        <view class="events-list">
          <view v-for="activity in activities" :key="activity.id" class="event-card" @click="navigateTo('/pages/activity-detail/activity-detail')">
            <image :src="activity.image" class="event-image" mode="aspectFill" />
            <view class="event-overlay"></view>
            
            <!-- 价格标签 -->
            <view class="price-tag">{{ activity.price }}</view>
            
            <!-- 标签 -->
            <view class="activity-badge">{{ activity.tag }}</view>

            <!-- 底部信息 -->
            <view class="event-info">
              <text class="event-name">{{ activity.title }}</text>
              <view class="event-details">
                <text class="detail-item">📍 {{ activity.venue }}</text>
                <text class="detail-item">⏰ {{ activity.time }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 二级导航栏 -->
    <view class="nav-section">
      <view class="nav-card">
        <view class="nav-grid">
          <view v-for="tab in tabs" :key="tab.id" class="nav-item" @click="handleTabClick(tab)">
            <view :class="['nav-btn', activeTab === tab.id ? 'active' : '']">
              <text class="nav-icon">{{ tab.icon }}</text>
              <text class="nav-text">{{ tab.id }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Market板块内容 -->
    <view v-if="activeTab === 'Market'" class="section">
      <view class="market-card" @click="navigateTo('/pages/market/market')">
        <view class="market-header">
          <view class="market-icon-box">
            <text class="market-icon">🗺️</text>
          </view>
          <view class="market-text">
            <text class="market-title">Gear Marketplace</text>
            <text class="market-desc">Buy and sell climbing gear with the community. Find great deals on quality equipment!</text>
          </view>
        </view>

        <view class="market-steps">
          <view class="step-item">
            <view class="step-num">1</view>
            <text>Browse second-hand climbing gear</text>
          </view>
          <view class="step-item">
            <view class="step-num">2</view>
            <text>Filter by category, price, and condition</text>
          </view>
          <view class="step-item">
            <view class="step-num">3</view>
            <text>List your own gear for sale 💰</text>
          </view>
        </view>

        <view class="market-btn">Browse Marketplace</view>
      </view>
    </view>

    <!-- Smart Partner板块内容 -->
    <view v-if="activeTab === 'Smart Partner'" class="section">
      <view class="partner-card" @click="navigateTo('/pages/smart-partner/smart-partner')">
        <view class="partner-header">
          <view class="partner-icon-box">
            <text class="partner-icon">👥</text>
          </view>
          <view class="partner-text">
            <text class="partner-title">Smart Partner Matching</text>
            <text class="partner-desc">AI-powered matching to find perfect climbing partners based on your level and preferences!</text>
          </view>
        </view>

        <view class="partner-steps">
          <view class="step-item">
            <view class="step-num">1</view>
            <text>Browse all available climb requests</text>
          </view>
          <view class="step-item">
            <view class="step-num">2</view>
            <text>Filter by level, tags, or use AI smart matching</text>
          </view>
          <view class="step-item">
            <view class="step-num">3</view>
            <text>Request to join and start climbing together ✨</text>
          </view>
        </view>

        <view class="partner-btn">Find Smart Partners</view>
      </view>
    </view>

    <!-- 热门场馆 -->
    <view class="section venues-section">
      <view class="section-header" style="margin-bottom: 0.75rem;">
        <text class="section-title">Popular Gyms</text>
        <text class="see-all" @click="navigateTo('/pages/venues/venues')">View All →</text>
      </view>
      
      <view class="venues-list">
        <view v-for="venue in venues" :key="venue.id" class="venue-card" @click="navigateToVenueDetail(venue)">
          <view class="venue-image-wrapper">
            <image :src="venue.image" class="venue-image" mode="aspectFill" />
            <view class="crowd-badge">{{ getCrowdText(venue.crowd) }}</view>
          </view>
          
          <view class="venue-content">
            <view class="venue-header">
              <text class="venue-name">{{ venue.name }}</text>
              <view class="venue-rating">
                <text>⭐</text>
                <text class="rating-num">{{ venue.rating }}</text>
                <text class="rating-count">({{ venue.reviews }})</text>
              </view>
            </view>
            
            <view class="venue-meta">
              <text class="meta-item">📍 {{ venue.distance }}</text>
              <text class="meta-item price">{{ venue.price }}</text>
              <text class="meta-item level">{{ venue.difficulty }}</text>
            </view>
            
            <view class="venue-tags">
              <view v-for="tag in venue.tags" :key="tag" class="venue-tag">{{ tag }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 自定义底部导航栏 -->
    <custom-tab-bar currentPath="pages/index/index" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow as uniOnShow } from '@dcloudio/uni-app'
import CustomTabBar from '../../components/custom-tab-bar/custom-tab-bar.vue'
import cloud from '../../utils/cloud.js'

const activeTab = ref('Beginner')
const isLoading = ref(false)
const userAvatar = ref('')
const userInitial = ref('C')

const tabs = [
  { id: 'Beginner', icon: '📖' },
  { id: 'Advanced', icon: '📈' },
  { id: 'Market', icon: '🗺️' },
  { id: 'Smart Partner', icon: '👥' },
]

const activities = [
  {
    id: 1,
    title: 'Weekend Beginner Session',
    venue: 'Rock Time Gym',
    time: 'Sat 2:00 PM',
    participants: 8,
    maxParticipants: 12,
    level: 'V0-V2',
    tag: 'Beginner Friendly',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 'Free',
  },
  {
    id: 2,
    title: 'Intermediate Training',
    venue: 'Climber\'s Paradise',
    time: 'Sun 10:00 AM',
    participants: 5,
    maxParticipants: 8,
    level: 'V3-V5',
    tag: 'Coach Guided',
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: '$15',
  },
  {
    id: 3,
    title: 'Spring Climbing Competition',
    venue: 'Peak Climbing Center',
    time: 'Mar 30, 9:00 AM',
    participants: 12,
    maxParticipants: 20,
    level: 'V4-V7',
    tag: 'Competition',
    image: 'https://images.unsplash.com/photo-1731176116069-86205f376088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: '$20',
  },
]

// 使用云数据
const venues = ref([])

// 将云场馆数据转换为首页需要的格式
const transformVenueData = (venue, index) => {
  // 从场馆价格信息
  let priceDisplay = '¥18/visit'
  if (venue.prices && venue.prices.length > 0) {
    priceDisplay = venue.prices[0].price
  }
  
  // 模拟距离
  const distances = ['1.2km', '2.5km', '3.8km']
  const crowds = ['Moderate', 'Relaxed', 'Busy']
  
  return {
    _id: venue._id || venue.id,
    id: venue._id || venue.id,
    name: venue.name,
    image: venue.images && venue.images.length > 0 ? venue.images[0] : '',
    distance: distances[index] || '2.0km',
    rating: venue.rating || 4.5,
    reviews: venue.review_count || 100,
    price: priceDisplay,
    tags: venue.tags && venue.tags.slice(0, 2) || [],
    difficulty: venue.climbing_level || 'V0-V8',
    crowd: crowds[index] || 'Moderate',
  }
}

const getCrowdText = (crowd) => {
  if (crowd === 'Moderate') return '🟢 Moderate'
  if (crowd === 'Relaxed') return '🟢 Relaxed'
  if (crowd === 'Busy') return '🔴 Busy'
  return crowd
}

const loadUserInfo = () => {
  const userId = uni.getStorageSync('userId')
  const userInfo = uni.getStorageSync('userInfo')
  if (userInfo) {
    userAvatar.value = userInfo.avatar || ''
    if (userInfo.name) {
      userInitial.value = userInfo.name.charAt(0).toUpperCase()
    }
  } else {
    userAvatar.value = ''
    userInitial.value = 'C'
  }
}

const handleTabClick = (tab) => {
  activeTab.value = tab.id
  if (tab.id === 'Beginner') {
    navigateTo('/pages/beginner-guide/beginner-guide')
  }
}

const navigateTo = (url) => {
  uni.navigateTo({
    url,
    fail: (err) => {
      console.error('Navigation failed:', err)
    }
  })
}

// 点击场馆跳转到详情页
const navigateToVenueDetail = (venue) => {
  const venueId = venue._id || venue.id
  console.log('点击场馆，ID:', venueId)
  uni.navigateTo({
    url: `/pages/venue-detail/venue-detail?id=${venueId}`,
    fail: (err) => {
      console.error('导航失败:', err)
    }
  })
}

// 加载场馆数据
const loadVenues = async () => {
  try {
    isLoading.value = true
    // 首页只显示 3 个热门场馆，避免全表扫描
    const data = await cloud.venue.getVenues({}, 3)
    console.log('加载到的场馆数据:', data)
    venues.value = data.map((venue, index) => transformVenueData(venue, index))
  } catch (error) {
    console.error('加载场馆失败:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadVenues()
  loadUserInfo()
})

uniOnShow(() => {
  loadUserInfo()
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f9f5;
  padding-bottom: 80px;
}

/* 头部样式 */
.header {
  background: linear-gradient(to bottom right, #7eb662, #6a9b54);
  padding: 0 0.5rem;
  padding-top: 1.5rem;
  padding-bottom: 1rem;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0 0.75rem;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  display: block;
}

.subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  display: block;
  margin-top: 0.25rem;
}

.avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.avatar-text {
  color: #fff;
  font-size: 1.125rem;
  font-weight: bold;
}

/* 盲盒区域 */
.blind-box-section {
  padding: 0 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.blind-box-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(to bottom right, #fbbf24, #f97316, #ef4444);
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.blind-box-content {
  flex: 1;
}

.blind-box-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.blind-box-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #fff;
}

.hot-badge {
  background-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  border-radius: 0.375rem;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: bold;
}

.blind-box-desc {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  display: block;
  margin-bottom: 0.25rem;
}

.blind-box-sub {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  display: block;
}

.blind-box-icon {
  position: relative;
}

.gift-icon {
  font-size: 2.5rem;
}

/* 通用区域样式 */
.section {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  margin-bottom: 0.75rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: bold;
  color: #111827;
}

.see-all {
  font-size: 0.875rem;
  color: #7eb662;
  font-weight: 500;
}

/* 活动区域 */
.events-scroll {
  padding-left: 1rem;
}

.events-list {
  display: flex;
  gap: 0.75rem;
  padding-bottom: 0.5rem;
}

.event-card {
  width: 18rem;
  height: 11rem;
  flex-shrink: 0;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: relative;
}

.event-image {
  width: 100%;
  height: 100%;
}

.event-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2), transparent);
}

.price-tag {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: rgba(126, 182, 98, 0.9);
  color: #fff;
  padding: 0.375rem 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: bold;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.activity-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background-color: rgba(255, 255, 255, 0.95);
  color: #111827;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.event-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
}

.event-name {
  font-weight: bold;
  color: #fff;
  font-size: 1.125rem;
  display: block;
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.event-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 导航区域 */
.nav-section {
  padding: 0 1rem;
  margin-top: 1.5rem;
}

.nav-card {
  background-color: #fff;
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
}

.nav-item {
  width: 100%;
}

.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0;
  border-radius: 0.75rem;
  transition: all 0.3s;
}

.nav-btn.active {
  background-color: #d4e7c5;
  color: #5a8a3f;
}

.nav-icon {
  font-size: 1.25rem;
}

.nav-text {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Market卡片 */
.market-card {
  margin: 0 1rem;
  margin-top: 1rem;
  background: linear-gradient(to bottom right, #3b82f6, #6366f1, #8b5cf6);
  border-radius: 1rem;
  padding: 1.5rem;
  color: #fff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.market-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.market-icon-box {
  width: 4rem;
  height: 4rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.market-icon {
  font-size: 2rem;
}

.market-text {
  flex: 1;
}

.market-title {
  font-size: 1.25rem;
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

.market-desc {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.625;
  display: block;
}

.market-steps {
  margin-bottom: 1rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.step-num {
  width: 1.5rem;
  height: 1.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

.market-btn {
  width: 100%;
  background-color: #fff;
  color: #63666a;
  font-weight: bold;
  text-align: center;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

/* Smart Partner卡片 */
.partner-card {
  margin: 0 1rem;
  margin-top: 1rem;
  background: linear-gradient(to bottom right, #8b5cf6, #63666a);
  border-radius: 1rem;
  padding: 1.5rem;
  color: #fff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.partner-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.partner-icon-box {
  width: 4rem;
  height: 4rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.partner-icon {
  font-size: 2rem;
}

.partner-text {
  flex: 1;
}

.partner-title {
  font-size: 1.25rem;
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

.partner-desc {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.625;
  display: block;
}

.partner-steps {
  margin-bottom: 1rem;
}

.partner-btn {
  width: 100%;
  background-color: #fff;
  color: #8b5cf6;
  font-weight: bold;
  text-align: center;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

/* 场馆区域 */
.venues-section {
  padding: 0 1rem;
  padding-bottom: 5rem;
  margin-top: 1.5rem;
}

.venues-list {
  margin-top: 0;
}

.venue-card + .venue-card {
  margin-top: 1rem;
}

.venue-card {
  background-color: #fff;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.venue-image-wrapper {
  position: relative;
  height: 12rem;
}

.venue-image {
  width: 100%;
  height: 100%;
}

.crowd-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.venue-content {
  padding: 1rem;
}

.venue-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.venue-name {
  font-weight: bold;
  color: #111827;
  font-size: 1.125rem;
}

.venue-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.rating-num {
  font-size: 0.875rem;
  font-weight: 500;
}

.rating-count {
  font-size: 0.75rem;
  color: #6b7280;
}

.venue-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.75rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.meta-item.price {
  color: #7eb662;
  font-weight: 500;
}

.meta-item.level {
  background-color: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.venue-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.venue-tag {
  background-color: #d4e7c5;
  color: #5a8a3f;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}
</style>
