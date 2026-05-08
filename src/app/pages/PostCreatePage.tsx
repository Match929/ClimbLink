import { useState } from "react";
import { ArrowLeft, Image, MapPin, Hash, Smile, AtSign } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { VisibilityModal, VisibilitySettings } from "../components/VisibilityModal";

export function PostCreatePage() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [visibility, setVisibility] = useState<VisibilitySettings>({
    type: "public",
    users: [],
  });

  const venues = ["Rock Time Gym", "Climber's Paradise", "Peak Climbing Center", "Cloud Nine Climbing Club"];
  const suggestedTags = ["First Check-in", "Advanced Challenge", "Weekend Activity", "Technique Sharing", "Gear Recommendation"];

  const handlePublish = () => {
    // 发布逻辑
    navigate("/community");
  };

  const getVisibilityLabel = () => {
    switch (visibility.type) {
      case "public":
        return "Public";
      case "private":
        return "Private";
      case "visible-to":
        return `Visible to ${visibility.users.length} ${visibility.users.length === 1 ? "person" : "people"}`;
      case "hidden-from":
        return `Hidden from ${visibility.users.length} ${visibility.users.length === 1 ? "person" : "people"}`;
      default:
        return "Public";
    }
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
          <h1 className="text-lg font-bold text-gray-900">Create Post</h1>
          <Button
            onClick={handlePublish}
            disabled={!content.trim()}
            size="sm"
            className="bg-[#7eb662] hover:bg-[#6a9b54] text-white disabled:opacity-50"
          >
            Publish
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 内容输入区 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your climbing moment..."
            className="w-full min-h-[160px] text-gray-900 placeholder-gray-400 resize-none outline-none"
          />

          {/* 图片预览区 */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button className="absolute top-2 right-2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xs">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 操作栏 */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-4">
            <button className="flex items-center gap-2 text-gray-500 hover:text-[#7eb662] transition-colors">
              <Image className="w-5 h-5" />
              <span className="text-sm">Photo</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-[#7eb662] transition-colors">
              <AtSign className="w-5 h-5" />
              <span className="text-sm">@Friends</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-[#7eb662] transition-colors">
              <Smile className="w-5 h-5" />
              <span className="text-sm">Emoji</span>
            </button>
          </div>
        </div>

        {/* 选择场馆 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-[#7eb662]" />
            <span className="font-semibold text-gray-900">Select Gym</span>
            <span className="text-xs text-gray-400">(optional)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {venues.map((venue) => (
              <button
                key={venue}
                onClick={() => setSelectedVenue(venue === selectedVenue ? "" : venue)}
                className={`px-4 py-2 rounded-xl text-sm transition-all ${
                  selectedVenue === venue
                    ? "bg-[#7eb662] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {venue}
              </button>
            ))}
          </div>
        </div>

        {/* 添加话题标签 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-5 h-5 text-[#7eb662]" />
            <span className="font-semibold text-gray-900">Add Topics</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-[#f0f7ec] text-[#5a8a3f] border-none cursor-pointer hover:bg-[#e8f5e0] transition-colors"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* 功能卡片 */}
        <div className="bg-gradient-to-br from-[#e8f5e0] to-[#d4e7c5] rounded-2xl p-4 border border-[#c8e1b8]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl">✨</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                AI-Generated Climb Memory Card
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                After posting, use AI to generate a beautiful memory card for this climb
              </p>
              <button className="text-sm text-[#7eb662] font-medium">
                Learn More →
              </button>
            </div>
          </div>
        </div>

        {/* 隐私设置 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Who can see</h3>
              <p className="text-sm text-gray-500">{getVisibilityLabel()}</p>
            </div>
            <button className="text-gray-400" onClick={() => setShowVisibilityModal(true)}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 隐私设置模态框 */}
      {showVisibilityModal && (
        <VisibilityModal
          value={visibility}
          onChange={setVisibility}
          onClose={() => setShowVisibilityModal(false)}
        />
      )}
    </div>
  );
}