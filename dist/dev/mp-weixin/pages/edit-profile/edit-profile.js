"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_cloud = require("../../utils/cloud.js");
const _sfc_main = {
  __name: "edit-profile",
  setup(__props) {
    const profile = common_vendor.ref({
      nickname: "",
      avatar: "",
      level: "",
      labels: [],
      bio: "",
      experience: ""
    });
    const levels = ["V0", "V1-V2", "V3-V4", "V5-V6", "V7-V8", "V9+"];
    const labelOptions = [
      "Extrovert",
      "Introvert",
      "Adventurer",
      "Planner",
      "Competitive",
      "Relaxed",
      "Tech-focused",
      "Fun-focused",
      "Early Bird",
      "Night Owl",
      "Team Player",
      "Independent"
    ];
    const loading = common_vendor.ref(false);
    const loadUserData = async () => {
      try {
        const userData = await utils_cloud.cloud.user.getCurrentUser();
        if (userData) {
          const userId = common_vendor.index.getStorageSync("userId");
          profile.value = {
            nickname: userData.name || "",
            avatar: utils_cloud.cloud.getAvatarUrl(userData.avatar, userId),
            level: userData.climbing_level || "V0",
            labels: userData.labels || [],
            bio: userData.bio || "",
            experience: ""
          };
        }
      } catch (err) {
        console.error("加载用户数据失败:", err);
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const toggleLabel = (label) => {
      const index = profile.value.labels.indexOf(label);
      if (index > -1) {
        profile.value.labels.splice(index, 1);
      } else {
        profile.value.labels.push(label);
      }
    };
    const changeAvatar = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["album", "camera"],
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0];
          profile.value.avatar = tempFilePath;
          try {
            common_vendor.index.showLoading({ title: "上传中..." });
            const uploadResult = await utils_cloud.cloud.storage.uploadAvatar(tempFilePath);
            if (uploadResult && uploadResult.success) {
              profile.value.avatar = uploadResult.fileID;
              console.log("头像上传成功:", uploadResult.fileID);
            } else {
              console.warn("头像上传失败，保留临时图片");
            }
          } catch (err) {
            console.error("头像上传异常:", err);
          } finally {
            common_vendor.index.hideLoading();
          }
        }
      });
    };
    const handleSave = async () => {
      if (!profile.value.nickname) {
        common_vendor.index.showToast({ title: "请输入昵称", icon: "none" });
        return;
      }
      loading.value = true;
      common_vendor.index.showLoading({ title: "Saving..." });
      try {
        const userId = common_vendor.index.getStorageSync("userId");
        const updateData = {
          name: profile.value.nickname,
          avatar: profile.value.avatar,
          climbing_level: profile.value.level,
          labels: profile.value.labels,
          bio: profile.value.bio
        };
        const result = await utils_cloud.cloud.user.updateUser(userId, updateData);
        common_vendor.index.hideLoading();
        loading.value = false;
        if (result && result.success) {
          const currentUserInfo = common_vendor.index.getStorageSync("userInfo") || {};
          common_vendor.index.setStorageSync("userInfo", { ...currentUserInfo, ...updateData });
          common_vendor.index.showToast({ title: "Saved successfully!", icon: "success" });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({ title: (result == null ? void 0 : result.message) || "保存失败", icon: "none" });
        }
      } catch (err) {
        console.error("保存失败:", err);
        common_vendor.index.hideLoading();
        loading.value = false;
        common_vendor.index.showToast({ title: "保存失败，请重试", icon: "none" });
      }
    };
    common_vendor.onMounted(() => {
      loadUserData();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goBack),
        b: common_vendor.o(handleSave),
        c: profile.value.avatar,
        d: common_vendor.o(changeAvatar),
        e: profile.value.nickname,
        f: common_vendor.o(($event) => profile.value.nickname = $event.detail.value),
        g: common_vendor.f(levels, (level, index, i0) => {
          return {
            a: common_vendor.t(level),
            b: index,
            c: profile.value.level === level ? 1 : "",
            d: common_vendor.o(($event) => profile.value.level = level, index)
          };
        }),
        h: common_vendor.f(labelOptions, (label, index, i0) => {
          return {
            a: common_vendor.t(label),
            b: index,
            c: profile.value.labels.includes(label) ? 1 : "",
            d: common_vendor.o(($event) => toggleLabel(label), index)
          };
        }),
        i: profile.value.bio,
        j: common_vendor.o(($event) => profile.value.bio = $event.detail.value),
        k: common_vendor.t(profile.value.bio.length)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-043f977d"]]);
wx.createPage(MiniProgramPage);
