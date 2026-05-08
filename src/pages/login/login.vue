<template>
  <view class="container">
    <view class="top-section">
      <view class="logo-container">
        <view class="logo-icon">
          <text class="logo-text">⛰️</text>
        </view>
        <text class="app-name">ClimbLink</text>
        <text class="app-slogan">Find partners, climb together</text>
      </view>
    </view>

    <view class="form-card">
      <view class="form-content">
        <view class="form-header">
          <text class="form-title">Welcome Back</text>
          <text class="form-subtitle">Sign in to continue your climbing journey</text>
        </view>

        <view class="form-inputs">
          <view class="input-group">
            <text class="input-label">Email</text>
            <view class="input-wrapper">
              <text class="input-icon">📧</text>
              <input 
                class="input-field"
                type="text"
                v-model="email"
                placeholder="Enter your email"
              />
            </view>
          </view>

          <view class="input-group">
            <text class="input-label">Password</text>
            <view class="input-wrapper">
              <text class="input-icon">🔒</text>
              <input 
                class="input-field password-input"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Enter your password"
              />
              <view class="password-toggle" @click="showPassword = !showPassword">
                <text>{{ showPassword ? '👁️‍🗨️' : '👁️' }}</text>
              </view>
            </view>
          </view>

          <view class="forgot-password">
            <text class="forgot-text">Forgot Password?</text>
          </view>

          <view class="submit-btn" @click="handleLogin" :class="{ disabled: isLoading }">
            <text class="submit-text">{{ isLoading ? '登录中...' : 'Sign In' }}</text>
          </view>
        </view>

        <view class="divider">
          <view class="divider-line"></view>
          <text class="divider-text">Or continue with</text>
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
          <text class="link-text">Don't have an account? </text>
          <text class="link-action" @click="navigateToRegister">Sign Up</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import cloud from '@/utils/cloud.js'

const showPassword = ref(false)
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  if (!email.value) {
    uni.showToast({
      title: '请输入邮箱',
      icon: 'none'
    })
    return
  }
  
  if (!password.value) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none'
    })
    return
  }
  
  isLoading.value = true
  uni.showLoading({ title: '登录中...' })
  
  try {
    const result = await cloud.user.login(email.value, password.value)
    
    if (result.success) {
      uni.hideLoading()
      uni.showToast({
        title: '登录成功',
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
        title: result.message || '登录失败',
        icon: 'none'
      })
    }
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: '登录失败，请重试',
      icon: 'none'
    })
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const navigateToRegister = () => {
  uni.navigateTo({
    url: '/pages/register/register'
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
  flex: 1;
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
  background: white;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  padding: 32px 24px 40px;
  box-shadow: 0 -25px 50px -12px rgba(0, 0, 0, 0.25);
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

.forgot-password {
  display: flex;
  justify-content: flex-end;
}

.forgot-text {
  font-size: 14px;
  font-weight: 500;
  color: #7eb662;
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
