"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_cloud = require("../../utils/cloud.js");
const _sfc_main = {
  __name: "venue-detail",
  setup(__props) {
    const isFavorite = common_vendor.ref(false);
    const activeTab = common_vendor.ref(0);
    const tabs = ["Price", "Facilities", "Events", "Reviews"];
    const isLoading = common_vendor.ref(true);
    const venueInfo = common_vendor.ref({
      _id: "",
      id: "",
      name: "",
      address: "",
      city: "",
      latitude: 31.3089,
      longitude: 120.7294,
      rating: 0,
      review_count: 0,
      images: [],
      tags: [],
      phone: "",
      business_hours: "",
      climbing_level: "",
      difficulty_distribution: [],
      amenities: [],
      equipment_rental: [],
      area_info: {},
      prices: [],
      events: []
    });
    const venueImageUrl = common_vendor.computed(() => {
      console.log("venueInfo.images:", venueInfo.value.images);
      if (venueInfo.value.images && venueInfo.value.images.length > 0) {
        const imgUrl = venueInfo.value.images[0];
        console.log("使用场馆图片:", imgUrl);
        return imgUrl;
      }
      const defaultImg = "https://images.unsplash.com/photo-1721885876144-25863108be60?w=1080&h=600&fit=crop";
      console.log("使用默认图片:", defaultImg);
      return defaultImg;
    });
    const handleImageError = (e) => {
      console.error("图片加载失败:", e);
    };
    const prices = common_vendor.computed(() => {
      return venueInfo.value.prices && venueInfo.value.prices.length > 0 ? venueInfo.value.prices : [
        { type: "Day Pass", price: "¥128", description: "Unlimited daily access" },
        { type: "10-Visit Pass", price: "¥980", description: "Valid for 3 months" },
        { type: "Monthly Pass", price: "¥1,280", description: "30 days unlimited" }
      ];
    });
    const difficultyDistribution = common_vendor.computed(() => {
      return venueInfo.value.difficulty_distribution && venueInfo.value.difficulty_distribution.length > 0 ? venueInfo.value.difficulty_distribution : [
        { level: "V0-V2", count: 18, percentage: 32 },
        { level: "V3-V4", count: 15, percentage: 27 },
        { level: "V5-V6", count: 12, percentage: 21 },
        { level: "V7-V8", count: 8, percentage: 14 },
        { level: "V9-V10", count: 3, percentage: 5 }
      ];
    });
    const amenities = common_vendor.computed(() => {
      return venueInfo.value.amenities && venueInfo.value.amenities.length > 0 ? venueInfo.value.amenities : ["Lockers", "Showers", "Rest Area", "Vending Machines"];
    });
    const equipmentTags = common_vendor.computed(() => {
      return venueInfo.value.equipment_rental && venueInfo.value.equipment_rental.length > 0 ? venueInfo.value.equipment_rental : ["Harness", "Climbing Shoes", "Chalk Bag"];
    });
    const activities = common_vendor.computed(() => {
      return venueInfo.value.events && venueInfo.value.events.length > 0 ? venueInfo.value.events : [
        { title: "Weekend Beginner Class", time: "Sat 2:00 PM", price: "¥168/person", spots: "5 spots left" },
        { title: "Advanced Technique Workshop", time: "Sun 10:00 AM", price: "¥268/person", spots: "3 spots left" }
      ];
    });
    const areaInfo = common_vendor.computed(() => {
      return venueInfo.value.area_info || {
        bouldering: "200㎡",
        ropes: "150㎡"
      };
    });
    const reviews = common_vendor.ref([
      {
        user: "NewClimber",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
        rating: 5,
        date: "2026-03-20",
        content: "Perfect for beginners! Very patient coaches and excellent facilities. Clean and well-maintained.",
        helpful: 12
      },
      {
        user: "VeteranClimber",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user2",
        rating: 5,
        date: "2026-03-18",
        content: "Routes are updated frequently with great difficulty distribution. Always find the perfect challenge. Highly recommend!",
        helpful: 8
      }
    ]);
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const toggleFavorite = () => {
      isFavorite.value = !isFavorite.value;
      common_vendor.index.showToast({
        title: isFavorite.value ? "已收藏" : "已取消收藏",
        icon: "success"
      });
    };
    const openLocation = () => {
      common_vendor.index.openLocation({
        latitude: venueInfo.value.latitude,
        longitude: venueInfo.value.longitude,
        name: venueInfo.value.name,
        address: venueInfo.value.address,
        scale: 18,
        success: () => {
          console.log("打开地图成功");
        },
        fail: (err) => {
          console.error("打开地图失败", err);
          common_vendor.index.showToast({
            title: "打开地图失败",
            icon: "none"
          });
        }
      });
    };
    const loadVenueDetail = async (venueId) => {
      try {
        isLoading.value = true;
        console.log("正在加载场馆详情，场馆ID:", venueId);
        const data = await utils_cloud.cloud.venue.getVenueById(venueId);
        console.log("获取到的场馆数据:", data);
        if (data) {
          venueInfo.value = {
            ...venueInfo.value,
            ...data
          };
          console.log("更新后的 venueInfo:", venueInfo.value);
        }
      } catch (error) {
        console.error("获取场馆详情失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        isLoading.value = false;
      }
    };
    const handleCheckIn = () => {
      common_vendor.index.showToast({
        title: "签到成功！",
        icon: "success"
      });
    };
    const handleFindPartner = () => {
      const venueId = venueInfo.value._id || venueInfo.value.id;
      console.log("跳转到找搭档，场馆ID:", venueId);
      common_vendor.index.navigateTo({
        url: `/pages/smart-partner/smart-partner?venueId=${venueId}`
      });
    };
    common_vendor.ref("");
    common_vendor.onMounted(() => {
      const pages = getCurrentPages();
      let venueId = null;
      if (pages && pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        if (currentPage && currentPage.options) {
          venueId = currentPage.options.id;
        }
      }
      console.log("获取到的参数:", venueId);
      if (venueId) {
        loadVenueDetail(venueId);
      } else {
        console.warn("未获取到场馆 ID，将使用默认场馆");
        loadVenueDetail("venue1");
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isLoading.value
      }, isLoading.value ? {} : {
        b: venueImageUrl.value,
        c: common_vendor.o(handleImageError),
        d: common_vendor.o(goBack),
        e: common_vendor.t(isFavorite.value ? "❤️" : "🤍"),
        f: common_vendor.o(toggleFavorite)
      }, {
        g: !isLoading.value
      }, !isLoading.value ? {
        h: common_vendor.t(venueInfo.value.name || "Rock Time Gym"),
        i: common_vendor.t(venueInfo.value.rating || "4.8"),
        j: common_vendor.t(venueInfo.value.review_count || "234"),
        k: common_vendor.t(venueInfo.value.climbing_level || "V0-V8"),
        l: common_vendor.f(venueInfo.value.tags && venueInfo.value.tags.length > 0 ? venueInfo.value.tags : ["Beginner Friendly", "Well Equipped", "Pro Coaches"], (tag, index, i0) => {
          return {
            a: common_vendor.t(tag),
            b: index
          };
        }),
        m: common_vendor.t(venueInfo.value.address || "328 Xinghu Street, Suzhou Industrial Park"),
        n: common_vendor.o(openLocation),
        o: common_vendor.t(venueInfo.value.phone || "0512-6688-8888"),
        p: common_vendor.t(venueInfo.value.business_hours || "10:00 AM - 10:00 PM")
      } : {}, {
        q: common_vendor.f(tabs, (tab, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab),
            b: activeTab.value === index
          }, activeTab.value === index ? {} : {}, {
            c: index,
            d: activeTab.value === index ? 1 : "",
            e: common_vendor.o(($event) => activeTab.value = index, index)
          });
        }),
        r: activeTab.value === 0
      }, activeTab.value === 0 ? {
        s: common_vendor.f(prices.value, (price, index, i0) => {
          return {
            a: common_vendor.t(price.type),
            b: common_vendor.t(price.description),
            c: common_vendor.t(price.price),
            d: index
          };
        })
      } : {}, {
        t: activeTab.value === 1
      }, activeTab.value === 1 ? common_vendor.e({
        v: common_vendor.f(difficultyDistribution.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.level),
            b: common_vendor.t(item.count),
            c: common_vendor.t(item.percentage),
            d: item.percentage + "%",
            e: index
          };
        }),
        w: areaInfo.value.bouldering
      }, areaInfo.value.bouldering ? {
        x: common_vendor.t(areaInfo.value.bouldering)
      } : {}, {
        y: areaInfo.value.ropes
      }, areaInfo.value.ropes ? {
        z: common_vendor.t(areaInfo.value.ropes)
      } : {}, {
        A: common_vendor.f(equipmentTags.value, (tag, index, i0) => {
          return {
            a: common_vendor.t(tag),
            b: index
          };
        }),
        B: common_vendor.f(amenities.value, (amenity, index, i0) => {
          return {
            a: common_vendor.t(amenity),
            b: index
          };
        })
      }) : {}, {
        C: activeTab.value === 2
      }, activeTab.value === 2 ? {
        D: common_vendor.f(activities.value, (activity, index, i0) => {
          return {
            a: common_vendor.t(activity.title),
            b: common_vendor.t(activity.time),
            c: common_vendor.t(activity.price),
            d: common_vendor.t(activity.spots),
            e: index
          };
        })
      } : {}, {
        E: activeTab.value === 3
      }, activeTab.value === 3 ? {
        F: common_vendor.f(5, (i, k0, i0) => {
          return {
            a: i
          };
        }),
        G: common_vendor.f(reviews.value, (review, index, i0) => {
          return {
            a: review.avatar,
            b: common_vendor.t(review.user),
            c: common_vendor.t(review.date),
            d: common_vendor.f(5, (i, k1, i1) => {
              return {
                a: common_vendor.t(i <= review.rating ? "⭐" : "☆"),
                b: i
              };
            }),
            e: common_vendor.t(review.content),
            f: common_vendor.t(review.helpful),
            g: index
          };
        })
      } : {}, {
        H: common_vendor.o(handleCheckIn),
        I: common_vendor.o(handleFindPartner)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-780cb2e5"]]);
wx.createPage(MiniProgramPage);
