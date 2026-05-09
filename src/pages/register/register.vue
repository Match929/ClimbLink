<template>
  <view class="container">
    <view class="top-section">
      <view class="logo-container">
        <view class="logo-icon">
          <text class="logo-text">⛰️</text>
        </view>
        <text class="app-name">Join ClimbLink</text>
        <text class="app-slogan">Start your climbing adventure today</text>
      </view>
    </view>

    <scroll-view scroll-y class="form-card">
      <view class="form-content">
        <view class="form-header">
          <text class="form-title">Create Account</text>
          <text class="form-subtitle">Fill in the information below</text>
        </view>

        <view class="form-inputs">
          <view class="input-group">
            <text class="input-label">Full Name</text>
            <view class="input-wrapper">
              <text class="input-icon">👤</text>
              <input 
                class="input-field"
                type="text"
                v-model="formData.name"
                placeholder="Enter your name"
              />
            </view>
          </view>

          <view class="input-group">
            <text class="input-label">Email</text>
            <view class="input-wrapper">
              <text class="input-icon">📧</text>
              <input 
                class="input-field"
                type="text"
                v-model="formData.email"
                placeholder="Enter your email"
              />
            </view>
          </view>

          <view class="input-group">
            <text class="input-label">Climbing Level</text>
            <view class="level-grid">
              <view 
                v-for="level in levels"
                :key="level.value"
                class="level-item"
                :class="{ active: formData.level === level.value }"
                @click="formData.level = level.value"
              >
                <text class="level-text">{{ level.value }}</text>
              </view>
            </view>
          </view>

          <view class="input-group">
            <text class="input-label">Password</text>
            <view class="input-wrapper">
              <text class="input-icon">🔒</text>
              <input 
                class="input-field password-input"
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.password"
                placeholder="Create a password"
              />
              <view class="password-toggle" @click="showPassword = !showPassword">
                <text>{{ showPassword ? '👁️‍🗨️' : '👁️' }}</text>
              </view>
            </view>
          </view>

          <view class="input-group">
            <text class="input-label">Confirm Password</text>
            <view class="input-wrapper">
              <text class="input-icon">🔒</text>
              <input 
                class="input-field"
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.confirmPassword"
                placeholder="Confirm your password"
              />
            </view>
          </view>

          <view class="terms-group">
            <checkbox 
              class="terms-checkbox"
              :checked="formData.agreeTerms"
              @click="formData.agreeTerms = !formData.agreeTerms"
            />
            <text class="terms-text">
              I agree to the Terms of Service and Privacy Policy
            </text>
          </view>

          <view class="submit-btn" @click="handleRegister" :class="{ disabled: isLoading }">
            <text class="submit-text">{{ isLoading ? 'Creating account...' : 'Create Account' }}</text>
          </view>
        </view>

        <view class="divider">
          <view class="divider-line"></view>
          <text class="divider-text">Or sign up with</text>
          <view class="divider-line"></view>
        </view>

        <view class="social-login">
          <view class="social-btn">
            <text class="social-icon">📱</text>
          </view>
          <view class="social-btn">
            <text class="social-icon">💬</text>
          </view>
          <view class="social-btn">
            <text class="social-icon">🍎</text>
          </view>
        </view>

        <view class="signup-link">
          <text class="link-text">Already have an account? </text>
          <text class="link-action" @click="navigateToLogin">Sign In</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import cloud from '@/utils/cloud.js'

const showPassword = ref(false)
const isLoading = ref(false)
const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  level: '',
  agreeTerms: false
})

const levels = [
  { value: 'V0', label: 'V0' },
  { value: 'V1-V2', label: 'V1-V2' },
  { value: 'V3-V4', label: 'V3-V4' },
  { value: 'V5-V6', label: 'V5-V6' },
  { value: 'V7-V8', label: 'V7-V8' },
  { value: 'V9+', label: 'V9+' }
]

const handleRegister = async () => {
  if (!formData.value.name) {
    uni.showToast({
      title: 'Please enter name',
      icon: 'none'
    })
    return
  }
  
  if (!formData.value.email) {
    uni.showToast({
      title: 'Please enter email',
      icon: 'none'
    })
    return
  }
  
  if (!formData.value.level) {
    uni.showToast({
      title: 'Please select climbing level',
      icon: 'none'
    })
    return
  }
  
  if (!formData.value.password) {
    uni.showToast({
      title: 'Please enter password',
      icon: 'none'
    })
    return
  }
  
  if (formData.value.password !== formData.value.confirmPassword) {
    uni.showToast({
      title: 'Passwords do not match',
      icon: 'none'
    })
    return
  }
  
  if (!formData.value.agreeTerms) {
    uni.showToast({
      title: 'Please agree to terms',
      icon: 'none'
    })
    return
  }
  
  isLoading.value = true
  uni.showLoading({ title: 'Creating account...' })
  
  try {
    const result = await cloud.user.register(formData.value)
    
    if (result.success) {
      uni.hideLoading()
      uni.showToast({
        title: 'Registration successful',
        icon: 'success'
      })
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/index/index'
        })
      }, 1000)
    } else {
      uni.hideLoading()
      uni.showToast({
        title: result.message || 'Registration failed',
        icon: 'none'
      })
    }
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: 'Registration failed, please try again',
      icon: 'none'
    })
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const navigateToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login'
  })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #7eb662 0%, #6a9b54 100%);
  display: flex;
  flex-direction: column;
}

.top-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px 24px;
}

.logo-container {
  text-align: center;
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.logo-text {
  font-size: 44px;
}

.app-name {
  display: block;
  font-size: 30px;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.app-slogan {
  display: block;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-card {
  flex: 1;
  background: white;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  padding: 32px 24px 40px;
  box-shadow: 0 -25px 50px -12px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
}

.form-content {
  max-width: 400px;
  margin: 0 auto;
}

.form-header {
  margin-bottom: 24px;
}

.form-title {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 8px;
}

.form-subtitle {
  display: block;
  font-size: 15px;
  color: #6b7280;
}

.form-inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  font-size: 20px;
  color: #9ca3af;
  z-index: 1;
}

.input-field {
  width: 100%;
  height: 48px;
  padding: 0 44px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  color: #111827;
}

.input-field:focus {
  border-color: #7eb662;
  outline: none;
}

.password-input {
  padding-right: 88px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  font-size: 20px;
  cursor: pointer;
}

.level-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.level-item {
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  text-align: center;
}

.level-item.active {
  border-color: #7eb662;
  background: #d4e7c5;
}

.level-text {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.terms-group {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding-top: 8px;
}

.terms-checkbox {
  margin-top: 2px;
}

.terms-text {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
}

.submit-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(90deg, #7eb662 0%, #6a9b54 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px -5px rgba(126, 182, 98, 0.4);
  margin-top: 24px;
}

.submit-btn.disabled {
  opacity: 0.7;
  pointer-events: none;
}

.submit-text {
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.divider {
  position: relative;
  display: flex;
  align-items: center;
  margin: 24px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.divider-text {
  padding: 0 16px;
  font-size: 14px;
  color: #6b7280;
  background: white;
}

.social-login {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.social-btn {
  height: 48px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-icon {
  font-size: 24px;
}

.signup-link {
  text-align: center;
}

.link-text {
  font-size: 15px;
  color: #4b5563;
}

.link-action {
  font-size: 15px;
  font-weight: 600;
  color: #7eb662;
}
</style>
