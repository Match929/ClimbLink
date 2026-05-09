"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "event-create",
  setup(__props) {
    const activeType = common_vendor.ref(0);
    const locations = ["Rock Time Gym", "Climber's Paradise", "Peak Gym", "Other"];
    const levels = ["All levels", "V0-V1", "V1-V2", "V2-V3", "V3-V4", "V4-V5", "V5+"];
    const types = [
      { icon: "🧗", name: "Climb" },
      { icon: "💪", name: "Workout" },
      { icon: "🎉", name: "Social" }
    ];
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const postEvent = () => {
      common_vendor.index.showToast({
        title: "Event created!",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1e3);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goBack),
        b: common_vendor.o(postEvent),
        c: common_vendor.t(locations[0]),
        d: locations,
        e: common_vendor.t(levels[0]),
        f: levels,
        g: common_vendor.f(types, (type, index, i0) => {
          return {
            a: common_vendor.t(type.icon),
            b: common_vendor.t(type.name),
            c: index,
            d: activeType.value === index ? 1 : "",
            e: common_vendor.o(($event) => activeType.value = index, index)
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d665bec2"]]);
wx.createPage(MiniProgramPage);
