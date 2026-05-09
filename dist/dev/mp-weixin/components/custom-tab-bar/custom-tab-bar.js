"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "custom-tab-bar",
  props: {
    currentPath: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const showPublishModal = common_vendor.ref(false);
    const navItems = [
      { path: "pages/index/index", label: "Home", icon: "🏠" },
      { path: "pages/community/community", label: "Community", icon: "👥" },
      { path: "pages/venues/venues", label: "Venues", icon: "📍" },
      { path: "pages/profile/profile", label: "Profile", icon: "👤" }
    ];
    const publishOptions = [
      {
        id: "post",
        title: "Post",
        icon: "💬",
        path: "/pages/post-create/post-create",
        gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
        angle: -45
      },
      {
        id: "match",
        title: "Partner",
        icon: "🧗",
        path: "/pages/climb-request/climb-request",
        gradient: "linear-gradient(135deg, #7eb662, #6a9b54)",
        angle: 0
      },
      {
        id: "event",
        title: "Event",
        icon: "📅",
        path: "/pages/event-create/event-create",
        gradient: "linear-gradient(135deg, #a855f7, #9333ea)",
        angle: 45
      }
    ];
    const togglePublishModal = () => {
      const userId = common_vendor.index.getStorageSync("userId");
      if (!userId) {
        common_vendor.index.showModal({
          title: "Login Required",
          content: "Please login first to publish",
          confirmText: "Login",
          cancelText: "Cancel",
          confirmColor: "#7eb662",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/login/login"
              });
            }
          }
        });
        return;
      }
      showPublishModal.value = !showPublishModal.value;
    };
    const closePublishModal = () => {
      showPublishModal.value = false;
    };
    const selectOption = (option) => {
      const userId = common_vendor.index.getStorageSync("userId");
      if (!userId) {
        common_vendor.index.showModal({
          title: "Login Required",
          content: "Please login first to publish",
          confirmText: "Login",
          cancelText: "Cancel",
          confirmColor: "#7eb662",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/login/login"
              });
            }
          }
        });
        return;
      }
      closePublishModal();
      common_vendor.index.navigateTo({
        url: option.path
      });
    };
    const switchTab = (path) => {
      common_vendor.index.reLaunch({
        url: "/" + path
      });
    };
    const getFanButtonStyle = (option, index) => {
      option.angle * Math.PI / 180;
      return {
        transitionDelay: `${index * 0.05}s`
      };
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: showPublishModal.value
      }, showPublishModal.value ? {
        b: common_vendor.o(closePublishModal)
      } : {}, {
        c: common_vendor.f(publishOptions, (option, index, i0) => {
          return {
            a: common_vendor.t(option.icon),
            b: option.gradient,
            c: common_vendor.t(option.title),
            d: option.id,
            e: common_vendor.s(getFanButtonStyle(option, index)),
            f: common_vendor.o(($event) => selectOption(option), option.id)
          };
        }),
        d: showPublishModal.value ? 1 : "",
        e: showPublishModal.value ? 1 : "",
        f: common_vendor.o(closePublishModal),
        g: showPublishModal.value ? 1 : "",
        h: common_vendor.f(navItems.slice(0, 2), (item, k0, i0) => {
          return {
            a: common_vendor.t(item.icon),
            b: __props.currentPath === item.path ? 1 : "",
            c: common_vendor.t(item.label),
            d: __props.currentPath === item.path ? 1 : "",
            e: item.path,
            f: __props.currentPath === item.path ? 1 : "",
            g: common_vendor.o(($event) => switchTab(item.path), item.path)
          };
        }),
        i: common_vendor.o(togglePublishModal),
        j: common_vendor.f(navItems.slice(2), (item, k0, i0) => {
          return {
            a: common_vendor.t(item.icon),
            b: __props.currentPath === item.path ? 1 : "",
            c: common_vendor.t(item.label),
            d: __props.currentPath === item.path ? 1 : "",
            e: item.path,
            f: __props.currentPath === item.path ? 1 : "",
            g: common_vendor.o(($event) => switchTab(item.path), item.path)
          };
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6b32d6d6"]]);
wx.createComponent(Component);
