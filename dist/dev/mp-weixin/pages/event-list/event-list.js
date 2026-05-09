"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "event-list",
  setup(__props) {
    const activeFilter = common_vendor.ref(0);
    const filters = ["All", "Climb", "Workout", "Social"];
    const events = common_vendor.ref([
      {
        id: 1,
        title: "Saturday Bouldering Session",
        date: "Sat, 2:00 PM",
        location: "Rock Time Gym",
        image: "https://images.unsplash.com/photo-1585950263799-4106e7687d05?w=800&h=400&fit=crop",
        tag: "Climb",
        level: "V2-V4",
        attendees: [
          { avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex" },
          { avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan" },
          { avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=taylor" },
          { avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=casey" }
        ]
      },
      {
        id: 2,
        title: "Beginner Friendly Top Rope",
        date: "Sun, 10:00 AM",
        location: "Climber's Paradise",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=400&fit=crop",
        tag: "Climb",
        level: "V0-V2",
        attendees: [
          { avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sam" },
          { avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jamie" }
        ]
      },
      {
        id: 3,
        title: "Climber Coffee Meetup",
        date: "Mon, 9:00 AM",
        location: "Cafe Climb",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=400&fit=crop",
        tag: "Social",
        level: "All levels",
        attendees: [
          { avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=riley" },
          { avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=avery" },
          { avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=quinn" },
          { avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=morgan" }
        ]
      }
    ]);
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const goToCreate = () => {
      common_vendor.index.navigateTo({
        url: "/pages/event-create/event-create"
      });
    };
    const goToDetail = () => {
      common_vendor.index.navigateTo({
        url: "/pages/activity-detail/activity-detail"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goBack),
        b: common_vendor.o(goToCreate),
        c: common_vendor.f(filters, (filter, index, i0) => {
          return {
            a: common_vendor.t(filter),
            b: index,
            c: activeFilter.value === index ? 1 : "",
            d: common_vendor.o(($event) => activeFilter.value = index, index)
          };
        }),
        d: common_vendor.f(events.value, (event, index, i0) => {
          return {
            a: event.image,
            b: common_vendor.t(event.tag),
            c: common_vendor.t(event.title),
            d: common_vendor.t(event.date),
            e: common_vendor.t(event.location),
            f: common_vendor.f(event.attendees.slice(0, 3), (attendee, i, i1) => {
              return {
                a: i,
                b: attendee.avatar
              };
            }),
            g: common_vendor.t(event.attendees.length),
            h: common_vendor.t(event.level),
            i: index,
            j: common_vendor.o(goToDetail, index)
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-58fd2ed6"]]);
wx.createPage(MiniProgramPage);
