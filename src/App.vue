<template>
  <view>
  </view>
</template>

<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
    // 每次应用启动时清除登录状态，方便测试
    try {
      uni.removeStorageSync('userId')
      uni.removeStorageSync('userInfo')
      console.log('已清除登录状态')
    } catch (e) {
      console.error('清除登录状态失败:', e)
    }
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/* 全局样式 */
page {
  background-color: #f5f9f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 通用工具类 */
.text-primary { color: #7eb662; }
.text-secondary { color: #666666; }
.text-muted { color: #999999; }
.bg-primary { background-color: #7eb662; }
.bg-white { background-color: #ffffff; }

/* 阴影工具类 */
.shadow-sm { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
.shadow-md { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.shadow-lg { box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); }

/* 圆角工具类 */
.rounded-sm { border-radius: 4px; }
.rounded-md { border-radius: 8px; }
.rounded-lg { border-radius: 12px; }
.rounded-xl { border-radius: 16px; }
</style>
