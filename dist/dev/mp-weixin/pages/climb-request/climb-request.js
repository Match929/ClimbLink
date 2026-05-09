"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_cloud = require("../../utils/cloud.js");
const _sfc_main = {
  __name: "climb-request",
  setup(__props) {
    const formData = common_vendor.ref({
      date: "",
      time: "",
      level: "",
      peopleCount: "1",
      description: "",
      tags: []
    });
    const selectedVenue = common_vendor.ref(null);
    const showTimePicker = common_vendor.ref(false);
    const showVenueModal = common_vendor.ref(false);
    const timeRange = common_vendor.ref({ start: "09:00", end: "12:00" });
    const isEditing = common_vendor.ref(false);
    const editingRequestId = common_vendor.ref(null);
    const today = common_vendor.computed(() => {
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    });
    const levels = [
      "V0-V2 Beginner",
      "V3-V5 Intermediate",
      "V6-V8 Advanced",
      "V9+ Expert"
    ];
    const venues = common_vendor.ref([]);
    const loadVenues = async () => {
      try {
        const data = await utils_cloud.cloud.venue.getVenues();
        venues.value = data.map((venue) => ({
          ...venue,
          id: venue.id || venue._id,
          distance: venue.distance || "Unknown"
        }));
      } catch (err) {
        console.error("加载场馆数据失败:", err);
      }
    };
    const loadRequestData = async (requestId) => {
      try {
        const res = await utils_cloud.cloud.climb.getClimbRequestById(requestId);
        if (res) {
          isEditing.value = true;
          editingRequestId.value = requestId;
          formData.value.date = res.climb_date || "";
          formData.value.level = res.level_requirement || "";
          formData.value.peopleCount = String(res.max_participants || "1");
          formData.value.description = res.description || "";
          formData.value.tags = res.tags || [];
          if (res.climb_time) {
            const timeParts = res.climb_time.split(" - ");
            if (timeParts.length === 2) {
              timeRange.value.start = timeParts[0];
              timeRange.value.end = timeParts[1];
            }
          }
          if (venues.value.length > 0) {
            const venue = venues.value.find((v) => v.id === res.venue_id || v._id === res.venue_id || v.name === res.venue_name);
            if (venue) {
              selectedVenue.value = venue;
            }
          }
        }
      } catch (err) {
        console.error("加载请求数据失败:", err);
      }
    };
    common_vendor.onMounted(() => {
      loadVenues();
      setTimeout(() => {
        const pages = getCurrentPages();
        if (pages.length > 0) {
          const currentPage = pages[pages.length - 1];
          const options = currentPage.options || {};
          if (options.requestId) {
            editingRequestId.value = options.requestId;
            loadVenues().then(() => {
              loadRequestData(options.requestId);
            });
          }
        }
      }, 100);
    });
    const availableTags = [
      { id: "bouldering", name: "Bouldering", icon: "🧗" },
      { id: "ropes", name: "Top Rope", icon: "🪢" },
      { id: "lead", name: "Lead Climbing", icon: "⛓️" },
      { id: "speed", name: "Speed Climbing", icon: "⚡" },
      { id: "beginner", name: "Beginner Friendly", icon: "🆕" },
      { id: "social", name: "Social Climb", icon: "🎉" },
      { id: "training", name: "Training Focus", icon: "💪" },
      { id: "project", name: "Working on Project", icon: "🎯" },
      { id: "relaxed", name: "Relaxed Pace", icon: "😌" },
      { id: "intense", name: "Intense Session", icon: "🔥" }
    ];
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const handlePublish = async () => {
      if (!selectedVenue.value || !formData.value.date || !formData.value.level) {
        common_vendor.index.showToast({
          title: "请填写必填项",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: isEditing.value ? "更新中..." : "发布中..."
      });
      const requestData = {
        venue_id: selectedVenue.value.id,
        venue_name: selectedVenue.value.name,
        climb_date: formData.value.date,
        climb_time: `${timeRange.value.start} - ${timeRange.value.end}`,
        level_requirement: formData.value.level,
        max_participants: parseInt(formData.value.peopleCount),
        description: formData.value.description,
        tags: formData.value.tags
      };
      let result;
      if (isEditing.value && editingRequestId.value) {
        result = await utils_cloud.cloud.climb.updateClimbRequest(editingRequestId.value, requestData);
      } else {
        result = await utils_cloud.cloud.climb.createClimbRequest(requestData);
      }
      common_vendor.index.hideLoading();
      if (result && result.success) {
        common_vendor.index.showToast({
          title: isEditing.value ? "更新成功!" : "发布成功!",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } else {
        common_vendor.index.showToast({
          title: (result == null ? void 0 : result.message) || (isEditing.value ? "更新失败，请重试" : "发布失败，请重试"),
          icon: "none"
        });
      }
    };
    const formatTimeRange = () => {
      if (!timeRange.value.start || !timeRange.value.end) return "Select Time Range";
      return `${timeRange.value.start} - ${timeRange.value.end}`;
    };
    const openVenueModal = () => {
      showVenueModal.value = true;
    };
    const closeVenueModal = () => {
      showVenueModal.value = false;
    };
    const selectVenue = (venue) => {
      selectedVenue.value = venue;
      closeVenueModal();
    };
    const openTimePicker = () => {
      showTimePicker.value = true;
    };
    const closeTimePicker = () => {
      showTimePicker.value = false;
    };
    const confirmTime = () => {
      formData.value.time = `${timeRange.value.start} - ${timeRange.value.end}`;
      closeTimePicker();
    };
    const onDateChange = (e) => {
      formData.value.date = e.detail.value;
    };
    const onStartTimeChange = (e) => {
      timeRange.value.start = e.detail.value;
    };
    const onEndTimeChange = (e) => {
      timeRange.value.end = e.detail.value;
    };
    const selectLevel = (level) => {
      formData.value.level = level;
    };
    const decreasePeople = () => {
      const count = Number(formData.value.peopleCount);
      if (count > 1) {
        formData.value.peopleCount = String(count - 1);
      }
    };
    const increasePeople = () => {
      const count = Number(formData.value.peopleCount);
      if (count < 10) {
        formData.value.peopleCount = String(count + 1);
      }
    };
    const onDescriptionInput = (e) => {
      formData.value.description = e.detail.value;
    };
    const toggleTag = (tagId) => {
      const index = formData.value.tags.indexOf(tagId);
      if (index === -1) {
        formData.value.tags.push(tagId);
      } else {
        formData.value.tags.splice(index, 1);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.t(isEditing.value ? "Edit Request" : "Find Partners"),
        c: common_vendor.t(isEditing.value ? "Update" : "Publish"),
        d: !selectedVenue.value || !formData.value.date || !formData.value.level ? 1 : "",
        e: common_vendor.o(handlePublish),
        f: selectedVenue.value
      }, selectedVenue.value ? common_vendor.e({
        g: common_vendor.t(selectedVenue.value.name),
        h: common_vendor.t(selectedVenue.value.address),
        i: selectedVenue.value.distance
      }, selectedVenue.value.distance ? {
        j: common_vendor.t(selectedVenue.value.distance)
      } : {}, {
        k: common_vendor.o(openVenueModal)
      }) : {
        l: common_vendor.o(openVenueModal)
      }, {
        m: common_vendor.t(formData.value.date || "Select Date"),
        n: !formData.value.date ? 1 : "",
        o: formData.value.date,
        p: today.value,
        q: common_vendor.o(onDateChange),
        r: common_vendor.t(formatTimeRange()),
        s: timeRange.value.start && timeRange.value.end ? 1 : "",
        t: common_vendor.o(openTimePicker),
        v: common_vendor.f(levels, (level, k0, i0) => {
          return {
            a: common_vendor.t(level),
            b: level,
            c: formData.value.level === level ? 1 : "",
            d: common_vendor.o(($event) => selectLevel(level), level)
          };
        }),
        w: common_vendor.o(decreasePeople),
        x: common_vendor.t(formData.value.peopleCount),
        y: common_vendor.o(increasePeople),
        z: common_vendor.f(availableTags, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag.icon),
            b: common_vendor.t(tag.name),
            c: tag.id,
            d: formData.value.tags.includes(tag.id) ? 1 : "",
            e: common_vendor.o(($event) => toggleTag(tag.id), tag.id)
          };
        }),
        A: formData.value.description,
        B: common_vendor.o(onDescriptionInput),
        C: showVenueModal.value
      }, showVenueModal.value ? {
        D: common_vendor.o(closeVenueModal),
        E: common_vendor.f(venues.value, (venue, k0, i0) => {
          var _a, _b;
          return common_vendor.e({
            a: common_vendor.t(venue.name),
            b: common_vendor.t(venue.address),
            c: venue.distance
          }, venue.distance ? {
            d: common_vendor.t(venue.distance)
          } : {}, {
            e: ((_a = selectedVenue.value) == null ? void 0 : _a.id) === venue.id
          }, ((_b = selectedVenue.value) == null ? void 0 : _b.id) === venue.id ? {} : {}, {
            f: venue.id,
            g: common_vendor.o(($event) => selectVenue(venue), venue.id)
          });
        }),
        F: common_vendor.o(() => {
        }),
        G: common_vendor.o(closeVenueModal)
      } : {}, {
        H: showTimePicker.value
      }, showTimePicker.value ? {
        I: common_vendor.o(closeTimePicker),
        J: common_vendor.t(timeRange.value.start || "09:00"),
        K: timeRange.value.start,
        L: common_vendor.o(onStartTimeChange),
        M: common_vendor.t(timeRange.value.end || "12:00"),
        N: timeRange.value.end,
        O: common_vendor.o(onEndTimeChange),
        P: common_vendor.o(confirmTime),
        Q: common_vendor.o(() => {
        }),
        R: common_vendor.o(closeTimePicker)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7a3b424a"]]);
wx.createPage(MiniProgramPage);
