"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "climb-records",
  setup(__props) {
    const selectedTab = common_vendor.ref("checkins");
    const tabs = [
      { value: "checkins", label: "Check-ins" },
      { value: "routes", label: "Routes" },
      { value: "stats", label: "Statistics" }
    ];
    const checkins = [
      {
        id: 1,
        venue: "Rock Time Gym",
        date: "2026-04-18",
        time: "14:30",
        duration: "2h 30m",
        image: "https://images.unsplash.com/photo-1721885876144-25863108be60?w=400"
      },
      {
        id: 2,
        venue: "Climber's Paradise",
        date: "2026-04-15",
        time: "10:00",
        duration: "3h 15m",
        image: "https://images.unsplash.com/photo-1659666287295-7da26c3f80d4?w=400"
      },
      {
        id: 3,
        venue: "Peak Climbing Center",
        date: "2026-04-12",
        time: "18:00",
        duration: "2h 00m",
        image: "https://images.unsplash.com/photo-1731176116069-86205f376088?w=400"
      }
    ];
    const routes = [
      {
        id: 1,
        name: "Red Dragon",
        grade: "V4",
        color: "red",
        venue: "Rock Time Gym",
        date: "2026-04-18",
        attempts: 3,
        completed: true
      },
      {
        id: 2,
        name: "Blue Steel",
        grade: "V5",
        color: "blue",
        venue: "Climber's Paradise",
        date: "2026-04-15",
        attempts: 5,
        completed: true
      },
      {
        id: 3,
        name: "Green Giant",
        grade: "V6",
        color: "green",
        venue: "Peak Climbing Center",
        date: "2026-04-12",
        attempts: 8,
        completed: false
      },
      {
        id: 4,
        name: "Yellow Flash",
        grade: "V3",
        color: "yellow",
        venue: "Rock Time Gym",
        date: "2026-04-10",
        attempts: 2,
        completed: true
      }
    ];
    const stats = {
      totalCheckins: 45,
      totalHours: 127,
      routesCompleted: 89,
      currentStreak: 7,
      longestStreak: 14,
      favoriteVenue: "Rock Time Gym",
      averageGrade: "V4.2",
      monthlyProgress: [
        { month: "Jan", routes: 18 },
        { month: "Feb", routes: 22 },
        { month: "Mar", routes: 25 },
        { month: "Apr", routes: 24 }
      ],
      gradeDistribution: [
        { grade: "V0-V2", count: 15 },
        { grade: "V3-V5", count: 48 },
        { grade: "V6-V8", count: 22 },
        { grade: "V9+", count: 4 }
      ]
    };
    const getColorClass = (color) => {
      const colors = {
        red: "red",
        blue: "blue",
        green: "green",
        yellow: "yellow",
        purple: "purple",
        orange: "orange",
        pink: "pink"
      };
      return colors[color] || "gray";
    };
    const getBarHeight = (routes2) => {
      const maxRoutes = Math.max(...stats.monthlyProgress.map((m) => m.routes));
      return routes2 / maxRoutes * 100;
    };
    const getGradeWidth = (count) => {
      const maxCount = Math.max(...stats.gradeDistribution.map((g) => g.count));
      return count / maxCount * 100;
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.t(stats.totalCheckins),
        c: common_vendor.t(stats.totalHours),
        d: common_vendor.t(stats.routesCompleted),
        e: common_vendor.t(stats.currentStreak),
        f: common_vendor.f(tabs, (tab, k0, i0) => {
          return {
            a: common_vendor.t(tab.label),
            b: selectedTab.value === tab.value ? 1 : "",
            c: tab.value,
            d: selectedTab.value === tab.value ? 1 : "",
            e: common_vendor.o(($event) => selectedTab.value = tab.value, tab.value)
          };
        }),
        g: selectedTab.value === "checkins"
      }, selectedTab.value === "checkins" ? {
        h: common_vendor.f(checkins, (checkin, k0, i0) => {
          return {
            a: checkin.image,
            b: common_vendor.t(checkin.venue),
            c: common_vendor.t(checkin.date),
            d: common_vendor.t(checkin.time),
            e: common_vendor.t(checkin.duration),
            f: checkin.id
          };
        })
      } : {}, {
        i: selectedTab.value === "routes"
      }, selectedTab.value === "routes" ? {
        j: common_vendor.f(routes, (route, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(route.grade),
            b: common_vendor.n(getColorClass(route.color)),
            c: common_vendor.t(route.name),
            d: common_vendor.t(route.venue),
            e: route.completed
          }, route.completed ? {} : {}, {
            f: common_vendor.t(route.attempts),
            g: common_vendor.t(route.date),
            h: common_vendor.t(route.completed ? "Completed" : "In Progress"),
            i: common_vendor.n(route.completed ? "completed" : "in-progress"),
            j: route.id
          });
        })
      } : {}, {
        k: selectedTab.value === "stats"
      }, selectedTab.value === "stats" ? {
        l: common_vendor.f(stats.monthlyProgress, (month, index, i0) => {
          return {
            a: common_vendor.t(month.routes),
            b: getBarHeight(month.routes) + "%",
            c: common_vendor.t(month.month),
            d: index
          };
        }),
        m: common_vendor.f(stats.gradeDistribution, (item, index, i0) => {
          return {
            a: common_vendor.t(item.grade),
            b: common_vendor.t(item.count),
            c: getGradeWidth(item.count) + "%",
            d: index
          };
        }),
        n: common_vendor.t(stats.longestStreak),
        o: common_vendor.t(stats.averageGrade),
        p: common_vendor.t(stats.favoriteVenue)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-84b51522"]]);
wx.createPage(MiniProgramPage);
