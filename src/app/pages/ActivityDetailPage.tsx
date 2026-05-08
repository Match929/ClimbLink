import { ArrowLeft, MapPin, Calendar, Clock, Users, Star, Share2, Heart, DollarSign } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function ActivityDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // 模拟活动数据
  const activity = {
    id: Number(id),
    title: "Weekend Beginner Climb Session",
    venue: "Rock Time Gym",
    venueId: 1,
    date: "March 29, 2026",
    time: "2:00 PM - 5:00 PM",
    participants: 8,
    maxParticipants: 12,
    level: "V0-V2",
    price: "Free",
    tag: "Beginner Friendly",
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYmluZyUyMGdyb3VwJTIwaW5kb29yfGVufDF8fHx8MTc3NDI5MDk5M3ww&ixlib=rb-4.1.0&q=80&w=800",
    organizer: {
      name: "Lee the Climber",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=organizer1",
      level: "V5",
      rating: 4.9,
    },
    description: "This is a climbing activity designed specifically for beginners! We provide basic instruction and equipment guidance. Whether you have no experience or just getting started, you are welcome to join.\n\nActivity includes:\n- Basic climbing technique instruction\n- Safety equipment usage training\n- Hands-on practice with guidance\n- Photo memories\n\nLooking forward to starting your climbing journey together!",
    highlights: ["Beginner Friendly", "Equipment Provided", "Coach Guidance", "Free Entry"],
    registeredUsers: [
      { id: 1, name: "Zhang", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1", level: "V1" },
      { id: 2, name: "Amy", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user2", level: "V2" },
      { id: 3, name: "Mike", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user3", level: "V0" },
    ],
    requirements: [
      "Please wear sports clothing and athletic shoes",
      "Arrive 15 minutes early for check-in",
      "Please bring a water bottle on the day",
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ec] to-[#f5f9f5] pb-24">
      {/* 顶部图片 */}
      <div className="relative h-72">
        <ImageWithFallback
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* 顶部操作栏 */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">{/* 标题和标签 */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {activity.title}
          </h1>
          <Badge className="bg-[#d4e7c5] text-[#5a8a3f] border-none">
            {activity.tag}
          </Badge>
        </div>

        {/* 关键信息卡片 */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#f0f7ec] rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-[#7eb662]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-1">Date</div>
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {activity.date}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#f0f7ec] rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[#7eb662]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-1">Time</div>
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {activity.time}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#f0f7ec] rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#7eb662]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-1">Venue</div>
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {activity.venue}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#f0f7ec] rounded-xl flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-[#7eb662]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-1">Cost</div>
                <div className="text-sm font-semibold text-[#7eb662] truncate">
                  {activity.price}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 组织者信息 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h2 className="font-bold text-gray-900 mb-3">Event Organizer</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={activity.organizer.avatar}
                alt={activity.organizer.name}
                className="w-12 h-12 rounded-full ring-2 ring-gray-100"
              />
              <div>
                <div className="font-semibold text-gray-900">
                  {activity.organizer.name}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Badge className="bg-[#d4e7c5] text-[#5a8a3f] border-none h-5 px-2">
                    {activity.organizer.level}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{activity.organizer.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-[#7eb662] text-[#7eb662]">
              View Profile
            </Button>
          </div>
        </div>

        {/* 活动亮点 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h2 className="font-bold text-gray-900 mb-3">Event Highlights</h2>
          <div className="flex flex-wrap gap-2">
            {activity.highlights.map((highlight, index) => (
              <Badge
                key={index}
                className="bg-gradient-to-r from-[#d4e7c5] to-[#c8e1b8] text-[#5a8a3f] border-none px-3 py-1.5"
              >
                ✓ {highlight}
              </Badge>
            ))}
          </div>
        </div>

        {/* 活动详情 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h2 className="font-bold text-gray-900 mb-3">Event Details</h2>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {activity.description}
          </p>
        </div>

        {/* 参与要求 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h2 className="font-bold text-gray-900 mb-3">Requirements</h2>
          <div className="space-y-2">
            {activity.requirements.map((req, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-[#7eb662] mt-1">•</span>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 已报名用户 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Registered</h2>
            <div className="flex items-center gap-1 text-sm">
              <Users className="w-4 h-4 text-[#7eb662]" />
              <span className="font-semibold text-[#7eb662]">
                {activity.participants}/{activity.maxParticipants}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {activity.registeredUsers.map((user) => (
                <ImageWithFallback
                  key={user.id}
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full ring-2 ring-white"
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {activity.registeredUsers[0]?.name}
              </span>{" "}
              and {activity.participants} others registered
            </div>
          </div>

          {/* 进度条 */}
          <div className="mt-3">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#7eb662] to-[#6a9b54] rounded-full transition-all"
                style={{
                  width: `${(activity.participants / activity.maxParticipants) * 100}%`,
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
              {activity.maxParticipants - activity.participants} spots remaining
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 p-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-gray-500">Event Cost</div>
            <div className="text-xl font-bold text-[#7eb662]">{activity.price}</div>
          </div>
          <Button className="flex-1 bg-gradient-to-r from-[#7eb662] to-[#6a9b54] hover:from-[#6a9b54] hover:to-[#5a8a3f] text-white font-bold shadow-lg">
            Register Now
          </Button>
        </div>
      </div>
    </div>
  );
}