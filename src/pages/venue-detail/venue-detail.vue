<template>
  <view class="container">
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <text class="loading-text">加载中...</text>
    </view>
    
    <!-- 顶部图片区域 -->
    <view v-else class="image-section">
      <image 
        class="venue-image" 
        :src="venueImageUrl" 
        mode="aspectFill" 
        @error="handleImageError"
      />
      
      <!-- 返回按钮 -->
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      
      <!-- 操作按钮 -->
      <view class="action-btns">
        <view class="action-btn" @click="toggleFavorite">
          <text class="action-icon">{{ isFavorite ? '❤️' : '🤍' }}</text>
        </view>
        <view class="action-btn">
          <text class="action-icon">📤</text>
        </view>
      </view>
      
      <!-- 实时客流 -->
      <view class="crowd-badge">
        <text class="crowd-text">🟢 Moderate</text>
      </view>
    </view>
    
    <!-- 基本信息 -->
    <view v-if="!isLoading" class="info-section">
      <view class="venue-header">
        <view>
          <text class="venue-name">{{ venueInfo.name || 'Rock Time Gym' }}</text>
          <view class="venue-meta">
            <view class="rating">
              <text class="star">⭐</text>
              <text class="rating-value">{{ venueInfo.rating || '4.8' }}</text>
              <text class="rating-count">({{ venueInfo.review_count || '234' }} reviews)</text>
            </view>
            <text class="separator">|</text>
            <text class="distance">{{ venueInfo.climbing_level || 'V0-V8' }}</text>
          </view>
        </view>
      </view>
      
      <!-- 标签 -->
      <view class="tags">
        <view v-for="(tag, index) in (venueInfo.tags && venueInfo.tags.length > 0 ? venueInfo.tags : ['Beginner Friendly', 'Well Equipped', 'Pro Coaches'])" :key="index" class="tag">{{ tag }}</view>
      </view>
      
      <!-- 联系方式 -->
      <view class="contact-info">
        <view class="contact-item">
          <text class="contact-icon">📍</text>
          <text class="contact-text">{{ venueInfo.address || '328 Xinghu Street, Suzhou Industrial Park' }}</text>
          <view class="nav-btn" @tap="openLocation">
            <text class="nav-text">Navigate</text>
          </view>
        </view>
        <view class="contact-item">
          <text class="contact-icon">📞</text>
          <text class="contact-text">{{ venueInfo.phone || '0512-6688-8888' }}</text>
        </view>
        <view class="contact-item">
          <text class="contact-icon">🕐</text>
          <text class="contact-text">{{ venueInfo.business_hours || '10:00 AM - 10:00 PM' }}</text>
        </view>
      </view>
    </view>
    
    <!-- 标签页导航 -->
    <view class="tabs-nav">
      <view 
        v-for="(tab, index) in tabs" 
        :key="index" 
        class="tab-item" 
        :class="{ active: activeTab === index }"
        @click="activeTab = index"
      >
        <text class="tab-text">{{ tab }}</text>
        <view v-if="activeTab === index" class="tab-indicator"></view>
      </view>
    </view>
    
    <!-- 标签页内容 -->
    <view class="tab-content">
      <!-- 价格 -->
      <view v-if="activeTab === 0" class="price-section">
        <view class="price-item" v-for="(price, index) in prices" :key="index">
          <view class="price-info">
            <text class="price-type">{{ price.type }}</text>
            <text class="price-desc">{{ price.description }}</text>
          </view>
          <text class="price-value">{{ price.price }}</text>
        </view>
      </view>
      
      <!-- 设施 -->
      <view v-if="activeTab === 1" class="facility-section">
        <!-- 难度分布 -->
        <view class="section-header">
          <text class="section-title">Route Difficulty Distribution</text>
          <text class="section-subtitle">(Total 56 routes)</text>
        </view>
        <view class="difficulty-list">
          <view v-for="(item, index) in difficultyDistribution" :key="index" class="difficulty-item">
            <view class="difficulty-top">
              <view class="difficulty-badge">{{ item.level }}</view>
              <text class="difficulty-count">{{ item.count }} routes ({{ item.percentage }}%)</text>
            </view>
            <view class="difficulty-bar">
              <view class="difficulty-fill" :style="{ width: item.percentage + '%' }"></view>
            </view>
          </view>
        </view>
        
        <view class="divider"></view>
        
        <!-- 难度范围 -->
        <view class="section-header">
          <text class="section-title">Overall Difficulty Range</text>
        </view>
        <text class="difficulty-range">V0-V8</text>
        
        <view class="divider"></view>
        
        <!-- 区域面积 -->
        <view class="section-header">
          <text class="section-title">Area Size</text>
        </view>
        <view class="area-grid">
          <view class="area-item" v-if="areaInfo.bouldering">
            <text class="area-label">Bouldering Area</text>
            <text class="area-value">{{ areaInfo.bouldering }}</text>
          </view>
          <view class="area-item" v-if="areaInfo.ropes">
            <text class="area-label">Top Rope Area</text>
            <text class="area-value">{{ areaInfo.ropes }}</text>
          </view>
        </view>
        
        <view class="divider"></view>
        
        <!-- 装备租赁 -->
        <view class="section-header">
          <text class="section-title">Equipment Rental</text>
        </view>
        <view class="equipment-tags">
          <view class="equipment-tag" v-for="(tag, index) in equipmentTags" :key="index">{{ tag }}</view>
        </view>
        
        <view class="divider"></view>
        
        <!-- 配套设施 -->
        <view class="section-header">
          <text class="section-title">Amenities</text>
        </view>
        <view class="amenities-list">
          <view class="amenity-item" v-for="(amenity, index) in amenities" :key="index">
            <text class="amenity-check">✓</text>
            <text class="amenity-text">{{ amenity }}</text>
          </view>
        </view>
      </view>
      
      <!-- 活动 -->
      <view v-if="activeTab === 2" class="activity-section">
        <view class="activity-card" v-for="(activity, index) in activities" :key="index">
          <text class="activity-title">{{ activity.title }}</text>
          <view class="activity-info">
            <text class="activity-detail">Time: {{ activity.time }}</text>
            <text class="activity-detail">Cost: {{ activity.price }}</text>
            <text class="activity-spots">{{ activity.spots }}</text>
          </view>
          <view class="activity-join-btn">
            <text class="activity-join-text">Register Now</text>
          </view>
        </view>
      </view>
      
      <!-- 评价 -->
      <view v-if="activeTab === 3" class="review-section">
        <!-- 评分概览 -->
        <view class="review-overview">
          <view class="overview-left">
            <text class="overall-rating">4.8</text>
            <view class="stars">
              <text v-for="i in 5" :key="i" class="star">⭐</text>
            </view>
          </view>
          <view class="overview-right">
            <text class="review-count-text">Based on 234 reviews</text>
            <view class="rating-bars">
              <view class="rating-bar-item">
                <text class="rating-label">Environment</text>
                <view class="rating-bar-bg">
                  <view class="rating-bar-fill" style="width: 90%"></view>
                </view>
              </view>
              <view class="rating-bar-item">
                <text class="rating-label">Facilities</text>
                <view class="rating-bar-bg">
                  <view class="rating-bar-fill" style="width: 88%"></view>
                </view>
              </view>
              <view class="rating-bar-item">
                <text class="rating-label">Service</text>
                <view class="rating-bar-bg">
                  <view class="rating-bar-fill" style="width: 92%"></view>
                </view>
              </view>
              <view class="rating-bar-item">
                <text class="rating-label">Routes</text>
                <view class="rating-bar-bg">
                  <view class="rating-bar-fill" style="width: 85%"></view>
                </view>
              </view>
              <view class="rating-bar-item">
                <text class="rating-label">Value</text>
                <view class="rating-bar-bg">
                  <view class="rating-bar-fill" style="width: 87%"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 评价列表 -->
        <view class="reviews-list">
          <view class="review-item" v-for="(review, index) in reviews" :key="index">
            <view class="review-top">
              <image class="review-avatar" :src="review.avatar" mode="aspectFill" />
              <view class="review-user-info">
                <view class="review-user-top">
                  <text class="review-username">{{ review.user }}</text>
                  <text class="review-date">{{ review.date }}</text>
                </view>
                <view class="review-stars">
                  <text v-for="i in 5" :key="i" class="mini-star">{{ i <= review.rating ? '⭐' : '☆' }}</text>
                </view>
              </view>
            </view>
            <text class="review-content">{{ review.content }}</text>
            <text class="review-helpful">👍 Helpful ({{ review.helpful }})</text>
          </view>
        </view>
        
        <!-- 写评价按钮 -->
        <view class="write-review-btn">
          <text class="write-review-text">Write Review</text>
        </view>
      </view>
    </view>
    
    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bottom-btn secondary" @click="handleCheckIn">
        <text class="bottom-btn-text">Check In</text>
      </view>
      <view class="bottom-btn primary" @click="handleFindPartner">
        <text class="bottom-btn-text">Find Partner</text>
      </view>
    </view>
    
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import cloud from '@/utils/cloud.js'

