"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "ai-chat-widget",
  setup(__props) {
    const isOpen = common_vendor.ref(false);
    const inputValue = common_vendor.ref("");
    const isTyping = common_vendor.ref(false);
    const scrollToView = common_vendor.ref("");
    const messages = common_vendor.ref([
      {
        role: "assistant",
        content: "Hi! I'm your AI climbing assistant. Ask me anything about climbing techniques, equipment, or safety! 🧗"
      }
    ]);
    const suggestedQuestions = [
      "What gear do I need as a beginner?",
      "How do I overcome fear of heights?",
      "What's a good warm-up routine?",
      "How often should I practice?"
    ];
    const scrollToBottom = () => {
      common_vendor.nextTick$1(() => {
        if (messages.value.length > 0) {
          scrollToView.value = "msg-" + (messages.value.length - 1);
        }
      });
    };
    common_vendor.watch(messages, () => {
      scrollToBottom();
    }, { deep: true });
    const generateResponse = (message) => {
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes("shoe") || lowerMessage.includes("equipment") || lowerMessage.includes("gear")) {
        return "For beginners, I recommend starting with comfortable climbing shoes that fit snugly but not painfully tight. A good pair of entry-level shoes costs around $80-120. Also, get a chalk bag ($10-30) to keep your hands dry. Don't forget to rent a harness at the gym initially!";
      } else if (lowerMessage.includes("warm up") || lowerMessage.includes("warmup")) {
        return "Great question! Always warm up for 5-10 minutes before climbing. Focus on: finger stretches, wrist rotations, shoulder circles, and light cardio. This prevents injuries and improves performance!";
      } else if (lowerMessage.includes("v0") || lowerMessage.includes("v1") || lowerMessage.includes("beginner") || lowerMessage.includes("start")) {
        return "Welcome to climbing! Start with V0-V1 routes to build fundamentals. Focus on: proper footwork, body positioning, and using your legs more than arms. Don't rush - mastering basics takes 1-2 months. You've got this! 💪";
      } else if (lowerMessage.includes("technique") || lowerMessage.includes("skill")) {
        return "Key techniques for beginners: 1) Keep your hips close to the wall, 2) Use precise footwork, 3) Look ahead to plan your route, 4) Rest on straight arms, 5) Breathe steadily. Practice these and you'll improve quickly!";
      } else if (lowerMessage.includes("fear") || lowerMessage.includes("scared") || lowerMessage.includes("height")) {
        return "Height fear is completely normal! Tips to overcome it: Start low and gradually increase height, focus on the next hold instead of looking down, practice falling safely on mats, and climb with supportive partners. Your confidence will build with time!";
      } else if (lowerMessage.includes("train") || lowerMessage.includes("practice") || lowerMessage.includes("how often")) {
        return "For beginners, I recommend 2-3 climbing sessions per week with rest days in between. Each session should be 1-2 hours. This gives your body time to recover and adapt. Consistency is more important than intensity!";
      } else if (lowerMessage.includes("injury") || lowerMessage.includes("pain") || lowerMessage.includes("hurt")) {
        return "⚠️ If you feel sharp pain, stop immediately! Common beginner issues: finger strain, elbow tendinitis. Prevention: warm up properly, don't overtrain, rest 1-2 days/week, and listen to your body. See a doctor if pain persists.";
      } else if (lowerMessage.includes("grade") || lowerMessage.includes("level") || lowerMessage.includes("difficulty")) {
        return "Climbing grades (V-scale): V0-V1 (Beginner), V2-V3 (Novice), V4-V5 (Intermediate), V6-V7 (Advanced), V8+ (Expert). Don't rush grades - focus on technique over difficulty. Progress naturally over months!";
      } else if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
        return "You're welcome! Feel free to ask anything else about climbing. Happy climbing! 🧗✨";
      } else {
        return "That's an interesting question! For climbing-related queries, I can help with: techniques, equipment, safety tips, training schedules, overcoming fears, and grade progressions. What would you like to know more about?";
      }
    };
    const handleSend = () => {
      if (!inputValue.value.trim()) return;
      const userMessage = inputValue.value.trim();
      inputValue.value = "";
      messages.value.push({ role: "user", content: userMessage });
      isTyping.value = true;
      setTimeout(() => {
        const response = generateResponse(userMessage);
        messages.value.push({ role: "assistant", content: response });
        isTyping.value = false;
      }, 1e3 + Math.random() * 1e3);
    };
    const handleSuggestedQuestion = (question) => {
      inputValue.value = question;
      setTimeout(() => {
        handleSend();
      }, 100);
    };
    const onScroll = (e) => {
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !isOpen.value
      }, !isOpen.value ? {
        b: common_vendor.o(($event) => isOpen.value = true)
      } : {}, {
        c: isOpen.value
      }, isOpen.value ? common_vendor.e({
        d: common_vendor.o(($event) => isOpen.value = false),
        e: common_vendor.f(messages.value, (message, index, i0) => {
          return {
            a: common_vendor.t(message.content),
            b: common_vendor.n(message.role),
            c: "msg-" + index,
            d: index,
            e: common_vendor.n(message.role)
          };
        }),
        f: isTyping.value
      }, isTyping.value ? {} : {}, {
        g: messages.value.length === 1
      }, messages.value.length === 1 ? {
        h: common_vendor.f(suggestedQuestions, (question, index, i0) => {
          return {
            a: common_vendor.t(question),
            b: index,
            c: common_vendor.o(($event) => handleSuggestedQuestion(question), index)
          };
        })
      } : {}, {
        i: scrollToView.value,
        j: common_vendor.o(onScroll),
        k: common_vendor.o(handleSend),
        l: inputValue.value,
        m: common_vendor.o(($event) => inputValue.value = $event.detail.value),
        n: !inputValue.value.trim() ? 1 : "",
        o: common_vendor.o(handleSend)
      }) : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-008024f4"]]);
wx.createComponent(Component);
