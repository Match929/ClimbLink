<template>
  <view>
    <!-- Floating Chat Button -->
    <view 
      v-if="!isOpen"
      class="floating-btn"
      @click="isOpen = true"
    >
      <view class="floating-icon-wrapper">
        <text class="floating-icon">✨</text>
        <view class="pulse-dot"></view>
      </view>
    </view>

    <!-- Chat Window -->
    <view v-if="isOpen" class="chat-window">
      <view class="chat-container">
        <!-- Header -->
        <view class="chat-header">
          <view class="header-left">
            <view class="header-icon">
              <text>✨</text>
            </view>
            <view>
              <text class="header-title">AI Climbing Assistant</text>
              <text class="header-subtitle">Always here to help</text>
            </view>
          </view>
          <view class="close-btn" @click="isOpen = false">
            <text>✕</text>
          </view>
        </view>

        <!-- Messages -->
        <scroll-view 
          scroll-y 
          class="chat-messages"
          :scroll-into-view="scrollToView"
          scroll-with-animation
          @scroll="onScroll"
        >
          <view v-for="(message, index) in messages" :key="index" class="message-wrapper" :class="message.role">
            <view 
              class="message-bubble" 
              :class="message.role"
              :id="'msg-' + index"
            >
              <text class="message-text">{{ message.content }}</text>
            </view>
          </view>

          <!-- Typing Indicator -->
          <view v-if="isTyping" class="message-wrapper assistant">
            <view class="message-bubble assistant">
              <view class="typing-indicator">
                <view class="typing-dot"></view>
                <view class="typing-dot"></view>
                <view class="typing-dot"></view>
              </view>
            </view>
          </view>

          <!-- Suggested Questions -->
          <view v-if="messages.length === 1" class="suggested-questions">
            <text class="suggested-title">Quick questions:</text>
            <view 
              v-for="(question, index) in suggestedQuestions" 
              :key="index"
              class="suggestion-btn"
              @click="handleSuggestedQuestion(question)"
            >
              <text class="suggestion-text">{{ question }}</text>
            </view>
          </view>

          <!-- Spacer -->
          <view style="height: 10px"></view>
        </scroll-view>

        <!-- Input -->
        <view class="chat-input">
          <view class="input-wrapper">
            <input 
              class="input-field"
              v-model="inputValue"
              type="text"
              placeholder="Ask me anything..."
              confirm-type="send"
              @confirm="handleSend"
            />
            <view 
              class="send-btn" 
              :class="{ disabled: !inputValue.trim() }"
              @click="handleSend"
            >
              <text>➤</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const isOpen = ref(false)
const inputValue = ref('')
const isTyping = ref(false)
const scrollToView = ref('')

const messages = ref([
  {
    role: 'assistant',
    content: "Hi! I'm your AI climbing assistant. Ask me anything about climbing techniques, equipment, or safety! 🧗"
  }
])

const suggestedQuestions = [
  "What gear do I need as a beginner?",
  "How do I overcome fear of heights?",
  "What's a good warm-up routine?",
  "How often should I practice?"
]

const scrollToBottom = () => {
  nextTick(() => {
    if (messages.value.length > 0) {
      scrollToView.value = 'msg-' + (messages.value.length - 1)
    }
  })
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })

const generateResponse = (message) => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("shoe") || lowerMessage.includes("equipment") || lowerMessage.includes("gear")) {
    return "For beginners, I recommend starting with comfortable climbing shoes that fit snugly but not painfully tight. A good pair of entry-level shoes costs around $80-120. Also, get a chalk bag ($10-30) to keep your hands dry. Don't forget to rent a harness at the gym initially!"
  } else if (lowerMessage.includes("warm up") || lowerMessage.includes("warmup")) {
    return "Great question! Always warm up for 5-10 minutes before climbing. Focus on: finger stretches, wrist rotations, shoulder circles, and light cardio. This prevents injuries and improves performance!"
  } else if (lowerMessage.includes("v0") || lowerMessage.includes("v1") || lowerMessage.includes("beginner") || lowerMessage.includes("start")) {
    return "Welcome to climbing! Start with V0-V1 routes to build fundamentals. Focus on: proper footwork, body positioning, and using your legs more than arms. Don't rush - mastering basics takes 1-2 months. You've got this! 💪"
  } else if (lowerMessage.includes("technique") || lowerMessage.includes("skill")) {
    return "Key techniques for beginners: 1) Keep your hips close to the wall, 2) Use precise footwork, 3) Look ahead to plan your route, 4) Rest on straight arms, 5) Breathe steadily. Practice these and you'll improve quickly!"
  } else if (lowerMessage.includes("fear") || lowerMessage.includes("scared") || lowerMessage.includes("height")) {
    return "Height fear is completely normal! Tips to overcome it: Start low and gradually increase height, focus on the next hold instead of looking down, practice falling safely on mats, and climb with supportive partners. Your confidence will build with time!"
  } else if (lowerMessage.includes("train") || lowerMessage.includes("practice") || lowerMessage.includes("how often")) {
    return "For beginners, I recommend 2-3 climbing sessions per week with rest days in between. Each session should be 1-2 hours. This gives your body time to recover and adapt. Consistency is more important than intensity!"
  } else if (lowerMessage.includes("injury") || lowerMessage.includes("pain") || lowerMessage.includes("hurt")) {
    return "⚠️ If you feel sharp pain, stop immediately! Common beginner issues: finger strain, elbow tendinitis. Prevention: warm up properly, don't overtrain, rest 1-2 days/week, and listen to your body. See a doctor if pain persists."
  } else if (lowerMessage.includes("grade") || lowerMessage.includes("level") || lowerMessage.includes("difficulty")) {
    return "Climbing grades (V-scale): V0-V1 (Beginner), V2-V3 (Novice), V4-V5 (Intermediate), V6-V7 (Advanced), V8+ (Expert). Don't rush grades - focus on technique over difficulty. Progress naturally over months!"
  } else if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
    return "You're welcome! Feel free to ask anything else about climbing. Happy climbing! 🧗✨"
  } else {
    return "That's an interesting question! For climbing-related queries, I can help with: techniques, equipment, safety tips, training schedules, overcoming fears, and grade progressions. What would you like to know more about?"
  }
}