const isFavorite = ref(false)
const activeTab = ref(0)
const tabs = ['Price', 'Facilities', 'Events', 'Reviews']
const isLoading = ref(true)

// 当前场馆信息
const venueInfo = ref({
  _id: '',
  id: '',
  name: '',
  address: '',
  city: '',
  latitude: 31.3089,
  longitude: 120.7294,
  rating: 0,
  review_count: 0,
  images: [],
  tags: [],
  phone: '',
  business_hours: '',
  climbing_level: '',
  difficulty_distribution: [],
  amenities: [],
  equipment_rental: [],
  area_info: {},
  prices: [],
  events: []
})

// 场馆图片 URL 计算属性
const venueImageUrl = computed(() => {
  console.log('venueInfo.images:', venueInfo.value.images)
  
  if (venueInfo.value.images && venueInfo.value.images.length > 0) {
    const imgUrl = venueInfo.value.images[0]
    console.log('使用场馆图片:', imgUrl)
    return imgUrl
  }
  
  // 默认图片，使用更简洁的 URL
  const defaultImg = 'https://images.unsplash.com/photo-1721885876144-25863108be60?w=1080&h=600&fit=crop'
  console.log('使用默认图片:', defaultImg)
  return defaultImg
})

// 图片加载失败处理
const handleImageError = (e) => {
  console.error('图片加载失败:', e)
}

