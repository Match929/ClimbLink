"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_cloud = require("../../utils/cloud.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const showPassword = common_vendor.ref(false);
    const email = common_vendor.ref("");
    const password = common_vendor.ref("");
    const isLoading = common_vendor.ref(false);
    const handleLogin = async () => {
      if (!email.value) {
        common_vendor.index.showToast({
          title: "请输入邮箱",
          icon: "none"
        });
        return;
      }
      if (!password.value) {
        common_vendor.index.showToast({
          title: "请输入密码",
          icon: "none"
        });
        return;
      }
      isLoading.value = true;
      common_vendor.index.showLoading({ title: "登录中..." });
      try {
        const result = await utils_cloud.cloud.user.login(email.value, password.value);
        if (result.success) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/pages/index/index"
            });
          }, 1e3);
        } else {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: result.message || "登录失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "登录失败，请重试",
          icon: "none"
        });
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };
    const navigateToRegister = () => {
      common_vendor.index.navigateTo({
        url: "/pages/register/register"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: email.value,
        b: common_vendor.o(($event) => email.value = $event.detail.value),
        c: showPassword.value ? "text" : "password",
        d: password.value,
        e: common_vendor.o(($event) => password.value = $event.detail.value),
        f: common_vendor.t(showPassword.value ? "👁️‍🗨️" : "👁️"),
        g: common_vendor.o(($event) => showPassword.value = !showPassword.value),
        h: common_vendor.t(isLoading.value ? "登录中..." : "Sign In"),
        i: common_vendor.o(handleLogin),
        j: isLoading.value ? 1 : "",
        k: common_vendor.o(navigateToRegister)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cdfe2409"]]);
wx.createPage(MiniProgramPage);
