import { useState } from "react";
import { ArrowLeft, Sparkles, Gift, RefreshCw, Heart, MapPin, TrendingUp } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";

export function BlindBoxPage() {
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  const handleMatch = () => {
    setIsMatching(true);
    setMatchResult(null);

    // 模拟匹配过程
    setTimeout(() => {
      setMatchResult({
        user: {
          name: "XiaoWang",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=xiaowang",
          level: "V3-V4",
          experience: "1.5 years",
          age: 26,
          gender: "Male",
        },
        venue: "Rock Time Gym",
        time: "Tomorrow 3:00 PM",
        compatibility: 88,
        commonInterests: ["Bouldering", "Outdoors", "Photography"],
        introduction: "Love challenging new routes and helping beginners. Looking for a partner to progress together!",
      });
      setIsMatching(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d4e7c5] to-[#f5f9f5]">
      {/* 顶部导航 */}
      <div className="bg-transparent px-4 py-4 flex items-center gap-3">
        <Link to="/">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Mystery Match</h1>
      </div>

      {/* 主内容区 */}
      <div className="px-4 pt-6">
        <div className="text-center mb-8">
          <motion.div
            animate={isMatching ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 1, repeat: isMatching ? Infinity : 0, ease: "linear" }}
            className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-[#7eb662] to-[#6a9b54] rounded-full flex items-center justify-center shadow-lg"
          >
            <Gift className="w-16 h-16 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Random Partner Match</h2>
          <p className="text-gray-600">
            Based on your skill level and preferences<br />We'll match you with like-minded climbing partners
          </p>
        </div>

        {/* 匹配按钮 */}
        {!matchResult && (
          <div className="space-y-4">
            <Button
              onClick={handleMatch}
              disabled={isMatching}
              className="w-full bg-[#7eb662] hover:bg-[#6a9b54] text-white py-6 rounded-2xl text-lg font-medium disabled:opacity-50"
            >
              {isMatching ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Finding your match...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Open Mystery Box
                </>
              )}
            </Button>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4">
              <h3 className="font-bold text-gray-900 mb-3">Matching Rules</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#7eb662]">✓</span>
                  <span>System will match based on your climbing level</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7eb662]">✓</span>
                  <span>Priority match with climbers in the same city and gym</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7eb662]">✓</span>
                  <span>Each match is a new surprise experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7eb662]">✓</span>
                  <span>Unsatisfied? Re-match</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* 匹配结果 */}
        {matchResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* 匹配成功提示 */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-4">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <span className="font-medium text-gray-900">Match Found!</span>
              </div>
            </div>

            {/* 用户信息卡片 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <ImageWithFallback
                  src={matchResult.user.avatar}
                  alt={matchResult.user.name}
                  className="w-20 h-20 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {matchResult.user.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {matchResult.user.age} years old · {matchResult.user.gender}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{matchResult.user.level}</span>
                    <span>·</span>
                    <span>{matchResult.user.experience} experience</span>
                  </div>
                  
                  {/* 匹配度 */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#7eb662] to-[#6a9b54] h-full rounded-full"
                        style={{ width: `${matchResult.compatibility}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[#7eb662]">
                      {matchResult.compatibility}%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
                "{matchResult.introduction}"
              </p>

              {/* 约爬信息 */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{matchResult.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Sparkles className="w-4 h-4" />
                  <span>Suggested climbing time: {matchResult.time}</span>
                </div>
              </div>

              {/* 共同兴趣 */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Common Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {matchResult.commonInterests.map((interest: string) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-[#d4e7c5] text-[#5a8a3f] rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setMatchResult(null)}
                  variant="outline"
                  className="flex-1 border-gray-300"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Re-match
                </Button>
                <Button className="flex-1 bg-[#7eb662] hover:bg-[#6a9b54] text-white">
                  <Heart className="w-4 h-4 mr-2" />
                  Accept Match
                </Button>
              </div>
            </div>

            {/* 提示信息 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
              <p>💡 After accepting the match, the system will generate a climbing card and notify the other party</p>
            </div>
          </motion.div>
        )}

        {/* 历史匹配记录 */}
        {!matchResult && !isMatching && (
          <div className="mt-8">
            <h3 className="font-bold text-gray-900 mb-3">Recent Matches</h3>
            <div className="space-y-3">
              {[
                { name: "XiaoZhang", level: "V2-V4", date: "March 20th" },
                { name: "Ami", level: "V3-V5", date: "March 18th" },
              ].map((record, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <ImageWithFallback
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${record.name}`}
                      alt={record.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{record.name}</div>
                      <div className="text-xs text-gray-500">{record.level}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{record.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}