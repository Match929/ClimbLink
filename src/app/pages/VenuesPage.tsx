import { useState } from "react";
import { Search, SlidersHorizontal, MapPin, Star, Navigation, TrendingUp } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

export function VenuesPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "Beginner Friendly", "Advanced", "Nearest", "Top Rated"];

  const venues = [
    {
      id: 1,
      name: "Rock Time Gym",
      image: "https://images.unsplash.com/photo-1721885876144-25863108be60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBneW0lMjBpbmRvb3J8ZW58MXx8fHwxNzc0MjkwOTkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      distance: "1.2km",
      rating: 4.8,
      reviews: 234,
      price: "$18",
      tags: ["Beginner Friendly", "Well Equipped"],
      difficulty: "V0-V8",
      crowd: "Moderate",
      openNow: true,
    },
    {
      id: 2,
      name: "Climber's Paradise",
      image: "https://images.unsplash.com/photo-1659666287295-7da26c3f80d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3VsZGVyaW5nJTIwd2FsbCUyMGNvbG9yZnVsJTIwaG9sZHN8ZW58MXx8fHwxNzc0MjkwOTkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      distance: "2.5km",
      rating: 4.9,
      reviews: 189,
      price: "$22",
      tags: ["Routes Updated Often", "Pro Coaches"],
      difficulty: "V0-V10",
      crowd: "Relaxed",
      openNow: true,
    },
    {
      id: 3,
      name: "Peak Climbing Center",
      image: "https://images.unsplash.com/photo-1731176116069-86205f376088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBwZW9wbGUlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzQyOTA5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      distance: "3.8km",
      rating: 4.7,
      reviews: 156,
      price: "$20",
      tags: ["Spacious", "Parking Available"],
      difficulty: "V0-V7",
      crowd: "Busy",
      openNow: true,
    },
    {
      id: 4,
      name: "Cloud Nine Climbing Club",
      image: "https://images.unsplash.com/photo-1721885876144-25863108be60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBneW0lMjBpbmRvb3J8ZW58MXx8fHwxNzc0MjkwOTkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      distance: "4.2km",
      rating: 4.6,
      reviews: 98,
      price: "$15",
      tags: ["Great Value", "Beautiful Setting"],
      difficulty: "V0-V6",
      crowd: "Moderate",
      openNow: false,
    },
  ];

  const nearbyVenues = [
    { name: "Rock Time Gym", distance: "1.2km", time: "5 min" },
    { name: "Climber's Paradise", distance: "2.5km", time: "12 min" },
    { name: "Peak Climbing Center", distance: "3.8km", time: "18 min" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ec] to-[#f5f9f5]">
      {/* 顶部区域 */}
      <div className="bg-gradient-to-br from-[#7eb662] to-[#6a9b54] px-4 pt-8 pb-6 rounded-b-[32px] shadow-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Discover Gyms</h1>
          <p className="text-sm text-white/80">Find the perfect climbing gym for you</p>
        </div>

        {/* 搜索栏 */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search gym name or address..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border-none outline-none text-sm shadow-sm"
          />
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* 快捷筛选 */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                selectedFilter === filter
                  ? "bg-white text-[#7eb662] font-medium shadow-sm"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 附近场馆快捷导航 */}
      <div className="px-4 -mt-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Navigation className="w-4 h-4 text-[#7eb662]" />
            <span className="text-sm font-medium text-gray-700">Nearby Gyms</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {nearbyVenues.map((venue, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#f0f7ec] to-[#e8f5e0] rounded-xl p-3 text-center"
              >
                <div className="text-lg font-bold text-[#7eb662] mb-1">
                  {venue.distance}
                </div>
                <div className="text-[10px] text-gray-600 mb-1 truncate">
                  {venue.name}
                </div>
                <div className="text-[9px] text-gray-500">{venue.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 场馆列表 */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">All Gyms</h2>
          <span className="text-xs text-gray-500">{venues.length} gyms</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {venues.map((venue) => (
            <Link key={venue.id} to={`/venue/${venue.id}`}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="relative h-40">
                  <ImageWithFallback
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* 营业状态 */}
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={`${
                        venue.openNow
                          ? "bg-green-500/90 text-white"
                          : "bg-gray-500/90 text-white"
                      } border-none backdrop-blur-sm`}
                    >
                      {venue.openNow ? "Open" : "Closed"}
                    </Badge>
                  </div>

                  {/* 客流状态 */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-medium">
                    {venue.crowd === "Moderate" && "🟢 Moderate"}
                    {venue.crowd === "Relaxed" && "🟢 Relaxed"}
                    {venue.crowd === "Busy" && "🔴 Busy"}
                  </div>

                  {/* 底部信息 */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div className="text-white">
                      <h3 className="font-bold text-lg mb-0.5 drop-shadow-lg">
                        {venue.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs drop-shadow-md">
                        <MapPin className="w-3 h-3" />
                        <span>{venue.distance}</span>
                      </div>
                    </div>
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <span className="text-sm font-bold text-[#7eb662]">
                        {venue.price}
                      </span>
                      <span className="text-xs text-gray-500">/visit</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">
                          {venue.rating}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({venue.reviews})
                        </span>
                      </div>
                      <div className="w-px h-3 bg-gray-200" />
                      <div className="text-xs text-gray-500">
                        Levels {venue.difficulty}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[#7eb662] hover:text-[#6a9b54] hover:bg-[#f0f7ec] -mr-2"
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Navigate
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {venue.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-[#f0f7ec] text-[#5a8a3f] border-none text-xs px-2 py-0.5"
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

      {/* 统计卡片 */}
      <div className="px-4 pb-6">
        <div className="bg-gradient-to-br from-white to-[#f0f7ec] rounded-2xl p-6 border border-[#e8f5e0]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#7eb662]" />
            <h3 className="font-bold text-gray-900">This Week's Stats</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#7eb662] mb-1">
                {venues.length}
              </div>
              <div className="text-xs text-gray-500">Total Gyms</div>
            </div>
            <div className="text-center border-l border-r border-gray-100">
              <div className="text-2xl font-bold text-[#7eb662] mb-1">
                {venues.filter((v) => v.openNow).length}
              </div>
              <div className="text-xs text-gray-500">Open Now</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#7eb662] mb-1">
                4.8
              </div>
              <div className="text-xs text-gray-500">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}