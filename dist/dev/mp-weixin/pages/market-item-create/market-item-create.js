"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "market-item-create",
  setup(__props) {
    const locations = [
      "Rock Time Gym",
      "Climber's Paradise",
      "Peak Gym",
      "Other"
    ];
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const postItem = () => {
      common_vendor.index.showToast({
        title: "Listing posted!",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1e3);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goBack),
        b: common_vendor.o(postItem),
        c: common_vendor.t(locations[0]),
        d: locations
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-de10076c"]]);
wx.createPage(MiniProgramPage);