// 计算属性，从场馆信息中获取数据
const prices = computed(() => {
  return venueInfo.value.prices && venueInfo.value.prices.length > 0 
    ? venueInfo.value.prices
    : [
        { type: 'Day Pass', price: '¥128', description: 'Unlimited daily access' },
        { type: '10-Visit Pass', price: '¥980', description: 'Valid for 3 months' },
        { type: 'Monthly Pass', price: '¥1,280', description: '30 days unlimited' }
      ]
})

const difficultyDistribution = computed(() => {
  return venueInfo.value.difficulty_distribution && venueInfo.value.difficulty_distribution.length > 0
    ? venueInfo.value.difficulty_distribution
    : [
        { level: 'V0-V2', count: 18, percentage: 32 },
        { level: 'V3-V4', count: 15, percentage: 27 },
        { level: 'V5-V6', count: 12, percentage: 21 },
        { level: 'V7-V8', count: 8, percentage: 14 },
        { level: 'V9-V10', count: 3, percentage: 5 }
      ]
})

const amenities = computed(() => {
  return venueInfo.value.amenities && venueInfo.value.amenities.length > 0
    ? venueInfo.value.amenities
    : ['Lockers', 'Showers', 'Rest Area', 'Vending Machines']
})

const equipmentTags = computed(() => {
  return venueInfo.value.equipment_rental && venueInfo.value.equipment_rental.length > 0
    ? venueInfo.value.equipment_rental
    : ['Harness', 'Climbing Shoes', 'Chalk Bag']
})

