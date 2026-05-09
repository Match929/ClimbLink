"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "market-item-detail",
  setup(__props) {
    const item = common_vendor.ref({
      id: 1,
      title: "La Sportiva Solution - Size 42",
      price: 85,
      location: "Rock Time Gym",
      date: "Today",
      image: "https://images.unsplash.com/photo-1585950263799-4106e7687d05?w=800&h=800&fit=crop",
      seller: {
        name: "Chris Sharma",
        level: "V10+",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chris"
      },
      description: "Selling my trusted La Sportiva Solutions. Size 42 EU (9 US men). Used but in excellent condition - still plenty of rubber left. Only selling because I sized down.",
      specs: [
        { label: "Condition", value: "Excellent" },
        { label: "Size", value: "42 EU / 9 US" },
        { label: "Age", value: "6 months" },
        { label: "Resoles", value: "0" }
      ]
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const contactSeller = () => {
      common_vendor.index.navigateTo({
        url: "/pages/chat/chat"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goBack),
        b: item.value.image,
        c: common_vendor.t(item.value.price),
        d: common_vendor.t(item.value.title),
        e: common_vendor.t(item.value.location),
        f: common_vendor.t(item.value.date),
        g: item.value.seller.avatar,
        h: common_vendor.t(item.value.seller.name),
        i: common_vendor.t(item.value.seller.level),
        j: common_vendor.o(contactSeller),
        k: common_vendor.t(item.value.description),
        l: common_vendor.f(item.value.specs, (spec, index, i0) => {
          return {
            a: common_vendor.t(spec.label),
            b: common_vendor.t(spec.value),
            c: index
          };
        }),
        m: common_vendor.o(goBack),
        n: common_vendor.o(contactSeller)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a6dfa7bd"]]);
wx.createPage(MiniProgramPage);
