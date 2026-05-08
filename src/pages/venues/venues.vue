<template>
  <view class="container">
    <view class="header">
      <view class="header-top">
        <view class="header-content">
          <text class="title">Discover Gyms</text>
          <text class="subtitle">Find the perfect climbing gym for you</text>
        </view>

        <view class="mode-btn" @tap="toggleMapMode">
          <text>{{ mapMode ? '📋' : '🗺️' }}</text>
        </view>
      </view>

      <view class="search-box">
        <text class="search-icon">🔍</text>
        <input 
          type="text" 
          placeholder="Search gym name or address..." 
          class="search-input"
          v-model="searchText"
          @input="filterVenues"
        />
        <view class="filter-btn">
          <text>⚙️</text>
        </view>
      </view>

      <scroll-view scroll-x class="filter-scroll">
        <view class="filters">
          <view 
            v-for="filter in filters" 
            :key="filter.id"
            :class="['filter-chip', { active: selectedFilter === filter.id }]"
            @click="selectedFilter = filter.id; filterVenues()"
          >
            {{ filter.name }}
          </view>
        </view>
      </scroll-view>
    </view>

    <view v-if="mapMode" class="map-container" :class="{ fullscreen: mapFullscreen }">
      <view class="map-handle" @tap="toggleFullscreen">
        <view class="handle-bar"></view>
      </view>

      <map 
        class="map-component"
        :latitude="centerLat"
        :longitude="centerLng"
        :scale="14"
        :markers="mapMarkers"
        @markertap="onMarkerTap"
        show-location
      ></map>

      <view class="map-controls">
        <view class="control-btn" @tap="toggleFullscreen">
          <text>{{ mapFullscreen ? '⬇️' : '⬆️' }}</text>
        </view>
        <view class="control-btn" @tap="resetLocation">
          <text>📍</text>
        </view>
      </view>

      <view v-if="selectedVenue" class="selected-venue-card" @tap="navigateToVenue(selectedVenue)">
        <image :src="selectedVenue.images && selectedVenue.images.length > 0 ? selectedVenue.images[0] : ''" class="selected-venue-image" mode="aspectFill"></image>
        <view class="selected-venue-info">
          <text class="selected-venue-name">{{ selectedVenue.name }}</text>
          <text class="selected-venue-distance">{{ selectedVenue.address }}</text>
          <view class="selected-venue-rating">
            <text>⭐</text>
            <text>{{ selectedVenue.rating }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="nearby-section">
      <view class="nearby-header">
        <text>🧭</text>
        <text class="nearby-title">Nearby Gyms</text>
      </view>
      <view class="nearby-grid">
        <view 
          v-for="(venue, index) in nearbyVenues" 
          :key="index"
          class="nearby-card"
          @tap="navigateToVenue(venue)"
        >
          <text class="nearby-name">{{ venue.name }}</text>
          <text class="nearby-address">{{ venue.address }}</text>
        </view>
      </view>
    </view>

    <view class="venues-list">
      <view class="list-header">
        <text class="list-title">All Gyms</text>
        <text class="list-count">{{ filteredVenues.length }} gyms</text>
      </view>
      
      <view v-if="isLoading" class="loading-container">
        <text class="loading-text">加载中...</text>
      </view>
      
      <view v-else class="venues-cards">
        <view 
          v-for="venue in filteredVenues" 
          :key="venue.id"
          class="venue-card"
          @click="navigateToVenue(venue)"
        >
          <view class="venue-image-container">
            <image :src="venue.images && venue.images.length > 0 ? venue.images[0] : ''" class="venue-image" mode="aspectFill"></image>
            
            <view class="status-badge open">
              Open
            </view>

            <view class="crowd-badge">
              🟢 Moderate
            </view>

            <view class="venue-overlay">
              <view class="venue-overlay-left">
                <text class="venue-name">{{ venue.name }}</text>
                <view class="venue-location">
                  <text>📍</text>
                  <text>{{ venue.address }}</text>
                </view>
              </view>
            </view>
          </view>

          <view class="venue-details">
            <view class="venue-meta">
              <view class="venue-rating">
                <text>⭐</text>
                <text class="rating-value">{{ venue.rating }}</text>
                <text class="rating-count">{{ venue.city }}</text>
              </view>
              <view class="divider"></view>
              <text class="venue-difficulty">{{ venue.climbing_level }}</text>
            </view>
            <view class="nav-btn">
              <text>🧭</text>
              <text>Navigate</text>
            </view>
          </view>

          <view class="venue-tags">
            <view class="tag">
              Beginner Friendly
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="stats-section">
      <view class="stats-header">
        <text>📈</text>
        <text class="stats-title">This Week's Stats</text>
      </view>
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ venues.length }}</text>
          <text class="stat-label">Total Gyms</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ venues.filter(v => v.city).length }}</text>
          <text class="stat-label">Open Now</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">4.8</text>
          <text class="stat-label">Avg Rating</text>
        </view>
      </view>
    </view>

    <custom-tab-bar currentPath="pages/venues/venues"></custom-tab-bar>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CustomTabBar from '../../components/custom-tab-bar/custom-tab-bar.vue'
