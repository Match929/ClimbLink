"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "market",
  setup(__props) {
    const activeCategory = common_vendor.ref(0);
    const categories = [
      { icon: "👟", name: "Shoes" },
      { icon: "🎒", name: "Chalk" },
      { icon: "🎯", name: "Holds" },
      { icon: "🧗", name: "Ropes" },
      { icon: "👕", name: "Apparel" },
      { icon: "📦", name: "All" }
    ];
    const items = common_vendor.ref([
      {
        id: 1,
        title: "La Sportiva Solution - Size 42",
        price: 85,
        location: "Rock Time Gym",
        date: "Today",
        image: "https://images.unsplash.com/photo-1585950263799-4106e7687d05?w=400&h=400&fit=crop",
        category: 0
      },
      {
        id: 2,
        title: "Friction Labs Chalk Bucket",
        price: 25,
        location: "Peak Gym",
        date: "Yesterday",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        category: 1
      },
      {
        id: 3,
        title: "Black Diamond Momentum Harness",
        price: 55,
        location: "Climber's Paradise",
        date: "2 days ago",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
        category: 3
      },
      {
        id: 4,
        title: "Climbing Brush Set",
        price: 18,
        location: "Rock Time Gym",
        date: "3 days ago",
        image: "https://images.unsplash.com/photo-1626291543912-80491b201013?w=400&h=400&fit=crop",
        category: 1
      },
      {
        id: 5,
        title: "Mammut 60m Rope - 9.8mm",
        price: 150,
        location: "Climber's Paradise",
        date: "4 days ago",
        image: "https://images.unsplash.com/photo-1630246836281-f18e174ce8a9?w=400&h=400&fit=crop",
        category: 3
      },
      {
        id: 6,
        title: "Prana Climbing Pants - M",
        price: 45,
        location: "Peak Gym",
        date: "5 days ago",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop",
        category: 4
      }
    ]);
    const filteredItems = common_vendor.computed(() => {
      if (activeCategory.value === categories.length - 1) {
        return items.value;
      }
      return items.value.filter((item) => item.category === activeCategory.value);
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const viewItem = (item) => {
      common_vendor.index.navigateTo({
        url: "/pages/market-item-detail/market-item-detail?id=" + item.id
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.o(($event) => _ctx.uni.navigateTo({
          url: "/pages/market-item-create/market-item-create"
        })),
        c: common_vendor.f(categories, (category, index, i0) => {
          return {
            a: common_vendor.t(category.icon),
            b: common_vendor.t(category.name),
            c: index,
            d: activeCategory.value === index ? 1 : "",
            e: common_vendor.o(($event) => activeCategory.value = index, index)
          };
        }),
        d: common_vendor.f(filteredItems.value, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.price),
            d: common_vendor.t(item.location),
            e: common_vendor.t(item.date),
            f: index,
            g: common_vendor.o(($event) => viewItem(item), index)
          };
        }),
        e: filteredItems.value.length === 0
      }, filteredItems.value.length === 0 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d5ebafbc"]]);
wx.createPage(MiniProgramPage);
