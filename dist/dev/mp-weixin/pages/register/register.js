"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_cloud = require("../../utils/cloud.js");
const _sfc_main = {
  __name: "register",
  setup(__props) {
    const showPassword = common_vendor.ref(false);
    const isLoading = common_vendor.ref(false);
    const formData = common_vendor.ref({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      level: "",
      agreeTerms: false
    });
    const levels = [
      { value: "V0-V2", label: "Beginner" },
      { value: "V3-V5", label: "Intermediate" },
      { value: "V6-V8", label: "Advanced" },
      { value: "V9+", label: "Expert" }
    ];
    const handleRegister = async () => {
      if (!formData.value.name) {
        common_vendor.index.showToast({
          title: "请输入姓名",
          icon: "none"
        });
        return;
      }
      if (!formData.value.email) {
        common_vendor.index.showToast({
          title: "请输入邮箱",
          icon: "none"
        });
        return;
      }
      if (!formData.value.level) {
        common_vendor.index.showToast({
          title: "请选择攀岩等级",
          icon: "none"
        });
        return;
      }
      if (!formData.value.password) {
        common_vendor.index.showToast({
          title: "请输入密码",
          icon: "none"
        });
        return;
      }
      if (formData.value.password !== formData.value.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次密码输入不一致",
          icon: "none"
        });
        return;
      }
      if (!formData.value.agreeTerms) {
        common_vendor.index.showToast({
          title: "请同意服务条款",
          icon: "none"
        });
        return;
      }
      isLoading.value = true;
      common_vendor.index.showLoading({ title: "注册中..." });
      try {
        const result = await utils_cloud.cloud.user.register(formData.value);
        if (result.success) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "注册成功",
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
            title: result.message || "注册失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "注册失败，请重试",
          icon: "none"
        });
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };
    const navigateToLogin = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: formData.value.name,
        b: common_vendor.o(($event) => formData.value.name = $event.detail.value),
        c: formData.value.email,
        d: common_vendor.o(($event) => formData.value.email = $event.detail.value),
        e: common_vendor.f(levels, (level, k0, i0) => {
          return {
            a: common_vendor.t(level.value),
            b: common_vendor.t(level.label),
            c: level.value,
            d: formData.value.level === level.value ? 1 : "",
            e: common_vendor.o(($event) => formData.value.level = level.value, level.value)
          };
        }),
        f: showPassword.value ? "text" : "password",
        g: formData.value.password,
        h: common_vendor.o(($event) => formData.value.password = $event.detail.value),
        i: common_vendor.t(showPassword.value ? "👁️‍🗨️" : "👁️"),
        j: common_vendor.o(($event) => showPassword.value = !showPassword.value),
        k: showPassword.value ? "text" : "password",
        l: formData.value.confirmPassword,
        m: common_vendor.o(($event) => formData.value.confirmPassword = $event.detail.value),
        n: formData.value.agreeTerms,
        o: common_vendor.o(($event) => formData.value.agreeTerms = !formData.value.agreeTerms),
        p: common_vendor.t(isLoading.value ? "注册中..." : "Create Account"),
        q: common_vendor.o(handleRegister),
        r: isLoading.value ? 1 : "",
        s: common_vendor.o(navigateToLogin)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-97bb96ad"]]);
wx.createPage(MiniProgramPage);
