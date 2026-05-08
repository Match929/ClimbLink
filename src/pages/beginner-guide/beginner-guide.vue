<template>
  <view class="container">
    <!-- Top Navigation -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>

      <view class="header-content">
        <view class="header-icon-box">
          <text class="header-icon">📖</text>
        </view>
        <view class="header-texts">
          <text class="header-title">Beginner's Guide</text>
          <text class="header-subtitle">Start from zero, climb safely</text>
        </view>
      </view>
    </view>

    <!-- Quick Navigation Cards -->
    <view class="quick-nav">
      <view class="nav-grid">
        <view class="nav-item" @tap="scrollToSection('equipment')">
          <view class="nav-icon-box">
            <text class="nav-icon">🎒</text>
          </view>
          <text class="nav-title">Gear Guide</text>
          <text class="nav-subtitle">Essential equipment</text>
        </view>

        <view class="nav-item" @tap="scrollToSection('venues')">
          <view class="nav-icon-box">
            <text class="nav-icon">📍</text>
          </view>
          <text class="nav-title">Friendly Gyms</text>
          <text class="nav-subtitle">Beginner-friendly</text>
        </view>

        <view class="nav-item" @tap="scrollToSection('learning')">
          <view class="nav-icon-box">
            <text class="nav-icon">🎓</text>
          </view>
          <text class="nav-title">Learning Path</text>
          <text class="nav-subtitle">Growth roadmap</text>
        </view>

        <view class="nav-item" @tap="scrollToSection('safety')">
          <view class="nav-icon-box">
            <text class="nav-icon">🛡️</text>
          </view>
          <text class="nav-title">Safety Tips</text>
          <text class="nav-subtitle">Important reminders</text>
        </view>
      </view>
    </view>

    <view class="content-scroll">
      <!-- Equipment Guide -->
      <view id="equipment" class="section-card">
        <view class="section-header">
          <text class="section-icon">🎒</text>
          <text class="section-title">Gear Guide</text>
        </view>

        <view v-for="category in equipmentGuide" :key="category.id" class="category-section">
          <view class="category-header">
            <view class="category-dot"></view>
            <text class="category-title">{{ category.category }}</text>
          </view>

          <view class="items-list">
            <view v-for="item in category.items" :key="item.name" class="gear-item">
              <view class="gear-top">
                <image :src="item.image" class="gear-image" mode="aspectFill" />
                <view class="gear-info">
                  <view class="gear-name-row">
                    <text class="gear-name">{{ item.name }}</text>
                    <view class="priority-badge" :class="item.priority === 'High' ? 'high' : 'medium'">
                      <text>{{ item.priority === 'High' ? 'Essential' : 'Recommended' }}</text>
                    </view>
                  </view>
                  <text class="gear-desc">{{ item.description }}</text>
                  <text class="gear-price">{{ item.price }}</text>
                </view>
              </view>
              <view class="gear-tip">
                <text class="tip-icon">💡</text>
                <text class="tip-text">{{ item.tips }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="rental-tip">
          <text class="rental-icon">✅</text>
          <view class="rental-texts">
            <text class="rental-title">Gear Rental Tips</text>
            <text class="rental-desc">Beginners can rent equipment at gyms initially, then purchase after commitment. Most gyms offer shoe and chalk bag rentals ($3-5/visit).</text>
          </view>
        </view>
      </view>

      <!-- Beginner-Friendly Gyms -->
      <view id="venues" class="section-card">
        <view class="section-header-row">
          <view class="section-header-left">
            <text class="section-icon">📍</text>
            <text class="section-title">Beginner-Friendly Gyms</text>
          </view>
          <view class="venues-badge">
            <text>{{ beginnerVenues.length }} Recommended</text>
          </view>
        </view>

        <view class="venues-list">
          <view v-for="venue in beginnerVenues" :key="venue.id" class="venue-card" @click="goToVenueDetail(venue.id)">
            <view class="venue-image-wrapper">
              <image :src="venue.image" class="venue-image" mode="aspectFill" />
              <view class="beginner-badge">
                <text>⭐ Beginner Friendly</text>
              </view>
            </view>
            <view class="venue-content">
              <view class="venue-top-row">
                <text class="venue-name">{{ venue.name }}</text>
                <view class="venue-rating">
                  <text>⭐</text>
                  <text>{{ venue.rating }}</text>
                </view>
              </view>
              <text class="venue-highlights">{{ venue.highlights }}</text>
              <view class="venue-meta-row">
                <text class="venue-meta">📍 {{ venue.distance }}</text>
                <text class="venue-price">{{ venue.price }}</text>
                <view class="venue-level">{{ venue.difficulty }}</view>
              </view>
              <view class="venue-features">
                <view v-for="feature in venue.features" :key="feature" class="feature-tag">
                  <text>{{ feature }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="view-more-btn" @click="goToVenues">
          <text>View More Gyms →</text>
        </view>
      </view>

      <!-- Learning Path -->
      <view id="learning" class="section-card">
        <view class="section-header">
          <text class="section-icon">🎓</text>
          <text class="section-title">Learning Path</text>
        </view>

        <view class="learning-path">
          <view v-for="(stage, idx) in learningPath" :key="idx" class="path-stage">
            <view v-if="idx < learningPath.length - 1" class="connect-line"></view>
            <view class="stage-content">
              <view class="stage-number-box">
                <text class="stage-number">{{ idx + 1 }}</text>
              </view>
              <view class="stage-details">
                <view class="stage-header">
                  <text class="stage-level">{{ stage.level }}</text>
                  <view class="stage-badge">
                    <text>{{ stage.difficulty }}</text>
                  </view>
                </view>
                <text class="stage-duration">Estimated: {{ stage.duration }}</text>
                <view class="goals-list">
                  <view v-for="(goal, goalIdx) in stage.goals" :key="goalIdx" class="goal-item">
                    <text class="goal-check">✅</text>
                    <text class="goal-text">{{ goal }}</text>
                  </view>
                </view>
                <view class="stage-tip-box">
                  <text class="stage-tip-icon">💡</text>
                  <text class="stage-tip-text">{{ stage.tips }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- Safety Tips -->
      <view id="safety" class="section-card">
        <view class="section-header">
          <text class="section-icon">🛡️</text>
          <text class="section-title">Safety Tips</text>
        </view>

        <view class="safety-list">
          <view v-for="(tip, idx) in safetyTips" :key="idx" class="safety-card">
            <view class="safety-icon-box">
              <text class="safety-icon">{{ tip.icon }}</text>
            </view>
            <view class="safety-content">
              <view class="safety-header">
                <text class="safety-title">{{ tip.title }}</text>
                <view class="importance-badge" :class="tip.importance.toLowerCase()">
                  <text>{{ tip.importance }}</text>
                </view>
              </view>
              <text class="safety-desc">{{ tip.description }}</text>
            </view>
          </view>
        </view>

        <view class="emergency-box">
          <text class="emergency-icon">⚠️</text>
          <view class="emergency-content">
            <text class="emergency-title">Emergency Alert</text>
            <text class="emergency-desc">Stop immediately if you feel pain in fingers, wrists, shoulders. Climbing is high-intensity. Over-training may cause injuries. Rest 1-2 days per week for full recovery.</text>
          </view>
        </view>
      </view>

      <!-- Common Mistakes -->
      <view class="section-card">
        <view class="section-header">
          <text class="section-icon">⚠️</text>
          <text class="section-title">Common Mistakes</text>
        </view>
        <view class="mistakes-list">
          <view v-for="(item, idx) in commonMistakes" :key="idx" class="mistake-card">
            <text class="mistake-emoji">{{ item.icon }}</text>
            <view class="mistake-content">
              <view class="mistake-row">
                <text class="mistake-mark">✗</text>
                <text class="mistake-text">{{ item.mistake }}</text>
              </view>
              <view class="solution-row">
                <text class="solution-mark">✓</text>
                <text class="solution-text">{{ item.solution }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="bottom-padding"></view>
    </view>

    <!-- AI Chat Widget -->
    <ai-chat-widget></ai-chat-widget>
  </view>
</template>

<script setup>
import AiChatWidget from '@/components/ai-chat-widget/ai-chat-widget.vue'

const equipmentGuide = [
  {
    id: 1,
    category: 'Essential Gear',
    items: [
      {
        name: 'Climbing Shoes',
        description: 'Tight-fitting, provides excellent friction',
        price: '$80-200',
        priority: 'High',
        tips: 'Beginners should choose comfortable fit, not too tight',
        image: 'https://images.unsplash.com/photo-1606814893907-c2e42943c91f?w=400'
      },
      {
        name: 'Chalk Bag',
        description: 'Keeps hands dry, increases friction',
        price: '$10-30',
        priority: 'High',
        tips: 'Liquid chalk is eco-friendly, powder chalk is traditional',
        image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400'
      }
    ]
  },
  {
    id: 2,
    category: 'Advanced Gear',
    items: [
      {
        name: 'Finger Tape',
        description: 'Protects finger skin, prevents wear',
        price: '$5-15',
        priority: 'Medium',
        tips: 'Recommended for long training sessions',
        image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400'
      },
      {
        name: 'Training Board',
        description: 'Home training, improves finger strength',
        price: '$50-150',
        priority: 'Medium',
        tips: 'Purchase after building a solid foundation',
        image: 'https://images.unsplash.com/photo-1731176116069-86205f376088?w=400'
      }
    ]
  }
]

const beginnerVenues = [
  {
    id: 1,
    name: 'Rock Time Gym',
    image: 'https://images.unsplash.com/photo-1721885876144-25863108be60?w=1080',
    distance: '1.2km',
    rating: 4.8,
    reviews: 234,
    price: '$18/visit',
    beginnerFriendly: true,
    features: ['Beginner Classes', 'Well Equipped', 'Patient Coaches', 'Friendly Environment'],
    difficulty: 'V0-V3',
    highlights: 'Dedicated beginner area, regular beginner courses'
  },
  {
    id: 2,
    name: 'Climber\'s Paradise',
    image: 'https://images.unsplash.com/photo-1659666287295-7da26c3f80d4?w=1080',
    distance: '2.5km',
    rating: 4.9,
    reviews: 189,
    price: '$22/visit',
    beginnerFriendly: true,
    features: ['1-on-1 Coaching', 'Gear Rental', 'Beginner Discounts', 'Active Community'],
    difficulty: 'V0-V4',
    highlights: 'Free beginner trial classes, full equipment rental'
  }
]

const safetyTips = [
  {
    icon: '🔥',
    title: 'Warm Up Properly',
    description: '5-10 minutes warm-up before climbing, activate fingers, wrists, shoulders',
    importance: 'Must'
  },
  {
    icon: '👀',
    title: 'Study the Route',
    description: 'Observe the route before climbing, plan your moves, don\'t climb blindly',
    importance: 'Important'
  },
  {
    icon: '👥',
    title: 'Climb with Partners',
    description: 'Beginners should climb with experienced partners for protection and guidance',
    importance: 'Recommended'
  },
  {
    icon: '💚',
    title: 'Know Your Limits',
    description: 'Don\'t rush high difficulty routes, gradual progression is key',
    importance: 'Must'
  }
]

const learningPath = [
  {
    level: 'Entry Level',
    difficulty: 'V0-V1',
    duration: '1-2 months',
    goals: ['Master basic stance', 'Learn proper grip', 'Build basic strength', 'Overcome height fear'],
    tips: 'Focus on fundamentals, don\'t rush'
  },
  {
    level: 'Beginner Level',
    difficulty: 'V1-V2',
    duration: '2-4 months',
    goals: ['Improve core strength', 'Learn footwork', 'Master weight transfer', 'Complete simple traverses'],
    tips: 'Practice footwork more, reduce arm dependence'
  },
  {
    level: 'Advanced Prep',
    difficulty: 'V2-V3',
    duration: '4-6 months',
    goals: ['Strengthen fingers', 'Learn dynamic moves', 'Improve endurance', 'Complete hanging training'],
    tips: 'Start systematic training, focus on rest and recovery'
  }
]

const commonMistakes = [
  {
    mistake: 'Over-relying on arm strength',
    solution: 'Learn to power with legs, keep center close to wall',
    icon: '💪'
  },
  {
    mistake: 'Ignoring footwork',
    solution: 'Practice precise footholds, improve foot stability',
    icon: '👟'
  },
  {
    mistake: 'Stiff climbing posture',
    solution: 'Relax body, maintain fluid movements',
    icon: '🧘'
  },
  {
    mistake: 'Lack of patience and regular training',
    solution: 'Create training plan, maintain 2-3 times per week',
    icon: '📅'
  }
]

const goBack = () => {
  uni.navigateBack()
}

const sectionPositions = {
  'equipment': 0,
  'venues': 700,
  'learning': 1500,
  'safety': 2200
}

const scrollToSection = (sectionId) => {
  console.log('scrollToSection called with:', sectionId)
  
  const targetPosition = sectionPositions[sectionId] || 0
  
  uni.pageScrollTo({
    scrollTop: targetPosition,
    duration: 300
  })
}

const goToVenueDetail = (id) => {
  uni.navigateTo({
    url: '/pages/venue-detail/venue-detail'
  })
}

const goToVenues = () => {
  uni.switchTab({
    url: '/pages/venues/venues'
  })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f9f5;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  background: linear-gradient(135deg, #7eb662, #6a9b54);
  padding: 24px 16px;
  padding-top: calc(24px + env(safe-area-inset-top, 0px));
  position: relative;
  padding-left: 56px;
}

.back-btn {
  position: fixed;
  left: 16px;
  top: calc(24px + env(safe-area-inset-top, 0px));
  z-index: 100;
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 20px;
  color: white;
  position: relative;
  top: -2px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon-box {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon {
  font-size: 24px;
}

.header-texts {
  display: flex;
  flex-direction: column;
  gap: 2px;
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

/* Quick Navigation */
.quick-nav {
  padding: 0 16px;
  margin-top: -12px;
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
}

.nav-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
}

.nav-item {
  background: white;
  border-radius: 16px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.nav-icon-box {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #d4e7c5, #c0ddb0);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.nav-icon {
  font-size: 20px;
}

.nav-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2px;
}

.nav-subtitle {
  font-size: 11px;
  color: #6b7280;
}

.content-scroll {
  padding: 16px;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

/* Section Card */
.section-card {
  background: white;
  border-radius: 16px;
  padding: 20px 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  font-size: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #111827;
}

/* Equipment Guide */
.category-section {
  margin-bottom: 20px;
}

.category-section:last-child {
  margin-bottom: 16px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.category-dot {
  width: 4px;
  height: 16px;
  background: #7eb662;
  border-radius: 2px;
}

.category-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.gear-item {
  background: #f9fafb;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
}

.gear-item:last-child {
  margin-bottom: 0;
}

.gear-top {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.gear-image {
  width: 64px;
  height: 64px;
  background: white;
  border-radius: 8px;
  flex-shrink: 0;
}

.gear-info {
  flex: 1;
}

.gear-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.gear-name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.priority-badge {
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 10px;
}

.priority-badge.high {
  background: #fef2f2;
  color: #dc2626;
}

.priority-badge.medium {
  background: #eff6ff;
  color: #2563eb;
}

.priority-badge text {
  font-weight: 600;
}

.gear-desc {
  display: block;
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 4px;
}

.gear-price {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #7eb662;
}

.gear-tip {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 8px 10px;
}

.tip-icon {
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 1px;
}

.tip-text {
  font-size: 12px;
  color: #1e40af;
  line-height: 1.4;
}

.rental-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: linear-gradient(135deg, #f0f7ec, #e8f5e0);
  border: 1px solid #d4e7c5;
  border-radius: 12px;
  padding: 12px;
  margin-top: 12px;
}

.rental-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.rental-texts {
  flex: 1;
}

.rental-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
}

.rental-desc {
  display: block;
  font-size: 12px;
  color: #4b5563;
  line-height: 1.5;
}

/* Venues Section */
.venues-badge {
  background: #d4e7c5;
  padding: 4px 10px;
  border-radius: 10px;
}

.venues-badge text {
  font-size: 12px;
  font-weight: 500;
  color: #5a8a3f;
}

.venue-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.venue-image-wrapper {
  position: relative;
  height: 120px;
}

.venue-image {
  width: 100%;
  height: 100%;
}

.beginner-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #22c55e;
  padding: 4px 10px;
  border-radius: 8px;
}

.beginner-badge text {
  font-size: 11px;
  font-weight: 600;
  color: white;
}

.venue-content {
  padding: 14px;
}

.venue-top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 6px;
}

.venue-name {
  font-size: 16px;
  font-weight: bold;
  color: #111827;
}

.venue-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.venue-highlights {
  display: block;
  font-size: 12px;
  color: #4b5563;
  margin-bottom: 10px;
}

.venue-meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.venue-meta {
  font-size: 12px;
  color: #6b7280;
}

.venue-price {
  font-size: 12px;
  font-weight: 500;
  color: #7eb662;
}

.venue-level {
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  color: #4b5563;
}

.venue-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.feature-tag {
  background: #f0f7ec;
  padding: 4px 10px;
  border-radius: 8px;
}

.feature-tag text {
  font-size: 11px;
  color: #5a8a3f;
}

.view-more-btn {
  width: 100%;
  padding: 12px;
  background: #7eb662;
  border-radius: 12px;
  text-align: center;
  margin-top: 4px;
}

.view-more-btn text {
  font-size: 14px;
  font-weight: 500;
  color: white;
}

/* Learning Path */
.learning-path {
  position: relative;
}

.path-stage {
  position: relative;
  margin-bottom: 16px;
}

.path-stage:last-child {
  margin-bottom: 0;
}

.connect-line {
  position: absolute;
  left: 16px;
  top: 48px;
  width: 2px;
  height: calc(100% - 16px);
  background: linear-gradient(180deg, #7eb662, #d4e7c5);
}

.stage-content {
  display: flex;
  gap: 12px;
}

.stage-number-box {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #7eb662, #6a9b54);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(126, 182, 98, 0.3);
  z-index: 1;
}

.stage-number {
  font-size: 14px;
  font-weight: bold;
  color: white;
}

.stage-details {
  flex: 1;
  background: #f9fafb;
  border-radius: 12px;
  padding: 14px;
}

.stage-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.stage-level {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.stage-badge {
  background: #7eb662;
  padding: 2px 8px;
  border-radius: 6px;
}

.stage-badge text {
  font-size: 11px;
  font-weight: 500;
  color: white;
}

.stage-duration {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 10px;
}

.goals-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 10px;
}

.goal-item {
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.goal-check {
  font-size: 12px;
  flex-shrink: 0;
  margin-top: 1px;
}

.goal-text {
  font-size: 11px;
  color: #4b5563;
  line-height: 1.3;
}

.stage-tip-box {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  background: #fffbeb;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  padding: 8px 10px;
}

.stage-tip-icon {
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 1px;
}

.stage-tip-text {
  font-size: 12px;
  color: #92400e;
  line-height: 1.4;
}

/* Safety Tips */
.safety-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.safety-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: linear-gradient(135deg, #f0f7ec, white);
  border: 1px solid #d4e7c5;
  border-radius: 12px;
  padding: 14px;
}

.safety-icon-box {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.safety-icon {
  font-size: 20px;
}

.safety-content {
  flex: 1;
}

.safety-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.safety-title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.importance-badge {
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 10px;
}

.importance-badge.must {
  background: #fef2f2;
  color: #dc2626;
}

.importance-badge.important {
  background: #fff7ed;
  color: #ea580c;
}

.importance-badge.recommended {
  background: #eff6ff;
  color: #2563eb;
}

.importance-badge text {
  font-weight: 600;
}

.safety-desc {
  display: block;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
}

.emergency-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 14px;
}

.emergency-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.emergency-content {
  flex: 1;
}

.emergency-title {
  display: block;
  font-size: 14px;
  font-weight: bold;
  color: #991b1b;
  margin-bottom: 4px;
}

.emergency-desc {
  display: block;
  font-size: 12px;
  color: #7f1d1d;
  line-height: 1.5;
}

/* Mistakes */
.mistakes-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mistake-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #f9fafb;
  border-radius: 12px;
  padding: 14px;
}

.mistake-emoji {
  font-size: 24px;
  flex-shrink: 0;
}

.mistake-content {
  flex: 1;
}

.mistake-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 6px;
}

.mistake-mark {
  font-size: 14px;
  color: #ef4444;
  flex-shrink: 0;
  margin-top: 1px;
}

.mistake-text {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.solution-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.solution-mark {
  font-size: 14px;
  color: #22c55e;
  flex-shrink: 0;
  margin-top: 1px;
}

.solution-text {
  font-size: 14px;
  color: #4b5563;
}

.bottom-padding {
  height: 24px;
}
</style>
