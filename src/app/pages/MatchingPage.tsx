import { useState } from "react";
import { ArrowLeft, Calendar, MapPin, TrendingUp, Users, Heart, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function MatchingPage() {
  const [showMatchingDialog, setShowMatchingDialog] = useState(false);

  const matchPosts = [
    {
      id: 1,
      user: {
        name: "小李",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoli",
        level: "V2-V4",
        experience: "1年",
      },
      title: "周六下午找搭子一起抱石",
      venue: "岩时攀岩馆",
      time: "3月27日 14:00-17:00",
      currentCount: 2,
      maxCount: 4,
      matchScore: 95,
      matchReasons: ["水平一致", "时间重合", "同场馆"],
      description: "想找两位水平相当的朋友一起练习，互相保护，互相学习！",
      preferences: ["认真练习", "互相鼓励"],
    },
    {
      id: 2,
      user: {
        name: "阿强",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aqiang",
        level: "V3-V5",
        experience: "2年",
      },
      title: "周末进阶训练，寻找搭档",
      venue: "攀岩者天堂",
      time: "3月28日 10:00-13:00",
      currentCount: 1,
      maxCount: 3,
      matchScore: 82,
      matchReasons: ["水平接近", "场馆相同"],
      description: "计划练习一些有挑战性的线路，希望找到志同道合的伙伴！",
      preferences: ["进阶训练", "挑战自我"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f9f5]">
      {/* 顶部导航 */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10 border-b border-gray-100" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
        <Link to="/">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">精准约爬匹配</h1>
      </div>

      {/* 发布约爬按钮 */}
      <div className="p-4">
        <Button
          onClick={() => setShowMatchingDialog(true)}
          className="w-full bg-[#7eb662] hover:bg-[#6a9b54] text-white py-6 rounded-2xl text-base font-medium"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          发布约爬需求
        </Button>
      </div>

      {/* 推荐匹配 */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">为你推荐</h2>
          <span className="text-xs text-gray-500">基于多维度智能匹配</span>
        </div>

        <div className="space-y-4">
          {matchPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm">
              {/* 匹配度评分 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7eb662] to-[#6a9b54] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {post.matchScore}%
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white fill-white" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">匹配度 {post.matchScore}%</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {post.matchReasons.map((reason) => (
                        <span
                          key={reason}
                          className="text-xs bg-[#d4e7c5] text-[#5a8a3f] px-2 py-0.5 rounded"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 用户信息 */}
              <div className="flex items-center gap-3 mb-3">
                <ImageWithFallback
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900">{post.user.name}</div>
                  <div className="text-xs text-gray-500">
                    {post.user.level} · {post.user.experience}经验
                  </div>
                </div>
              </div>

              {/* 约爬标题 */}
              <h3 className="font-bold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{post.description}</p>

              {/* 详细信息 */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{post.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{post.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>
                    {post.currentCount}/{post.maxCount}人
                  </span>
                  <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden ml-2">
                    <div
                      className="bg-[#7eb662] h-full rounded-full"
                      style={{ width: `${(post.currentCount / post.maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 偏好标签 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.preferences.map((pref) => (
                  <Badge
                    key={pref}
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 border-none"
                  >
                    {pref}
                  </Badge>
                ))}
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-[#7eb662] text-[#7eb662] hover:bg-[#f0f7ec]"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  私聊
                </Button>
                <Button className="flex-1 bg-[#7eb662] hover:bg-[#6a9b54] text-white">
                  申请加入
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 发布约爬对话框 */}
      {showMatchingDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">发布约爬需求</h2>
              <button
                onClick={() => setShowMatchingDialog(false)}
                className="text-gray-500 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  约爬标题
                </label>
                <input
                  type="text"
                  placeholder="例如：周末找搭子一起练习"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#7eb662]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  场馆选择
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#7eb662]">
                  <option>岩时攀岩馆</option>
                  <option>攀岩者天堂</option>
                  <option>巅峰攀岩中心</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  约爬时间
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#7eb662]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  水平要求
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["V0-V2", "V2-V4", "V4-V6", "V6-V8", "V8+", "不限"].map((level) => (
                    <button
                      key={level}
                      className="px-4 py-2 rounded-lg border border-gray-200 hover:border-[#7eb662] hover:bg-[#f0f7ec] text-sm"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  需要人数
                </label>
                <input
                  type="number"
                  placeholder="2-8人"
                  min="2"
                  max="8"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#7eb662]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  详细描述
                </label>
                <textarea
                  placeholder="说说你的约爬想法..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#7eb662] resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 AI助手可以帮你生成个性化文案
                </p>
              </div>

              <Button className="w-full bg-[#7eb662] hover:bg-[#6a9b54] text-white py-4 rounded-xl text-base">
                发布约爬
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}