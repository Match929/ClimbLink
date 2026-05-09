"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "activity-detail",
  setup(__props) {
    const isFavorite = common_vendor.ref(false);
    const activity = common_vendor.ref({
      id: 1,
      title: "Weekend Beginner Bouldering Class",
      type: "Beginner",
      level: "V0-V2",
      image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800",
      location: "Rock Time Gym, 328 Xinghu St",
      date: "Saturday, March 28, 2026",
      time: "2:00 PM - 4:00 PM",
      currentParticipants: 8,
      maxParticipants: 12,
      price: "$25 per person",
      description: "Join us for a fun and educational bouldering session perfect for beginners! Learn basic techniques, safety rules, and how to read routes with our experienced coaches. No prior experience needed.",
      equipment: ["Climbing shoes", "Chalk bag", "Comfortable clothing", "Water bottle"],
      organizer: {
        name: "Rock Time Coaches",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=coaches"
      },
      participants: [
        { name: "Xiao Ming", level: "V0", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ming" },
        { name: "Hong", level: "V1", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hong" },
        { name: "Li", level: "V1", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=li" },
        { name: "Wang", level: "V2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wang" },
        { name: "Zhang", level: "V0", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhang" },
        { name: "Chen", level: "V1", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chen" },
        { name: "Liu", level: "V2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=liu" },
        { name: "Zhou", level: "V0", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhou" }
      ]
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const toggleFavorite = () => {
      isFavorite.value = !isFavorite.value;
    };
    const handleJoin = () => {
      common_vendor.index.showToast({
        title: "Joined successfully!",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    };
    return (_ctx, _cache) => {
      return {
        a: activity.value.image,
        b: common_vendor.o(goBack),
        c: common_vendor.t(isFavorite.value ? "❤️" : "🤍"),
        d: common_vendor.o(toggleFavorite),
        e: common_vendor.t(activity.value.title),
        f: common_vendor.t(activity.value.type),
        g: common_vendor.t(activity.value.level),
        h: activity.value.organizer.avatar,
        i: common_vendor.t(activity.value.organizer.name),
        j: common_vendor.t(activity.value.location),
        k: common_vendor.t(activity.value.date),
        l: common_vendor.t(activity.value.time),
        m: common_vendor.t(activity.value.currentParticipants),
        n: common_vendor.t(activity.value.maxParticipants),
        o: common_vendor.t(activity.value.price),
        p: common_vendor.t(activity.value.description),
        q: common_vendor.f(activity.value.equipment, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        r: common_vendor.t(activity.value.currentParticipants),
        s: common_vendor.f(activity.value.participants, (participant, index, i0) => {
          return {
            a: participant.avatar,
            b: common_vendor.t(participant.name),
            c: common_vendor.t(participant.level),
            d: index
          };
        }),
        t: common_vendor.t(activity.value.price),
        v: common_vendor.o(handleJoin)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-47f02b22"]]);
wx.createPage(MiniProgramPage);
