"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_cloud = require("../../utils/cloud.js");
const _sfc_main = {
  __name: "add-friend",
  setup(__props) {
    const searchKeyword = common_vendor.ref("");
    const isSearching = common_vendor.ref(false);
    const hasSearched = common_vendor.ref(false);
    const searchResults = common_vendor.ref([]);
    const handleSearch = async () => {
      if (!searchKeyword.value.trim()) {
        common_vendor.index.showToast({
          title: "请输入搜索关键词",
          icon: "none"
        });
        return;
      }
      isSearching.value = true;
      hasSearched.value = true;
      try {
        const currentUserId = common_vendor.index.getStorageSync("userId");
        const results = await utils_cloud.cloud.chat.searchUsers(searchKeyword.value.trim());
        searchResults.value = results.filter((user) => user._id !== currentUserId);
      } catch (err) {
        console.error("搜索失败:", err);
        common_vendor.index.showToast({
          title: "搜索失败",
          icon: "none"
        });
      } finally {
        isSearching.value = false;
      }
    };
    const clearSearch = () => {
      searchKeyword.value = "";
      hasSearched.value = false;
      searchResults.value = [];
    };
    const getDefaultAvatar = (userId) => {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
    };
    const startChat = async (user) => {
      try {
        common_vendor.index.showLoading({ title: "创建会话..." });
        const conversation = await utils_cloud.cloud.chat.getOrCreateSingleConversation(user._id);
        if (conversation) {
          common_vendor.index.hideLoading();
          common_vendor.index.redirectTo({
            url: `/pages/chat/chat?conversationId=${conversation._id}&otherUserId=${user._id}`
          });
        } else {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "创建会话失败",
            icon: "none"
          });
        }
      } catch (err) {
        common_vendor.index.hideLoading();
        console.error("创建会话失败:", err);
        common_vendor.index.showToast({
          title: "创建会话失败",
          icon: "none"
        });
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.o(handleSearch),
        c: searchKeyword.value,
        d: common_vendor.o(($event) => searchKeyword.value = $event.detail.value),
        e: searchKeyword.value
      }, searchKeyword.value ? {
        f: common_vendor.o(clearSearch)
      } : {}, {
        g: common_vendor.o(handleSearch),
        h: isSearching.value
      }, isSearching.value ? {} : hasSearched.value && searchResults.value.length === 0 ? {} : searchResults.value.length > 0 ? {
        k: common_vendor.f(searchResults.value, (user, k0, i0) => {
          return common_vendor.e({
            a: user.avatar || getDefaultAvatar(user._id),
            b: common_vendor.t(user.name),
            c: user.climbing_level
          }, user.climbing_level ? {
            d: common_vendor.t(user.climbing_level)
          } : {
            e: common_vendor.t(user.bio || "暂无简介")
          }, {
            f: user._id,
            g: common_vendor.o(($event) => startChat(user), user._id)
          });
        })
      } : {}, {
        i: hasSearched.value && searchResults.value.length === 0,
        j: searchResults.value.length > 0
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9de6d729"]]);
wx.createPage(MiniProgramPage);
