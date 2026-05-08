<template>
  <view class="container">
    <!-- Header -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text>←</text>
      </view>
      <text class="title">Create Post</text>
      <view class="publish-btn" @click="publish">
        <text>Publish</text>
      </view>
    </view>

    <!-- Form -->
    <view class="form">
      <!-- Title -->
      <view class="input-group">
        <input 
          type="text" 
          placeholder="Title (required)"
          v-model="form.title"
          class="title-input"
        />
      </view>

      <!-- Content -->
      <view class="input-group">
        <textarea 
          placeholder="Share your thoughts..."
          v-model="form.content"
          class="content-textarea"
          :maxlength="500"
        ></textarea>
        <text class="char-count">{{ form.content.length }}/500</text>
      </view>

      <!-- Image Upload -->
      <view class="upload-section">
        <view class="upload-label">
          <text>📷 Add Photos</text>
          <text class="upload-hint">Up to 9 images</text>
        </view>
        <view class="image-grid">
          <view 
            v-for="(img, index) in form.images" 
            :key="index"
            class="image-item"
          >
            <image :src="img" mode="aspectFill" class="preview-img"></image>
            <view class="remove-btn" @click="removeImage(index)">
              <text>×</text>
            </view>
          </view>
          <view 
            v-if="form.images.length < 9"
            class="upload-btn"
            @click="chooseImage"
          >
            <text class="upload-icon">+</text>
            <text class="upload-text">Add</text>
          </view>
        </view>
      </view>

      <!-- Category -->
      <view class="category-section">
        <text class="section-title">Category</text>
        <view class="category-grid">
          <view 
            v-for="cat in categories" 
            :key="cat.id"
            :class="['category-chip', { active: form.category === cat.id }]"
            @click="form.category = cat.id"
          >
            <text>{{ cat.icon }} {{ cat.label }}</text>
          </view>
        </view>
      </view>

      <!-- Tags -->
      <view class="tags-section">
        <text class="section-title">Tags</text>
        <view class="tags-container">
          <view 
            v-for="(tag, index) in form.tags" 
            :key="index"
            class="tag-chip"
          >
            <text>#{{ tag }}</text>
            <text class="tag-remove" @click="removeTag(index)">×</text>
          </view>
          <view v-if="form.tags.length < 5" class="tag-input-container">
            <input 
              type="text" 
              placeholder="Add tag..."
              v-model="newTag"
              confirm-type="done"
              @confirm="addTag"
              class="tag-input"
            />
          </view>
        </view>
      </view>

      <!-- Visibility -->
      <view class="visibility-section">
        <text class="section-title">Visibility</text>
        <view class="visibility-options">
          <view 
            v-for="opt in visibilityOptions" 
            :key="opt.id"
            :class="['visibility-option', { active: form.visibility === opt.id }]"
            @click="form.visibility = opt.id"
          >
            <text class="option-icon">{{ opt.icon }}</text>
            <view class="option-info">
              <text class="option-title">{{ opt.label }}</text>
              <text class="option-desc">{{ opt.desc }}</text>
            </view>
            <view class="option-radio">
              <view :class="['radio-circle', { active: form.visibility === opt.id }]"></view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import cloud from '@/utils/cloud.js'

const form = ref({
  title: '',
  content: '',
  images: [],
  category: 'general',
  tags: [],
  visibility: 'public'
})

const newTag = ref('')

const categories = [
  { id: 'general', label: 'General', icon: '📌' },
  { id: 'skill', label: 'Skill Share', icon: '🎯' },
  { id: 'gear', label: 'Gear Talk', icon: '🧗' },
  { id: 'partner', label: 'Find Partner', icon: '👥' },
  { id: 'event', label: 'Event', icon: '🎉' }
]

const visibilityOptions = [
  { id: 'public', label: 'Public', desc: 'Everyone can see', icon: '🌍' },
  { id: 'friends', label: 'Friends Only', desc: 'Only friends can see', icon: '👥' },
  { id: 'private', label: 'Private', desc: 'Only you can see', icon: '🔒' }
]

const goBack = () => {
  uni.navigateBack()
}

const chooseImage = () => {
  uni.chooseImage({
    count: 9 - form.value.images.length,
    sourceType: ['album', 'camera'],
    success: (res) => {
      form.value.images = [...form.value.images, ...res.tempFilePaths]
    }
  })
}

