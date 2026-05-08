import { useState } from "react";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export function EditProfilePage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "Climbing Enthusiast",
    bio: "Love climbing, enjoy challenges 🧗‍♂️",
    level: "V3-V5",
    experience: "1.5 years",
    gender: "Male",
    age: "25",
    height: "175",
    weight: "70",
    phone: "138****8888",
    wechat: "climber_2024",
    location: "Suzhou · Industrial Park",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // 保存逻辑
    console.log("Save profile:", formData);
    navigate(-1);
  };

  const levels = ["V0", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10"];

  return (
    <div className="min-h-screen bg-[#f5f9f5] pb-24">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Edit Profile</span>
          </button>
          <button
            onClick={handleSave}
            className="text-[#7eb662] font-medium flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* 头像设置 */}
        <div className="bg-white rounded-2xl p-6 mb-4">
          <h2 className="font-bold text-gray-900 mb-4">Avatar</h2>
          <div className="flex items-center justify-center">
            <div className="relative">
              <ImageWithFallback
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=myprofile"
                alt="Avatar"
                className="w-24 h-24 rounded-full"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#7eb662] rounded-full flex items-center justify-center text-white shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 基本信息 */}
        <div className="bg-white rounded-2xl p-4 mb-4">
          <h2 className="font-bold text-gray-900 mb-4">Basic Info</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Nickname</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:bg-gray-100 transition-colors"
                placeholder="Enter your nickname"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-2 block">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:bg-gray-100 transition-colors resize-none"
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:bg-gray-100 transition-colors"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:bg-gray-100 transition-colors"
                  placeholder="Age"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleChange("height", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:bg-gray-100 transition-colors"
                  placeholder="Height"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleChange("weight", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:bg-gray-100 transition-colors"
                  placeholder="Weight"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-2 block">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:bg-gray-100 transition-colors"
                placeholder="Your location"
              />
            </div>
          </div>
        </div>

        {/* 攀岩信息 */}
        <div className="bg-white rounded-2xl p-4 mb-4">
          <h2 className="font-bold text-gray-900 mb-4">Climbing Info</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Climbing Level
                <span className="ml-2 text-xs text-gray-400">
                  (Select your comfort difficulty range)
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => {
                  const isSelected = formData.level.includes(level);
                  return (
                    <button
                      key={level}
                      onClick={() => handleChange("level", level)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-[#7eb662] text-white"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-2 block">Climbing Experience</label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:bg-gray-100 transition-colors"
                placeholder="e.g.: 1.5 years"
              />
            </div>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="bg-white rounded-2xl p-4 mb-4">
          <h2 className="font-bold text-gray-900 mb-4">Contact Info</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:bg-gray-100 transition-colors"
                placeholder="Phone number"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                WeChat ID
                <span className="ml-2 text-xs text-gray-400">
                  (For partners to contact you)
                </span>
              </label>
              <input
                type="text"
                value={formData.wechat}
                onChange={(e) => handleChange("wechat", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:bg-gray-100 transition-colors"
                placeholder="WeChat ID"
              />
            </div>
          </div>
        </div>

        {/* 隐私提示 */}
        <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Privacy Protection</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your contact info is only visible to matched partners. We strictly protect your personal information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 底部保存按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-[#7eb662] to-[#6a9b54] hover:from-[#6a9b54] hover:to-[#5a8a3f] text-white font-bold shadow-lg h-12"
          >
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}