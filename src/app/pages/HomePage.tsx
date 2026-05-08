import { useState } from "react";
import { Link } from "react-router";
import { Search, MapPin, Star, Users, Clock, TrendingUp, Sparkles, BookOpen, Map, Gift, Calendar } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

export function HomePage() {
  const [activeTab, setActiveTab] = useState("Beginner");

  const tabs = [
    { id: "Beginner", icon: BookOpen },
    { id: "Advanced", icon: TrendingUp },
    { id: "Market", icon: Map },
    { id: "Smart Partner", icon: Users },
  ];

  const activities = [
    {
      id: 1,
      title: "Weekend Beginner Session",
      venue: "Rock Time Gym",
      time: "Sat 2:00 PM",
      participants: 8,
      maxParticipants: 12,
      level: "V0-V2",
      tag: "Beginner Friendly",
      image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYmluZyUyMGdyb3VwJTIwaW5kb29yfGVufDF8fHx8MTc3NDI5MDk5M3ww&ixlib=rb-4.1.0&q=80&w=400",
      price: "Free",
    },
    {
      id: 2,
      title: "Intermediate Training",
      venue: "Climber's Paradise",
      time: "Sun 10:00 AM",
      participants: 5,
      maxParticipants: 8,
      level: "V3-V5",
      tag: "Coach Guided",
      image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYmluZyUyMHRyYWluaW5nJTIwY2xhc3N8ZW58MXx8fHwxNzc0MjkwOTk0fDA&ixlib=rb-4.1.0&q=80&w=400",
      price: "$15",
    },
    {
      id: 3,
      title: "Spring Climbing Competition",
      venue: "Peak Climbing Center",
      time: "Mar 30, 9:00 AM",
      participants: 12,
      maxParticipants: 20,
      level: "V4-V7",
      tag: "Competition",
      image: "https://images.unsplash.com/photo-1731176116069-86205f376088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBwZW9wbGUlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzQyOTA5OTJ8MA&ixlib=rb-4.1.0&q=80&w=400",
      price: "$20",
    },
  ];

  const venues = [
    {
      id: 1,
      name: "Rock Time Gym",
      image: "https://images.unsplash.com/photo-1721885876144-25863108be60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBneW0lMjBpbmRvb3J8ZW58MXx8fHwxNzc0MjkwOTkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      distance: "1.2km",
      rating: 4.8,
      reviews: 234,
      price: "$18/visit",
      tags: ["Beginner Friendly", "Well Equipped"],
      difficulty: "V0-V8",
      crowd: "Moderate",
    },
    {
      id: 2,
      name: "Climber's Paradise",
      image: "https://images.unsplash.com/photo-1659666287295-7da26c3f80d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3VsZGVyaW5nJTIwd2FsbCUyMGNvbG9yZnVsJTIwaG9sZHN8ZW58MXx8fHwxNzc0MjkwOTkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      distance: "2.5km",
      rating: 4.9,
      reviews: 189,
      price: "$22/visit",
      tags: ["Routes Updated Often", "Pro Coaches"],
      difficulty: "V0-V10",
      crowd: "Relaxed",
    },
    {
      id: 3,
      name: "Peak Climbing Center",
      image: "https://images.unsplash.com/photo-1731176116069-86205f376088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBwZW9wbGUlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzQyOTA5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      distance: "3.8km",
      rating: 4.7,
      reviews: 156,
      price: "$20/visit",
      tags: ["Spacious", "Parking Available"],
      difficulty: "V0-V7",
      crowd: "Busy",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f9f5]">
      {/* 顶部标题栏 */}
      <div className="bg-gradient-to-br from-[#7eb662] to-[#6a9b54] px-4 pt-6 pb-4 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">ClimbConnect</h1>
            <p className="text-sm text-white/90 mt-1">Find partners, find gyms, climb together 🧗</p>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/30">
            <span className="text-white text-lg font-bold">C</span>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search gyms, events, partners..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-none outline-none text-sm shadow-sm"
          />
        </div>
      </div>

      {/* 盲盒搭子超显眼入口 */}
      <div className="px-4 mt-6 mb-4">
        <Link to="/blindbox">
          <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-2xl p-5 shadow-2xl hover:shadow-3xl transition-all hover:scale-[1.02] active:scale-[0.98]">
            {/* 动态背景装饰 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6 text-white animate-pulse" />
                  <h3 className="text-xl font-bold text-white">Mystery Match</h3>
                  <Badge className="bg-white/30 text-white border-none backdrop-blur-sm animate-bounce">
                    🔥 HOT
                  </Badge>
                </div>
                <p className="text-sm text-white/95 font-medium mb-1">
                  Random Matching · Endless Surprises
                </p>
                <p className="text-xs text-white/80">
                  Make every climb an adventure ✨
                </p>
              </div>

              {/* 立体盒子图标 */}
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center rotate-12 hover:rotate-0 transition-transform">
                  <Gift className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center text-xs font-bold animate-ping">
                  !
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* 热门活动 - 横向拖拽式 */}
      <div className="mt-6 mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#7eb662]" />
            <h2 className="text-lg font-bold text-gray-900">Popular Events</h2>
          </div>
          <Link to="/events" className="text-sm text-[#7eb662] font-medium">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto scrollbar-hide pl-4">
          <div className="flex gap-3 pb-2">
            {activities.map((activity) => (
              <Link key={activity.id} to={`/activity/${activity.id}`}>
                <div className="w-72 h-44 flex-shrink-0 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-[1.02]">
                  {/* 活动图片 */}
                  <div className="relative w-full h-full">
                    <ImageWithFallback
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* 价格标签 */}
                    <div className="absolute top-3 right-3 bg-[#7eb662]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg">
                      {activity.price}
                    </div>
                    
                    {/* 标签 */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/95 text-gray-900 border-none backdrop-blur-sm shadow-md">
                        {activity.tag}
                      </Badge>
                    </div>

                    {/* 底部信息 */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-white text-lg mb-2 drop-shadow-lg">
                        {activity.title}
                      </h3>
                      <div className="flex items-center justify-between text-white/90 text-sm">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span className="drop-shadow">{activity.venue}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span className="drop-shadow">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 二级导航栏 */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-2xl p-2 shadow-sm">
          <div className="grid grid-cols-4 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return tab.id === "Beginner" ? (
                <Link key={tab.id} to="/beginner-guide">
                  <button
                    className={`w-full flex flex-col items-center gap-2 py-3 rounded-xl transition-colors ${"text-gray-600 hover:bg-gray-50"}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{tab.id}</span>
                  </button>
                </Link>
              ) : (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-2 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-[#d4e7c5] text-[#5a8a3f]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{tab.id}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Market板块内容 */}
      {activeTab === "Market" && (
        <div className="px-4 mt-4">
          <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                <Map className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Gear Marketplace</h3>
                <p className="text-sm text-white/90 leading-relaxed">
                  Buy and sell climbing gear with the community. Find great deals on quality equipment!
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <span>Browse second-hand climbing gear</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <span>Filter by category, price, and condition</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <span>List your own gear for sale 💰</span>
              </div>
            </div>

            <Link to="/market">
              <Button className="w-full bg-white hover:bg-white/90 text-indigo-600 font-bold shadow-lg">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Smart Partner板块内容 */}
      {activeTab === "Smart Partner" && (
        <div className="px-4 mt-4">
          <div className="bg-gradient-to-br from-purple-500 via-blue-500 to-[#7eb662] rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Smart Partner Matching</h3>
                <p className="text-sm text-white/90 leading-relaxed">
                  AI-powered matching to find perfect climbing partners based on your level and preferences!
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <span>Browse all available climb requests</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <span>Filter by level, tags, or use AI smart matching</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <span>Request to join and start climbing together ✨</span>
              </div>
            </div>

            <Link to="/smart-partner">
              <Button className="w-full bg-white hover:bg-white/90 text-purple-600 font-bold shadow-lg">
                Find Smart Partners
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 热门场馆 */}
      <div className="px-4 mt-6 pb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Popular Gyms</h2>
        
        <div className="space-y-4">
          {venues.map((venue) => (
            <Link key={venue.id} to={`/venue/${venue.id}`}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium">
                    {venue.crowd === "Moderate" && "🟢 Moderate"}
                    {venue.crowd === "Relaxed" && "🟢 Relaxed"}
                    {venue.crowd === "Busy" && "🔴 Busy"}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{venue.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{venue.rating}</span>
                      <span className="text-xs text-gray-500">({venue.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{venue.distance}</span>
                    </div>
                    <span className="text-[#7eb662] font-medium">{venue.price}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {venue.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {venue.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-[#f0f7ec] text-[#5a8a3f] border-none text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}