"use strict";
const common_vendor = require("../common/vendor.js");
let db = null;
function initCloud() {
  console.log("开始初始化云开发...");
  if (!common_vendor.index.cloud) {
    console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    return false;
  }
  try {
    common_vendor.index.cloud.init({
      env: "cloudbase-3g8bx0epea7f2ae2",
      traceUser: true
    });
    console.log("云开发初始化完成");
    db = common_vendor.index.cloud.database();
    console.log("数据库实例已获取", db);
    return true;
  } catch (err) {
    console.error("云开发初始化失败:", err);
    return false;
  }
}
function generateUUID() {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function getAvatarUrl(avatar, defaultSeed) {
  if (avatar && (avatar.startsWith("cloud://") || avatar.startsWith("wx"))) {
    console.log("使用云存储头像:", avatar);
    return avatar;
  }
  if (avatar && (avatar.startsWith("http://") || avatar.startsWith("https://"))) {
    console.log("使用 HTTP 头像:", avatar);
    return avatar;
  }
  const seed = defaultSeed || "defaultuser";
  const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + seed;
  console.log("使用默认头像:", defaultAvatar);
  return defaultAvatar;
}
const userAPI = {
  // 注册用户
  async register(userData) {
    if (!initCloud()) return null;
    try {
      const checkRes = await db.collection("users").where({
        email: userData.email
      }).get();
      if (checkRes.data.length > 0) {
        return { success: false, message: "该邮箱已被注册" };
      }
      const userId = generateUUID();
      const result = await db.collection("users").add({
        data: {
          _id: userId,
          email: userData.email,
          password: userData.password,
          name: userData.name,
          avatar: "",
          bio: "",
          climbing_level: userData.level || "",
          labels: [],
          created_at: db.serverDate(),
          updated_at: db.serverDate()
        }
      });
      common_vendor.index.setStorageSync("userId", userId);
      common_vendor.index.setStorageSync("userInfo", {
        _id: userId,
        email: userData.email,
        name: userData.name,
        climbing_level: userData.level || ""
      });
      return { success: true, userId };
    } catch (err) {
      console.error("注册失败:", err);
      return { success: false, message: "注册失败，请重试" };
    }
  },
  async login(email, password) {
    if (!initCloud()) {
      return { success: false, message: "云开发初始化失败" };
    }
    try {
      console.log("尝试登录，邮箱:", email);
      const res = await db.collection("users").where({
        email,
        password
      }).get();
      console.log("查询结果:", res);
      if (!res.data || res.data.length === 0) {
        return { success: false, message: "邮箱或密码错误" };
      }
      const userInfo = res.data[0];
      common_vendor.index.setStorageSync("userId", userInfo._id);
      common_vendor.index.setStorageSync("userInfo", userInfo);
      return { success: true, userInfo };
    } catch (err) {
      console.error("登录失败:", err);
      return { success: false, message: "登录失败: " + (err.message || "请重试") };
    }
  },
  async getCurrentUser() {
    const userId = common_vendor.index.getStorageSync("userId");
    if (!userId) return null;
    if (!initCloud()) return null;
    try {
      const res = await db.collection("users").doc(userId).get();
      return res.data;
    } catch (err) {
      console.error("获取用户信息失败:", err);
      return null;
    }
  },
  // 获取用户统计数据
  async getUserStats(userId) {
    if (!initCloud()) return null;
    try {
      let postsCount = 0;
      let climbRequestsCount = 0;
      let applicationsCount = 0;
      let venuesCount = 0;
      let partnersCount = 0;
      try {
        const postsRes = await db.collection("posts").where({ user_id: userId }).count();
        postsCount = postsRes.total;
      } catch (e) {
        console.log("posts 表可能不存在");
      }
      try {
        const climbRequestsRes = await db.collection("climb_requests").where({ user_id: userId }).count();
        climbRequestsCount = climbRequestsRes.total;
        const requestsRes = await db.collection("climb_requests").where({ user_id: userId }).get();
        const venues = /* @__PURE__ */ new Set();
        requestsRes.data.forEach((req) => {
          if (req.venue_name) {
            venues.add(req.venue_name);
          }
        });
        venuesCount = venues.size;
      } catch (e) {
        console.log("climb_requests 表可能不存在");
      }
      try {
        const applicationsRes = await db.collection("climb_request_participants").where({ user_id: userId, status: "accepted" }).count();
        applicationsCount = applicationsRes.total;
      } catch (e) {
        console.log("climb_request_participants 表可能不存在");
      }
      try {
        const conversationsRes = await db.collection("chat_conversation_members").where({ user_id: userId }).get();
        const partners = /* @__PURE__ */ new Set();
        for (const member of conversationsRes.data) {
          const otherMembersRes = await db.collection("chat_conversation_members").where({
            conversation_id: member.conversation_id,
            user_id: db.command.neq(userId)
          }).get();
          otherMembersRes.data.forEach((m) => partners.add(m.user_id));
        }
        partnersCount = partners.size;
      } catch (e) {
        console.log("chat_conversation_members 表可能不存在");
      }
      return {
        posts: postsCount,
        activities: climbRequestsCount + applicationsCount,
        venues: venuesCount,
        partners: partnersCount
      };
    } catch (err) {
      console.error("获取用户统计数据失败:", err);
      return {
        posts: 0,
        activities: 0,
        venues: 0,
        partners: 0
      };
    }
  },
  // 更新用户信息
  async updateUser(userId, updateData) {
    if (!initCloud()) return null;
    try {
      const result = await db.collection("users").doc(userId).update({
        data: {
          ...updateData,
          updated_at: db.serverDate()
        }
      });
      const currentInfo = common_vendor.index.getStorageSync("userInfo");
      if (currentInfo) {
        common_vendor.index.setStorageSync("userInfo", { ...currentInfo, ...updateData });
      }
      return { success: true };
    } catch (err) {
      console.error("更新用户信息失败:", err);
      return { success: false, message: "更新失败，请重试" };
    }
  },
  logout() {
    common_vendor.index.removeStorageSync("userId");
    common_vendor.index.removeStorageSync("userInfo");
  }
};
const venueAPI = {
  async getVenues(filter = {}, limit = null) {
    if (!initCloud()) return [];
    try {
      let query = db.collection("venues");
      if (filter.city) {
        query = query.where({ city: filter.city });
      }
      query = query.orderBy("rating", "desc");
      if (limit) {
        query = query.limit(limit);
      }
      const res = await query.get();
      if (res.data && res.data.length > 0) {
        return res.data.map((venue) => ({
          ...venue,
          id: venue._id || venue.id
        }));
      }
      const mockVenues = this.getMockVenues();
      return limit ? mockVenues.slice(0, limit) : mockVenues;
    } catch (err) {
      console.error("获取场馆列表失败:", err);
      const mockVenues = this.getMockVenues();
      return limit ? mockVenues.slice(0, limit) : mockVenues;
    }
  },
  async getVenueById(venueId) {
    if (!initCloud() || !venueId) return null;
    try {
      const res = await db.collection("venues").doc(venueId).get();
      if (res.data) {
        return {
          ...res.data,
          id: res.data._id || res.data.id
        };
      }
      const mockVenues = this.getMockVenues();
      return mockVenues.find((v) => v._id === venueId || v.id === venueId) || null;
    } catch (err) {
      console.error("获取场馆详情失败:", err);
      const mockVenues = this.getMockVenues();
      return mockVenues.find((v) => v._id === venueId || v.id === venueId) || null;
    }
  },
  async addVenue(venueData) {
    if (!initCloud()) return null;
    try {
      const venueId = generateUUID();
      const result = await db.collection("venues").add({
        data: {
          _id: venueId,
          ...venueData,
          created_at: db.serverDate()
        }
      });
      return { success: true, venueId };
    } catch (err) {
      console.error("添加场馆失败:", err);
      return { success: false };
    }
  },
  // 获取模拟场馆数据
  getMockVenues() {
    return [
      {
        _id: "venue1",
        id: "venue1",
        name: "Rock Time Gym",
        address: "328 Xinghu Street, Suzhou Industrial Park",
        city: "Suzhou",
        latitude: 31.3089,
        longitude: 120.7294,
        rating: 4.8,
        review_count: 234,
        images: [
          "https://images.unsplash.com/photo-1721885876144-25863108be60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        ],
        tags: ["bouldering", "ropes", "beginner friendly"],
        phone: "0512-6688-8888",
        business_hours: "10:00 AM - 10:00 PM",
        climbing_level: "V0-V8",
        difficulty_distribution: [
          { level: "V0-V2", count: 18, percentage: 32 },
          { level: "V3-V4", count: 15, percentage: 27 },
          { level: "V5-V6", count: 12, percentage: 21 },
          { level: "V7-V8", count: 8, percentage: 14 },
          { level: "V9-V10", count: 3, percentage: 5 }
        ],
        amenities: ["Lockers", "Showers", "Rest Area", "Vending Machines"],
        equipment_rental: ["Harness", "Climbing Shoes", "Chalk Bag"],
        area_info: {
          bouldering: "200㎡",
          ropes: "150㎡"
        },
        prices: [
          { type: "Day Pass", price: "¥128", description: "Unlimited daily access" },
          { type: "10-Visit Pass", price: "¥980", description: "Valid for 3 months" },
          { type: "Monthly Pass", price: "¥1,280", description: "30 days unlimited" }
        ],
        events: [
          { title: "Weekend Beginner Class", time: "Sat 2:00 PM", price: "¥168/person", spots: "5 spots left" },
          { title: "Advanced Technique Workshop", time: "Sun 10:00 AM", price: "¥268/person", spots: "3 spots left" }
        ]
      },
      {
        _id: "venue2",
        id: "venue2",
        name: "Climb Zone",
        address: "888 Jinji Lake Avenue, Suzhou Industrial Park",
        city: "Suzhou",
        latitude: 31.3156,
        longitude: 120.7345,
        rating: 4.6,
        review_count: 189,
        images: [
          "https://images.unsplash.com/photo-1581091215372-8240e3286765?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        ],
        tags: ["bouldering", "training", "project"],
        phone: "0512-6666-8888",
        business_hours: "9:00 AM - 11:00 PM",
        climbing_level: "V0-V10",
        difficulty_distribution: [
          { level: "V0-V2", count: 12, percentage: 24 },
          { level: "V3-V4", count: 14, percentage: 28 },
          { level: "V5-V6", count: 12, percentage: 24 },
          { level: "V7-V8", count: 8, percentage: 16 },
          { level: "V9-V10", count: 4, percentage: 8 }
        ],
        amenities: ["Lockers", "Showers", "Cafe", "Pro Shop"],
        equipment_rental: ["Harness", "Climbing Shoes", "Chalk Bag", "Belay Device"],
        area_info: {
          bouldering: "250㎡",
          ropes: "180㎡"
        },
        prices: [
          { type: "Day Pass", price: "¥148", description: "Unlimited daily access" },
          { type: "10-Visit Pass", price: "¥1,180", description: "Valid for 3 months" },
          { type: "Monthly Pass", price: "¥1,480", description: "30 days unlimited" }
        ],
        events: [
          { title: "Bouldering Competition", time: "Sat 6:00 PM", price: "Free", spots: "Registration open" },
          { title: "Kids Climbing Class", time: "Sun 2:00 PM", price: "¥128/kid", spots: "8 spots left" }
        ]
      },
      {
        _id: "venue3",
        id: "venue3",
        name: "Peak Climbing Gym",
        address: "168 Pingjiang Road, Gusu District, Suzhou",
        city: "Suzhou",
        latitude: 31.3234,
        longitude: 120.6256,
        rating: 4.7,
        review_count: 156,
        images: [
          "https://images.unsplash.com/photo-1564966478399-128c22699948?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        ],
        tags: ["ropes", "lead", "relaxed", "social"],
        phone: "0512-6789-8888",
        business_hours: "10:00 AM - 9:00 PM",
        climbing_level: "V1-V9",
        difficulty_distribution: [
          { level: "V0-V2", count: 10, percentage: 20 },
          { level: "V3-V4", count: 16, percentage: 32 },
          { level: "V5-V6", count: 12, percentage: 24 },
          { level: "V7-V8", count: 10, percentage: 20 },
          { level: "V9-V10", count: 2, percentage: 4 }
        ],
        amenities: ["Lockers", "Showers", "Lounge Area", "Pro Shop"],
        equipment_rental: ["Harness", "Climbing Shoes", "Chalk Bag"],
        area_info: {
          bouldering: "150㎡",
          ropes: "220㎡"
        },
        prices: [
          { type: "Day Pass", price: "¥108", description: "Unlimited daily access" },
          { type: "10-Visit Pass", price: "¥880", description: "Valid for 3 months" },
          { type: "Monthly Pass", price: "¥1,080", description: "30 days unlimited" }
        ],
        events: [
          { title: "Social Climbing Night", time: "Every Friday 7:00 PM", price: "Discount for night pass", spots: "Unlimited" },
          { title: "Lead Climbing Clinic", time: "Sun 10:00 AM", price: "¥298/person", spots: "6 spots left" }
        ]
      }
    ];
  }
};
const climbAPI = {
  // 创建约爬请求
  async createClimbRequest(requestData) {
    if (!initCloud()) return null;
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      if (!currentUserId) {
        return { success: false, message: "请先登录" };
      }
      const requestId = generateUUID();
      const result = await db.collection("climb_requests").add({
        data: {
          _id: requestId,
          user_id: currentUserId,
          venue_id: requestData.venue_id || "",
          venue_name: requestData.venue_name,
          climb_date: requestData.climb_date,
          climb_time: requestData.climb_time,
          level_requirement: requestData.level_requirement || "",
          description: requestData.description || "",
          max_participants: requestData.max_participants || 4,
          status: "pending",
          tags: requestData.tags || [],
          created_at: db.serverDate(),
          updated_at: db.serverDate()
        }
      });
      return { success: true, requestId };
    } catch (err) {
      console.error("创建约爬请求失败:", err);
      return { success: false, message: "发布失败，请重试" };
    }
  },
  // 获取约爬请求列表
  async getClimbRequests() {
    if (!initCloud()) return [];
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      const res = await db.collection("climb_requests").where({
        status: db.command.in(["pending", "ongoing"])
      }).orderBy("created_at", "desc").get();
      const requests = res.data || [];
      const result = [];
      for (const request of requests) {
        if (currentUserId && request.user_id === currentUserId) {
          continue;
        }
        let userInfo = null;
        if (request.user_id) {
          try {
            const userRes = await db.collection("users").doc(request.user_id).get();
            userInfo = userRes.data;
          } catch (err) {
            console.error("获取用户信息失败:", err);
          }
        }
        const participantRes = await db.collection("climb_request_participants").where({
          request_id: request._id,
          status: "accepted"
        }).get();
        const participantCount = participantRes.data.length;
        result.push({
          ...request,
          user: userInfo,
          participant_count: participantCount
        });
      }
      return result;
    } catch (err) {
      console.error("获取约爬请求列表失败:", err);
      return [];
    }
  },
  // 申请加入约爬
  async applyJoinRequest(requestId) {
    if (!initCloud()) return null;
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      if (!currentUserId) {
        return { success: false, message: "请先登录" };
      }
      const requestRes = await db.collection("climb_requests").doc(requestId).get();
      if (!requestRes.data) {
        return { success: false, message: "请求不存在" };
      }
      const request = requestRes.data;
      const maxParticipants = request.max_participants || 4;
      const participantRes = await db.collection("climb_request_participants").where({
        request_id: requestId,
        status: "accepted"
      }).get();
      if (participantRes.data.length >= maxParticipants) {
        return { success: false, message: "人数已满" };
      }
      const existingRes = await db.collection("climb_request_participants").where({
        request_id: requestId,
        user_id: currentUserId
      }).get();
      if (existingRes.data.length > 0) {
        return { success: false, message: "你已经申请过了" };
      }
      const participantId = generateUUID();
      await db.collection("climb_request_participants").add({
        data: {
          _id: participantId,
          request_id: requestId,
          user_id: currentUserId,
          status: "pending",
          joined_at: db.serverDate()
        }
      });
      return { success: true };
    } catch (err) {
      console.error("申请加入失败:", err);
      return { success: false, message: "申请失败，请重试" };
    }
  },
  // 获取我发布的约爬请求（以及别人申请的状态）
  async getMyRequestsWithApplications() {
    if (!initCloud()) return [];
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      if (!currentUserId) return [];
      const requestRes = await db.collection("climb_requests").where({
        user_id: currentUserId
      }).orderBy("created_at", "desc").get();
      const requests = requestRes.data || [];
      const result = [];
      for (const request of requests) {
        const participantRes = await db.collection("climb_request_participants").where({
          request_id: request._id
        }).get();
        const acceptedRes = await db.collection("climb_request_participants").where({
          request_id: request._id,
          status: "accepted"
        }).get();
        const applicants = [];
        for (const participant of participantRes.data) {
          const userRes = await db.collection("users").doc(participant.user_id).get();
          applicants.push({
            ...participant,
            user: userRes.data
          });
        }
        result.push({
          ...request,
          applicants,
          participant_count: acceptedRes.data.length,
          is_owner: true
        });
      }
      return result;
    } catch (err) {
      console.error("获取我的约爬请求失败:", err);
      return [];
    }
  },
  // 获取我申请的约爬请求
  async getMyApplications() {
    if (!initCloud()) return [];
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      if (!currentUserId) return [];
      const participantRes = await db.collection("climb_request_participants").where({
        user_id: currentUserId
      }).get();
      const participants = participantRes.data || [];
      const result = [];
      for (const participant of participants) {
        const requestRes = await db.collection("climb_requests").doc(participant.request_id).get();
        const request = requestRes.data;
        if (!request) continue;
        const userRes = await db.collection("users").doc(request.user_id).get();
        const acceptedRes = await db.collection("climb_request_participants").where({
          request_id: participant.request_id,
          status: "accepted"
        }).get();
        result.push({
          ...request,
          user: userRes.data,
          my_status: participant.status,
          participant_count: acceptedRes.data.length,
          is_owner: false
        });
      }
      return result;
    } catch (err) {
      console.error("获取我的申请失败:", err);
      return [];
    }
  },
  // 获取我发布的约爬请求（简单版本）
  async getMyRequests() {
    if (!initCloud()) return [];
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      if (!currentUserId) return [];
      const requestRes = await db.collection("climb_requests").where({
        user_id: currentUserId
      }).orderBy("created_at", "desc").get();
      const requests = requestRes.data || [];
      return requests.map((req) => ({
        ...req,
        venueName: req.venue_name,
        climbDate: req.climb_date,
        climbTime: req.climb_time,
        levelRequirement: req.level_requirement,
        maxParticipants: req.max_participants
      }));
    } catch (err) {
      console.error("获取我的约爬请求失败:", err);
      return [];
    }
  },
  // 接受申请
  async acceptApplication(participantId) {
    if (!initCloud()) return null;
    try {
      await db.collection("climb_request_participants").doc(participantId).update({
        data: {
          status: "accepted"
        }
      });
      return { success: true };
    } catch (err) {
      console.error("接受申请失败:", err);
      return { success: false };
    }
  },
  // 拒绝申请
  async rejectApplication(participantId) {
    if (!initCloud()) return null;
    try {
      await db.collection("climb_request_participants").doc(participantId).update({
        data: {
          status: "rejected"
        }
      });
      return { success: true };
    } catch (err) {
      console.error("拒绝申请失败:", err);
      return { success: false };
    }
  },
  // 响应聊天中的约爬邀请（同意/拒绝）
  async respondClimbInvite(requestId, status, messageId) {
    if (!initCloud()) return null;
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      if (!currentUserId) {
        return { success: false, message: "请先登录" };
      }
      if (status === "accepted") {
        const requestRes = await db.collection("climb_requests").doc(requestId).get();
        if (!requestRes.data) {
          return { success: false, message: "请求不存在" };
        }
        const request = requestRes.data;
        const maxParticipants = request.max_participants || 4;
        const participantRes = await db.collection("climb_request_participants").where({
          request_id: requestId,
          status: "accepted"
        }).get();
        if (participantRes.data.length >= maxParticipants) {
          return { success: false, message: "人数已满" };
        }
        const existingRes = await db.collection("climb_request_participants").where({
          request_id: requestId,
          user_id: currentUserId
        }).get();
        if (existingRes.data.length > 0) {
          await db.collection("climb_request_participants").doc(existingRes.data[0]._id).update({
            data: {
              status: "accepted"
            }
          });
        } else {
          const participantId = generateUUID();
          await db.collection("climb_request_participants").add({
            data: {
              _id: participantId,
              request_id: requestId,
              user_id: currentUserId,
              status: "accepted",
              joined_at: db.serverDate()
            }
          });
        }
      }
      if (messageId) {
        try {
          await db.collection("chat_messages").doc(messageId).update({
            data: {
              "extra.status": status,
              updated_at: db.serverDate()
            }
          });
        } catch (err) {
          console.error("更新消息状态失败:", err);
        }
      }
      return { success: true };
    } catch (err) {
      console.error("响应约爬邀请失败:", err);
      return { success: false, message: "操作失败，请重试" };
    }
  },
  // 获取约爬请求详情
  async getClimbRequestById(requestId) {
    if (!initCloud()) return null;
    try {
      const requestRes = await db.collection("climb_requests").doc(requestId).get();
      return requestRes.data;
    } catch (err) {
      console.error("获取约爬请求详情失败:", err);
      return null;
    }
  },
  // 更新约爬请求
  async updateClimbRequest(requestId, requestData) {
    if (!initCloud()) return null;
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      if (!currentUserId) {
        return { success: false, message: "请先登录" };
      }
      const requestRes = await db.collection("climb_requests").doc(requestId).get();
      const request = requestRes.data;
      if (!request) {
        return { success: false, message: "请求不存在" };
      }
      if (request.user_id !== currentUserId) {
        return { success: false, message: "只能修改自己的约爬请求" };
      }
      await db.collection("climb_requests").doc(requestId).update({
        data: {
          venue_name: requestData.venue_name,
          climb_date: requestData.climb_date,
          climb_time: requestData.climb_time,
          level_requirement: requestData.level_requirement,
          max_participants: requestData.max_participants,
          description: requestData.description,
          tags: requestData.tags || [],
          updated_at: db.serverDate()
        }
      });
      return { success: true };
    } catch (err) {
      console.error("更新约爬请求失败:", err);
      return { success: false, message: "更新失败，请重试" };
    }
  },
  // 删除约爬请求
  async deleteClimbRequest(requestId) {
    if (!initCloud()) return null;
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      if (!currentUserId) {
        return { success: false, message: "请先登录" };
      }
      const requestRes = await db.collection("climb_requests").doc(requestId).get();
      const request = requestRes.data;
      if (!request) {
        return { success: false, message: "请求不存在" };
      }
      if (request.user_id !== currentUserId) {
        return { success: false, message: "只能删除自己的约爬请求" };
      }
      await db.collection("climb_requests").doc(requestId).remove();
      const participantsRes = await db.collection("climb_request_participants").where({ request_id: requestId }).get();
      for (const participant of participantsRes.data || []) {
        await db.collection("climb_request_participants").doc(participant._id).remove();
      }
      return { success: true };
    } catch (err) {
      console.error("删除约爬请求失败:", err);
      return { success: false, message: "删除失败，请重试" };
    }
  }
};
const postAPI = {
  // 获取帖子列表
  async getPosts() {
    if (!initCloud()) return [];
    try {
      const res = await db.collection("posts").orderBy("created_at", "desc").get();
      const posts = res.data || [];
      const result = [];
      for (const post of posts) {
        let userInfo = null;
        if (post.user_id) {
          try {
            const userRes = await db.collection("users").doc(post.user_id).get();
            userInfo = userRes.data;
          } catch (err) {
            console.error("获取用户信息失败:", err);
          }
        }
        result.push({
          ...post,
          user: userInfo || {
            name: "Unknown User",
            avatar: "",
            level: "V1"
          }
        });
      }
      return result;
    } catch (err) {
      console.error("获取帖子列表失败:", err);
      return [];
    }
  },
  // 创建帖子
  async createPost(postData) {
    if (!initCloud()) return null;
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!currentUserId) {
        return { success: false, message: "请先登录" };
      }
      const postId = generateUUID();
      const result = await db.collection("posts").add({
        data: {
          _id: postId,
          user_id: currentUserId,
          title: postData.title,
          content: postData.content,
          images: postData.images || [],
          category: postData.category || "general",
          tags: postData.tags || [],
          visibility: postData.visibility || "public",
          likes: 0,
          liked_by: [],
          comments: [],
          created_at: db.serverDate(),
          updated_at: db.serverDate()
        }
      });
      return { success: true, postId };
    } catch (err) {
      console.error("创建帖子失败:", err);
      return { success: false, message: "发布失败，请重试" };
    }
  },
  // 点赞帖子
  async likePost(postId) {
    if (!initCloud()) return null;
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      if (!currentUserId) return null;
      const postRes = await db.collection("posts").doc(postId).get();
      const post = postRes.data;
      if (!post) return null;
      const liked = post.liked_by && post.liked_by.includes(currentUserId);
      let newLikedBy = post.liked_by || [];
      let newLikes = post.likes || 0;
      if (liked) {
        newLikedBy = newLikedBy.filter((id) => id !== currentUserId);
        newLikes = Math.max(0, newLikes - 1);
      } else {
        if (!newLikedBy.includes(currentUserId)) {
          newLikedBy.push(currentUserId);
        }
        newLikes += 1;
      }
      await db.collection("posts").doc(postId).update({
        data: {
          likes: newLikes,
          liked_by: newLikedBy
        }
      });
      return { liked: !liked };
    } catch (err) {
      console.error("点赞失败:", err);
      return null;
    }
  },
  // 获取用户自己的帖子
  async getMyPosts() {
    if (!initCloud()) return [];
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      if (!currentUserId) return [];
      const res = await db.collection("posts").where({ user_id: currentUserId }).orderBy("created_at", "desc").get();
      const posts = res.data || [];
      const result = [];
      for (const post of posts) {
        let userInfo = null;
        if (post.user_id) {
          try {
            const userRes = await db.collection("users").doc(post.user_id).get();
            userInfo = userRes.data;
          } catch (err) {
            console.error("获取用户信息失败:", err);
          }
        }
        result.push({
          ...post,
          user: userInfo || {
            name: "Unknown User",
            avatar: "",
            level: "V1"
          }
        });
      }
      return result;
    } catch (err) {
      console.error("获取我的帖子失败:", err);
      return [];
    }
  },
  // 删除帖子
  async deletePost(postId) {
    if (!initCloud()) return null;
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      if (!currentUserId) {
        return { success: false, message: "请先登录" };
      }
      const postRes = await db.collection("posts").doc(postId).get();
      const post = postRes.data;
      if (!post) {
        return { success: false, message: "帖子不存在" };
      }
      if (post.user_id !== currentUserId) {
        return { success: false, message: "只能删除自己的帖子" };
      }
      await db.collection("posts").doc(postId).remove();
      return { success: true };
    } catch (err) {
      console.error("删除帖子失败:", err);
      return { success: false, message: "删除失败，请重试" };
    }
  },
  // 搜索聊天记录
  async searchMessages(keyword) {
    if (!initCloud()) return [];
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      if (!currentUserId) return [];
      const memberRes = await db.collection("chat_conversation_members").where({
        user_id: currentUserId
      }).get();
      const conversationIds = memberRes.data.map((m) => m.conversation_id);
      if (conversationIds.length === 0) return [];
      const messages = [];
      for (const convId of conversationIds) {
        const msgRes = await db.collection("chat_messages").where({
          conversation_id: convId
        }).orderBy("created_at", "desc").get();
        const convMessages = msgRes.data || [];
        const filtered = convMessages.filter((msg) => {
          return msg.content && msg.content.toLowerCase().includes(keyword.toLowerCase());
        });
        for (const msg of filtered) {
          const convRes = await db.collection("chat_conversations").doc(convId).get();
          const conversation = convRes.data;
          if (!conversation) continue;
          const memberListRes = await db.collection("chat_conversation_members").where({
            conversation_id: convId
          }).get();
          const memberIds = memberListRes.data.map((m) => m.user_id).filter((id) => id !== currentUserId);
          let otherUser = null;
          if (memberIds.length > 0) {
            const userRes = await db.collection("users").doc(memberIds[0]).get();
            otherUser = userRes.data;
          }
          messages.push({
            _id: msg._id,
            conversation_id: convId,
            content: msg.content,
            sender_id: msg.sender_id,
            created_at: msg.created_at,
            is_self: msg.sender_id === currentUserId,
            other_user: otherUser
          });
        }
      }
      messages.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      return messages;
    } catch (err) {
      console.error("搜索消息失败:", err);
      return [];
    }
  }
};
const chatAPI = {
  // 搜索用户（通过 name）
  async searchUsers(keyword) {
    if (!initCloud()) return [];
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      console.log("搜索关键词:", keyword, "当前用户ID:", currentUserId);
      let query = db.collection("users");
      if (keyword) {
        query = query.where({
          name: db.RegExp({
            regexp: keyword,
            options: "i"
          })
        });
      }
      const res = await query.get();
      console.log("搜索结果:", res.data);
      let results = res.data || [];
      if (currentUserId) {
        results = results.filter((user) => user._id !== currentUserId);
      }
      return results;
    } catch (err) {
      console.error("搜索用户失败:", err);
      common_vendor.index.showToast({
        title: "搜索失败，请重试",
        icon: "none"
      });
      return [];
    }
  },
  // 获取或创建单聊会话
  async getOrCreateSingleConversation(otherUserId) {
    if (!initCloud()) return null;
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      if (!currentUserId) return null;
      const memberRes = await db.collection("chat_conversation_members").where({
        user_id: db.command.in([currentUserId, otherUserId])
      }).get();
      const conversationMemberCount = {};
      memberRes.data.forEach((member) => {
        if (!conversationMemberCount[member.conversation_id]) {
          conversationMemberCount[member.conversation_id] = 0;
        }
        conversationMemberCount[member.conversation_id]++;
      });
      for (const convId in conversationMemberCount) {
        if (conversationMemberCount[convId] === 2) {
          const convRes = await db.collection("chat_conversations").doc(convId).get();
          if (convRes.data && convRes.data.type === "single") {
            return convRes.data;
          }
        }
      }
      const conversationId = generateUUID();
      await db.collection("chat_conversations").add({
        data: {
          _id: conversationId,
          type: "single",
          created_at: db.serverDate()
        }
      });
      await db.collection("chat_conversation_members").add({
        data: {
          _id: generateUUID(),
          conversation_id: conversationId,
          user_id: currentUserId,
          unread_count: 0,
          joined_at: db.serverDate()
        }
      });
      await db.collection("chat_conversation_members").add({
        data: {
          _id: generateUUID(),
          conversation_id: conversationId,
          user_id: otherUserId,
          unread_count: 0,
          joined_at: db.serverDate()
        }
      });
      return { _id: conversationId, type: "single" };
    } catch (err) {
      console.error("获取或创建会话失败:", err);
      return null;
    }
  },
  // 获取当前用户的所有会话
  async getConversations() {
    if (!initCloud()) return [];
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      if (!currentUserId) return [];
      const memberRes = await db.collection("chat_conversation_members").where({
        user_id: currentUserId
      }).get();
      if (memberRes.data.length === 0) return [];
      const unreadCountMap = {};
      const conversationIds = [];
      for (const member of memberRes.data) {
        unreadCountMap[member.conversation_id] = member.unread_count || 0;
        conversationIds.push(member.conversation_id);
      }
      const convRes = await db.collection("chat_conversations").where({
        _id: db.command.in(conversationIds)
      }).orderBy("created_at", "desc").get();
      const conversations = convRes.data || [];
      const result = [];
      for (const conv of conversations) {
        const convMemberRes = await db.collection("chat_conversation_members").where({
          conversation_id: conv._id
        }).get();
        const memberUserIds = convMemberRes.data.map((m) => m.user_id).filter((id) => id !== currentUserId);
        let otherMembers = [];
        if (memberUserIds.length > 0) {
          const userRes = await db.collection("users").where({
            _id: db.command.in(memberUserIds)
          }).get();
          otherMembers = userRes.data || [];
        }
        const msgRes = await db.collection("chat_messages").where({
          conversation_id: conv._id
        }).orderBy("created_at", "desc").limit(1).get();
        const lastMessage = msgRes.data && msgRes.data.length > 0 ? msgRes.data[0] : null;
        result.push({
          ...conv,
          otherMembers,
          lastMessage,
          unread_count: unreadCountMap[conv._id] || 0
        });
      }
      return result;
    } catch (err) {
      console.error("获取会话列表失败:", err);
      return [];
    }
  },
  // 获取会话消息
  async getMessages(conversationId) {
    if (!initCloud()) return [];
    try {
      const res = await db.collection("chat_messages").where({
        conversation_id: conversationId
      }).orderBy("created_at", "asc").get();
      return res.data || [];
    } catch (err) {
      console.error("获取消息失败:", err);
      return [];
    }
  },
  // 发送消息
  async sendMessage(conversationId, content, type = "text", extra = {}) {
    if (!initCloud()) return null;
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      if (!currentUserId) return null;
      const messageId = generateUUID();
      const messageData = {
        _id: messageId,
        conversation_id: conversationId,
        sender_id: currentUserId,
        content,
        type,
        created_at: db.serverDate()
      };
      if (Object.keys(extra).length > 0) {
        messageData.extra = extra;
      }
      await db.collection("chat_messages").add({
        data: messageData
      });
      const memberRes = await db.collection("chat_conversation_members").where({
        conversation_id: conversationId,
        user_id: db.command.neq(currentUserId)
      }).get();
      for (const member of memberRes.data) {
        let currentUnread = member.unread_count || 0;
        try {
          await db.collection("chat_conversation_members").doc(member._id).update({
            data: {
              unread_count: currentUnread + 1
            }
          });
        } catch (e) {
          await db.collection("chat_conversation_members").doc(member._id).update({
            data: {
              unread_count: 1
            }
          });
        }
      }
      return {
        ...messageData,
        created_at: /* @__PURE__ */ new Date()
      };
    } catch (err) {
      console.error("发送消息失败:", err);
      return null;
    }
  },
  // 获取用户信息
  async getUserById(userId) {
    if (!initCloud()) return null;
    try {
      const res = await db.collection("users").doc(userId).get();
      return res.data;
    } catch (err) {
      console.error("获取用户信息失败:", err);
      return null;
    }
  },
  // 清空会话的未读计数
  async clearUnreadCount(conversationId) {
    if (!initCloud()) return null;
    try {
      const currentUserId = common_vendor.index.getStorageSync("userId");
      if (!currentUserId) return null;
      const memberRes = await db.collection("chat_conversation_members").where({
        conversation_id: conversationId,
        user_id: currentUserId
      }).get();
      if (memberRes.data.length > 0) {
        const member = memberRes.data[0];
        await db.collection("chat_conversation_members").doc(member._id).update({
          data: {
            unread_count: 0
          }
        });
      }
      return { success: true };
    } catch (err) {
      console.error("清空未读计数失败:", err);
      return null;
    }
  }
};
const smartMatchAPI = {
  // 将 level 字符串转换为 L 组号 (1-6)
  getLevelGroup(levelStr) {
    if (!levelStr) return 3;
    if (levelStr === "V0") return 1;
    if (levelStr === "V1" || levelStr === "V1-V2" || levelStr === "V2" || levelStr === "V0-V2 Beginner") return 2;
    if (levelStr === "V3" || levelStr === "V3-V4" || levelStr === "V3-V5 Intermediate" || levelStr === "V4") return 3;
    if (levelStr === "V5" || levelStr === "V5-V6" || levelStr === "V6") return 4;
    if (levelStr === "V7" || levelStr === "V7-V8" || levelStr === "V8" || levelStr === "V6-V8 Advanced") return 5;
    if (levelStr === "V9+" || levelStr === "V9+ Expert") return 6;
    return 3;
  },
  // 性格互补标签对
  complementaryPairs: [
    ["Extrovert", "Introvert"],
    ["Planner", "Adventurer"],
    ["Competitive", "Relaxed"],
    ["Early Bird", "Night Owl"]
  ],
  // 约爬相关标签组
  relatedGroups: [
    ["bouldering", "project"],
    ["ropes", "lead"],
    ["training", "intense"],
    ["beginner", "relaxed", "social"]
  ],
  // 计算攀岩水平得分
  calculateLevelScore(myLevel, requestLevel) {
    const myL = this.getLevelGroup(myLevel);
    const reqL = this.getLevelGroup(requestLevel);
    const diff = Math.abs(myL - reqL);
    if (diff === 0) return 35;
    else if (diff === 1) return 20;
    else if (diff === 2) return 10;
    else return 5;
  },
  // 解析时间字符串，返回分钟数
  parseTime(timeStr) {
    if (!timeStr) return null;
    const match = timeStr.match(/(\d+):(\d+)/);
    if (match) {
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return null;
  },
  // 计算时间重叠分钟数
  calculateTimeOverlap(myTime, reqTime) {
    if (!myTime || !reqTime || myTime.includes("any") || reqTime.includes("any")) {
      return 120;
    }
    const parseRange = (timeRange) => {
      const parts = timeRange.split("-");
      if (parts.length === 2) {
        return {
          start: this.parseTime(parts[0]),
          end: this.parseTime(parts[1])
        };
      }
      const singleTime = this.parseTime(timeRange);
      return { start: singleTime, end: singleTime + 60 };
    };
    const myRange = parseRange(myTime);
    const reqRange = parseRange(reqTime);
    if (!myRange.start || !myRange.end || !reqRange.start || !reqRange.end) {
      return 0;
    }
    const overlapStart = Math.max(myRange.start, reqRange.start);
    const overlapEnd = Math.min(myRange.end, reqRange.end);
    if (overlapEnd > overlapStart) {
      return overlapEnd - overlapStart;
    }
    return 0;
  },
  // 计算时间/场馆得分
  calculateTimeVenueScore(request, myRequest = null, anyTime = false) {
    let score = 0;
    if (myRequest && myRequest.venue_name === request.venue_name) {
      score += 12;
    }
    if (myRequest && myRequest.climb_date === request.climb_date) {
      score += 10;
    }
    const overlap = anyTime ? 120 : this.calculateTimeOverlap(
      myRequest ? myRequest.climb_time : null,
      request.climb_time
    );
    if (overlap >= 120) {
      score += 8;
    } else if (overlap >= 60) {
      score += 5;
    } else if (overlap > 0) {
      score += 3;
    }
    return Math.min(score, 30);
  },
  // 计算性格标签得分
  calculatePersonalityLabelScore(myLabels, requestLabels) {
    if (!myLabels || myLabels.length === 0 || !requestLabels || requestLabels.length === 0) {
      return 3;
    }
    const myLabelSet = new Set(myLabels);
    const reqLabelSet = new Set(requestLabels);
    const commonLabels = [...myLabelSet].filter((x) => reqLabelSet.has(x));
    if (commonLabels.length >= 3) return 10;
    if (commonLabels.length === 2) return 8;
    if (commonLabels.length === 1) return 5;
    for (const pair of this.complementaryPairs) {
      if (myLabelSet.has(pair[0]) && reqLabelSet.has(pair[1]) || myLabelSet.has(pair[1]) && reqLabelSet.has(pair[0])) {
        return 4;
      }
    }
    return 2;
  },
  // 计算约爬请求标签得分
  calculateRequestTagScore(myTags, requestTags) {
    if (!myTags || myTags.length === 0 || !requestTags || requestTags.length === 0) {
      return 10;
    }
    const myTagSet = new Set(myTags);
    const reqTagSet = new Set(requestTags);
    const commonTags = [...myTagSet].filter((x) => reqTagSet.has(x));
    if (commonTags.length >= 2) return 10;
    if (commonTags.length === 1) return 7;
    for (const group of this.relatedGroups) {
      const hasMyTag = group.some((tag) => myTagSet.has(tag));
      const hasReqTag = group.some((tag) => reqTagSet.has(tag));
      if (hasMyTag && hasReqTag) {
        return 4;
      }
    }
    return 2;
  },
  // 计算历史互动得分
  async calculateInteractionScore(myUserId, requestUserId) {
    try {
      const successClimbs = await db.collection("climb_request_participants").where({
        user_id: myUserId,
        status: "accepted"
      }).get();
      for (const participant of successClimbs.data) {
        const request = await db.collection("climb_requests").doc(participant.request_id).get();
        if (request.data && request.data.user_id === requestUserId) {
          return 10;
        }
      }
      const myMemberships = await db.collection("chat_conversation_members").where({ user_id: myUserId }).get();
      for (const membership of myMemberships.data) {
        const otherMembers = await db.collection("chat_conversation_members").where({
          conversation_id: membership.conversation_id,
          user_id: requestUserId
        }).get();
        if (otherMembers.data.length > 0) {
          const messages = await db.collection("chat_messages").where({ conversation_id: membership.conversation_id }).count();
          if (messages.total >= 5) return 9;
          else if (messages.total > 0) return 7;
          else return 5;
        }
      }
      const applications = await db.collection("climb_request_participants").where({
        user_id: myUserId
      }).get();
      for (const app of applications.data) {
        const request = await db.collection("climb_requests").doc(app.request_id).get();
        if (request.data && request.data.user_id === requestUserId) {
          return 5;
        }
      }
      return 3;
    } catch (err) {
      console.error("计算互动得分失败:", err);
      return 3;
    }
  },
  // 计算共同活动得分
  async calculateActivityScore(myUserId, requestUserId) {
    try {
      const myRequests = await db.collection("climb_requests").where({ user_id: myUserId }).get();
      const reqRequests = await db.collection("climb_requests").where({ user_id: requestUserId }).get();
      const myVenues = new Set(myRequests.data.map((r) => r.venue_name).filter(Boolean));
      const reqVenues = new Set(reqRequests.data.map((r) => r.venue_name).filter(Boolean));
      const commonVenues = [...myVenues].filter((x) => reqVenues.has(x));
      let maxGymCount = 0;
      for (const venue of commonVenues) {
        const myCount = myRequests.data.filter((r) => r.venue_name === venue).length;
        const reqCount = reqRequests.data.filter((r) => r.venue_name === venue).length;
        maxGymCount = Math.max(maxGymCount, Math.min(myCount, reqCount));
      }
      if (maxGymCount >= 3) return 5;
      else if (maxGymCount >= 1) return 3;
      else if (myVenues.size > 0 && reqVenues.size > 0) return 2;
      return 1;
    } catch (err) {
      console.error("计算活动得分失败:", err);
      return 1;
    }
  },
  // 获取匹配理由
  getMatchReasons(scoreBreakdown, myLabels, reqLabels, myTags, reqTags) {
    const reasons = [];
    if (scoreBreakdown.level === 35) {
      reasons.push("同水平，完美搭档");
    } else if (scoreBreakdown.level >= 20) {
      reasons.push("水平相近，可以互相学习");
    }
    if (scoreBreakdown.time_venue >= 20) {
      reasons.push("同场馆/时间方便约爬");
    }
    if (scoreBreakdown.personality_label >= 8) {
      if (scoreBreakdown.personality_label >= 8) {
        reasons.push("性格相似，默契度高");
      } else if (scoreBreakdown.personality_label >= 4) {
        reasons.push("性格互补，合作愉快");
      }
    }
    if (scoreBreakdown.climb_request_label >= 7) {
      reasons.push("攀爬类型匹配");
    }
    if (scoreBreakdown.interaction >= 7) {
      reasons.push("聊过天/约过爬，熟悉可靠");
    }
    if (reasons.length === 0) {
      reasons.push("看看这个合不合适");
    }
    return reasons;
  },
  // 计算完整匹配得分
  async calculateMatchScore(myUserInfo, requestInfo, myRequest = null, anyTime = false, overrideLevel = null) {
    const myUserId = common_vendor.index.getStorageSync("userId");
    if (!myUserId) return { total: 0, percentage: 0, reasons: [] };
    try {
      const levelToUse = overrideLevel || myUserInfo.climbing_level;
      const levelScore = this.calculateLevelScore(
        levelToUse,
        requestInfo.level_requirement
      );
      const timeVenueScore = this.calculateTimeVenueScore(requestInfo, myRequest, anyTime);
      const personalityLabelScore = this.calculatePersonalityLabelScore(
        myUserInfo.labels,
        requestInfo.user ? requestInfo.user.labels : null
      );
      const requestTagScore = this.calculateRequestTagScore(
        myRequest ? myRequest.tags : null,
        requestInfo.tags
      );
      const interactionScore = await this.calculateInteractionScore(
        myUserId,
        requestInfo.user_id
      );
      const activityScore = await this.calculateActivityScore(
        myUserId,
        requestInfo.user_id
      );
      const total = levelScore + timeVenueScore + personalityLabelScore + requestTagScore + interactionScore + activityScore;
      const reasons = this.getMatchReasons(
        {
          level: levelScore,
          time_venue: timeVenueScore,
          personality_label: personalityLabelScore,
          climb_request_label: requestTagScore,
          interaction: interactionScore,
          activity: activityScore
        },
        myUserInfo.labels,
        requestInfo.user ? requestInfo.user.labels : null,
        myRequest ? myRequest.tags : null,
        requestInfo.tags
      );
      return {
        total,
        percentage: Math.round(total),
        // 直接用分作为百分比
        breakdown: {
          level: levelScore,
          time_venue: timeVenueScore,
          personality_label: personalityLabelScore,
          climb_request_label: requestTagScore,
          interaction: interactionScore,
          activity: activityScore
        },
        reasons
      };
    } catch (err) {
      console.error("计算匹配得分失败:", err);
      return { total: 0, percentage: 0, reasons: ["匹配失败"] };
    }
  },
  // 对约爬请求进行智能匹配和排序
  async smartMatchRequests(requests, myRequest = null, anyTime = false, overrideLevel = null) {
    if (!initCloud()) return requests;
    try {
      const myUserInfo = await this.user.getCurrentUser();
      if (!myUserInfo) return requests;
      const matchedRequests = [];
      for (const request of requests) {
        const matchScore = await this.calculateMatchScore(
          myUserInfo,
          request,
          myRequest,
          anyTime,
          overrideLevel
        );
        if (matchScore.total >= 40) {
          matchedRequests.push({
            ...request,
            match_score: matchScore
          });
        }
      }
      matchedRequests.sort((a, b) => {
        return (b.match_score ? b.match_score.total : 0) - (a.match_score ? a.match_score.total : 0);
      });
      return matchedRequests;
    } catch (err) {
      console.error("智能匹配失败:", err);
      return requests;
    }
  }
};
const storageAPI = {
  // 上传文件到云存储
  async uploadFile(filePath, options = {}) {
    if (!initCloud()) return null;
    try {
      console.log("开始上传文件:", filePath);
      const {
        directory = "uploads",
        fileName = generateUUID(),
        fileType = ""
      } = options;
      let extension = "";
      if (filePath.lastIndexOf(".") > -1) {
        extension = filePath.substring(filePath.lastIndexOf("."));
      }
      const cloudPath = `${directory}/${fileName}${extension}`;
      console.log("云存储路径:", cloudPath);
      const result = await common_vendor.index.cloud.uploadFile({
        cloudPath,
        filePath
      });
      console.log("上传成功:", result);
      return {
        success: true,
        fileID: result.fileID,
        cloudPath
      };
    } catch (err) {
      console.error("上传文件失败:", err);
      return {
        success: false,
        message: err.errMsg || "上传失败"
      };
    }
  },
  // 上传头像
  async uploadAvatar(filePath) {
    const userId = common_vendor.index.getStorageSync("userId") || "guest";
    return this.uploadFile(filePath, {
      directory: "avatars",
      fileName: `avatar_${userId}_${Date.now()}`
    });
  },
  // 上传帖子图片
  async uploadPostImage(filePath) {
    const userId = common_vendor.index.getStorageSync("userId") || "guest";
    return this.uploadFile(filePath, {
      directory: "posts",
      fileName: `post_${userId}_${Date.now()}`
    });
  },
  // 删除云文件
  async deleteFile(fileID) {
    if (!initCloud()) return null;
    try {
      const result = await common_vendor.index.cloud.deleteFile({
        fileList: [fileID]
      });
      return {
        success: true,
        result: result.fileList
      };
    } catch (err) {
      console.error("删除文件失败:", err);
      return {
        success: false,
        message: err.errMsg || "删除失败"
      };
    }
  },
  // 获取临时文件链接
  async getTempFileURL(fileID) {
    if (!initCloud()) return null;
    try {
      const result = await common_vendor.index.cloud.getTempFileURL({
        fileList: [fileID]
      });
      if (result.fileList && result.fileList.length > 0) {
        return {
          success: true,
          tempFileURL: result.fileList[0].tempFileURL,
          fileID: result.fileList[0].fileID
        };
      }
      return { success: false, message: "获取链接失败" };
    } catch (err) {
      console.error("获取临时链接失败:", err);
      return {
        success: false,
        message: err.errMsg || "获取链接失败"
      };
    }
  }
};
smartMatchAPI.user = userAPI;
const cloud = {
  initCloud,
  generateUUID,
  getAvatarUrl,
  // 导出头像处理工具函数
  // 使用 getter 确保每次获取最新的 db
  get db() {
    if (!db) {
      initCloud();
    }
    return db;
  },
  user: userAPI,
  venue: venueAPI,
  chat: chatAPI,
  post: postAPI,
  climb: climbAPI,
  smartMatch: smartMatchAPI,
  storage: storageAPI
};
exports.cloud = cloud;