const removeImage = (index) => {
  form.value.images.splice(index, 1)
}

const addTag = () => {
  if (newTag.value.trim() && !form.value.tags.includes(newTag.value.trim())) {
    form.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (index) => {
  form.value.tags.splice(index, 1)
}

const publish = async () => {
  if (!form.value.title.trim()) {
    uni.showToast({ title: 'Please enter title', icon: 'none' })
    return
  }
  if (!form.value.content.trim()) {
    uni.showToast({ title: 'Please enter content', icon: 'none' })
    return
  }

  uni.showLoading({ title: 'Publishing...' })
  
  try {
    const result = await cloud.post.createPost(form.value)
    
    if (result && result.success) {
      uni.hideLoading()
      uni.showToast({ title: 'Published!', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1000)
    } else {
      uni.hideLoading()
      uni.showToast({ 
        title: result?.message || 'Publish failed', 
        icon: 'none' 
      })
    }
  } catch (err) {
    uni.hideLoading()
    console.error('发布失败:', err)
    uni.showToast({ title: 'Publish failed', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f5f9f5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 10;
  overflow: hidden;
  
  
  .back-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #333;
  }
  
  .title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  
  .publish-btn {
    padding: 8px 20px;
    background: linear-gradient(135deg, #7eb662 0%, #6a9b54 100%);
    border-radius: 20px;
    
    text {
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
    }
  }
}

.form {
  padding: 16px;
  
  .input-group {
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    position: relative;
    
    .title-input {
      font-size: 18px;
      font-weight: 600;
      border: none;
      outline: none;
      width: 100%;
    }
    
    .content-textarea {
      min-height: 120px;
      font-size: 15px;
      line-height: 1.6;
      border: none;
      outline: none;
      width: 100%;
    }
    
    .char-count {
      position: absolute;
      bottom: 12px;
      right: 16px;
      font-size: 12px;
      color: #999;
    }
  }
  
  .upload-section {
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    
    .upload-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      text {
        font-size: 15px;
        font-weight: 600;
        color: #333;
      }
      
      .upload-hint {
        font-size: 12px;
        font-weight: 400;
        color: #999;
      }
    }
    
    .image-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .image-item {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 8px;
        overflow: hidden;
        
        .preview-img {
          width: 100%;
          height: 100%;
        }
        
        .remove-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 24px;
          height: 24px;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          
          text {
            color: #ffffff;
            font-size: 18px;
            line-height: 1;
          }
        }
      }
      
      .upload-btn {
        width: 100px;
        height: 100px;
        border: 2px dashed #ddd;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f9f9f9;
        
        .upload-icon {
          font-size: 28px;
          color: #999;
          line-height: 1;
        }
        
        .upload-text {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
  
  .category-section,
  .tags-section,
  .visibility-section {
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    
    .section-title {
      font-size: 15px;
      font-weight: 600;
      color: #333;
      display: block;
      margin-bottom: 12px;
    }
    
    .category-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .category-chip {
        padding: 8px 16px;
        background: #f5f5f5;
        border-radius: 20px;
        
        &.active {
          background: #7eb662;
          
          text {
            color: #ffffff;
          }
        }
        
        text {
          font-size: 13px;
          color: #666;
        }
      }
    }
    
    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .tag-chip {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        background: #f0f9f0;
        border-radius: 16px;
        
        text {
          font-size: 13px;
          color: #7eb662;
        }
        
        .tag-remove {
          font-size: 16px;
          color: #999;
          line-height: 1;
        }
      }
      
      .tag-input-container {
        min-width: 80px;
        
        .tag-input {
          padding: 6px 0;
          font-size: 13px;
          border: none;
          outline: none;
        }
      }
    }
    
    .visibility-options {
      .visibility-option {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
        }
        
        .option-icon {
          font-size: 24px;
        }
        
        .option-info {
          flex: 1;
          
          .option-title {
            font-size: 15px;
            font-weight: 500;
            color: #333;
            display: block;
          }
          
          .option-desc {
            font-size: 12px;
            color: #999;
            display: block;
          }
        }
        
        .option-radio {
          .radio-circle {
            width: 20px;
            height: 20px;
            border: 2px solid #ddd;
            border-radius: 50%;
            position: relative;
            
            &.active {
              border-color: #7eb662;
              
              &::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 10px;
                height: 10px;
                background: #7eb662;
                border-radius: 50%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
