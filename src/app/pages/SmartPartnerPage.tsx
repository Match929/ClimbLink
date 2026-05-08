import { useState } from "react";
import { Link } from "react-router";
import { Search, MapPin, Clock, Users, Filter, Sparkles, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

export function SmartPartnerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [showSmartMatch, setShowSmartMatch] = useState(false);

  const levels = [
    { value: "all", label: "All Levels" },
    { value: "V0-V2", label: "V0-V2" },
    { value: "V3-V5", label: "V3-V5" },
    { value: "V6-V8", label: "V6-V8" },
    { value: "V9+", label: "V9+" },
  ];

  const tags = ["Beginner Friendly", "Weekend", "Weekday", "Morning", "Afternoon", "Evening", "Coach Available"];

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Mock data for climb requests
  const climbRequests = [
    {
      id: 1,
      user: {
        name: "Alex Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
        level: "V3-V5",
      },
      venue: "Rock Time Gym",
      time: "Sat, Apr 25, 2:00 PM",
      duration: "2 hours",
      participants: 2,
      maxParticipants: 4,
      tags: ["Weekend", "Afternoon", "Beginner Friendly"],
      description: "Looking for partners to practice technique and have fun!",
      matchScore: 95,
      distance: "1.2km",
    },
    {
      id: 2,
      user: {
        name: "Sarah Kim",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        level: "V4-V6",
      },
      venue: "Climber's Paradise",
      time: "Sun, Apr 26, 10:00 AM",
      duration: "3 hours",
      participants: 1,
      maxParticipants: 3,
      tags: ["Weekend", "Morning", "Coach Available"],
      description: "Training session with focus on technique improvement",
      matchScore: 88,
      distance: "2.5km",
    },
    {
      id: 3,
      user: {
        name: "Mike Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
        level: "V2-V4",
      },
      venue: "Peak Climbing Center",
      time: "Mon, Apr 27, 6:00 PM",
      duration: "2 hours",
      participants: 3,
      maxParticipants: 5,
      tags: ["Weekday", "Evening", "Beginner Friendly"],
      description: "Casual climbing session after work, all levels welcome!",
      matchScore: 92,
      distance: "3.8km",
    },
    {
      id: 4,
      user: {
        name: "Emma Lee",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
        level: "V3-V5",
      },
      venue: "Rock Time Gym",
      time: "Wed, Apr 28, 7:00 PM",
      duration: "1.5 hours",
      participants: 1,
      maxParticipants: 2,
      tags: ["Weekday", "Evening"],
      description: "Quick evening climb, looking for one partner",
      matchScore: 90,
      distance: "1.2km",
    },
  ];

  // Filter requests based on selection
  const filteredRequests = climbRequests.filter((request) => {
    const matchesLevel =
      selectedLevel === "all" || request.user.level === selectedLevel;
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => request.tags.includes(tag));
    const matchesSearch =
      searchQuery === "" ||
      request.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.venue.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLevel && matchesTags && matchesSearch;
  });

  // Sort by match score if smart match is enabled
  const displayRequests = showSmartMatch
    ? [...filteredRequests].sort((a, b) => b.matchScore - a.matchScore)
    : filteredRequests;

  return (
    <div className="min-h-screen bg-[#f5f9f5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#7eb662] to-[#6a9b54] px-4 pt-6 pb-6 rounded-b-3xl shadow-lg" style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Smart Partner</h1>
            <p className="text-sm text-white/90 mt-1">
              Find your perfect climbing match
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-none outline-none text-sm shadow-sm"
          />
        </div>
      </div>

      {/* Smart Match Toggle */}
      <div className="px-4 mt-4">
        <button
          onClick={() => setShowSmartMatch(!showSmartMatch)}
          className={`w-full p-4 rounded-2xl shadow-md transition-all ${
            showSmartMatch
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "bg-white text-gray-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  showSmartMatch ? "bg-white/20" : "bg-purple-100"
                }`}
              >
                <TrendingUp
                  className={`w-5 h-5 ${
                    showSmartMatch ? "text-white" : "text-purple-600"
                  }`}
                />
              </div>
              <div className="text-left">
                <div className="font-bold">AI Smart Match</div>
                <div
                  className={`text-xs ${
                    showSmartMatch ? "text-white/90" : "text-gray-500"
                  }`}
                >
                  {showSmartMatch ? "Enabled - Showing best matches" : "Click to enable smart sorting"}
                </div>
              </div>
            </div>
            <div
              className={`w-12 h-6 rounded-full transition-colors ${
                showSmartMatch ? "bg-white/30" : "bg-gray-200"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  showSmartMatch ? "translate-x-6" : "translate-x-0.5"
                } mt-0.5`}
              />
            </div>
          </div>
        </button>
      </div>

      {/* Level Filter */}
      <div className="px-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Filter by Level</h3>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {levels.map((level) => (
            <button
              key={level.value}
              onClick={() => setSelectedLevel(level.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedLevel === level.value
                  ? "bg-[#7eb662] text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tag Filter */}
      <div className="px-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Filter by Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedTags.includes(tag)
                  ? "bg-[#7eb662] text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 mt-4">
        <p className="text-sm text-gray-600">
          Found <span className="font-bold text-[#7eb662]">{displayRequests.length}</span>{" "}
          climbing {displayRequests.length === 1 ? "request" : "requests"}
        </p>
      </div>

      {/* Climb Requests List */}
      <div className="px-4 mt-4 pb-6 space-y-3">
        {displayRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="p-4">
              {/* User info */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={request.user.avatar}
                    alt={request.user.name}
                    className="w-12 h-12 rounded-full border-2 border-[#7eb662]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{request.user.name}</h3>
                      <Badge className="bg-[#f0f7ec] text-[#5a8a3f] border-none text-xs">
                        {request.user.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{request.distance}</span>
                    </div>
                  </div>
                </div>

                {/* Match score (if smart match enabled) */}
                {showSmartMatch && (
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full">
                    <div className="text-xs font-bold">{request.matchScore}% Match</div>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-700 mb-3">{request.description}</p>

              {/* Venue and time */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-[#7eb662]" />
                  <span className="font-medium">{request.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-[#7eb662]" />
                  <span>
                    {request.time} · {request.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-[#7eb662]" />
                  <span>
                    {request.participants}/{request.maxParticipants} participants
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {request.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-gray-100 text-gray-600 border-none text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Action button */}
              <Button className="w-full bg-gradient-to-r from-[#7eb662] to-[#6a9b54] hover:from-[#6a9b54] hover:to-[#5a8a3f] text-white">
                Request to Join
              </Button>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {displayRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No matches found</h3>
            <p className="text-sm text-gray-500">
              Try adjusting your filters or search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
