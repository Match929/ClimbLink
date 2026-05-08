import { useState } from "react";
import { ArrowLeft, MapPin, Calendar, Clock, Users, DollarSign, FileText, Image } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { VenueSearchModal } from "../components/VenueSearchModal";

export function EventCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    venue: "",
    venueAddress: "",
    date: "",
    startTime: "",
    endTime: "",
    maxPeople: "20",
    price: "",
    level: "",
    description: "",
    coverImage: "",
  });
  const [showVenueSearch, setShowVenueSearch] = useState(false);

  const levels = ["All Levels", "Beginner Friendly", "Intermediate+", "Advanced Only"];
  const eventTypes = [
    { id: "training", label: "Training Course", icon: "🎯" },
    { id: "competition", label: "Friendly Comp", icon: "🏆" },
    { id: "social", label: "Social Gathering", icon: "🎉" },
    { id: "outdoor", label: "Outdoor Climb", icon: "⛰️" },
  ];
  const [selectedType, setSelectedType] = useState("");

  const handlePublish = () => {
    // 发布活动逻辑
    navigate("/venues");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ec] to-[#f5f9f5]">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Create Event</h1>
          <Button
            onClick={handlePublish}
            disabled={!formData.title || !formData.venue || !formData.date}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
          >
            Publish
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 活动封面 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Image className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-900">Event Cover</span>
          </div>
          <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity border-2 border-dashed border-purple-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2">
                <Image className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Click to upload cover image</p>
            </div>
          </div>
        </div>

        {/* 活动标题 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-900">Event Title</span>
            <span className="text-red-500 text-sm">*</span>
          </div>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g.: Weekend Beginner Class / Spring Climbing Competition"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-purple-600 transition-colors"
          />
        </div>

        {/* 活动类型 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="mb-3">
            <span className="font-semibold text-gray-900">Event Type</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {eventTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedType === type.id
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                <span className="text-lg">{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 选择场馆 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-900">Event Venue</span>
            <span className="text-red-500 text-sm">*</span>
          </div>
          <button
            onClick={() => setShowVenueSearch(true)}
            className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              formData.venue
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100"
            }`}
          >
            {formData.venue ? formData.venue : "Select Venue"}
          </button>
          {formData.venueAddress && (
            <p className="text-xs text-gray-500 mt-2 px-2">{formData.venueAddress}</p>
          )}
        </div>

        {/* 日期和时间 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-900">Event Date</span>
            <span className="text-red-500 text-sm">*</span>
          </div>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-purple-600 transition-colors mb-3"
          />
          
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-900">Time Slot</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-purple-600 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-purple-600 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 参与人数和价格 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 参与人数 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900 text-sm">Max Capacity</span>
            </div>
            <input
              type="number"
              value={formData.maxPeople}
              onChange={(e) => setFormData({ ...formData, maxPeople: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-purple-600 transition-colors text-center text-lg font-bold text-purple-600"
            />
          </div>

          {/* 活动价格 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900 text-sm">Cost</span>
            </div>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Free / $22"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-purple-600 transition-colors text-center text-lg font-bold text-purple-600"
            />
          </div>
        </div>

        {/* 技能水平要求 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-purple-600 text-white border-none">
              <span>V</span>
            </Badge>
            <span className="font-semibold text-gray-900">Level Requirement</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setFormData({ ...formData, level })}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  formData.level === level
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* 活动详情 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="mb-3">
            <span className="font-semibold text-gray-900">Event Details</span>
          </div>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the event content, agenda, important notes, etc..."
            className="w-full min-h-[120px] px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-purple-600 transition-colors resize-none"
          />
        </div>

        {/* 提示信息 */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-100">
          <h3 className="font-semibold text-gray-900 mb-2">Event Publishing Guidelines</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>Events will be displayed on the venue detail page</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>Users can register directly for the event</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>View participation statistics after the event ends</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 场馆搜索模态框 */}
      {showVenueSearch && (
        <VenueSearchModal
          value={formData.venue}
          onChange={(venue) => setFormData({ ...formData, venue: venue.name, venueAddress: venue.address })}
          onClose={() => setShowVenueSearch(false)}
        />
      )}
    </div>
  );
}