const activities = computed(() => {
  return venueInfo.value.events && venueInfo.value.events.length > 0
    ? venueInfo.value.events
    : [
        { title: 'Weekend Beginner Class', time: 'Sat 2:00 PM', price: '¥168/person', spots: '5 spots left' },
        { title: 'Advanced Technique Workshop', time: 'Sun 10:00 AM', price: '¥268/person', spots: '3 spots left' }
      ]
})

// 区域信息
const areaInfo = computed(() => {
  return venueInfo.value.area_info || {
    bouldering: '200㎡',
    ropes: '150㎡'
  }
})

const reviews = ref([
  { 
    user: 'NewClimber', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', 
    rating: 5, 
    date: '2026-03-20', 
    content: 'Perfect for beginners! Very patient coaches and excellent facilities. Clean and well-maintained.', 
    helpful: 12 
  },
  { 
    user: 'VeteranClimber', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', 
    rating: 5, 
    date: '2026-03-18', 
    content: 'Routes are updated frequently with great difficulty distribution. Always find the perfect challenge. Highly recommend!', 
    helpful: 8 
  }
])

const goBack = () => {
  uni.navigateBack()
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  uni.showToast({
    title: isFavorite.value ? '已收藏' : '已取消收藏',
    icon: 'success'
  })
}

const openLocation = () => {
  uni.openLocation({
    latitude: venueInfo.value.latitude,
    longitude: venueInfo.value.longitude,
    name: venueInfo.value.name,
    address: venueInfo.value.address,
    scale: 18,
    success: () => {
      console.log('打开地图成功')
    },
    fail: (err) => {
      console.error('打开地图失败', err)
      uni.showToast({
        title: '打开地图失败',
        icon: 'none'
      })
    }
  })
}

