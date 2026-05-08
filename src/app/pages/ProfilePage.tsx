import { Settings, ChevronRight, Award, Calendar, MapPin, Trophy, Users, Heart, Star, TrendingUp, Target } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

export function ProfilePage() {
  const user = {
    name: "Climbing Enthusiast",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=myprofile",
    level: "V3-V5",
    experience: "1.5 years",
    bio: "Love climbing, enjoy challenges 🧗‍♂️",
    stats: {
      venues: 12,
      partners: 28,
      activities: 45,
      posts: 23,
    },
  };

  const badges = [
    { id: 1, name: "Gym Explorer", icon: "🏆", description: "Checked in 10 gyms" },
    { id: 2, name: "Social Butterfly", icon: "👥", description: "Added 20 partners" },
    { id: 3, name: "Advanced Climber", icon: "📈", description: "Completed V5 routes" },
    { id: 4, name: "Active Member", icon: "⭐", description: "Joined 30 events" },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "climb",
      title: "Completed V4 Red Route",
      venue: "Rock Time Gym",
      date: "2026-03-22",
    },
    {
      id: 2,
      type: "match",
      title: "Climbed with Lee",
      venue: "Climber's Paradise",
      date: "2026-03-20",
    },
    {
      id: 3,
      type: "checkin",
      title: "Checked in Peak Climbing Center",
      venue: "Peak Climbing Center",
      date: "2026-03-18",
    },
  ];

  const menuItems = [
    {
      section: "My Activities",
      items: [
        { icon: Calendar, label: "My Climb Dates", badge: 3 },
        { icon: Heart, label: "Favorite Gyms", badge: 0 },
        { icon: Users, label: "My Partners", badge: 0 },
        { icon: Trophy, label: "Achievement Badges", badge: 4 },
      ],
    },
    {
      section: "Data Statistics",
      items: [
        { icon: Target, label: "Training Goals" },
        { icon: Star, label: "Skill Assessment" },
      ],
    },
    {
      section: "Settings",
      items: [
        { icon: Settings, label: "Account Settings" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f9f5]">
      {/* User Info Card */}
      <div className="px-4 pt-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative">
          {/* Top Part - Green Background */}
          <div className="bg-gradient-to-br from-[#7eb662] to-[#6a9b54] p-6 pb-8 relative">
            {/* Settings Button */}
            <div className="absolute top-4 right-4">
              <button className="text-white hover:text-white/90">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className="relative">
                <ImageWithFallback
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 bg-white text-[#7eb662] text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  {user.level}
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white mb-1 drop-shadow-sm">
                  {user.name}
                </h1>
                <p className="text-sm text-white/95 mb-2 drop-shadow-sm">{user.bio}</p>
                <div className="text-xs text-white/85 drop-shadow-sm">
                  Climbing Experience: {user.experience}
                </div>
              </div>
            </div>

            {/* Wave Transition */}
            <div className="absolute bottom-0 left-0 right-0 h-6">
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="w-full h-full"
                style={{ transform: 'translateY(1px)' }}
              >
                <path
                  d="M0,0 C150,60 350,0 600,40 C850,80 1050,20 1200,60 L1200,120 L0,120 Z"
                  fill="white"
                  opacity="0.3"
                />
                <path
                  d="M0,20 C200,80 400,20 600,60 C800,100 1000,40 1200,80 L1200,120 L0,120 Z"
                  fill="white"
                  opacity="0.5"
                />
                <path
                  d="M0,40 C300,100 500,40 700,80 C900,120 1100,60 1200,100 L1200,120 L0,120 Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>

          {/* Bottom Part - White Background */}
          <div className="bg-white p-6 pt-2">
            {/* Data Statistics */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  {user.stats.venues}
                </div>
                <div className="text-xs text-gray-500 mt-1">Checked-in Gyms</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  {user.stats.partners}
                </div>
                <div className="text-xs text-gray-500 mt-1">My Partners</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  {user.stats.activities}
                </div>
                <div className="text-xs text-gray-500 mt-1">Joined Activities</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  {user.stats.posts}
                </div>
                <div className="text-xs text-gray-500 mt-1">Posted Updates</div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Link to="/profile/edit">
              <Button
                variant="outline"
                className="w-full border-[#7eb662] text-[#7eb662] hover:bg-[#f0f7ec]"
              >
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Achievement Badges</h2>
            <span className="text-xs text-gray-500">
              Earned {badges.length} badges
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {badges.map((badge) => (
              <div key={badge.id} className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-[#d4e7c5] to-[#e8f5e0] rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">{badge.icon}</span>
                </div>
                <div className="text-xs text-gray-700 font-medium">
                  {badge.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Climbing Records - Featured */}
      <div className="px-4 mt-4">
        <Link to="/climb-records">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#7eb662] via-[#6a9b54] to-[#5a8a3f] rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Climbing Records</h3>
                  <p className="text-sm text-white/90">
                    Track your progress & achievements
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="text-2xl font-bold text-white">{user.stats.activities}</div>
                <div className="text-xs text-white/80">Total Sessions</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4 relative">
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 text-center">
                <div className="text-sm font-bold text-white">12</div>
                <div className="text-xs text-white/80">Venues</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 text-center">
                <div className="text-sm font-bold text-white">127h</div>
                <div className="text-xs text-white/80">Climbing</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 text-center">
                <div className="text-sm font-bold text-white">7d</div>
                <div className="text-xs text-white/80">Streak</div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activities */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-bold text-gray-900 mb-3">Recent Activities</h2>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className="w-10 h-10 bg-[#d4e7c5] rounded-full flex items-center justify-center">
                  {activity.type === "climb" && "🧗"}
                  {activity.type === "match" && "👥"}
                  {activity.type === "checkin" && "📍"}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {activity.venue} · {activity.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Function Menu */}
      <div className="px-4 mt-4 pb-6">
        {menuItems.map((section) => (
          <div key={section.section} className="bg-white rounded-2xl p-4 mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              {section.section}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge !== undefined && item.badge > 0 && (
                        <Badge className="bg-red-500 text-white border-none">
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}