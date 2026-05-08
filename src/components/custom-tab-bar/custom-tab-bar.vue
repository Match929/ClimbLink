<template>
  <view class="tab-bar">
    <!-- 背景遮罩 -->
    <view v-if="showPublishModal" class="overlay" @click="closePublishModal" />

    <!-- 扇形菜单 -->
    <view class="fan-menu" :class="{ visible: showPublishModal }">
      <view 
        v-for="(option, index) in publishOptions" 
        :key="option.id"
        class="fan-button"
        :class="{ visible: showPublishModal }"
        :style="getFanButtonStyle(option, index)"
        @click="selectOption(option)"
      >
        <view class="fan-button-inner" :style="{ background: option.gradient }">
          <text class="fan-icon">{{ option.icon }}</text>
        </view>
        <view class="fan-label">
          <text>{{ option.title }}</text>
        </view>
      </view>

      <!-- 关闭按钮 -->
      <view 
        class="close-button"
        :class="{ visible: showPublishModal }"
        @click="closePublishModal"
      >
        <view class="close-icon">
          <view class="close-line" />
          <view class="close-line" />
        </view>
      </view>
    </view>

    <!-- 导航栏 -->
    <view class="nav-container">
      <view class="nav-content">
        <!-- 前两个导航项 -->
        <view 
          v-for="item in navItems.slice(0, 2)" 
          :key="item.path"
          class="nav-item"
          :class="{ active: currentPath === item.path }"
          @click="switchTab(item.path)"
        >
          <text class="nav-icon" :class="{ active: currentPath === item.path }">{{ item.icon }}</text>
          <text class="nav-label" :class="{ active: currentPath === item.path }">{{ item.label }}</text>
        </view>

        <!-- 中间发布按钮 -->
        <view class="publish-button-container">
          <view class="publish-button" @click="togglePublishModal">
            <view class="publish-glow" />
            <view class="publish-inner">
              <text class="publish-plus">+</text>
            </view>
          </view>
        </view>

        <!-- 后两个导航项 -->
        <view 
          v-for="item in navItems.slice(2)" 
          :key="item.path"
          class="nav-item"
          :class="{ active: currentPath === item.path }"
          @click="switchTab(item.path)"
        >
          <text class="nav-icon" :class="{ active: currentPath === item.path }">{{ item.icon }}</text>
          <text class="nav-label" :class="{ active: currentPath === item.path }">{{ item.label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  currentPath: {
    type: String,
    default: ''
  }
});

const showPublishModal = ref(false);

const navItems = [
  { path: 'pages/index/index', label: 'Home', icon: '🏠' },
  { path: 'pages/community/community', label: 'Community', icon: '👥' },
  { path: 'pages/venues/venues', label: 'Venues', icon: '📍' },
  { path: 'pages/profile/profile', label: 'Profile', icon: '👤' }
];

const publishOptions = [
  {
    id: 'post',
    title: 'Post',
    icon: '💬',
    path: '/pages/post-create/post-create',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    angle: -45
  },
  {
    id: 'match',
    title: 'Partner',
    icon: '🧗',
    path: '/pages/climb-request/climb-request',
    gradient: 'linear-gradient(135deg, #7eb662, #6a9b54)',
    angle: 0
  },
  {
    id: 'event',
    title: 'Event',
    icon: '📅',
    path: '/pages/event-create/event-create',
    gradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
    angle: 45
  }
];

const togglePublishModal = () => {
  // 检查是否登录
  const userId = uni.getStorageSync('userId');
  if (!userId) {
    uni.showModal({
      title: 'Login Required',
      content: 'Please login first to publish',
      confirmText: 'Login',
      cancelText: 'Cancel',
      confirmColor: '#7eb662',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/login/login'
          });
        }
      }
    });
    return;
  }
  showPublishModal.value = !showPublishModal.value;
};

const closePublishModal = () => {
  showPublishModal.value = false;
};

const selectOption = (option) => {
  // 检查是否登录
  const userId = uni.getStorageSync('userId');
  if (!userId) {
    uni.showModal({
      title: 'Login Required',
      content: 'Please login first to publish',
      confirmText: 'Login',
      cancelText: 'Cancel',
      confirmColor: '#7eb662',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/login/login'
          });
        }
      }
    });
    return;
  }
  closePublishModal();
  uni.navigateTo({
    url: option.path
  });
};

const switchTab = (path) => {
  uni.reLaunch({
    url: '/' + path
  });
};

const getFanButtonStyle = (option, index) => {
  const radius = 140;
  const angleInRadians = (option.angle * Math.PI) / 180;
  const x = Math.sin(angleInRadians) * radius;
  const y = -Math.cos(angleInRadians) * radius;
  
  return {
    transitionDelay: `${index * 0.05}s`
  };
};
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 998;
  backdrop-filter: blur(4px);
}

.fan-menu {
  position: absolute;
  left: 50%;
  bottom: 80px;
  transform: translateX(-50%);
  width: 300px;
  height: 200px;
  pointer-events: none;
  z-index: 999;
}

.fan-button {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 0) scale(0);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: auto;
}

.fan-button.visible {
  transform: translate(-50%, 0) scale(1);
}

.fan-button:nth-child(1).visible {
  transform: translate(calc(-50% - 120px), -140px) scale(1);
}

.fan-button:nth-child(2).visible {
  transform: translate(-50%, -140px) scale(1);
}

.fan-button:nth-child(3).visible {
  transform: translate(calc(-50% + 120px), -140px) scale(1);
}

.fan-button-inner {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.fan-icon {
  font-size: 28px;
}

.fan-label {
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.95);
  padding: 4px 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.fan-label text {
  font-size: 12px;
  font-weight: bold;
  color: #111;
}

.close-button {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%) scale(0);
  width: 56px;
  height: 56px;
  background: rgba(31, 41, 55, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  pointer-events: auto;
}

.close-button.visible {
  transform: translateX(-50%) scale(1);
}

.close-icon {
  position: relative;
  width: 20px;
  height: 20px;
}

.close-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 2px;
  background: white;
  border-radius: 1px;
}

.close-line:nth-child(1) {
  transform: translate(-50%, -50%) rotate(45deg);
}

.close-line:nth-child(2) {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.nav-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(229, 231, 235, 0.8);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.03);
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-content {
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 64px;
  position: relative;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  gap: 2px;
  transition: all 0.2s ease;
}

.nav-icon {
  font-size: 20px;
  opacity: 0.6;
}

.nav-icon.active {
  opacity: 1;
}

.nav-label {
  font-size: 10px;
  color: #9ca3af;
}

.nav-label.active {
  color: #7eb662;
  font-weight: 500;
}

.publish-button-container {
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
  top: -12px;
  left: 0px
}

.publish-button {
  position: absolute;
  top: -24px;
  z-index: 10;
}

.publish-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #7eb662, #6a9b54);
  border-radius: 16px;
  transform: rotate(45deg);
  filter: blur(12px);
  opacity: 0.3;
}

.publish-inner {
  position: relative;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #7eb662, #6a9b54);
  border-radius: 16px;
  transform: rotate(45deg);
  box-shadow: 0 4px 16px rgba(126, 182, 98, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.publish-plus {
  color: white;
  font-size: 28px;
  font-weight: bold;
  transform: rotate(-45deg);

  position: relative;
  top: -2px;
  left: -2px;
}
</style>