import cloud from '@/utils/cloud.js'

const selectedFilter = ref('All')
const mapMode = ref(false)
const mapFullscreen = ref(false)
const selectedVenue = ref(null)
const searchText = ref('')
const isLoading = ref(false)

const centerLat = ref(31.3089)
const centerLng = ref(120.7294)

const filters = [
  { id: 'All', name: 'All' },
  { id: 'Beginner', name: 'Beginner Friendly' },
  { id: 'Advanced', name: 'Advanced' },
  { id: 'Nearest', name: 'Nearest' },
  { id: 'Top Rated', name: 'Top Rated' }
]

const venues = ref([])
const filteredVenues = ref([])

const mapMarkers = computed(() => {
  return filteredVenues.value.map((venue, index) => ({
    id: index,
    latitude: venue.latitude || 31.3089,
    longitude: venue.longitude || 120.7294,
    iconPath: '/static/marker.png',
    width: 30,
    height: 40,
    callout: {
      content: venue.name,
      color: '#333',
      fontSize: 12,
      borderRadius: 10,
      bgColor: '#fff',
      padding: 5,
      display: 'BYCLICK'
    }
  }))
})

const nearbyVenues = computed(() => {
  return filteredVenues.value.slice(0, 3)
})

const loadVenues = async () => {
  isLoading.value = true
  try {
    const data = await cloud.venue.getVenues()
    venues.value = data || []
    filteredVenues.value = data || []
  } catch (error) {
    console.error('加载场馆数据失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    isLoading.value = false
  }
}

const filterVenues = () => {
  let result = [...venues.value]
  
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase()
    result = result.filter(v => 
      v.name.toLowerCase().includes(searchLower) || 
      (v.address && v.address.toLowerCase().includes(searchLower))
    )
  }
  
  filteredVenues.value = result
}

const toggleMapMode = () => {
  mapMode.value = !mapMode.value
  if (mapMode.value) {
    selectedVenue.value = null
  }
}

const toggleFullscreen = () => {
  mapFullscreen.value = !mapFullscreen.value
}

const onMarkerTap = (e) => {
  const markerId = e.detail.markerId
  if (filteredVenues.value[markerId]) {
    selectedVenue.value = filteredVenues.value[markerId]
  }
}

const resetLocation = () => {
  centerLat.value = 31.3089
  centerLng.value = 120.7294
  selectedVenue.value = null
}

const navigateToVenue = (venue) => {
  // 使用 _id 作为主要 ID
  const venueId = venue._id || venue.id
  console.log('导航到场馆详情，ID:', venueId, '场馆数据:', venue)
  
  uni.navigateTo({
    url: '/pages/venue-detail/venue-detail?id=' + venueId,
    fail: (err) => {
      console.error('Navigation failed:', err);
      uni.showToast({
        title: '页面即将上线',
        icon: 'none'
      });
    }
  })
}

