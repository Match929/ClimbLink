<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">Edit Profile</text>
      <view class="save-btn" @click="handleSave">
        <text class="save-text">Save</text>
      </view>
    </view>
    
    <view class="content">
      <!-- 头像编辑 -->
      <view class="avatar-section">
        <image class="avatar" :src="profile.avatar" mode="aspectFill" />
        <view class="change-avatar-btn" @click="changeAvatar">
          <text class="change-avatar-text">Change Photo</text>
        </view>
      </view>
      
      <!-- 表单区域 -->
      <view class="form-section">
        <!-- 昵称 -->
        <view class="form-item">
          <text class="form-label">Nickname</text>
          <input class="form-input" v-model="profile.nickname" placeholder="Enter your nickname" />
        </view>
        
        <!-- 攀岩等级 -->
        <view class="form-item">
          <text class="form-label">Climbing Level</text>
          <view class="level-selector">
            <view 
              v-for="(level, index) in levels" 
              :key="index"
              class="level-option"
              :class="{ active: profile.level === level }"
              @click="profile.level = level"
            >
              <text class="level-text">{{ level }}</text>
            </view>
          </view>
        </view>
        
        <!-- 个人性格标签 -->
        <view class="form-item">
          <text class="form-label">Personality Labels</text>
          <text class="form-subtitle">Select up to 5 labels that describe you</text>
          <view class="label-selector">
            <view 
              v-for="(label, index) in labelOptions" 
              :key="index"
              class="label-option"
              :class="{ active: profile.labels.includes(label) }"
              @click="toggleLabel(label)"
            >
              <text class="label-text">{{ label }}</text>
            </view>
          </view>
        </view>
        
        <!-- 个人简介 -->
        <view class="form-item">
          <text class="form-label">Bio</text>
          <textarea 
            class="form-textarea" 
            v-model="profile.bio" 
            placeholder="Tell others about yourself..."
            :maxlength="200"
          />
          <text class="char-count">{{ profile.bio.length }}/200</text>
        </view>
      </view>
    </view>
    
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import cloud from '@/utils/cloud.js'

const profile = ref({
  nickname: '',
  avatar: '',
  level: '',
  labels: [],
  bio: '',
  experience: ''
})

const levels = ['V0', 'V1-V2', 'V3-V4', 'V5-V6', 'V7-V8', 'V9+']
const labelOptions = [
  'Extrovert', 'Introvert', 'Adventurer', 'Planner',
  'Competitive', 'Relaxed', 'Tech-focused', 'Fun-focused',
  'Early Bird', 'Night Owl', 'Team Player', 'Independent'
]
const experiences = ['Less than 6 months', '6-12 months', '1-2 years', '2-5 years', '5+ years']

const loading = ref(false)

const loadUserData = async () => {
  try {
    const userData = await cloud.user.getCurrentUser()
    if (userData) {
      const userId = uni.getStorageSync('userId')
      profile.value = {
        nickname: userData.name || '',
        avatar: cloud.getAvatarUrl(userData.avatar, userId),
        level: userData.climbing_level || 'V0',
        labels: userData.labels || [],
        bio: userData.bio || '',
        experience: ''
      }
    }
  } catch (err) {
    console.error('加载用户数据失败:', err)
  }
}

const goBack = () => {
  uni.navigateBack()
}

const toggleLabel = (label) => {
  const index = profile.value.labels.indexOf(label)
  if (index > -1) {
    profile.value.labels.splice(index, 1)
  } else {
    profile.value.labels.push(label)
  }
}

const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0];
      
      // 先显示临时图片给用户预览
      profile.value.avatar = tempFilePath;
      
      // 立即上传到云存储
      try {
        uni.showLoading({ title: '上传中...' });
        
        const uploadResult = await cloud.storage.uploadAvatar(tempFilePath);
        
        if (uploadResult && uploadResult.success) {
          // 上传成功，更新为 fileID
          profile.value.avatar = uploadResult.fileID;
          console.log('头像上传成功:', uploadResult.fileID);
        } else {
          // 上传失败，保留临时图片并提示
          console.warn('头像上传失败，保留临时图片');
        }
      } catch (err) {
        console.error('头像上传异常:', err);
        // 上传失败不影响预览
      } finally {
        uni.hideLoading();
      }
    }
  })
}

const handleSave = async () => {
  if (!profile.value.nickname) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }

  loading.value = true
  uni.showLoading({ title: 'Saving...' })

  try {
    const userId = uni.getStorageSync('userId')
    const updateData = {
      name: profile.value.nickname,
      avatar: profile.value.avatar,
      climbing_level: profile.value.level,
      labels: profile.value.labels,
      bio: profile.value.bio
    }

    const result = await cloud.user.updateUser(userId, updateData)
    uni.hideLoading()
    loading.value = false

    if (result && result.success) {
      // 更新本地缓存
      const currentUserInfo = uni.getStorageSync('userInfo') || {}
      uni.setStorageSync('userInfo', { ...currentUserInfo, ...updateData })
      
      uni.showToast({ title: 'Saved successfully!', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      uni.showToast({ title: result?.message || '保存失败', icon: 'none' })
    }
  } catch (err) {
    console.error('保存失败:', err)
    uni.hideLoading()
    loading.value = false
    uni.showToast({ title: '保存失败，请重试', icon: 'none' })
  }
}

onMounted(() => {
  loadUserData()
})
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
  overflow: hidden;
}

.back-btn {
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

.header-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.save-btn {
  padding: 12rpx 32rpx;
  background-color: #7eb662;
  border-radius: 30rpx;
}

.save-text {
  font-size: 26rpx;
  color: #ffffff;
  font-weight: 500;
}

.content {
  padding: 40rpx 30rpx;
}

/* 头像区域 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

.avatar {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  margin-bottom: 24rpx;
}

.change-avatar-btn {
  padding: 12rpx 32rpx;
  border: 2rpx solid #7eb662;
  border-radius: 30rpx;
}

.change-avatar-text {
  font-size: 24rpx;
  color: #7eb662;
  font-weight: 500;
}

/* 表单区域 */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.form-label {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.form-subtitle {
  font-size: 24rpx;
  color: #999;
}

.form-input {
  padding: 24rpx 28rpx;
  background-color: #ffffff;
  border: 2rpx solid #eee;
  border-radius: 16rpx;
  font-size: 28rpx;
}

.form-textarea {
  width: 100%;
  padding: 24rpx 28rpx;
  background-color: #ffffff;
  border: 2rpx solid #eee;
  border-radius: 16rpx;
  font-size: 28rpx;
  min-height: 200rpx;
  box-sizing: border-box;
}

.char-count {
  font-size: 22rpx;
  color: #999;
  text-align: right;
}

/* 等级和标签选择器 */
.level-selector,
.label-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.level-option,
.label-option {
  padding: 16rpx 28rpx;
  background-color: #ffffff;
  border: 2rpx solid #eee;
  border-radius: 30rpx;
}

.level-option.active,
.label-option.active {
  background-color: #d4e7c5;
  border-color: #7eb662;
}

.level-text,
.label-text {
  font-size: 24rpx;
  color: #333;
}

.level-option.active .level-text,
.label-option.active .label-text {
  color: #5a8a3f;
  font-weight: 500;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
