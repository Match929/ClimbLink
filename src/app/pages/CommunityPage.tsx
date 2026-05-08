import { useState } from "react";
import { Heart, MessageCircle, Share2, Plus, TrendingUp, Search, Bell, CheckCircle, Clock, Edit, Users as UsersIcon, FileText } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { CommentDrawer } from "../components/CommentDrawer";

export function CommunityPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Feed");
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedPostCommentCount, setSelectedPostCommentCount] = useState(0);

  const tabs = ["Feed", "List", "Messages"];

  const handleOpenComments = (postId: number, commentCount: number) => {
    setSelectedPostId(postId);
    setSelectedPostCommentCount(commentCount);
    setCommentDrawerOpen(true);
  };

  const handleCloseComments = () => {
    setCommentDrawerOpen(false);
    setSelectedPostId(null);
  };

  const posts = [
    {
      id: 1,
      user: {
        name: "Lee the Climber",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=post1",
        level: "V5",
      },
      content: "Finally completed the V5 red route today! Thanks to @AQiang for the patient guidance. Climbing really requires persistence 💪",
      images: [
        "https://images.unsplash.com/photo-1721885876144-25863108be60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBneW0lMjBpbmRvb3J8ZW58MXx8fHwxNzc0MjkwOTkwfDA&ixlib=rb-4.1.0&q=80&w=400",
      ],
      venue: "Rock Time Gym",
      time: "2 hours ago",
      likes: 128,
      comments: 23,
      tags: ["Advanced Challenge", "V5"],
    },
    {
      id: 2,
      user: {
        name: "Newbie Climber",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=post2",
        level: "V1",
      },
      content: "First time trying climbing! Only completed V1 but it felt amazing! Highly recommend for all beginners to try it 🧗‍♀️",
      images: [
        "https://images.unsplash.com/photo-1659666287295-7da26c3f80d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3VsZGVyaW5nJTIwd2FsbCUyMGNvbG9yZnVsJTIwaG9sZHN8ZW58MXx8fHwxNzc0MjkwOTkxfDA&ixlib=rb-4.1.0&q=80&w=400",
      ],
      venue: "Climber's Paradise",
      time: "5 hours ago",
      likes: 89,
      comments: 15,
      tags: ["First Check-in", "First Experience"],
    },
    {
      id: 3,
      user: {
        name: "Photographer AQiang",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=post3",
        level: "V4",
      },
      content: "Weekend climb memory 📸 Had a fulfilling day with @Lee @Amy. Looking forward to next time!",
      images: [
        "https://images.unsplash.com/photo-1731176116069-86205f376088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBwZW9wbGUlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzQyOTA5OTJ8MA&ixlib=rb-4.1.0&q=80&w=400",
      ],
      venue: "Peak Climbing Center",
      time: "1 day ago",
      likes: 156,
      comments: 31,
      tags: ["Climb Memory", "Weekend Activity"],
      hasMemoryCard: true,
    },
  ];

  // Personal activity management data
  const myClimbRequests = [
    {
      id: 1,
      type: "applied",
      title: "Intermediate Training",
      venue: "Climber's Paradise",
      time: "Sun, Apr 26, 10:00 AM",
      status: "pending",
      applicants: 5,
    },
    {
      id: 2,
      type: "applied",
      title: "Weekend Beginner Session",
      venue: "Rock Time Gym",
      time: "Sat, Apr 25, 2:00 PM",
      status: "approved",
      applicants: 8,
    },
    {
      id: 3,
      type: "applied",
      title: "Bouldering Workshop",
      venue: "Climber's Paradise",
      time: "Sat, Apr 25, 3:00 PM",
      status: "completed",
      applicants: 6,
    },
  ];

  const myPostedRequests = [
    {
      id: 1,
      title: "Looking for V3-V5 partners",
      venue: "Rock Time Gym",
      time: "Mon, Apr 27, 6:00 PM",
      applicants: 3,
      maxApplicants: 4,
      canEdit: true,
    },
    {
      id: 2,
      title: "Weekend climbing session",
      venue: "Peak Climbing Center",
      time: "Sat, Apr 25, 2:00 PM",
      applicants: 2,
      maxApplicants: 3,
      canEdit: true,
    },
  ];

  const receivedRequests = [
    {
      id: 1,
      user: {
        name: "Emma Lee",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
        level: "V3-V5",
      },
      message: "Would love to join your climbing session!",
      time: "2 hours ago",
      status: "pending",
    },
    {
      id: 2,
      user: {
        name: "Mike Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
        level: "V2-V4",
      },
      message: "Looking forward to climbing together",
      time: "5 hours ago",
      status: "pending",
    },
  ];

  const myPosts = [
    {
      id: 1,
      content: "Finally completed the V5 red route today! 💪",
      images: [
        "https://images.unsplash.com/photo-1721885876144-25863108be60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBneW0lMjBpbmRvb3J8ZW58MXx8fHwxNzc0MjkwOTkwfDA&ixlib=rb-4.1.0&q=80&w=400",
      ],
      time: "2 days ago",
      likes: 45,
      comments: 12,
    },
    {
      id: 2,
      content: "Great climbing session with new friends!",
      images: [
        "https://images.unsplash.com/photo-1731176116069-86205f376088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBwZW9wbGUlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzQyOTA5OTJ8MA&ixlib=rb-4.1.0&q=80&w=400",
      ],
      time: "1 week ago",
      likes: 32,
      comments: 8,
    },
  ];

  const [listFilter, setListFilter] = useState<"all" | "requests" | "posts">("all");

  const messages = [
    {
      id: 1,
      user: {
        name: "Lee",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=msg1",
      },
      lastMessage: "See you at Rock Time 3pm tomorrow!",
      time: "10 min ago",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      user: {
        name: "AQiang",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=msg2",
      },
      lastMessage: "This route is indeed challenging, let's study it together",
      time: "1 hour ago",
      unread: 0,
      online: true,
    },
    {
      id: 3,
      user: {
        name: "Amy",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=msg3",
      },
      lastMessage: "Sounds good, see you this weekend!",
      time: "Yesterday",
      unread: 0,
      online: false,
    },
  ];

  const notifications = [
    {
      id: 1,
      type: "match",
      title: "Partner Match Success",
      content: "You matched with 'Zhang'",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      type: "activity",
      title: "Event Reminder",
      content: "Weekend beginner class starts tomorrow",
      time: "5 hours ago",
      unread: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ec] to-[#f5f9f5]">
      {/* 顶部标题栏 */}
      <div className="bg-white/80 backdrop-blur-lg px-4 py-4 sticky top-0 z-10 border-b border-gray-100 shadow-sm" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Community</h1>
          <div className="flex items-center gap-2">
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <Button
              size="sm"
              className="bg-[#7eb662] hover:bg-[#6a9b54] text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Post
            </Button>
          </div>
        </div>

        {/* Tab 导航 */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-white text-[#7eb662] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
              {tab === "Messages" && messages.filter(m => m.unread > 0).length > 0 && (
                <Badge className="ml-1 bg-red-500 text-white border-none h-4 min-w-[16px] px-1 text-[10px]">
                  {messages.filter(m => m.unread > 0).reduce((sum, m) => sum + m.unread, 0)}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 动态内容 */}
      {activeTab === "Feed" && (
        <div className="px-4 py-4 space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
              {/* 用户信息 */}
              <div className="flex items-start gap-3 mb-3">
                <ImageWithFallback
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-11 h-11 rounded-full ring-2 ring-gray-100"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {post.user.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {post.time} · {post.venue}
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-[#d4e7c5] to-[#c8e1b8] text-[#5a8a3f] border-none">
                      {post.user.level}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* 内容 */}
              <p className="text-gray-800 mb-3 leading-relaxed">{post.content}</p>

              {/* 图片 */}
              {post.images && post.images.length > 0 && (
                <div className="mb-3 rounded-xl overflow-hidden">
                  <ImageWithFallback
                    src={post.images[0]}
                    alt="post image"
                    className="w-full h-56 object-cover"
                  />
                </div>
              )}

              {/* 约爬纪念卡标识 */}
              {post.hasMemoryCard && (
                <div className="mb-3 p-3 bg-gradient-to-r from-[#e8f5e0] to-[#d4e7c5] rounded-xl border border-[#c8e1b8]">
                  <div className="flex items-center gap-2 text-sm text-[#5a8a3f]">
                    <span className="font-medium">✨ Includes Climb Memory Card</span>
                    <Badge className="bg-white text-[#5a8a3f] border-none text-xs">
                      AI Generated
                    </Badge>
                  </div>
                </div>
              )}

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[#7eb662] hover:underline cursor-pointer font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 互动按钮 */}
              <div className="flex items-center gap-6 pt-3 border-t border-gray-50">
                <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button
                  className="flex items-center gap-2 text-gray-500 hover:text-[#7eb662] transition-colors"
                  onClick={() => handleOpenComments(post.id, post.comments)}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-[#7eb662] transition-colors ml-auto">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List板块内容 - 个人活动管理 */}
      {activeTab === "List" && (
        <div className="px-4 py-4 space-y-4">
          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setListFilter("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                listFilter === "all"
                  ? "bg-[#7eb662] text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => setListFilter("requests")}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                listFilter === "requests"
                  ? "bg-[#7eb662] text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Climb Requests
            </button>
            <button
              onClick={() => setListFilter("posts")}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                listFilter === "posts"
                  ? "bg-[#7eb662] text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              My Posts
            </button>
          </div>

          {/* My Applied Requests */}
          {(listFilter === "all" || listFilter === "requests") && myClimbRequests.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-[#7eb662]" />
                My Applications
              </h3>
              <div className="space-y-3">
                {myClimbRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{request.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{request.venue}</span>
                          <span>•</span>
                          <span>{request.time}</span>
                        </div>
                      </div>
                      <Badge
                        className={`${
                          request.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : request.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        } border-none`}
                      >
                        {request.status === "approved" ? (
                          <><CheckCircle className="w-3 h-3 mr-1" /> Approved</>
                        ) : request.status === "completed" ? (
                          <><CheckCircle className="w-3 h-3 mr-1" /> Completed</>
                        ) : (
                          <><Clock className="w-3 h-3 mr-1" /> Pending</>
                        )}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Posted Requests */}
          {(listFilter === "all" || listFilter === "requests") && myPostedRequests.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#7eb662]" />
                My Posted Requests
              </h3>
              <div className="space-y-3">
                {myPostedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-3 bg-gradient-to-r from-[#f0f7ec] to-white rounded-xl border border-[#d4e7c5]"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{request.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <span>{request.venue}</span>
                          <span>•</span>
                          <span>{request.time}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <UsersIcon className="w-4 h-4 inline mr-1" />
                          {request.applicants}/{request.maxApplicants} applicants
                        </div>
                      </div>
                      {request.canEdit && (
                        <button className="p-2 hover:bg-[#7eb662]/10 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-[#7eb662]" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Received Requests */}
          {(listFilter === "all" || listFilter === "requests") && receivedRequests.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#7eb662]" />
                Requests from Others
                <Badge className="bg-red-500 text-white border-none ml-auto">
                  {receivedRequests.filter(r => r.status === "pending").length}
                </Badge>
              </h3>
              <div className="space-y-3">
                {receivedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <ImageWithFallback
                        src={request.user.avatar}
                        alt={request.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{request.user.name}</span>
                          <Badge className="bg-[#f0f7ec] text-[#5a8a3f] border-none text-xs">
                            {request.user.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{request.message}</p>
                        <span className="text-xs text-gray-400 mt-1">{request.time}</span>
                      </div>
                    </div>
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-[#7eb662] hover:bg-[#6a9b54] text-white"
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Posts */}
          {(listFilter === "all" || listFilter === "posts") && myPosts.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#7eb662]" />
                My Posts
              </h3>
              <div className="space-y-3">
                {myPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex gap-3">
                      {post.images && post.images.length > 0 && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={post.images[0]}
                            alt="post"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 mb-2 line-clamp-2">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{post.time}</span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {post.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {((listFilter === "requests" && myClimbRequests.length === 0 && myPostedRequests.length === 0 && receivedRequests.length === 0) ||
            (listFilter === "posts" && myPosts.length === 0)) && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No activity yet</h3>
              <p className="text-sm text-gray-500">
                {listFilter === "posts"
                  ? "Share your climbing moments with the community"
                  : "Start by joining or creating climb requests"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 消息内容 */}
      {activeTab === "Messages" && (
        <div className="px-4 py-4">
          {/* 系统通知 */}
          {notifications.filter(n => n.unread).length > 0 && (
            <div className="mb-4">
              <div className="bg-gradient-to-r from-[#d4e7c5] to-[#e8f5e0] rounded-2xl p-4 shadow-sm border border-[#c8e1b8]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                  <Badge className="bg-red-500 text-white border-none">
                    {notifications.filter(n => n.unread).length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {notifications.filter(n => n.unread).map((notification) => (
                    <div
                      key={notification.id}
                      className="bg-white/90 backdrop-blur-sm rounded-xl p-3 cursor-pointer hover:bg-white transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm mb-1">
                            {notification.title}
                          </div>
                          <div className="text-xs text-gray-600">
                            {notification.content}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 ml-2">
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 搜索框 */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-gray-100 outline-none text-sm focus:border-[#7eb662] transition-colors"
            />
          </div>

          {/* 对话列表 */}
          <div className="space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                onClick={() => navigate(`/chat/${message.id}`)}
                className="bg-white rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-[#e8f5e0]"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <ImageWithFallback
                      src={message.user.avatar}
                      alt={message.user.name}
                      className="w-12 h-12 rounded-full"
                    />
                    {message.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {message.user.name}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {message.time}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate flex-1">
                        {message.lastMessage}
                      </p>
                      {message.unread > 0 && (
                        <Badge className="bg-red-500 text-white border-none ml-2 h-5 min-w-[20px] flex items-center justify-center">
                          {message.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 评论抽屉 */}
      <CommentDrawer
        isOpen={commentDrawerOpen}
        onClose={handleCloseComments}
        postId={selectedPostId || 0}
        commentCount={selectedPostCommentCount}
      />
    </div>
  );
}