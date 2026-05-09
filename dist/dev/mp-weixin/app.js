"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/register/register.js";
  "./pages/conversation-list/conversation-list.js";
  "./pages/add-friend/add-friend.js";
  "./pages/community/community.js";
  "./pages/venues/venues.js";
  "./pages/profile/profile.js";
  "./pages/blindbox/blindbox.js";
  "./pages/post-create/post-create.js";
  "./pages/venue-detail/venue-detail.js";
  "./pages/activity-detail/activity-detail.js";
  "./pages/edit-profile/edit-profile.js";
  "./pages/beginner-guide/beginner-guide.js";
  "./pages/chat/chat.js";
  "./pages/smart-partner/smart-partner.js";
  "./pages/climb-records/climb-records.js";
  "./pages/market/market.js";
  "./pages/market-item-detail/market-item-detail.js";
  "./pages/market-item-create/market-item-create.js";
  "./pages/event-list/event-list.js";
  "./pages/event-create/event-create.js";
  "./pages/climb-request/climb-request.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
    try {
      common_vendor.index.removeStorageSync("userId");
      common_vendor.index.removeStorageSync("userInfo");
      console.log("已清除登录状态");
    } catch (e) {
      console.error("清除登录状态失败:", e);
    }
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
