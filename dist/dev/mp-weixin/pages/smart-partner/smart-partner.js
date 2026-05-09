"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_cloud = require("../../utils/cloud.js");
const _sfc_main = {
  __name: "smart-partner",
  setup(__props) {
    const searchQuery = common_vendor.ref("");
    const selectedLevel = common_vendor.ref("all");
    const showSmartMatch = common_vendor.ref(false);
    const selectedTags = common_vendor.ref([]);
    const climbRequests = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const smartMatchingLoading = common_vendor.ref(false);
    const matchedRequests = common_vendor.ref([]);
    const currentVenueId = common_vendor.ref("");
    const currentVenue = common_vendor.ref(null);
    const showTimePicker = common_vendor.ref(false);
    const selectedTimeType = common_vendor.ref("any");
    const selectedQuickTime = common_vendor.ref("morning");
    const customStartTime = common_vendor.ref("09:00");
    const customEndTime = common_vendor.ref("18:00");
    const savedTimeSelection = common_vendor.ref({
      type: "any",
      quickTime: "morning",
      startTime: "09:00",
      endTime: "18:00"
    });
    const levels = [
      { value: "all", label: "All Levels (Use My Level)" },
      { value: "V0", label: "L1 (V0)" },
      { value: "V1-V2", label: "L2 (V1-V2)" },
      { value: "V3-V4", label: "L3 (V3-V4)" },
      { value: "V5-V6", label: "L4 (V5-V6)" },
      { value: "V7-V8", label: "L5 (V7-V8)" },
      { value: "V9+", label: "L6 (V9+)" }
    ];
    const quickTimeOptions = [
      { value: "morning", label: "Morning (6-12)" },
      { value: "afternoon", label: "Afternoon (12-18)" },
      { value: "evening", label: "Evening (18-22)" },
      { value: "night", label: "Night (22-6)" }
    ];
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
    const tagNames = {
      "bouldering": "Bouldering",
      "ropes": "Top Rope",
      "lead": "Lead Climbing",
      "speed": "Speed Climbing",
      "beginner": "Beginner Friendly",
      "social": "Social Climb",
      "training": "Training Focus",
      "project": "Working on Project",
      "relaxed": "Relaxed Pace",
      "intense": "Intense Session"
    };
    const getUserAvatar = (request) => {
      var _a;
      return utils_cloud.cloud.getAvatarUrl((_a = request.user) == null ? void 0 : _a.avatar, request.user_id);
    };
    const getTimeDisplayText = () => {
      const sel = savedTimeSelection.value;
      if (sel.type === "any") {
        return "Any Time";
      } else if (sel.type === "quick") {
        const option = quickTimeOptions.find((t) => t.value === sel.quickTime);
        return option ? option.label : "Any Time";
      } else {
        return `${sel.startTime} - ${sel.endTime}`;
      }
    };
    const selectAnyTime = () => {
      selectedTimeType.value = "any";
    };
    const selectQuickTime = (value) => {
      selectedTimeType.value = "quick";
      selectedQuickTime.value = value;
    };
    const selectCustomTime = () => {
      selectedTimeType.value = "custom";
    };
    const onStartTimeChange = (e) => {
      customStartTime.value = e.detail.value;
    };
    const onEndTimeChange = (e) => {
      customEndTime.value = e.detail.value;
    };
    const confirmTimeSelection = () => {
      savedTimeSelection.value = {
        type: selectedTimeType.value,
        quickTime: selectedQuickTime.value,
        startTime: customStartTime.value,
        endTime: customEndTime.value
      };
      showTimePicker.value = false;
      if (showSmartMatch.value) {
        computeSmartMatch();
      }
    };
    const matchesTime = (request, timeSelection) => {
      if (!timeSelection || timeSelection.type === "any") return true;
      const timeStr = request.climb_time || "";
      const requestMinutes = parseTimeToMinutes(timeStr);
      if (timeSelection.type === "quick") {
        return matchesQuickTime(requestMinutes, timeSelection.quickTime);
      } else if (timeSelection.type === "custom") {
        const startMinutes = parseTimeToMinutes(timeSelection.startTime);
        const endMinutes = parseTimeToMinutes(timeSelection.endTime);
        return matchesCustomTime(requestMinutes, startMinutes, endMinutes);
      }
      return true;
    };
    const parseTimeToMinutes = (timeStr) => {
      if (!timeStr) return null;
      const match = timeStr.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        return parseInt(match[1]) * 60 + parseInt(match[2]);
      }
      return null;
    };
    const matchesQuickTime = (minutes, quickType) => {
      if (minutes === null) return false;
      switch (quickType) {
        case "morning":
          return minutes >= 6 * 60 && minutes < 12 * 60;
        case "afternoon":
          return minutes >= 12 * 60 && minutes < 18 * 60;
        case "evening":
          return minutes >= 18 * 60 && minutes < 22 * 60;
        case "night":
          return minutes >= 22 * 60 || minutes < 6 * 60;
      }
      return false;
    };
    const matchesCustomTime = (minutes, startMinutes, endMinutes) => {
      if (minutes === null) return false;
      if (startMinutes <= endMinutes) {
        return minutes >= startMinutes && minutes <= endMinutes;
      } else {
        return minutes >= startMinutes || minutes <= endMinutes;
      }
    };
    const getTimeMatchInfo = () => {
      const sel = savedTimeSelection.value;
      if (sel.type === "any") {
        return { any: true };
      } else if (sel.type === "quick") {
        switch (sel.quickTime) {
          case "morning":
            return { any: false, start: "06:00", end: "12:00" };
          case "afternoon":
            return { any: false, start: "12:00", end: "18:00" };
          case "evening":
            return { any: false, start: "18:00", end: "22:00" };
          case "night":
            return { any: false, start: "22:00", end: "06:00" };
        }
      } else {
        return { any: false, start: sel.startTime, end: sel.endTime };
      }
      return { any: true };
    };
    const loadVenueInfo = async (venueId) => {
      try {
        console.log("加载场馆信息，ID:", venueId);
        const venue = await utils_cloud.cloud.venue.getVenueById(venueId);
        if (venue) {
          currentVenue.value = {
            ...venue,
            id: venue._id || venue.id
          };
          console.log("加载到的场馆:", currentVenue.value);
          if (venue.tags && venue.tags.length > 0) {
            const supportedTags = venue.tags.filter(
              (tag) => availableTags.some((availableTag) => availableTag.id === tag)
            );
            selectedTags.value = supportedTags;
          }
        } else {
          console.warn("未找到场馆信息，ID:", venueId);
        }
      } catch (err) {
        console.error("加载场馆信息失败:", err);
      }
    };
    const loadClimbRequests = async () => {
      loading.value = true;
      try {
        const requests = await utils_cloud.cloud.climb.getClimbRequests();
        climbRequests.value = requests;
      } catch (err) {
        console.error("加载约爬请求失败:", err);
      } finally {
        loading.value = false;
      }
    };
    const computeSmartMatch = async () => {
      if (!showSmartMatch.value) {
        matchedRequests.value = [];
        return;
      }
      smartMatchingLoading.value = true;
      try {
        const timeInfo = getTimeMatchInfo();
        const anyTime = timeInfo.any;
        const overrideLevel = selectedLevel.value === "all" ? null : selectedLevel.value;
        const myRequest = {
          climb_time: timeInfo.any ? null : `${timeInfo.start} - ${timeInfo.end}`,
          tags: selectedTags.value.length > 0 ? selectedTags.value : null
        };
        const results = await utils_cloud.cloud.smartMatch.smartMatchRequests(
          climbRequests.value,
          myRequest,
          anyTime,
          overrideLevel
        );
        matchedRequests.value = results;
      } catch (err) {
        console.error("智能匹配失败:", err);
      } finally {
        smartMatchingLoading.value = false;
      }
    };
    common_vendor.onMounted(() => {
      let venueId = null;
      try {
        const pages = getCurrentPages();
        if (pages && pages.length > 0) {
          const currentPage = pages[pages.length - 1];
          if (currentPage && currentPage.options) {
            venueId = currentPage.options.venueId;
          }
        }
      } catch (err) {
        console.error("获取参数失败:", err);
      }
      console.log("Smart Partner 获取到的 venueId:", venueId);
      if (venueId) {
        currentVenueId.value = venueId;
        loadVenueInfo(venueId);
      }
      loadClimbRequests();
    });
    common_vendor.watch(showSmartMatch, (newVal) => {
      if (newVal && climbRequests.value.length > 0) {
        computeSmartMatch();
      }
    });
    common_vendor.watch(selectedLevel, () => {
      if (showSmartMatch.value) {
        computeSmartMatch();
      }
    });
    common_vendor.watch(selectedTags, () => {
      if (showSmartMatch.value) {
        computeSmartMatch();
      }
    }, { deep: true });
    common_vendor.watch(climbRequests, () => {
      if (showSmartMatch.value) {
        computeSmartMatch();
      }
    });
    const filteredRequests = common_vendor.computed(() => {
      let requests = climbRequests.value;
      if (showSmartMatch.value) {
        requests = matchedRequests.value;
      }
      return requests.filter((request) => {
        var _a, _b, _c;
        let matchesLevel;
        if (showSmartMatch.value) {
          matchesLevel = true;
        } else {
          matchesLevel = selectedLevel.value === "all" || request.level_requirement === selectedLevel.value;
        }
        const matchesTimeVal = showSmartMatch.value ? true : matchesTime(request, savedTimeSelection.value);
        const matchesTags = showSmartMatch.value ? true : selectedTags.value.length === 0 || selectedTags.value.every((tag) => (request.tags || []).includes(tag));
        const matchesSearch = searchQuery.value === "" || ((_b = (_a = request.user) == null ? void 0 : _a.name) == null ? void 0 : _b.toLowerCase().includes(searchQuery.value.toLowerCase())) || ((_c = request.venue_name) == null ? void 0 : _c.toLowerCase().includes(searchQuery.value.toLowerCase()));
        return matchesLevel && matchesTimeVal && matchesTags && matchesSearch;
      });
    });
    const displayRequests = common_vendor.computed(() => {
      if (showSmartMatch.value) {
        return filteredRequests.value;
      }
      return filteredRequests.value;
    });
    const onSearchInput = (e) => {
      searchQuery.value = e.detail.value;
    };
    const selectLevel = (level) => {
      selectedLevel.value = level;
      if (showSmartMatch.value) {
        computeSmartMatch();
      }
    };
    const toggleTag = (tag) => {
      const idx = selectedTags.value.indexOf(tag);
      if (idx > -1) {
        selectedTags.value.splice(idx, 1);
      } else {
        selectedTags.value.push(tag);
      }
      if (showSmartMatch.value) {
        computeSmartMatch();
      }
    };
    const toggleSmartMatch = () => {
      showSmartMatch.value = !showSmartMatch.value;
    };
    const handleRequestToJoin = async (request) => {
      common_vendor.index.showLoading({
        title: "申请中..."
      });
      const applyResult = await utils_cloud.cloud.climb.applyJoinRequest(request._id);
      if (!applyResult || !applyResult.success) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: (applyResult == null ? void 0 : applyResult.message) || "申请失败，请重试",
          icon: "none"
        });
        return;
      }
      const conversation = await utils_cloud.cloud.chat.getOrCreateSingleConversation(request.user_id);
      common_vendor.index.hideLoading();
      if (!conversation) {
        common_vendor.index.showToast({
          title: "会话创建失败",
          icon: "none"
        });
        return;
      }
      const messageContent = `我想申请加入你的约爬请求！`;
      const extra = {
        type: "climb_request_card",
        requestId: request._id,
        venueName: request.venue_name,
        climbDate: request.climb_date,
        climbTime: request.climb_time,
        levelRequirement: request.level_requirement,
        maxParticipants: request.max_participants || 4,
        tags: request.tags || []
      };
      await utils_cloud.cloud.chat.sendMessage(conversation._id, messageContent, "climb_request", extra);
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?conversationId=${conversation._id}&otherUserId=${request.user_id}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: currentVenue.value
      }, currentVenue.value ? {
        b: common_vendor.t(currentVenue.value.name)
      } : {}, {
        c: searchQuery.value,
        d: common_vendor.o(onSearchInput),
        e: showSmartMatch.value ? 1 : "",
        f: common_vendor.t(showSmartMatch.value ? "Enabled - Showing best matches" : "Click to enable smart sorting"),
        g: showSmartMatch.value ? 1 : "",
        h: showSmartMatch.value ? 1 : "",
        i: showSmartMatch.value ? 1 : "",
        j: showSmartMatch.value ? 1 : "",
        k: common_vendor.o(toggleSmartMatch),
        l: common_vendor.f(levels, (level, index, i0) => {
          return {
            a: common_vendor.t(level.label),
            b: index,
            c: selectedLevel.value === level.value ? 1 : "",
            d: common_vendor.o(($event) => selectLevel(level.value), index)
          };
        }),
        m: common_vendor.t(getTimeDisplayText()),
        n: common_vendor.o(($event) => showTimePicker.value = true),
        o: common_vendor.f(availableTags, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag.icon),
            b: common_vendor.t(tag.name),
            c: tag.id,
            d: selectedTags.value.includes(tag.id) ? 1 : "",
            e: common_vendor.o(($event) => toggleTag(tag.id), tag.id)
          };
        }),
        p: loading.value || smartMatchingLoading.value
      }, loading.value || smartMatchingLoading.value ? {
        q: common_vendor.t(smartMatchingLoading.value ? "Calculating matches..." : "Loading...")
      } : common_vendor.e({
        r: common_vendor.t(displayRequests.value.length),
        s: common_vendor.t(displayRequests.value.length === 1 ? "request" : "requests"),
        t: common_vendor.f(displayRequests.value, (request, k0, i0) => {
          var _a;
          return common_vendor.e({
            a: getUserAvatar(request),
            b: common_vendor.t(((_a = request.user) == null ? void 0 : _a.name) || "Unknown"),
            c: common_vendor.t(request.level_requirement || "V0")
          }, showSmartMatch.value ? {
            d: common_vendor.t(request.match_score ? request.match_score.percentage : 0)
          } : {}, {
            e: common_vendor.t(request.description),
            f: common_vendor.t(request.venue_name),
            g: common_vendor.t(request.climb_date),
            h: common_vendor.t(request.climb_time),
            i: common_vendor.t(request.participant_count || 0),
            j: common_vendor.t(request.max_participants || 4),
            k: common_vendor.f(request.tags || [], (tag, k1, i1) => {
              return {
                a: common_vendor.t(tagNames[tag] || tag),
                b: tag
              };
            }),
            l: common_vendor.t(request.participant_count >= (request.max_participants || 4) ? "Full" : "Request to Join"),
            m: request.participant_count >= (request.max_participants || 4) ? 1 : "",
            n: common_vendor.o(($event) => request.participant_count < (request.max_participants || 4) ? handleRequestToJoin(request) : null, request._id),
            o: request._id
          });
        }),
        v: showSmartMatch.value,
        w: displayRequests.value.length === 0
      }, displayRequests.value.length === 0 ? {} : {}), {
        x: showTimePicker.value
      }, showTimePicker.value ? common_vendor.e({
        y: common_vendor.o(($event) => showTimePicker.value = false),
        z: selectedTimeType.value === "any"
      }, selectedTimeType.value === "any" ? {} : {}, {
        A: selectedTimeType.value === "any" ? 1 : "",
        B: common_vendor.o(selectAnyTime),
        C: common_vendor.f(quickTimeOptions, (time, k0, i0) => {
          return {
            a: common_vendor.t(time.label),
            b: time.value,
            c: selectedTimeType.value === "quick" && selectedQuickTime.value === time.value ? 1 : "",
            d: common_vendor.o(($event) => selectQuickTime(time.value), time.value)
          };
        }),
        D: common_vendor.t(customStartTime.value || "09:00"),
        E: customStartTime.value,
        F: common_vendor.o(onStartTimeChange),
        G: common_vendor.t(customEndTime.value || "18:00"),
        H: customEndTime.value,
        I: common_vendor.o(onEndTimeChange),
        J: selectedTimeType.value === "custom"
      }, selectedTimeType.value === "custom" ? {} : {}, {
        K: selectedTimeType.value === "custom" ? 1 : "",
        L: common_vendor.o(selectCustomTime),
        M: common_vendor.o(($event) => showTimePicker.value = false),
        N: common_vendor.o(confirmTimeSelection),
        O: common_vendor.o(() => {
        }),
        P: common_vendor.o(($event) => showTimePicker.value = false)
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d1dfe639"]]);
wx.createPage(MiniProgramPage);
