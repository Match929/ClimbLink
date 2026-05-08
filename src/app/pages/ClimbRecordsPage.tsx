import { useState } from "react";
import { ArrowLeft, MapPin, TrendingUp, Target, Award, Calendar, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

export function ClimbRecordsPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<"checkins" | "routes" | "stats">("checkins");

  // Mock data
  const checkins = [
    {
      id: 1,
      venue: "Rock Time Gym",
      date: "2026-04-18",
      time: "14:30",
      duration: "2h 30m",
      image: "https://images.unsplash.com/photo-1721885876144-25863108be60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBneW0lMjBpbmRvb3J8ZW58MXx8fHwxNzc0MjkwOTkwfDA&ixlib=rb-4.1.0&q=80&w=400",
    },
    {
      id: 2,
      venue: "Climber's Paradise",
      date: "2026-04-15",
      time: "10:00",
      duration: "3h 15m",
      image: "https://images.unsplash.com/photo-1659666287295-7da26c3f80d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3VsZGVyaW5nJTIwd2FsbCUyMGNvbG9yZnVsJTIwaG9sZHN8ZW58MXx8fHwxNzc0MjkwOTkxfDA&ixlib=rb-4.1.0&q=80&w=400",
    },
    {
      id: 3,
      venue: "Peak Climbing Center",
      date: "2026-04-12",
      time: "18:00",
      duration: "2h 00m",
      image: "https://images.unsplash.com/photo-1731176116069-86205f376088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBwZW9wbGUlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzQyOTA5OTJ8MA&ixlib=rb-4.1.0&q=80&w=400",
    },
  ];

  const routes = [
    {
      id: 1,
      name: "Red Dragon",
      grade: "V4",
      color: "red",
      venue: "Rock Time Gym",
      date: "2026-04-18",
      attempts: 3,
      completed: true,
    },
    {
      id: 2,
      name: "Blue Steel",
      grade: "V5",
      color: "blue",
      venue: "Climber's Paradise",
      date: "2026-04-15",
      attempts: 5,
      completed: true,
    },
    {
      id: 3,
      name: "Green Giant",
      grade: "V6",
      color: "green",
      venue: "Peak Climbing Center",
      date: "2026-04-12",
      attempts: 8,
      completed: false,
    },
    {
      id: 4,
      name: "Yellow Flash",
      grade: "V3",
      color: "yellow",
      venue: "Rock Time Gym",
      date: "2026-04-10",
      attempts: 2,
      completed: true,
    },
  ];

  const stats = {
    totalCheckins: 45,
    totalHours: 127,
    routesCompleted: 89,
    currentStreak: 7,
    longestStreak: 14,
    favoriteVenue: "Rock Time Gym",
    averageGrade: "V4.2",
    monthlyProgress: [
      { month: "Jan", routes: 18 },
      { month: "Feb", routes: 22 },
      { month: "Mar", routes: 25 },
      { month: "Apr", routes: 24 },
    ],
    gradeDistribution: [
      { grade: "V0-V2", count: 15 },
      { grade: "V3-V5", count: 48 },
      { grade: "V6-V8", count: 22 },
      { grade: "V9+", count: 4 },
    ],
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      pink: "bg-pink-500",
    };
    return colors[color] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-[#f5f9f5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#7eb662] to-[#6a9b54] px-4 pt-6 pb-6 rounded-b-3xl shadow-lg" style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))' }}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Climb Records</h1>
            <p className="text-sm text-white/90 mt-1">Track your climbing journey</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{stats.totalCheckins}</div>
            <div className="text-xs text-white/80 mt-1">Check-ins</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{stats.totalHours}</div>
            <div className="text-xs text-white/80 mt-1">Hours</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{stats.routesCompleted}</div>
            <div className="text-xs text-white/80 mt-1">Routes</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
            <div className="text-xs text-white/80 mt-1">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-1.5 shadow-sm grid grid-cols-3 gap-1">
          <button
            onClick={() => setSelectedTab("checkins")}
            className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedTab === "checkins"
                ? "bg-[#7eb662] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Check-ins
          </button>
          <button
            onClick={() => setSelectedTab("routes")}
            className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedTab === "routes"
                ? "bg-[#7eb662] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Routes
          </button>
          <button
            onClick={() => setSelectedTab("stats")}
            className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedTab === "stats"
                ? "bg-[#7eb662] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Statistics
          </button>
        </div>
      </div>

      {/* Content based on selected tab */}
      <div className="px-4 mt-4 pb-6">
        {/* Check-ins Tab */}
        {selectedTab === "checkins" && (
          <div className="space-y-3">
            {checkins.map((checkin) => (
              <div
                key={checkin.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={checkin.image}
                      alt={checkin.venue}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{checkin.venue}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{checkin.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{checkin.time} · {checkin.duration}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Routes Tab */}
        {selectedTab === "routes" && (
          <div className="space-y-3">
            {routes.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${getColorClass(route.color)} rounded-xl flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{route.grade}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{route.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{route.venue}</span>
                      </div>
                    </div>
                  </div>
                  {route.completed && (
                    <CheckCircle2 className="w-5 h-5 text-[#7eb662]" />
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-gray-500">Attempts:</span>{" "}
                      <span className="font-semibold text-gray-900">{route.attempts}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>{" "}
                      <span className="font-semibold text-gray-900">{route.date}</span>
                    </div>
                  </div>
                  <Badge
                    className={`${
                      route.completed
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    } border-none`}
                  >
                    {route.completed ? "Completed" : "In Progress"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics Tab */}
        {selectedTab === "stats" && (
          <div className="space-y-4">
            {/* Progress Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#7eb662]" />
                Monthly Progress
              </h3>
              <div className="relative h-40 mb-8">
                {/* Line chart */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                  <polyline
                    points={stats.monthlyProgress.map((month, index) => {
                      const maxRoutes = Math.max(...stats.monthlyProgress.map(m => m.routes));
                      const x = (index / (stats.monthlyProgress.length - 1)) * 100;
                      const y = 100 - (month.routes / maxRoutes) * 100;
                      return `${x}%,${y}%`;
                    }).join(' ')}
                    fill="none"
                    stroke="#7eb662"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Data points */}
                  {stats.monthlyProgress.map((month, index) => {
                    const maxRoutes = Math.max(...stats.monthlyProgress.map(m => m.routes));
                    const x = (index / (stats.monthlyProgress.length - 1)) * 100;
                    const y = 100 - (month.routes / maxRoutes) * 100;
                    return (
                      <circle
                        key={index}
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r="5"
                        fill="white"
                        stroke="#7eb662"
                        strokeWidth="3"
                      />
                    );
                  })}
                </svg>

                {/* Bar chart */}
                <div className="flex items-end justify-between gap-2 h-full relative" style={{ zIndex: 0 }}>
                  {stats.monthlyProgress.map((month, index) => {
                    const maxRoutes = Math.max(...stats.monthlyProgress.map(m => m.routes));
                    const height = (month.routes / maxRoutes) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-[#d4e7c5]/60 hover:bg-[#7eb662]/60 rounded-t-lg transition-colors relative" style={{ height: `${height}%` }}>
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1.5 py-0.5 rounded shadow-sm">
                            {month.routes}
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 font-medium">{month.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Grade Distribution */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#7eb662]" />
                Grade Distribution
              </h3>
              <div className="space-y-3">
                {stats.gradeDistribution.map((item, index) => {
                  const maxCount = Math.max(...stats.gradeDistribution.map(g => g.count));
                  const width = (item.count / maxCount) * 100;
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.grade}</span>
                        <span className="text-sm font-bold text-gray-900">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#7eb662] to-[#6a9b54] h-2 rounded-full transition-all"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-[#7eb662]" />
                  <span className="text-xs text-gray-500">Longest Streak</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.longestStreak} days</div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-[#7eb662]" />
                  <span className="text-xs text-gray-500">Average Grade</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.averageGrade}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-[#7eb662]" />
                <span className="text-xs text-gray-500">Favorite Venue</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{stats.favoriteVenue}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
