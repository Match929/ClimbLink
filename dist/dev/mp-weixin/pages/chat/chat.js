"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_cloud = require("../../utils/cloud.js");
const _sfc_main = {
  __name: "chat",
  setup(__props) {
    const tagNames = {
      bouldering: "抱石",
      top_rope: "顶绳",
      lead_climbing: "先锋",
      speed_climbing: "速度",
      beginner_friendly: "新手友好",
      skill_share: "技术交流",
      casual_fun: "轻松娱乐",
      intense_training: "高强度训练",
      morning: "上午",
      afternoon: "下午",
      evening: "晚上",
      weekend: "周末",
      weekday: "工作日"
    };
    const scrollToView = common_vendor.ref("");
    const inputText = common_vendor.ref("");
    const conversationId = common_vendor.ref("");
    const messages = common_vendor.ref([]);
    const isLoading = common_vendor.ref(true);
    const showModal = common_vendor.ref(false);
    const activeTab = common_vendor.ref("existing");
    const tabs = [
      { id: "existing", name: "已有请求" },
      { id: "new", name: "新建邀请" }
    ];
    const myRequests = common_vendor.ref([]);
    const selectedRequest = common_vendor.ref(null);
    const newInvite = common_vendor.ref({
      venueName: "",
      climbDate: "",
      climbTime: "",
      levelRequirement: "",
      maxParticipants: "",
      notes: ""
    });
    const venueList = common_vendor.ref([]);
    const levelOptions = ["不限", "V0-V2", "V2-V4", "V4-V6", "V6-V8", "V8+"];
    const participantOptions = ["2", "3", "4", "5", "6"];
    const chatPartner = common_vendor.ref({
      _id: "",
      name: "",
      avatar: ""
    });
    const selfUser = common_vendor.ref({
      _id: "",
      name: "",
      avatar: ""
    });
    const getDefaultAvatar = (userId) => {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
    };
    const formatTime = (date) => {
      if (!date) return "";
      const d = new Date(date);
      let hours = d.getHours();
      let minutes = d.getMinutes();
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      return `${hours}:${minutes}`;
    };
    const scrollToBottom = () => {
      common_vendor.nextTick$1(() => {
        if (messages.value.length > 0) {
          scrollToView.value = "msg-" + (messages.value.length - 1);
        }
      });
    };
    const loadMessages = async () => {
      if (!conversationId.value) return;
      try {
        const data = await utils_cloud.cloud.chat.getMessages(conversationId.value);
        const currentUserId = common_vendor.index.getStorageSync("userId");
        messages.value = data.map((msg) => ({
          ...msg,
          isSelf: msg.sender_id === currentUserId
        }));
      } catch (err) {
        console.error("加载消息失败:", err);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        isLoading.value = false;
      }
    };
    const sendMessage = async () => {
      if (!inputText.value.trim() || !conversationId.value) return;
      const content = inputText.value;
      inputText.value = "";
      try {
        const newMsg = await utils_cloud.cloud.chat.sendMessage(conversationId.value, content);
        if (newMsg) {
          newMsg.isSelf = true;
          messages.value.push(newMsg);
          scrollToBottom();
        }
      } catch (err) {
        console.error("发送消息失败:", err);
        common_vendor.index.showToast({
          title: "发送失败",
          icon: "none"
        });
        inputText.value = content;
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const showClimbInviteModal = () => {
      showModal.value = true;
      activeTab.value = "existing";
      selectedRequest.value = null;
      resetNewInvite();
      loadMyRequests();
      loadVenues();
    };
    const loadVenues = async () => {
      try {
        console.log("开始加载场馆...");
        const venues = await utils_cloud.cloud.venue.getVenues();
        console.log("获取到的场馆:", venues);
        venueList.value = venues || [];
        if (venueList.value.length === 0) {
          console.log("使用备用场馆数据");
          venueList.value = [
            { name: "Rock Time Gym" },
            { name: "Climb Zone" },
            { name: "Peak Climbing Gym" }
          ];
        }
      } catch (err) {
        console.error("加载场馆失败:", err);
        venueList.value = [
          { name: "Rock Time Gym" },
          { name: "Climb Zone" },
          { name: "Peak Climbing Gym" }
        ];
      }
    };
    const onVenueChange = (e) => {
      var _a;
      const index = e.detail.value;
      newInvite.value.venueName = ((_a = venueList.value[index]) == null ? void 0 : _a.name) || "";
    };
    const onDateChange = (e) => {
      newInvite.value.climbDate = e.detail.value;
    };
    const onTimeChange = (e) => {
      newInvite.value.climbTime = e.detail.value;
    };
    const onLevelChange = (e) => {
      newInvite.value.levelRequirement = levelOptions[e.detail.value];
    };
    const onParticipantChange = (e) => {
      newInvite.value.maxParticipants = participantOptions[e.detail.value];
    };
    const closeModal = () => {
      showModal.value = false;
    };
    const resetNewInvite = () => {
      newInvite.value = {
        venueName: "",
        climbDate: "",
        climbTime: "",
        levelRequirement: "",
        maxParticipants: "",
        notes: ""
      };
    };
    const loadMyRequests = async () => {
      try {
        const requests = await utils_cloud.cloud.climb.getMyRequests();
        myRequests.value = requests || [];
      } catch (err) {
        console.error("加载约爬请求失败:", err);
        myRequests.value = [];
      }
    };
    const selectRequest = (req) => {
      var _a;
      if (((_a = selectedRequest.value) == null ? void 0 : _a._id) === req._id) {
        selectedRequest.value = null;
      } else {
        selectedRequest.value = req;
      }
    };
    const canSend = () => {
      if (activeTab.value === "existing") {
        return selectedRequest.value !== null;
      } else {
        return newInvite.value.venueName && newInvite.value.climbDate && newInvite.value.climbTime;
      }
    };
    const sendClimbInvite = async () => {
      if (!canSend()) return;
      let inviteData;
      let createdRequestId = null;
      if (activeTab.value === "existing") {
        const req = selectedRequest.value;
        inviteData = {
          venueName: req.venueName,
          climbDate: req.climbDate,
          climbTime: req.climbTime,
          levelRequirement: req.levelRequirement,
          maxParticipants: req.maxParticipants,
          tags: req.tags || [],
          requestId: req._id
        };
        createdRequestId = req._id;
      } else {
        const requestData = {
          venue_name: newInvite.value.venueName,
          climb_date: newInvite.value.climbDate,
          climb_time: newInvite.value.climbTime,
          level_requirement: newInvite.value.levelRequirement || "不限",
          max_participants: parseInt(newInvite.value.maxParticipants) || 2,
          description: newInvite.value.notes || "",
          tags: []
        };
        try {
          const result = await utils_cloud.cloud.climb.createClimbRequest(requestData);
          if (result && result.success) {
            createdRequestId = result.requestId;
          }
        } catch (err) {
          console.error("创建约爬请求失败:", err);
        }
        inviteData = {
          venueName: newInvite.value.venueName,
          climbDate: newInvite.value.climbDate,
          climbTime: newInvite.value.climbTime,
          levelRequirement: newInvite.value.levelRequirement || "不限",
          maxParticipants: parseInt(newInvite.value.maxParticipants) || 2,
          tags: [],
          requestId: createdRequestId
        };
      }
      const content = activeTab.value === "existing" ? "我发起了一个约爬请求，一起去吗？" : newInvite.value.notes || "要不要一起去攀岩？";
      try {
        const newMsg = await utils_cloud.cloud.chat.sendMessage(
          conversationId.value,
          content,
          "climb_request",
          inviteData
        );
        if (newMsg) {
          newMsg.isSelf = true;
          messages.value.push(newMsg);
          scrollToBottom();
          closeModal();
          common_vendor.index.showToast({
            title: "发送成功",
            icon: "success"
          });
        }
      } catch (err) {
        console.error("发送约爬邀请失败:", err);
        common_vendor.index.showToast({
          title: "发送失败",
          icon: "none"
        });
      }
    };
    const handleAcceptRequest = (msg) => {
      common_vendor.index.showModal({
        title: "Confirm Accept",
        content: "Are you sure you want to accept this climb request?",
        confirmText: "Confirm",
        cancelText: "Cancel",
        confirmColor: "#7eb662",
        success: async (res) => {
          if (res.confirm) {
            try {
              const requestId = msg.extra.requestId;
              const result = await utils_cloud.cloud.climb.respondClimbInvite(requestId, "accepted", msg._id);
              if (result == null ? void 0 : result.success) {
                msg.extra.status = "accepted";
                common_vendor.index.showToast({
                  title: "Accepted",
                  icon: "success"
                });
              } else {
                common_vendor.index.showToast({
                  title: (result == null ? void 0 : result.message) || "Operation failed",
                  icon: "none"
                });
              }
            } catch (err) {
              console.error("Accept climb failed:", err);
              common_vendor.index.showToast({
                title: "Operation failed",
                icon: "none"
              });
            }
          }
        }
      });
    };
    const handleRejectRequest = (msg) => {
      common_vendor.index.showModal({
        title: "Confirm Reject",
        content: "Are you sure you want to reject this climb request?",
        confirmText: "Confirm",
        cancelText: "Cancel",
        confirmColor: "#ef4444",
        success: async (res) => {
          if (res.confirm) {
            try {
              const requestId = msg.extra.requestId;
              const result = await utils_cloud.cloud.climb.respondClimbInvite(requestId, "rejected", msg._id);
              if (result == null ? void 0 : result.success) {
                msg.extra.status = "rejected";
                common_vendor.index.showToast({
                  title: "Rejected",
                  icon: "success"
                });
              } else {
                common_vendor.index.showToast({
                  title: (result == null ? void 0 : result.message) || "Operation failed",
                  icon: "none"
                });
              }
            } catch (err) {
              console.error("Reject climb failed:", err);
              common_vendor.index.showToast({
                title: "Operation failed",
                icon: "none"
              });
            }
          }
        }
      });
    };
    const loadChatPartner = async (userId) => {
      try {
        const user = await utils_cloud.cloud.chat.getUserById(userId);
        if (user) {
          chatPartner.value = user;
        }
      } catch (err) {
        console.error("加载用户信息失败:", err);
      }
    };
    common_vendor.onMounted(() => {
      var _a, _b;
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const options = currentPage.options;
      if (options.conversationId) {
        conversationId.value = options.conversationId;
        utils_cloud.cloud.chat.clearUnreadCount(options.conversationId);
      }
      if (options.otherUserId) {
        chatPartner.value._id = options.otherUserId;
        loadChatPartner(options.otherUserId);
      }
      selfUser.value._id = common_vendor.index.getStorageSync("userId");
      selfUser.value.name = ((_a = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _a.name) || "";
      selfUser.value.avatar = ((_b = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _b.avatar) || "";
      loadMessages().then(() => {
        scrollToBottom();
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: chatPartner.value.avatar || getDefaultAvatar(chatPartner.value._id),
        c: common_vendor.t(chatPartner.value.name || "加载中..."),
        d: common_vendor.o(showClimbInviteModal),
        e: common_vendor.f(messages.value, (msg, index, i0) => {
          return common_vendor.e({
            a: msg.isSelf ? selfUser.value.avatar || getDefaultAvatar(selfUser.value._id) : chatPartner.value.avatar || getDefaultAvatar(chatPartner.value._id),
            b: msg.type === "climb_request" && msg.extra
          }, msg.type === "climb_request" && msg.extra ? common_vendor.e({
            c: common_vendor.t(msg.extra.venueName),
            d: common_vendor.t(msg.extra.climbDate),
            e: common_vendor.t(msg.extra.climbTime),
            f: common_vendor.t(msg.extra.levelRequirement),
            g: common_vendor.t(msg.extra.maxParticipants),
            h: msg.extra.tags && msg.extra.tags.length > 0
          }, msg.extra.tags && msg.extra.tags.length > 0 ? {
            i: common_vendor.f(msg.extra.tags, (tag, tagIdx, i1) => {
              return {
                a: common_vendor.t(tagNames[tag] || tag),
                b: tagIdx
              };
            })
          } : {}, {
            j: common_vendor.t(msg.content),
            k: !msg.isSelf && !msg.extra.status
          }, !msg.isSelf && !msg.extra.status ? {
            l: common_vendor.o(($event) => handleRejectRequest(msg), msg._id || index),
            m: common_vendor.o(($event) => handleAcceptRequest(msg), msg._id || index)
          } : {}, {
            n: msg.extra.status
          }, msg.extra.status ? {
            o: common_vendor.t(msg.extra.status === "accepted" ? "✅ Accepted" : "❌ Rejected"),
            p: common_vendor.n(msg.extra.status)
          } : {}) : {
            q: common_vendor.t(msg.content)
          }, {
            r: common_vendor.t(formatTime(msg.created_at)),
            s: msg._id || index,
            t: "msg-" + index,
            v: msg.isSelf ? 1 : ""
          });
        }),
        f: scrollToView.value,
        g: common_vendor.o(sendMessage),
        h: inputText.value,
        i: common_vendor.o(($event) => inputText.value = $event.detail.value),
        j: inputText.value.trim() ? 1 : "",
        k: common_vendor.o(sendMessage),
        l: showModal.value
      }, showModal.value ? common_vendor.e({
        m: common_vendor.o(closeModal),
        n: common_vendor.f(tabs, (tab, k0, i0) => {
          return {
            a: common_vendor.t(tab.name),
            b: tab.id,
            c: activeTab.value === tab.id ? 1 : "",
            d: common_vendor.o(($event) => activeTab.value = tab.id, tab.id)
          };
        }),
        o: activeTab.value === "existing"
      }, activeTab.value === "existing" ? common_vendor.e({
        p: myRequests.value.length === 0
      }, myRequests.value.length === 0 ? {} : {
        q: common_vendor.f(myRequests.value, (req, k0, i0) => {
          var _a, _b, _c;
          return common_vendor.e({
            a: common_vendor.t(req.venueName),
            b: common_vendor.t(req.climbDate),
            c: common_vendor.t(req.climbTime),
            d: common_vendor.t(req.levelRequirement),
            e: ((_a = selectedRequest.value) == null ? void 0 : _a._id) === req._id
          }, ((_b = selectedRequest.value) == null ? void 0 : _b._id) === req._id ? {} : {}, {
            f: req._id,
            g: ((_c = selectedRequest.value) == null ? void 0 : _c._id) === req._id ? 1 : "",
            h: common_vendor.o(($event) => selectRequest(req), req._id)
          });
        })
      }) : {}, {
        r: activeTab.value === "new"
      }, activeTab.value === "new" ? {
        s: common_vendor.t(newInvite.value.venueName || "请选择场馆"),
        t: !newInvite.value.venueName ? 1 : "",
        v: venueList.value,
        w: common_vendor.o(onVenueChange),
        x: common_vendor.t(newInvite.value.climbDate || "选择日期"),
        y: !newInvite.value.climbDate ? 1 : "",
        z: newInvite.value.climbDate,
        A: common_vendor.o(onDateChange),
        B: common_vendor.t(newInvite.value.climbTime || "选择时间"),
        C: !newInvite.value.climbTime ? 1 : "",
        D: newInvite.value.climbTime,
        E: common_vendor.o(onTimeChange),
        F: common_vendor.t(newInvite.value.levelRequirement || "选择等级"),
        G: !newInvite.value.levelRequirement ? 1 : "",
        H: levelOptions,
        I: common_vendor.o(onLevelChange),
        J: common_vendor.t(newInvite.value.maxParticipants ? newInvite.value.maxParticipants + " 人" : "选择人数"),
        K: !newInvite.value.maxParticipants ? 1 : "",
        L: participantOptions,
        M: common_vendor.o(onParticipantChange),
        N: newInvite.value.notes,
        O: common_vendor.o(($event) => newInvite.value.notes = $event.detail.value)
      } : {}, {
        P: common_vendor.o(closeModal),
        Q: !canSend ? 1 : "",
        R: common_vendor.o(sendClimbInvite),
        S: common_vendor.o(() => {
        }),
        T: common_vendor.o(closeModal)
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a041b13f"]]);
wx.createPage(MiniProgramPage);