const handleSend = () => {
  if (!inputValue.value.trim()) return

  const userMessage = inputValue.value.trim()
  inputValue.value = ''
  messages.value.push({ role: 'user', content: userMessage })

  // Simulate AI response
  isTyping.value = true
  setTimeout(() => {
    const response = generateResponse(userMessage)
    messages.value.push({ role: 'assistant', content: response })
    isTyping.value = false
  }, 1000 + Math.random() * 1000)
}

const handleSuggestedQuestion = (question) => {
  inputValue.value = question
  setTimeout(() => {
    handleSend()
  }, 100)
}

const onScroll = (e) => {
  // Do nothing for now
}
</script>

<style scoped>
/* Floating Button */
.floating-btn {
  position: fixed;
  bottom: 100px;
  right: 16px;
  z-index: 1000;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #7eb662 0%, #6a9b54 100%);
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-icon-wrapper {
  position: relative;
}

.floating-icon {
  font-size: 24px;
}

.pulse-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 12px;
  height: 12px;
  background-color: #facc15;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

/* Chat Window */
.chat-window {
  position: fixed;
  bottom: 16px;
  right: 16px;
  left: 16px;
  z-index: 1000;
  max-width: 384px;
  margin: 0 auto;
}

.chat-container {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  border: 1px solid #e5e7eb;
}

/* Header */
.chat-header {
  background: linear-gradient(90deg, #7eb662 0%, #6a9b54 100%);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  width: 32px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.header-title {
  font-size: 14px;
  font-weight: bold;
  color: white;
  display: block;
}

.header-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  display: block;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:active {
  background-color: rgba(255, 255, 255, 0.2);
}

.close-btn text {
  color: white;
  font-size: 18px;
}

/* Messages */
.chat-messages {
  height: 384px;
  background-color: #f9fafb;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
}

.message-wrapper {
  display: flex;
  margin-bottom: 12px;
  width: 100%;
  box-sizing: border-box;
}

.message-wrapper.user {
  justify-content: flex-end;
}

.message-wrapper.assistant {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 80%;
  padding: 10px 16px;
  border-radius: 16px;
  box-sizing: border-box;
}

.message-bubble.user {
  background: linear-gradient(90deg, #7eb662 0%, #6a9b54 100%);
  border-bottom-right-radius: 4px;
}

.message-bubble.assistant {
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
  border-bottom-left-radius: 4px;
}

.message-text {
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  display: block;
}

.message-bubble.user .message-text {
  color: white;
}

.message-bubble.assistant .message-text {
  color: #111827;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  background-color: #9ca3af;
  border-radius: 50%;
  animation: bounce 1s infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* Suggested Questions */
.suggested-questions {
  margin-top: 8px;
}

.suggested-title {
  font-size: 12px;
  color: #6b7280;
  display: block;
  text-align: center;
  margin-bottom: 8px;
}

.suggestion-btn {
  width: 100%;
  padding: 10px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 8px;
}

.suggestion-btn:active {
  background-color: #f0f7ec;
  border-color: #7eb662;
}

.suggestion-text {
  font-size: 12px;
  color: #374151;
}

/* Input */
.chat-input {
  padding: 12px;
  background-color: white;
  border-top: 1px solid #f3f4f6;
}

.input-wrapper {
  display: flex;
  gap: 8px;
}

.input-field {
  flex: 1;
  height: 40px;
  padding: 0 12px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
}

.input-field:focus {
  border-color: #7eb662;
}

.send-btn {
  width: 40px;
  height: 40px;
  background: linear-gradient(90deg, #7eb662 0%, #6a9b54 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.send-btn.disabled {
  background-color: #e5e7eb;
}

.send-btn text {
  color: white;
  font-size: 14px;
}

.send-btn.disabled text {
  color: #9ca3af;
}
</style>