// 从云数据库获取场馆详情
const loadVenueDetail = async (venueId) => {
  try {
    isLoading.value = true
    console.log('正在加载场馆详情，场馆ID:', venueId)
    const data = await cloud.venue.getVenueById(venueId)
    console.log('获取到的场馆数据:', data)
    
    if (data) {
      venueInfo.value = {
        ...venueInfo.value,
        ...data
      }
      console.log('更新后的 venueInfo:', venueInfo.value)
    }
  } catch (error) {
    console.error('获取场馆详情失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    isLoading.value = false
  }
}

// 签到功能
const handleCheckIn = () => {
  uni.showToast({
    title: '签到成功！',
    icon: 'success'
  })
}

// 找搭档功能
const handleFindPartner = () => {
  // 跳转到 smart-partner 页面，传递场馆信息
  const venueId = venueInfo.value._id || venueInfo.value.id
  console.log('跳转到找搭档，场馆ID:', venueId)
  uni.navigateTo({
    url: `/pages/smart-partner/smart-partner?venueId=${venueId}`
  })
}

// 页面加载时获取参数
const venueIdFromParam = ref('')

// 页面挂载时加载数据
onMounted(() => {
  // 尝试多种方式获取参数
  const pages = getCurrentPages()
  let venueId = null
  
  if (pages && pages.length > 0) {
    const currentPage = pages[pages.length - 1]
    if (currentPage && currentPage.options) {
      venueId = currentPage.options.id
    }
  }
  
  console.log('获取到的参数:', venueId)
  
  if (venueId) {
    loadVenueDetail(venueId)
  } else {
    // 如果没有获取到参数，尝试加载第一个场馆作为默认
    console.warn('未获取到场馆 ID，将使用默认场馆')
    loadVenueDetail('venue1')
  }
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f9f5;
  padding-bottom: 160rpx;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

/* 图片区域 */
.image-section {
  position: relative;
  width: 100%;
  height: 500rpx;
}

.venue-image {
  width: 100%;
  height: 100%;
}

.back-btn {
  position: absolute;
  top: 40rpx;
  left: 30rpx;
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.back-icon {
  font-size: 36rpx;
  color: #333;
}

.action-btns {
  position: absolute;
  top: 40rpx;
  right: 30rpx;
  display: flex;
  gap: 20rpx;
  z-index: 10;
}

.action-btn {
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon {
  font-size: 36rpx;
}

.crowd-badge {
  position: absolute;
  bottom: 30rpx;
  right: 30rpx;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10rpx 24rpx;
  border-radius: 30rpx;
  z-index: 10;
}

.crowd-text {
  font-size: 24rpx;
  font-weight: 500;
}

/* 信息区域 */
.info-section {
  background-color: #ffffff;
  padding: 40rpx 30rpx;
  margin-top: -30rpx;
  border-radius: 30rpx 30rpx 0 0;
  position: relative;
  z-index: 5;
}

.venue-header {
  margin-bottom: 30rpx;
}

.venue-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

.venue-meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.star {
  font-size: 28rpx;
}

.rating-value {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.rating-count {
  font-size: 24rpx;
  color: #999;
}

.separator {
  color: #ddd;
  font-size: 24rpx;
}

.distance {
  font-size: 24rpx;
  color: #666;
}

/* 标签 */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 30rpx;
}

.tag {
  padding: 10rpx 24rpx;
  background-color: #d4e7c5;
  color: #5a8a3f;
  border-radius: 30rpx;
  font-size: 24rpx;
}

/* 联系方式 */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.contact-icon {
  font-size: 32rpx;
  color: #999;
}

.contact-text {
  flex: 1;
  font-size: 26rpx;
  color: #333;
}

.nav-btn {
  padding: 12rpx 24rpx;
  border: 2rpx solid #7eb662;
  border-radius: 20rpx;
}

.nav-text {
  font-size: 24rpx;
  color: #7eb662;
  font-weight: 500;
}

/* 标签页导航 */
.tabs-nav {
  display: flex;
  background-color: #ffffff;
  border-bottom: 2rpx solid #eee;
  margin-top: 20rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 30rpx 0;
  position: relative;
}

.tab-text {
  font-size: 28rpx;
  color: #666;
}

.tab-item.active .tab-text {
  color: #7eb662;
  font-weight: 500;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 6rpx;
  background-color: #7eb662;
  border-radius: 6rpx;
}

/* 标签页内容 */
.tab-content {
  background-color: #ffffff;
  padding: 30rpx;
}

/* 价格 */
.price-section {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.price-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  background-color: #f8faf8;
  border-radius: 20rpx;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.price-type {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.price-desc {
  font-size: 22rpx;
  color: #999;
}

.price-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #7eb662;
}

/* 设施 */
.facility-section {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  display: block;
}

.section-subtitle {
  font-size: 22rpx;
  color: #999;
  margin-left: 16rpx;
}

.difficulty-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.difficulty-item {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.difficulty-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.difficulty-badge {
  padding: 8rpx 20rpx;
  background-color: #7eb662;
  color: #ffffff;
  border-radius: 30rpx;
  font-size: 22rpx;
  font-weight: 500;
}

.difficulty-count {
  font-size: 24rpx;
  font-weight: 500;
  color: #333;
}

.difficulty-bar {
  width: 100%;
  height: 20rpx;
  background-color: #eee;
  border-radius: 20rpx;
  overflow: hidden;
}

.difficulty-fill {
  height: 100%;
  background: linear-gradient(to right, #7eb662, #6a9b54);
  border-radius: 20rpx;
  transition: width 0.3s;
}

.divider {
  height: 2rpx;
  background-color: #eee;
  margin: 10rpx 0;
}

.difficulty-range {
  font-size: 26rpx;
  color: #666;
}

.area-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.area-item {
  padding: 24rpx;
  background-color: #f8faf8;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.area-label {
  font-size: 24rpx;
  color: #999;
}

.area-value {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
}

.equipment-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.equipment-tag {
  padding: 12rpx 28rpx;
  background-color: #d4e7c5;
  color: #5a8a3f;
  border-radius: 30rpx;
  font-size: 24rpx;
}

.amenities-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.amenity-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.amenity-check {
  font-size: 24rpx;
  color: #7eb662;
}

.amenity-text {
  font-size: 24rpx;
  color: #666;
}

/* 活动 */
.activity-section {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.activity-card {
  padding: 30rpx;
  border: 2rpx solid #eee;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.activity-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.activity-detail {
  font-size: 24rpx;
  color: #666;
}

.activity-spots {
  font-size: 24rpx;
  color: #ff6b35;
}

.activity-join-btn {
  width: 100%;
  padding: 20rpx;
  background-color: #7eb662;
  border-radius: 16rpx;
  text-align: center;
  margin-top: 10rpx;
  box-sizing: border-box;
}

.activity-join-text {
  font-size: 26rpx;
  color: #ffffff;
  font-weight: 500;
  box-sizing: border-box;
}

/* 评价 */
.review-section {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.review-overview {
  padding: 30rpx;
  background-color: #f8faf8;
  border-radius: 20rpx;
  display: flex;
  gap: 30rpx;
}

.overview-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.overall-rating {
  font-size: 50rpx;
  font-weight: bold;
  color: #333;
}

.stars {
  display: flex;
  gap: 4rpx;
}

.overview-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.review-count-text {
  font-size: 24rpx;
  color: #666;
}

.rating-bars {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.rating-bar-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.rating-label {
  font-size: 22rpx;
  color: #999;
  width: 120rpx;
}

.rating-bar-bg {
  flex: 1;
  height: 12rpx;
  background-color: #ddd;
  border-radius: 12rpx;
  overflow: hidden;
}

.rating-bar-fill {
  height: 100%;
  background-color: #7eb662;
  border-radius: 12rpx;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.review-item {
  padding-bottom: 30rpx;
  border-bottom: 2rpx solid #eee;
}

.review-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.review-top {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  margin-bottom: 16rpx;
}

.review-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.review-user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.review-user-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.review-username {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.review-date {
  font-size: 22rpx;
  color: #999;
}

.review-stars {
  display: flex;
  gap: 4rpx;
}

.mini-star {
  font-size: 20rpx;
}

.review-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  display: block;
  margin-bottom: 16rpx;
}

.review-helpful {
  font-size: 22rpx;
  color: #999;
}

.write-review-btn {
  width: 100%;
  padding: 24rpx;
  border: 2rpx solid #7eb662;
  border-radius: 16rpx;
  text-align: center;
  margin-top: 10rpx;
  box-sizing: border-box;
}

.write-review-text {
  font-size: 28rpx;
  color: #7eb662;
  font-weight: 500;
}

/* 底部操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-top: 2rpx solid #eee;
  padding: 24rpx 30rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  display: flex;
  gap: 20rpx;
  z-index: 100;
}

.bottom-btn {
  flex: 1;
  padding: 28rpx;
  border-radius: 16rpx;
  text-align: center;
}

.bottom-btn.secondary {
  border: 2rpx solid #7eb662;
}

.bottom-btn.primary {
  background: linear-gradient(to right, #7eb662, #6a9b54);
}

.bottom-btn-text {
  font-size: 28rpx;
  font-weight: 500;
}

.bottom-btn.secondary .bottom-btn-text {
  color: #7eb662;
}

.bottom-btn.primary .bottom-btn-text {
  color: #ffffff;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
