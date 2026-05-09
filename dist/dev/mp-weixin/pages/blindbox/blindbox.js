"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "blindbox",
  setup(__props) {
    const isMatching = common_vendor.ref(false);
    const matchResult = common_vendor.ref(null);
    const matchHistory = common_vendor.ref([
      { name: "XiaoZhang", level: "V2-V4", date: "March 20th", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoZhang" },
      { name: "Ami", level: "V3-V5", date: "March 18th", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ami" }
    ]);
    function navigateBack() {
      common_vendor.index.navigateBack();
    }
    function handleMatch() {
      if (isMatching.value) return;
      isMatching.value = true;
      matchResult.value = null;
      setTimeout(() => {
        matchResult.value = {
          user: {
            name: "XiaoWang",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=XiaoWang",
            level: "V3-V4",
            experience: "1.5 years",
            age: 26,
            gender: "Male"
          },
          venue: "Rock Time Gym",
          time: "Tomorrow 3:00 PM",
          compatibility: 88,
          commonInterests: ["Bouldering", "Outdoors", "Photography"],
          introduction: "Love challenging new routes and helping beginners. Looking for a partner to progress together!"
        };
        isMatching.value = false;
      }, 2e3);
    }
    function rematch() {
      matchResult.value = null;
      handleMatch();
    }
    function acceptMatch() {
      common_vendor.index.showToast({
        title: "Match accepted!",
        icon: "success"
      });
      setTimeout(() => {
        navigateBack();
      }, 1500);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(navigateBack),
        b: isMatching.value ? 1 : "",
        c: !matchResult.value
      }, !matchResult.value ? common_vendor.e({
        d: isMatching.value
      }, isMatching.value ? {} : {}, {
        e: common_vendor.o(handleMatch),
        f: isMatching.value ? 1 : "",
        g: !isMatching.value
      }, !isMatching.value ? {
        h: common_vendor.f(matchHistory.value, (record, index, i0) => {
          return {
            a: record.avatar,
            b: common_vendor.t(record.name),
            c: common_vendor.t(record.level),
            d: common_vendor.t(record.date),
            e: index
          };
        })
      } : {}) : {
        i: matchResult.value.user.avatar,
        j: common_vendor.t(matchResult.value.user.name),
        k: common_vendor.t(matchResult.value.user.age),
        l: common_vendor.t(matchResult.value.user.gender),
        m: common_vendor.t(matchResult.value.user.level),
        n: common_vendor.t(matchResult.value.user.experience),
        o: matchResult.value.compatibility + "%",
        p: common_vendor.t(matchResult.value.compatibility),
        q: common_vendor.t(matchResult.value.introduction),
        r: common_vendor.t(matchResult.value.venue),
        s: common_vendor.t(matchResult.value.time),
        t: common_vendor.f(matchResult.value.commonInterests, (interest, index, i0) => {
          return {
            a: common_vendor.t(interest),
            b: index
          };
        }),
        v: common_vendor.o(rematch),
        w: common_vendor.o(acceptMatch)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6f8a0b1b"]]);
wx.createPage(MiniProgramPage);