onMounted(() => {
  loadVenues()
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f0f7ec, #f5f9f5);
  padding-bottom: 80px;
}

.header {
  background: linear-gradient(to bottom right, #7eb662, #6a9b54);
  padding: 16px;
  padding-top: 32px;
  padding-bottom: 16px;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.header-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.header-content {
  flex: 1;
  margin-bottom: 12px;
}

.mode-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.2s;
  flex-shrink: 0;
}

.map-container {
  position: relative;
  height: 300px;
  background: #fff;
  transition: height 0.3s ease;
  overflow: hidden;
}

.map-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  z-index: 100;
}

.map-handle {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  z-index: 10;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.handle-bar {
  width: 40px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
}

.map-component {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  right: 12px;
  top: 42px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}

.control-btn {
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 18px;
}

.selected-venue-card {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  background: #fff;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.selected-venue-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
}

.selected-venue-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.selected-venue-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.selected-venue-distance {
  font-size: 12px;
  color: #666;
}

.selected-venue-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #333;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  display: block;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  display: block;
}

.search-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 16px;
  padding: 12px 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-icon {
  font-size: 18px;
  margin-right: 12px;
}

.search-input {
  flex: 1;
  font-size: 14px;
  border: none;
  outline: none;
  background: transparent;
}

.filter-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
}

.filter-scroll {
  white-space: nowrap;
}

.filters {
  display: inline-flex;
  gap: 8px;
}

.filter-chip {
  padding: 8px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  white-space: nowrap;
  font-size: 14px;
  color: #ffffff;
  transition: all 0.2s;
}

.filter-chip.active {
  background: #ffffff;
  color: #7eb662;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nearby-section {
  margin: -24px 16px 24px;
}

.nearby-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  background: #ffffff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nearby-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.nearby-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: #ffffff;
  padding: 12px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nearby-card {
  background: linear-gradient(to bottom right, #f0f7ec, #e8f5e0);
  border-radius: 12px;
  padding: 12px 8px;
  text-align: center;
}

.nearby-name {
  font-size: 10px;
  color: #333;
  display: block;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nearby-address {
  font-size: 9px;
  color: #666;
  display: block;
}

.venues-list {
  padding: 0 16px 24px;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.list-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.list-count {
  font-size: 12px;
  color: #999;
}

.loading-container {
  text-align: center;
  padding: 40px 0;
}

.loading-text {
  color: #666;
  font-size: 14px;
}

.venues-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.venue-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.venue-card:active {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.venue-image-container {
  position: relative;
  height: 160px;
}

.venue-image {
  width: 100%;
  height: 100%;
}

.status-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.4);
  color: #ffffff;
}

.status-badge.open {
  background: rgba(34, 197, 94, 0.9);
}

.crowd-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}

.venue-overlay {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.venue-overlay-left {
  flex: 1;
}

.venue-name {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  display: block;
  margin-bottom: 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.venue-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.venue-details {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.venue-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.venue-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.rating-count {
  font-size: 12px;
  color: #999;
}

.divider {
  width: 1px;
  height: 12px;
  background: #e5e5e5;
}

.venue-difficulty {
  font-size: 12px;
  color: #999;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 12px;
  color: #7eb662;
  font-weight: 500;
  margin-right: -8px;
}

.venue-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 16px 16px;
}

.tag {
  background: #f0f7ec;
  color: #5a8a3f;
  padding: 4px 12px;
  border-radius: 10px;
  font-size: 11px;
}

.stats-section {
  padding: 0 16px 24px;
}

.stats-header {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(to bottom right, #ffffff, #f0f7ec);
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #e8f5e0;
}

.stats-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  background: linear-gradient(to bottom right, #ffffff, #f0f7ec);
  padding: 0 16px 16px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border: 1px solid #e8f5e0;
  border-top: none;
}

.stat-item {
  text-align: center;
  padding: 12px 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #7eb662;
  display: block;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 11px;
  color: #999;
}
</style>