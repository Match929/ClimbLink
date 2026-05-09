"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_cloud = require("../../utils/cloud.js");
if (!Math) {
  CustomTabBar();
}
const CustomTabBar = () => "../../components/custom-tab-bar/custom-tab-bar.js";
const _sfc_main = {
  __name: "profile",
  setup(__props) {
    const isLoggedIn = common_vendor.ref(false);
    const user = common_vendor.ref({
      name: "Climbing Enthusiast",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=myprofile",
      level: "V1",
      experience: "0 years",
      bio: "Love climbing, enjoy challenges 🧗‍♂️",
      labels: [],
      stats: {
        venues: 0,
        partners: 0,
        activities: 0,
        posts: 0
      }
    });
    const badges = common_vendor.ref([
      { id: 1, name: "Gym Explorer", icon: "🏆", description: "Checked in 10 gyms" },
      { id: 2, name: "Social Butterfly", icon: "👥", description: "Added 20 partners" },
      { id: 3, name: "Advanced Climber", icon: "📈", description: "Completed V5 routes" },
      { id: 4, name: "Active Member", icon: "⭐", description: "Joined 30 events" }
    ]);
    const recentActivities = common_vendor.ref([
      {
        id: 1,
        type: "climb",
        title: "Completed V4 Red Route",
        venue: "Rock Time Gym",
        date: "2026-03-22"
      },
      {
        id: 2,
        type: "match",
        title: "Climbed with Lee",
        venue: "Climber's Paradise",
        date: "2026-03-20"
      },
      {
        id: 3,
        type: "checkin",
        title: "Checked in Peak Climbing Center",
        venue: "Peak Climbing Center",
        date: "2026-03-18"
      }
    ]);
    const menuItems = common_vendor.ref([
      {
        section: "My Activities",
        items: [
          { icon: "📅", label: "My Climb Dates", badge: 3 },
          { icon: "❤️", label: "Favorite Gyms", badge: 0 },
          { icon: "👥", label: "My Partners", badge: 0 },
          { icon: "🏆", label: "Achievement Badges", badge: 4 }
        ]
      },
      {
        section: "Data Statistics",
        items: [
          { icon: "🎯", label: "Training Goals" },
          { icon: "⭐", label: "Skill Assessment" }
        ]
      },
      {
        section: "Settings",
        items: [
          { icon: "⚙️", label: "Account Settings" }
        ]
      }
    ]);
    const loadUserData = async () => {
      try {
        const userId = common_vendor.index.getStorageSync("userId");
        if (!userId) {
          console.log("用户未登录");
          isLoggedIn.value = false;
          user.value = {
            name: "Please Login",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guest",
            level: "V0",
            experience: "0 years",
            bio: "Log in to start your climbing journey!",
            labels: [],
            stats: {
              venues: 0,
              partners: 0,
              activities: 0,
              posts: 0
            }
          };
          return;
        }
        isLoggedIn.value = true;
        const userData = await utils_cloud.cloud.user.getCurrentUser();
        if (userData) {
          user.value.name = userData.name || "Climbing Enthusiast";
          user.value.level = userData.climbing_level || "V1";
          user.value.bio = userData.bio || "Love climbing, enjoy challenges 🧗‍♂️";
          user.value.avatar = utils_cloud.cloud.getAvatarUrl(userData.avatar, userId);
          user.value.labels = userData.labels || [];
          if (userData.created_at) {
            const createdDate = new Date(userData.created_at);
            const now = /* @__PURE__ */ new Date();
            const diffYears = (now - createdDate) / (1e3 * 60 * 60 * 24 * 365);
            user.value.experience = diffYears.toFixed(1) + " years";
          }
        }
        const stats = await utils_cloud.cloud.user.getUserStats(userId);
        if (stats) {
          user.value.stats = {
            venues: stats.venues || 0,
            partners: stats.partners || 0,
            activities: stats.activities || 0,
            posts: stats.posts || 0
          };
        }
      } catch (err) {
        console.error("加载用户数据失败:", err);
      }
    };
    const goToLogin = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    };
    function navigateToPage(path) {
      try {
        common_vendor.index.navigateTo({
          url: path
        });
      } catch (error) {
        console.error("Navigation error:", error);
        common_vendor.index.showToast({
          title: "Page coming soon",
          icon: "none"
        });
      }
    }
    function handleMenuItemClick(item) {
      if (item.path) {
        navigateToPage(item.path);
      } else {
        common_vendor.index.showToast({
          title: "Feature coming soon",
          icon: "none"
        });
      }
    }
    const handleLogout = () => {
      common_vendor.index.showModal({
        title: "Confirm Logout",
        content: "Are you sure you want to logout?",
        confirmText: "Logout",
        cancelText: "Cancel",
        confirmColor: "#ef4444",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("userId");
            common_vendor.index.removeStorageSync("userInfo");
            loadUserData();
            common_vendor.index.showToast({
              title: "Logged out successfully",
              icon: "success"
            });
          }
        }
      });
    };
    common_vendor.onMounted(() => {
      loadUserData();
    });
    common_vendor.onShow(() => {
      loadUserData();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isLoggedIn.value
      }, isLoggedIn.value ? {} : {}, {
        b: user.value.avatar,
        c: isLoggedIn.value
      }, isLoggedIn.value ? {
        d: common_vendor.t(user.value.level)
      } : {}, {
        e: !isLoggedIn.value
      }, !isLoggedIn.value ? {
        f: common_vendor.o(goToLogin)
      } : {}, {
        g: common_vendor.t(user.value.name),
        h: common_vendor.t(user.value.bio),
        i: isLoggedIn.value
      }, isLoggedIn.value ? {
        j: common_vendor.t(user.value.experience)
      } : {}, {
        k: isLoggedIn.value && user.value.labels && user.value.labels.length > 0
      }, isLoggedIn.value && user.value.labels && user.value.labels.length > 0 ? {
        l: common_vendor.f(user.value.labels, (label, index, i0) => {
          return {
            a: common_vendor.t(label),
            b: index
          };
        })
      } : {}, {
        m: isLoggedIn.value
      }, isLoggedIn.value ? {
        n: common_vendor.t(user.value.stats.venues),
        o: common_vendor.t(user.value.stats.partners),
        p: common_vendor.t(user.value.stats.activities),
        q: common_vendor.t(user.value.stats.posts)
      } : {}, {
        r: isLoggedIn.value
      }, isLoggedIn.value ? {
        s: common_vendor.o(($event) => navigateToPage("/pages/edit-profile/edit-profile"))
      } : {}, {
        t: isLoggedIn.value
      }, isLoggedIn.value ? {
        v: common_vendor.t(badges.value.length),
        w: common_vendor.f(badges.value, (badge, k0, i0) => {
          return {
            a: common_vendor.t(badge.icon),
            b: common_vendor.t(badge.name),
            c: badge.id
          };
        })
      } : {}, {
        x: isLoggedIn.value
      }, isLoggedIn.value ? {
        y: common_vendor.t(user.value.stats.activities),
        z: common_vendor.o(($event) => navigateToPage("/pages/climb-records/climb-records"))
      } : {}, {
        A: isLoggedIn.value
      }, isLoggedIn.value ? {
        B: common_vendor.f(recentActivities.value, (activity, k0, i0) => {
          return common_vendor.e({
            a: activity.type === "climb"
          }, activity.type === "climb" ? {} : activity.type === "match" ? {} : {}, {
            b: activity.type === "match",
            c: common_vendor.t(activity.title),
            d: common_vendor.t(activity.venue),
            e: common_vendor.t(activity.date),
            f: activity.id
          });
        })
      } : {}, {
        C: isLoggedIn.value
      }, isLoggedIn.value ? {
        D: common_vendor.f(menuItems.value, (section, k0, i0) => {
          return {
            a: common_vendor.t(section.section),
            b: common_vendor.f(section.items, (item, k1, i1) => {
              return common_vendor.e({
                a: common_vendor.t(item.icon),
                b: common_vendor.t(item.label),
                c: item.badge !== void 0 && item.badge > 0
              }, item.badge !== void 0 && item.badge > 0 ? {
                d: common_vendor.t(item.badge)
              } : {}, {
                e: item.label,
                f: common_vendor.o(($event) => handleMenuItemClick(item), item.label)
              });
            }),
            c: section.section
          };
        })
      } : {}, {
        E: isLoggedIn.value
      }, isLoggedIn.value ? {
        F: common_vendor.o(handleLogout)
      } : {}, {
        G: common_vendor.p({
          currentPath: "pages/profile/profile"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-04d37cba"]]);
wx.createPage(MiniProgramPage);
