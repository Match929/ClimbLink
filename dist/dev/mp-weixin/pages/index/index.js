"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_cloud = require("../../utils/cloud.js");
if (!Math) {
  CustomTabBar();
}
const CustomTabBar = () => "../../components/custom-tab-bar/custom-tab-bar.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const activeTab = common_vendor.ref("Beginner");
    const isLoading = common_vendor.ref(false);
    const userAvatar = common_vendor.ref("");
    const userInitial = common_vendor.ref("C");
    const tabs = [
      { id: "Beginner", icon: "📖" },
      { id: "Advanced", icon: "📈" },
      { id: "Market", icon: "🗺️" },
      { id: "Smart Partner", icon: "👥" }
    ];
    const activities = [
      {
        id: 1,
        title: "Weekend Beginner Session",
        venue: "Rock Time Gym",
        time: "Sat 2:00 PM",
        participants: 8,
        maxParticipants: 12,
        level: "V0-V2",
        tag: "Beginner Friendly",
        image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
        price: "Free"
      },
      {
        id: 2,
        title: "Intermediate Training",
        venue: "Climber's Paradise",
        time: "Sun 10:00 AM",
        participants: 5,
        maxParticipants: 8,
        level: "V3-V5",
        tag: "Coach Guided",
        image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
        price: "$15"
      },
      {
        id: 3,
        title: "Spring Climbing Competition",
        venue: "Peak Climbing Center",
        time: "Mar 30, 9:00 AM",
        participants: 12,
        maxParticipants: 20,
        level: "V4-V7",
        tag: "Competition",
        image: "https://images.unsplash.com/photo-1731176116069-86205f376088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
        price: "$20"
      }
    ];
    const venues = common_vendor.ref([]);
    const transformVenueData = (venue, index) => {
      let priceDisplay = "¥18/visit";
      if (venue.prices && venue.prices.length > 0) {
        priceDisplay = venue.prices[0].price;
      }
      const distances = ["1.2km", "2.5km", "3.8km"];
      const crowds = ["Moderate", "Relaxed", "Busy"];
      return {
        _id: venue._id || venue.id,
        id: venue._id || venue.id,
        name: venue.name,
        image: venue.images && venue.images.length > 0 ? venue.images[0] : "",
        distance: distances[index] || "2.0km",
        rating: venue.rating || 4.5,
        reviews: venue.review_count || 100,
        price: priceDisplay,
        tags: venue.tags && venue.tags.slice(0, 2) || [],
        difficulty: venue.climbing_level || "V0-V8",
        crowd: crowds[index] || "Moderate"
      };
    };
    const getCrowdText = (crowd) => {
      if (crowd === "Moderate") return "🟢 Moderate";
      if (crowd === "Relaxed") return "🟢 Relaxed";
      if (crowd === "Busy") return "🔴 Busy";
      return crowd;
    };
    const loadUserInfo = () => {
      common_vendor.index.getStorageSync("userId");
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        userAvatar.value = userInfo.avatar || "";
        if (userInfo.name) {
          userInitial.value = userInfo.name.charAt(0).toUpperCase();
        }
      } else {
        userAvatar.value = "";
        userInitial.value = "C";
      }
    };
    const handleTabClick = (tab) => {
      activeTab.value = tab.id;
      if (tab.id === "Beginner") {
        navigateTo("/pages/beginner-guide/beginner-guide");
      }
    };
    const navigateTo = (url) => {
      common_vendor.index.navigateTo({
        url,
        fail: (err) => {
          console.error("Navigation failed:", err);
        }
      });
    };
    const navigateToVenueDetail = (venue) => {
      const venueId = venue._id || venue.id;
      console.log("点击场馆，ID:", venueId);
      common_vendor.index.navigateTo({
        url: `/pages/venue-detail/venue-detail?id=${venueId}`,
        fail: (err) => {
          console.error("导航失败:", err);
        }
      });
    };
    const loadVenues = async () => {
      try {
        isLoading.value = true;
        const data = await utils_cloud.cloud.venue.getVenues({}, 3);
        console.log("加载到的场馆数据:", data);
        venues.value = data.map((venue, index) => transformVenueData(venue, index));
      } catch (error) {
        console.error("加载场馆失败:", error);
      } finally {
        isLoading.value = false;
      }
    };
    common_vendor.onMounted(() => {
      loadVenues();
      loadUserInfo();
    });
    common_vendor.onShow(() => {
      loadUserInfo();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userAvatar.value
      }, userAvatar.value ? {
        b: userAvatar.value
      } : {
        c: common_vendor.t(userInitial.value)
      }, {
        d: common_vendor.o(($event) => navigateTo("/pages/profile/profile")),
        e: common_vendor.o(($event) => navigateTo("/pages/blindbox/blindbox")),
        f: common_vendor.o(($event) => navigateTo("/pages/event-list/event-list")),
        g: common_vendor.f(activities, (activity, k0, i0) => {
          return {
            a: activity.image,
            b: common_vendor.t(activity.price),
            c: common_vendor.t(activity.tag),
            d: common_vendor.t(activity.title),
            e: common_vendor.t(activity.venue),
            f: common_vendor.t(activity.time),
            g: activity.id,
            h: common_vendor.o(($event) => navigateTo("/pages/activity-detail/activity-detail"), activity.id)
          };
        }),
        h: common_vendor.f(tabs, (tab, k0, i0) => {
          return {
            a: common_vendor.t(tab.icon),
            b: common_vendor.t(tab.id),
            c: common_vendor.n(activeTab.value === tab.id ? "active" : ""),
            d: tab.id,
            e: common_vendor.o(($event) => handleTabClick(tab), tab.id)
          };
        }),
        i: activeTab.value === "Market"
      }, activeTab.value === "Market" ? {
        j: common_vendor.o(($event) => navigateTo("/pages/market/market"))
      } : {}, {
        k: activeTab.value === "Smart Partner"
      }, activeTab.value === "Smart Partner" ? {
        l: common_vendor.o(($event) => navigateTo("/pages/smart-partner/smart-partner"))
      } : {}, {
        m: common_vendor.o(($event) => navigateTo("/pages/venues/venues")),
        n: common_vendor.f(venues.value, (venue, k0, i0) => {
          return {
            a: venue.image,
            b: common_vendor.t(getCrowdText(venue.crowd)),
            c: common_vendor.t(venue.name),
            d: common_vendor.t(venue.rating),
            e: common_vendor.t(venue.reviews),
            f: common_vendor.t(venue.distance),
            g: common_vendor.t(venue.price),
            h: common_vendor.t(venue.difficulty),
            i: common_vendor.f(venue.tags, (tag, k1, i1) => {
              return {
                a: common_vendor.t(tag),
                b: tag
              };
            }),
            j: venue.id,
            k: common_vendor.o(($event) => navigateToVenueDetail(venue), venue.id)
          };
        }),
        o: common_vendor.p({
          currentPath: "pages/index/index"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-83a5a03c"]]);
wx.createPage(MiniProgramPage);
