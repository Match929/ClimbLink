"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_cloud = require("../../utils/cloud.js");
if (!Math) {
  CustomTabBar();
}
const CustomTabBar = () => "../../components/custom-tab-bar/custom-tab-bar.js";
const _sfc_main = {
  __name: "conversation-list",
  setup(__props) {
    const isLoading = common_vendor.ref(true);
    const conversations = common_vendor.ref([]);
    const loadConversations = async () => {
      isLoading.value = true;
      try {
        const data = await utils_cloud.cloud.chat.getConversations();
        conversations.value = data;
      } catch (err) {
        console.error("加载会话失败:", err);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        isLoading.value = false;
      }
    };
    const getDefaultAvatar = (userId) => {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
    };
    const formatTime = (date) => {
      if (!date) return "";
      const d = new Date(date);
      const now = /* @__PURE__ */ new Date();
      const diff = now - d;
      const oneDay = 24 * 60 * 60 * 1e3;
      if (diff < oneDay) {
        let hours = d.getHours();
        let minutes = d.getMinutes();
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        return `${hours}:${minutes}`;
      } else if (diff < oneDay * 2) {
        return "昨天";
      } else {
        const month = d.getMonth() + 1;
        const day = d.getDate();
        return `${month}/${day}`;
      }
    };
    const goToChat = (conv) => {
      if (conv.otherMembers.length > 0) {
        common_vendor.index.navigateTo({
          url: `/pages/chat/chat?conversationId=${conv._id}&otherUserId=${conv.otherMembers[0]._id}`
        });
      }
    };
    const goToAddFriend = () => {
      common_vendor.index.navigateTo({
        url: "/pages/add-friend/add-friend"
      });
    };
    common_vendor.onMounted(() => {
      loadConversations();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goToAddFriend),
        b: isLoading.value
      }, isLoading.value ? {} : conversations.value.length === 0 ? {} : {
        d: common_vendor.f(conversations.value, (conv, k0, i0) => {
          return common_vendor.e({
            a: conv.otherMembers.length > 0
          }, conv.otherMembers.length > 0 ? {
            b: conv.otherMembers[0].avatar || getDefaultAvatar(conv.otherMembers[0]._id)
          } : {}, {
            c: common_vendor.t(conv.otherMembers.length > 0 ? conv.otherMembers[0].name : "未知用户"),
            d: conv.lastMessage
          }, conv.lastMessage ? {
            e: common_vendor.t(formatTime(conv.lastMessage.created_at))
          } : {}, {
            f: common_vendor.t(conv.lastMessage ? conv.lastMessage.content : "开始聊天吧"),
            g: conv._id,
            h: common_vendor.o(($event) => goToChat(conv), conv._id)
          });
        })
      }, {
        c: conversations.value.length === 0,
        e: common_vendor.p({
          currentPath: "pages/conversation-list/conversation-list"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-03e88394"]]);
wx.createPage(MiniProgramPage);
