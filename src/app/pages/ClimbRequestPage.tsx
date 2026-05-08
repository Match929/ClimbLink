import { useState } from "react";
import { ArrowLeft, MapPin, Calendar, Clock, Users, Zap, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { TimeWheelPicker } from "../components/TimeWheelPicker";
import { VenueSearchModal } from "../components/VenueSearchModal";

interface Venue {
  id: string;
  name: string;
  address: string;
  distance?: string;
}

export function ClimbRequestPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    level: "",
    peopleCount: "1",
    description: "",
  });
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [timeRange, setTimeRange] = useState({ start: "09:00", end: "12:00" });

  const levels = [
    "V0-V2 Beginner",
    "V3-V5 Intermediate",
    "V6-V8 Advanced",
    "V9+ Expert",
  ];

  const handlePublish = () => {
    // 发布约爬需求逻辑
    navigate("/community");
  };

  const formatTimeRange = () => {
    if (!timeRange.start || !timeRange.end) return "Select Time Range";
    return `${timeRange.start} - ${timeRange.end}`;
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
          <h1 className="text-lg font-bold text-gray-900">Find Partners</h1>
          <Button
            onClick={handlePublish}
            disabled={!selectedVenue || !formData.date || !formData.level}
            size="sm"
            className="bg-[#7eb662] hover:bg-[#6a9b54] text-white disabled:opacity-50"
          >
            Publish
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 选择场馆 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-[#7eb662]" />
            <span className="font-semibold text-gray-900">Climbing Gym</span>
            <span className="text-red-500 text-sm">*</span>
          </div>
          
          {selectedVenue ? (
            <button
              onClick={() => setShowVenueModal(true)}
              className="w-full bg-white hover:bg-gray-50 rounded-2xl p-4 border border-gray-100 transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#7eb662] to-[#6a9b54] rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 mb-1">
                    {selectedVenue.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {selectedVenue.address}
                  </div>
                  {selectedVenue.distance && (
                    <div className="text-xs text-[#7eb662] font-medium mt-1">
                      {selectedVenue.distance}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            </button>
          ) : (
            <button
              onClick={() => setShowVenueModal(true)}
              className="w-full px-4 py-4 rounded-xl text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100 transition-all flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Select Venue
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {showVenueModal && (
          <VenueSearchModal
            value={selectedVenue?.name || ""}
            onChange={(venue) => {
              setSelectedVenue(venue);
              setShowVenueModal(false);
            }}
            onClose={() => setShowVenueModal(false)}
          />
        )}

        {/* 选择日期 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-[#7eb662]" />
            <span className="font-semibold text-gray-900">Climb Date</span>
            <span className="text-red-500 text-sm">*</span>
          </div>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#7eb662] transition-colors"
          />
        </div>

        {/* 选择时间段 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-[#7eb662]" />
            <span className="font-semibold text-gray-900">Time Slot</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => setShowTimePicker(true)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                timeRange.start && timeRange.end
                  ? "bg-[#7eb662] text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100"
              }`}
            >
              {formatTimeRange()}
            </button>
          </div>
          {showTimePicker && (
            <TimeWheelPicker
              value={timeRange}
              onChange={(range) => {
                setTimeRange(range);
                setFormData({ ...formData, time: `${range.start} - ${range.end}` });
              }}
              onClose={() => setShowTimePicker(false)}
            />
          )}
        </div>

        {/* 技能水平 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-[#7eb662] text-white border-none">
              <span>V</span>
            </Badge>
            <span className="font-semibold text-gray-900">Skill Level</span>
            <span className="text-red-500 text-sm">*</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setFormData({ ...formData, level })}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  formData.level === level
                    ? "bg-[#7eb662] text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* 寻找人数 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-[#7eb662]" />
            <span className="font-semibold text-gray-900">Looking For Partners</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setFormData({
                  ...formData,
                  peopleCount: String(Math.max(1, Number(formData.peopleCount) - 1)),
                })
              }
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center font-bold text-gray-700 transition-colors"
            >
              -
            </button>
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-[#7eb662]">
                {formData.peopleCount}
              </div>
              <div className="text-xs text-gray-500 mt-1">people</div>
            </div>
            <button
              onClick={() =>
                setFormData({
                  ...formData,
                  peopleCount: String(Math.min(10, Number(formData.peopleCount) + 1)),
                })
              }
              className="w-10 h-10 bg-[#7eb662] hover:bg-[#6a9b54] rounded-xl flex items-center justify-center font-bold text-white transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* 补充说明 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="mb-3">
            <span className="font-semibold text-gray-900">Additional Notes</span>
            <span className="text-xs text-gray-400 ml-2">(optional)</span>
          </div>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Share your climbing expectations, personal traits, etc..."
            className="w-full min-h-[100px] px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#7eb662] transition-colors resize-none"
          />
        </div>

        {/* 匹配说明 */}
        <div className="bg-gradient-to-br from-[#e8f5e0] to-[#d4e7c5] rounded-2xl p-4 border border-[#c8e1b8]">
          <h3 className="font-semibold text-gray-900 mb-2">Smart Matching Info</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#7eb662] mt-0.5">•</span>
              <span>System will auto-match based on time, location, and skill level</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7eb662] mt-0.5">•</span>
              <span>Both parties can view detailed info after matching</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7eb662] mt-0.5">•</span>
              <span>Generate AI memory card after climb completion</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}