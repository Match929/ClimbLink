"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_cloud = require("../../utils/cloud.js");
if (!Math) {
  CustomTabBar();
}
const CustomTabBar = () => "../../components/custom-tab-bar/custom-tab-bar.js";
const _sfc_main = {
  __name: "community",
  setup(__props) {
    const activeTab = common_vendor.ref("Feed");
    const listFilter = common_vendor.ref("Incoming");
    const tabs = ["Feed", "List", "Messages"];
    const listTabOptions = [
      { value: "Incoming", label: "Incoming" },
      { value: "Outgoing", label: "Outgoing" },
      { value: "My Posts", label: "My Posts" }
    ];
    const myRequests = common_vendor.ref([]);
    const myApplications = common_vendor.ref([]);
    const myPosts = common_vendor.ref([]);
    const listLoading = common_vendor.ref(false);
    const showEditRequestModal = common_vendor.ref(false);
    const editingRequest = common_vendor.ref(null);
    const activeDropdown = common_vendor.ref(null);
    const conversations = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const searchKeyword = common_vendor.ref("");
    const searchResults = common_vendor.ref([]);
    const searchLoading = common_vendor.ref(false);
    const searchDebounceTimer = common_vendor.ref(null);
    const isSearching = common_vendor.computed(() => {
      return searchKeyword.value.trim().length > 0;
    });
    const listUnreadCount = common_vendor.computed(() => {
      let totalPending = 0;
      for (const request of myRequests.value) {
        if (request.applicants && request.applicants.length > 0) {
          for (const applicant of request.applicants) {
            if (applicant.status === "pending") {
              totalPending++;
            }
          }
        }
      }
      return totalPending;
    });
    const messagesUnreadCount = common_vendor.computed(() => {
      let totalUnread = 0;
      for (const conv of conversations.value) {
        totalUnread += conv.unread_count || 0;
      }
      return totalUnread;
    });
    const posts = common_vendor.ref([]);
    const postsLoading = common_vendor.ref(false);
    const filteredConversations = common_vendor.computed(() => {
      if (!searchKeyword.value.trim()) {
        return conversations.value;
      }
      const keyword = searchKeyword.value.toLowerCase().trim();
      return conversations.value.filter((conv) => {
        var _a, _b, _c, _d;
        const userName = ((_b = (_a = conv.otherMembers[0]) == null ? void 0 : _a.name) == null ? void 0 : _b.toLowerCase()) || "";
        if (userName.includes(keyword)) {
          return true;
        }
        const lastMsg = ((_d = (_c = conv.lastMessage) == null ? void 0 : _c.content) == null ? void 0 : _d.toLowerCase()) || "";
        if (lastMsg.includes(keyword)) {
          return true;
        }
        return false;
      });
    });
    const isLoggedIn = common_vendor.computed(() => {
      return !!common_vendor.index.getStorageSync("userId");
    });
    common_vendor.watch(activeTab, async (newTab) => {
      if (newTab === "Messages") {
        await loadConversations();
      }
      if (newTab === "Feed") {
        if (isLoggedIn.value) {
          await loadPosts();
        }
      }
      if (newTab === "List") {
        await loadClimbRequests();
      }
    });
    common_vendor.watch(listFilter, async (newFilter) => {
      if (newFilter === "My Posts" && isLoggedIn.value) {
        await loadMyPosts();
      }
    });
    common_vendor.onMounted(async () => {
      const promises = [];
      if (isLoggedIn.value) {
        promises.push(loadPosts());
      }
      promises.push(loadConversations());
      promises.push(loadClimbRequests());
      await Promise.all(promises);
    });
    common_vendor.onShow(async () => {
      const promises = [];
      promises.push(loadConversations());
      promises.push(loadClimbRequests());
      if (isLoggedIn.value && activeTab.value === "Feed") {
        promises.push(loadPosts());
      }
      await Promise.all(promises);
    });
    const loadPosts = async () => {
      if (!isLoggedIn.value) {
        posts.value = [];
        return;
      }
      postsLoading.value = true;
      try {
        const data = await utils_cloud.cloud.post.getPosts();
        const currentUserId = common_vendor.index.getStorageSync("userId");
        posts.value = data.map((post) => {
          var _a, _b, _c;
          return {
            id: post._id,
            user: {
              name: ((_a = post.user) == null ? void 0 : _a.name) || "Unknown User",
              avatar: ((_b = post.user) == null ? void 0 : _b.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`,
              level: ((_c = post.user) == null ? void 0 : _c.climbing_level) || "V1"
            },
            content: post.content,
            images: post.images || [],
            venue: "Rock Time Gym",
            time: formatPostTime(post.created_at),
            likes: post.likes || 0,
            comments: (post.comments || []).length,
            tags: post.tags || [],
            liked: post.liked_by && post.liked_by.includes(currentUserId),
            hasMemoryCard: false
          };
        });
      } catch (err) {
        console.error("加载帖子失败:", err);
      } finally {
        postsLoading.value = false;
      }
    };
    const formatPostTime = (date) => {
      if (!date) return "";
      const now = /* @__PURE__ */ new Date();
      const postDate = new Date(date);
      const diffMs = now - postDate;
      const diffMins = Math.floor(diffMs / 6e4);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return postDate.toLocaleDateString();
    };
    common_vendor.ref([
      {
        id: 1,
        type: "applied",
        title: "Intermediate Training",
        venue: "Climber's Paradise",
        time: "Sun, Apr 26, 10:00 AM",
        status: "pending",
        applicants: 5
      },
      {
        id: 2,
        type: "applied",
        title: "Weekend Beginner Session",
        venue: "Rock Time Gym",
        time: "Sat, Apr 25, 2:00 PM",
        status: "approved",
        applicants: 8
      },
      {
        id: 3,
        type: "applied",
        title: "Bouldering Workshop",
        venue: "Climber's Paradise",
        time: "Sat, Apr 25, 3:00 PM",
        status: "completed",
        applicants: 6
      }
    ]);
    common_vendor.ref([
      {
        id: 1,
        title: "Looking for V3-V5 partners",
        venue: "Rock Time Gym",
        time: "Mon, Apr 27, 6:00 PM",
        applicants: 3,
        maxApplicants: 4,
        canEdit: true
      },
      {
        id: 2,
        title: "Weekend climbing session",
        venue: "Peak Climbing Center",
        time: "Sat, Apr 25, 2:00 PM",
        applicants: 2,
        maxApplicants: 3,
        canEdit: true
      }
    ]);
    common_vendor.ref([
      {
        id: 1,
        user: {
          name: "Emma Lee",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
          level: "V3-V5"
        },
        message: "Would love to join your climbing session!",
        time: "2 hours ago",
        status: "pending"
      },
      {
        id: 2,
        user: {
          name: "Mike Johnson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
          level: "V2-V4"
        },
        message: "Looking forward to climbing together",
        time: "5 hours ago",
        status: "pending"
      }
    ]);
    common_vendor.ref([
      {
        id: 1,
        user: {
          name: "Lee",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=msg1"
        },
        lastMessage: "See you at Rock Time 3pm tomorrow!",
        time: "10 min ago",
        unread: 2,
        online: true
      },
      {
        id: 2,
        user: {
          name: "AQiang",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=msg2"
        },
        lastMessage: "This route is indeed challenging, let's study it together",
        time: "1 hour ago",
        unread: 0,
        online: true
      },
      {
        id: 3,
        user: {
          name: "Amy",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=msg3"
        },
        lastMessage: "Sounds good, see you this weekend!",
        time: "Yesterday",
        unread: 0,
        online: false
      }
    ]);
    common_vendor.ref([
      {
        id: 1,
        type: "match",
        title: "Partner Match Success",
        content: "You matched with Zhang",
        time: "2 hours ago",
        unread: true
      },
      {
        id: 2,
        type: "activity",
        title: "Event Reminder",
        content: "Weekend beginner class starts tomorrow",
        time: "5 hours ago",
        unread: true
      }
    ]);
    common_vendor.ref(2);
    const unreadNotifications = common_vendor.ref(2);
    common_vendor.ref(2);
    const likePost = async (post) => {
      if (!isLoggedIn.value) {
        common_vendor.index.showModal({
          title: "Login Required",
          content: "Please login first to like posts",
          confirmText: "Login",
          cancelText: "Cancel",
          confirmColor: "#7eb662",
          success: (res) => {
            if (res.confirm) {
              navigateTo("/pages/login/login");
            }
          }
        });
        return;
      }
      const wasLiked = post.liked;
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
      try {
        const result = await utils_cloud.cloud.post.likePost(post.id);
        if (!result) {
          post.liked = wasLiked;
          post.likes += wasLiked ? 1 : -1;
          common_vendor.index.showToast({
            title: "Like failed",
            icon: "none"
          });
        }
      } catch (err) {
        console.error("点赞失败:", err);
        post.liked = wasLiked;
        post.likes += wasLiked ? 1 : -1;
        common_vendor.index.showToast({
          title: "Like failed",
          icon: "none"
        });
      }
    };
    const openComments = (post) => {
      if (!isLoggedIn.value) {
        common_vendor.index.showModal({
          title: "Login Required",
          content: "Please login first to view comments",
          confirmText: "Login",
          cancelText: "Cancel",
          confirmColor: "#7eb662",
          success: (res) => {
            if (res.confirm) {
              navigateTo("/pages/login/login");
            }
          }
        });
        return;
      }
      common_vendor.index.showToast({
        title: "Comments feature coming soon!",
        icon: "none"
      });
    };
    const loadClimbRequests = async () => {
      listLoading.value = true;
      try {
        const [requests, applications] = await Promise.all([
          utils_cloud.cloud.climb.getMyRequestsWithApplications(),
          utils_cloud.cloud.climb.getMyApplications()
        ]);
        myRequests.value = requests || [];
        myApplications.value = applications || [];
      } catch (err) {
        console.error("加载约爬请求失败:", err);
      } finally {
        listLoading.value = false;
      }
    };
    const loadMyPosts = async () => {
      listLoading.value = true;
      try {
        const posts2 = await utils_cloud.cloud.post.getMyPosts();
        myPosts.value = posts2 || [];
      } catch (err) {
        console.error("加载我的帖子失败:", err);
      } finally {
        listLoading.value = false;
      }
    };
    const toggleDropdown = (requestId) => {
      activeDropdown.value = activeDropdown.value === requestId ? null : requestId;
    };
    const editRequest = (request) => {
      activeDropdown.value = null;
      common_vendor.index.navigateTo({
        url: `/pages/climb-request/climb-request?requestId=${request._id}`
      });
    };
    const closeEditModal = () => {
      showEditRequestModal.value = false;
      editingRequest.value = null;
    };
    const getLevelIndex = (level) => {
      const levels = ["不限", "V0-V2", "V2-V4", "V4-V6", "V6-V8", "V8+"];
      return levels.indexOf(level);
    };
    const getParticipantIndex = (count) => {
      const counts = ["2", "3", "4", "5", "6"];
      const index = counts.indexOf(String(count));
      return index >= 0 ? index : 0;
    };
    const onEditDateChange = (e) => {
      editingRequest.value.climb_date = e.detail.value;
    };
    const onEditTimeChange = (e) => {
      editingRequest.value.climb_time = e.detail.value;
    };
    const onEditLevelChange = (e) => {
      const levels = ["不限", "V0-V2", "V2-V4", "V4-V6", "V6-V8", "V8+"];
      editingRequest.value.level_requirement = levels[e.detail.value];
    };
    const onEditParticipantChange = (e) => {
      const counts = ["2", "3", "4", "5", "6"];
      editingRequest.value.max_participants = parseInt(counts[e.detail.value]);
    };
    const saveEditRequest = async () => {
      if (!editingRequest.value.venue_name || !editingRequest.value.climb_date || !editingRequest.value.climb_time) {
        common_vendor.index.showToast({
          title: "Please fill in all required fields",
          icon: "none"
        });
        return;
      }
      try {
        const result = await utils_cloud.cloud.climb.updateClimbRequest(editingRequest.value._id, {
          venue_name: editingRequest.value.venue_name,
          climb_date: editingRequest.value.climb_date,
          climb_time: editingRequest.value.climb_time,
          level_requirement: editingRequest.value.level_requirement,
          max_participants: editingRequest.value.max_participants,
          description: editingRequest.value.description || "",
          tags: []
        });
        if ((result == null ? void 0 : result.success) !== false) {
          common_vendor.index.showToast({
            title: "Updated successfully!",
            icon: "success"
          });
          closeEditModal();
          await loadClimbRequests();
        } else {
          common_vendor.index.showToast({
            title: (result == null ? void 0 : result.message) || "Update failed",
            icon: "none"
          });
        }
      } catch (err) {
        console.error("更新约爬请求失败:", err);
        common_vendor.index.showToast({
          title: "Update failed",
          icon: "none"
        });
      }
    };
    const deleteRequest = (requestId) => {
      activeDropdown.value = null;
      common_vendor.index.showModal({
        title: "Confirm Delete",
        content: "Are you sure you want to delete this climb request?",
        confirmText: "Delete",
        cancelText: "Cancel",
        confirmColor: "#ef4444",
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await utils_cloud.cloud.climb.deleteClimbRequest(requestId);
              if ((result == null ? void 0 : result.success) !== false) {
                common_vendor.index.showToast({
                  title: "Deleted successfully!",
                  icon: "success"
                });
                await loadClimbRequests();
              } else {
                common_vendor.index.showToast({
                  title: (result == null ? void 0 : result.message) || "Delete failed",
                  icon: "none"
                });
              }
            } catch (err) {
              console.error("删除约爬请求失败:", err);
              common_vendor.index.showToast({
                title: "Delete failed",
                icon: "none"
              });
            }
          }
        }
      });
    };
    const deletePost = (postId) => {
      common_vendor.index.showModal({
        title: "Confirm Delete",
        content: "Are you sure you want to delete this post?",
        confirmText: "Delete",
        cancelText: "Cancel",
        confirmColor: "#ef4444",
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await utils_cloud.cloud.post.deletePost(postId);
              if ((result == null ? void 0 : result.success) !== false) {
                common_vendor.index.showToast({
                  title: "Deleted successfully!",
                  icon: "success"
                });
                await loadMyPosts();
              } else {
                common_vendor.index.showToast({
                  title: (result == null ? void 0 : result.message) || "Delete failed",
                  icon: "none"
                });
              }
            } catch (err) {
              console.error("删除帖子失败:", err);
              common_vendor.index.showToast({
                title: "Delete failed",
                icon: "none"
              });
            }
          }
        }
      });
    };
    const acceptApplication = (participantId) => {
      if (!isLoggedIn.value) {
        common_vendor.index.showModal({
          title: "Login Required",
          content: "Please login first to manage requests",
          confirmText: "Login",
          cancelText: "Cancel",
          confirmColor: "#7eb662",
          success: (res) => {
            if (res.confirm) {
              navigateTo("/pages/login/login");
            }
          }
        });
        return;
      }
      common_vendor.index.showModal({
        title: "Confirm Accept",
        content: "Are you sure you want to accept this climb request?",
        confirmText: "Accept",
        cancelText: "Cancel",
        confirmColor: "#7eb662",
        success: (res) => {
          if (res.confirm) {
            doAcceptApplication(participantId);
          }
        }
      });
    };
    const doAcceptApplication = async (participantId) => {
      try {
        await utils_cloud.cloud.climb.acceptApplication(participantId);
        common_vendor.index.showToast({
          title: "Accepted!",
          icon: "success"
        });
        await loadClimbRequests();
      } catch (err) {
        console.error("接受申请失败:", err);
        common_vendor.index.showToast({
          title: "Failed to accept",
          icon: "none"
        });
      }
    };
    const rejectApplication = (participantId) => {
      if (!isLoggedIn.value) {
        common_vendor.index.showModal({
          title: "Login Required",
          content: "Please login first to manage requests",
          confirmText: "Login",
          cancelText: "Cancel",
          confirmColor: "#7eb662",
          success: (res) => {
            if (res.confirm) {
              navigateTo("/pages/login/login");
            }
          }
        });
        return;
      }
      common_vendor.index.showModal({
        title: "Confirm Reject",
        content: "Are you sure you want to reject this climb request?",
        confirmText: "Reject",
        cancelText: "Cancel",
        confirmColor: "#ef4444",
        success: (res) => {
          if (res.confirm) {
            doRejectApplication(participantId);
          }
        }
      });
    };
    const doRejectApplication = async (participantId) => {
      try {
        await utils_cloud.cloud.climb.rejectApplication(participantId);
        common_vendor.index.showToast({
          title: "Rejected!",
          icon: "success"
        });
        await loadClimbRequests();
      } catch (err) {
        console.error("拒绝申请失败:", err);
        common_vendor.index.showToast({
          title: "Failed to reject",
          icon: "none"
        });
      }
    };
    const formatTime = (date) => {
      if (!date) return "";
      const d = new Date(date);
      const now = /* @__PURE__ */ new Date();
      const diff = now - d;
      if (diff < 6e4) return "Just now";
      if (diff < 36e5) return Math.floor(diff / 6e4) + " min ago";
      if (diff < 864e5) return Math.floor(diff / 36e5) + " hours ago";
      return `${d.getMonth() + 1}/${d.getDate()}`;
    };
    const navigateTo = (url) => {
      common_vendor.index.navigateTo({
        url,
        fail: (err) => {
          console.error("Navigation failed:", err);
          common_vendor.index.showToast({
            title: "Navigation failed",
            icon: "none"
          });
        }
      });
    };
    const handlePostClick = () => {
      if (!isLoggedIn.value) {
        common_vendor.index.showModal({
          title: "Login Required",
          content: "Please login first to create a post",
          confirmText: "Login",
          cancelText: "Cancel",
          confirmColor: "#7eb662",
          success: (res) => {
            if (res.confirm) {
              navigateTo("/pages/login/login");
            }
          }
        });
      } else {
        navigateTo("/pages/post-create/post-create");
      }
    };
    const handleAddFriendClick = () => {
      if (!isLoggedIn.value) {
        common_vendor.index.showModal({
          title: "Login Required",
          content: "Please login first to add friends",
          confirmText: "Login",
          cancelText: "Cancel",
          confirmColor: "#7eb662",
          success: (res) => {
            if (res.confirm) {
              navigateTo("/pages/login/login");
            }
          }
        });
      } else {
        navigateTo("/pages/add-friend/add-friend");
      }
    };
    const loadConversations = async () => {
      loading.value = true;
      try {
        const data = await utils_cloud.cloud.chat.getConversations();
        conversations.value = data || [];
      } catch (err) {
        console.error("Load conversations failed:", err);
      } finally {
        loading.value = false;
      }
    };
    const loadMoreConversations = async () => {
    };
    const goToChat = (conversation) => {
      var _a;
      if (!isLoggedIn.value) {
        common_vendor.index.showModal({
          title: "Login Required",
          content: "Please login first to view messages",
          confirmText: "Login",
          cancelText: "Cancel",
          confirmColor: "#7eb662",
          success: (res) => {
            if (res.confirm) {
              navigateTo("/pages/login/login");
            }
          }
        });
        return;
      }
      const otherUserId = (_a = conversation.otherMembers[0]) == null ? void 0 : _a._id;
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?conversationId=${conversation._id}&otherUserId=${otherUserId}`
      });
    };
    const getDefaultAvatar = (userId) => {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId || "default"}`;
    };
    const onSearchInput = () => {
      if (searchDebounceTimer.value) {
        clearTimeout(searchDebounceTimer.value);
      }
      if (!searchKeyword.value.trim()) {
        searchResults.value = [];
        return;
      }
      if (!isLoggedIn.value) {
        return;
      }
      searchDebounceTimer.value = setTimeout(() => {
        performSearch();
      }, 500);
    };
    const handleSearch = async () => {
      if (!isLoggedIn.value) {
        common_vendor.index.showModal({
          title: "Login Required",
          content: "Please login first to search messages",
          confirmText: "Login",
          cancelText: "Cancel",
          confirmColor: "#7eb662",
          success: (res) => {
            if (res.confirm) {
              navigateTo("/pages/login/login");
            }
          }
        });
        return;
      }
      if (!searchKeyword.value.trim()) {
        searchResults.value = [];
        return;
      }
      await performSearch();
    };
    const performSearch = async () => {
      if (!isLoggedIn.value) {
        return;
      }
      searchLoading.value = true;
      try {
        const results = await utils_cloud.cloud.post.searchMessages(searchKeyword.value);
        searchResults.value = results;
      } catch (err) {
        console.error("搜索失败:", err);
        searchResults.value = [];
      } finally {
        searchLoading.value = false;
      }
    };
    const clearSearch = () => {
      searchKeyword.value = "";
      searchResults.value = [];
      if (searchDebounceTimer.value) {
        clearTimeout(searchDebounceTimer.value);
        searchDebounceTimer.value = null;
      }
    };
    const goToSearchResult = (result) => {
      var _a;
      const otherUserId = (_a = result.other_user) == null ? void 0 : _a._id;
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?conversationId=${result.conversation_id}&otherUserId=${otherUserId}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: unreadNotifications.value > 0
      }, unreadNotifications.value > 0 ? {} : {}, {
        b: common_vendor.o(handlePostClick),
        c: common_vendor.f(tabs, (tab, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab),
            b: tab === "List" && listUnreadCount.value > 0
          }, tab === "List" && listUnreadCount.value > 0 ? {
            c: common_vendor.t(listUnreadCount.value > 99 ? "99+" : listUnreadCount.value)
          } : {}, {
            d: tab === "Messages" && messagesUnreadCount.value > 0
          }, tab === "Messages" && messagesUnreadCount.value > 0 ? {
            e: common_vendor.t(messagesUnreadCount.value > 99 ? "99+" : messagesUnreadCount.value)
          } : {}, {
            f: tab,
            g: common_vendor.n({
              active: activeTab.value === tab
            }),
            h: common_vendor.o(($event) => activeTab.value = tab, tab)
          });
        }),
        d: activeTab.value === "Feed"
      }, activeTab.value === "Feed" ? common_vendor.e({
        e: !isLoggedIn.value
      }, !isLoggedIn.value ? {
        f: common_vendor.o(($event) => navigateTo("/pages/login/login"))
      } : postsLoading.value ? {} : posts.value.length === 0 ? {
        i: common_vendor.o(handlePostClick)
      } : {
        j: common_vendor.f(posts.value, (post, k0, i0) => {
          return common_vendor.e({
            a: post.user.avatar,
            b: common_vendor.t(post.user.name),
            c: common_vendor.t(post.time),
            d: common_vendor.t(post.venue),
            e: common_vendor.t(post.user.level),
            f: common_vendor.t(post.content),
            g: post.images && post.images.length > 0
          }, post.images && post.images.length > 0 ? {
            h: post.images[0]
          } : {}, {
            i: post.hasMemoryCard
          }, post.hasMemoryCard ? {} : {}, {
            j: common_vendor.f(post.tags, (tag, k1, i1) => {
              return {
                a: common_vendor.t(tag),
                b: tag
              };
            }),
            k: common_vendor.t(post.liked ? "❤️" : "🤍"),
            l: common_vendor.t(post.likes),
            m: common_vendor.o(($event) => likePost(post), post.id),
            n: common_vendor.t(post.comments),
            o: common_vendor.o(($event) => openComments(), post.id),
            p: post.id
          });
        })
      }, {
        g: postsLoading.value,
        h: posts.value.length === 0
      }) : {}, {
        k: activeTab.value === "List"
      }, activeTab.value === "List" ? common_vendor.e({
        l: !isLoggedIn.value
      }, !isLoggedIn.value ? {
        m: common_vendor.o(($event) => navigateTo("/pages/login/login"))
      } : common_vendor.e({
        n: common_vendor.f(listTabOptions, (option, k0, i0) => {
          return {
            a: common_vendor.t(option.label),
            b: option.value,
            c: listFilter.value === option.value ? 1 : "",
            d: common_vendor.o(($event) => listFilter.value = option.value, option.value)
          };
        }),
        o: listLoading.value
      }, listLoading.value ? {} : listFilter.value === "Incoming" ? common_vendor.e({
        q: myRequests.value.length === 0
      }, myRequests.value.length === 0 ? {} : {
        r: common_vendor.f(myRequests.value, (request, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(request.venue_name),
            b: common_vendor.t(request.climb_date),
            c: activeDropdown.value === request._id
          }, activeDropdown.value === request._id ? {
            d: common_vendor.o(($event) => editRequest(request), request._id),
            e: common_vendor.o(($event) => deleteRequest(request._id), request._id)
          } : {}, {
            f: common_vendor.o(($event) => toggleDropdown(request._id), request._id),
            g: common_vendor.t(request.venue_name),
            h: common_vendor.t(request.climb_time),
            i: common_vendor.t(request.participant_count || 0),
            j: common_vendor.t(request.max_participants || 4),
            k: request.applicants && request.applicants.length > 0
          }, request.applicants && request.applicants.length > 0 ? {
            l: common_vendor.t(request.applicants.length),
            m: common_vendor.f(request.applicants, (applicant, k1, i1) => {
              var _a, _b;
              return common_vendor.e({
                a: ((_a = applicant.user) == null ? void 0 : _a.avatar) || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + applicant.user_id,
                b: common_vendor.t(((_b = applicant.user) == null ? void 0 : _b.name) || "Unknown"),
                c: common_vendor.t(formatTime(applicant.joined_at)),
                d: applicant.status === "pending"
              }, applicant.status === "pending" ? {
                e: common_vendor.o(($event) => acceptApplication(applicant._id), applicant._id),
                f: common_vendor.o(($event) => rejectApplication(applicant._id), applicant._id)
              } : {
                g: common_vendor.t(applicant.status === "accepted" ? "✓ Accepted" : "✕ Declined"),
                h: common_vendor.n(applicant.status)
              }, {
                i: applicant._id
              });
            })
          } : {}, {
            n: request._id
          });
        })
      }) : listFilter.value === "Outgoing" ? common_vendor.e({
        t: myApplications.value.length === 0
      }, myApplications.value.length === 0 ? {} : {
        v: common_vendor.f(myApplications.value, (application, k0, i0) => {
          var _a, _b;
          return {
            a: ((_a = application.user) == null ? void 0 : _a.avatar) || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + application.user_id,
            b: common_vendor.t(((_b = application.user) == null ? void 0 : _b.name) || "Unknown"),
            c: common_vendor.t(application.venue_name),
            d: common_vendor.t(application.climb_date),
            e: common_vendor.t(application.climb_time),
            f: common_vendor.t(application.my_status === "pending" ? "⏳ Pending" : application.my_status === "accepted" ? "✓ Accepted" : "✕ Declined"),
            g: common_vendor.n(application.my_status),
            h: common_vendor.t(application.description),
            i: common_vendor.t(application.participant_count || 0),
            j: common_vendor.t(application.max_participants || 4),
            k: application._id
          };
        })
      }) : listFilter.value === "My Posts" ? common_vendor.e({
        x: myPosts.value.length === 0
      }, myPosts.value.length === 0 ? {} : {
        y: common_vendor.f(myPosts.value, (post, k0, i0) => {
          var _a, _b, _c;
          return common_vendor.e({
            a: (_a = post.user) == null ? void 0 : _a.avatar,
            b: common_vendor.t(((_b = post.user) == null ? void 0 : _b.name) || "Unknown"),
            c: common_vendor.t(formatPostTime(post.created_at)),
            d: common_vendor.o(($event) => deletePost(post._id), post._id),
            e: common_vendor.t(post.content),
            f: post.images && post.images.length > 0
          }, post.images && post.images.length > 0 ? {
            g: common_vendor.f(post.images, (img, idx, i1) => {
              return {
                a: idx,
                b: img
              };
            })
          } : {}, {
            h: common_vendor.t(post.likes || 0),
            i: common_vendor.t(((_c = post.comments) == null ? void 0 : _c.length) || 0),
            j: post._id
          });
        })
      }) : {}, {
        p: listFilter.value === "Incoming",
        s: listFilter.value === "Outgoing",
        w: listFilter.value === "My Posts"
      })) : {}, {
        z: activeTab.value === "Messages"
      }, activeTab.value === "Messages" ? common_vendor.e({
        A: !isLoggedIn.value
      }, !isLoggedIn.value ? {
        B: common_vendor.o(($event) => navigateTo("/pages/login/login"))
      } : common_vendor.e({
        C: common_vendor.o(handleAddFriendClick),
        D: common_vendor.o(handleSearch),
        E: common_vendor.o([($event) => searchKeyword.value = $event.detail.value, onSearchInput]),
        F: searchKeyword.value,
        G: searchKeyword.value
      }, searchKeyword.value ? {
        H: common_vendor.o(clearSearch)
      } : {}, {
        I: searchLoading.value
      }, searchLoading.value ? {} : isSearching.value && searchResults.value.length > 0 ? {
        K: common_vendor.f(searchResults.value, (result, k0, i0) => {
          var _a, _b, _c, _d;
          return {
            a: ((_a = result.other_user) == null ? void 0 : _a.avatar) || getDefaultAvatar((_b = result.other_user) == null ? void 0 : _b._id),
            b: common_vendor.t(((_c = result.other_user) == null ? void 0 : _c.name) || "Unknown User"),
            c: common_vendor.t(formatTime(result.created_at)),
            d: common_vendor.t(result.is_self ? "我" : (_d = result.other_user) == null ? void 0 : _d.name),
            e: common_vendor.t(result.content),
            f: result._id,
            g: common_vendor.o(($event) => goToSearchResult(result), result._id)
          };
        })
      } : isSearching.value && searchResults.value.length === 0 ? {} : common_vendor.e({
        M: loading.value
      }, loading.value ? {} : filteredConversations.value.length === 0 ? {
        O: common_vendor.o(($event) => navigateTo("/pages/add-friend/add-friend"))
      } : {
        P: common_vendor.f(filteredConversations.value, (conversation, k0, i0) => {
          var _a, _b, _c, _d, _e;
          return common_vendor.e({
            a: ((_a = conversation.otherMembers[0]) == null ? void 0 : _a.avatar) || getDefaultAvatar((_b = conversation.otherMembers[0]) == null ? void 0 : _b._id),
            b: common_vendor.t(((_c = conversation.otherMembers[0]) == null ? void 0 : _c.name) || "Unknown User"),
            c: common_vendor.t(formatTime((_d = conversation.lastMessage) == null ? void 0 : _d.created_at)),
            d: conversation.unread_count > 0
          }, conversation.unread_count > 0 ? {
            e: common_vendor.t(conversation.unread_count > 99 ? "99+" : conversation.unread_count)
          } : {}, {
            f: common_vendor.t(((_e = conversation.lastMessage) == null ? void 0 : _e.content) || "Start a conversation"),
            g: conversation._id,
            h: common_vendor.o(($event) => goToChat(conversation), conversation._id)
          });
        })
      }, {
        N: filteredConversations.value.length === 0
      }), {
        J: isSearching.value && searchResults.value.length > 0,
        L: isSearching.value && searchResults.value.length === 0,
        Q: common_vendor.o(loadMoreConversations)
      })) : {}, {
        R: common_vendor.p({
          currentPath: "pages/community/community"
        }),
        S: showEditRequestModal.value
      }, showEditRequestModal.value ? common_vendor.e({
        T: common_vendor.o(closeEditModal),
        U: editingRequest.value
      }, editingRequest.value ? {
        V: editingRequest.value.venue_name,
        W: common_vendor.o(($event) => editingRequest.value.venue_name = $event.detail.value),
        X: common_vendor.t(editingRequest.value.climb_date || "Select date"),
        Y: !editingRequest.value.climb_date ? 1 : "",
        Z: editingRequest.value.climb_date,
        aa: common_vendor.o(onEditDateChange),
        ab: common_vendor.t(editingRequest.value.climb_time || "Select time"),
        ac: !editingRequest.value.climb_time ? 1 : "",
        ad: editingRequest.value.climb_time,
        ae: common_vendor.o(onEditTimeChange),
        af: common_vendor.t(editingRequest.value.level_requirement || "Select level"),
        ag: !editingRequest.value.level_requirement ? 1 : "",
        ah: ["不限", "V0-V2", "V2-V4", "V4-V6", "V6-V8", "V8+"],
        ai: getLevelIndex(editingRequest.value.level_requirement),
        aj: common_vendor.o(onEditLevelChange),
        ak: common_vendor.t(editingRequest.value.max_participants || "2"),
        al: ["2", "3", "4", "5", "6"],
        am: getParticipantIndex(editingRequest.value.max_participants),
        an: common_vendor.o(onEditParticipantChange),
        ao: editingRequest.value.description,
        ap: common_vendor.o(($event) => editingRequest.value.description = $event.detail.value)
      } : {}, {
        aq: common_vendor.o(closeEditModal),
        ar: common_vendor.o(saveEditRequest),
        as: common_vendor.o(() => {
        }),
        at: common_vendor.o(closeEditModal)
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-38f92639"]]);
wx.createPage(MiniProgramPage);
