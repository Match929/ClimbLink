import { Link } from "react-router";
import { BookOpen, Package, MapPin, GraduationCap, ShieldCheck, Users, Heart, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { AIChatWidget } from "../components/AIChatWidget";

export function BeginnerGuidePage() {
  const equipmentGuide = [
    {
      id: 1,
      category: "Essential Gear",
      items: [
        {
          name: "Climbing Shoes",
          description: "Tight-fitting, provides excellent friction",
          price: "$80-200",
          priority: "High",
          tips: "Beginners should choose comfortable fit, not too tight",
          image: "https://images.unsplash.com/photo-1606814893907-c2e42943c91f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        },
        {
          name: "Chalk Bag",
          description: "Keeps hands dry, increases friction",
          price: "$10-30",
          priority: "High",
          tips: "Liquid chalk is eco-friendly, powder chalk is traditional",
          image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        },
      ],
    },
    {
      id: 2,
      category: "Advanced Gear",
      items: [
        {
          name: "Finger Tape",
          description: "Protects finger skin, prevents wear",
          price: "$5-15",
          priority: "Medium",
          tips: "Recommended for long training sessions",
          image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        },
        {
          name: "Training Board",
          description: "Home training, improves finger strength",
          price: "$50-150",
          priority: "Medium",
          tips: "Purchase after building a solid foundation",
          image: "https://images.unsplash.com/photo-1731176116069-86205f376088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        },
      ],
    },
  ];

  const beginnerVenues = [
    {
      id: 1,
      name: "Rock Time Gym",
      image: "https://images.unsplash.com/photo-1721885876144-25863108be60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      distance: "1.2km",
      rating: 4.8,
      reviews: 234,
      price: "$18/visit",
      beginnerFriendly: true,
      features: ["Beginner Classes", "Well Equipped", "Patient Coaches", "Friendly Environment"],
      difficulty: "V0-V3",
      highlights: "Dedicated beginner area, regular beginner courses",
    },
    {
      id: 2,
      name: "Climber's Paradise",
      image: "https://images.unsplash.com/photo-1659666287295-7da26c3f80d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      distance: "2.5km",
      rating: 4.9,
      reviews: 189,
      price: "$22/visit",
      beginnerFriendly: true,
      features: ["1-on-1 Coaching", "Gear Rental", "Beginner Discounts", "Active Community"],
      difficulty: "V0-V4",
      highlights: "Free beginner trial classes, full equipment rental",
    },
  ];

  const safetyTips = [
    {
      icon: ShieldCheck,
      title: "Warm Up Properly",
      description: "5-10 minutes warm-up before climbing, activate fingers, wrists, shoulders",
      importance: "Must",
    },
    {
      icon: AlertCircle,
      title: "Study the Route",
      description: "Observe the route before climbing, plan your moves, don't climb blindly",
      importance: "Important",
    },
    {
      icon: Users,
      title: "Climb with Partners",
      description: "Beginners should climb with experienced partners for protection and guidance",
      importance: "Recommended",
    },
    {
      icon: Heart,
      title: "Know Your Limits",
      description: "Don't rush high difficulty routes, gradual progression is key",
      importance: "Must",
    },
  ];

  const learningPath = [
    {
      level: "Entry Level",
      difficulty: "V0-V1",
      duration: "1-2 months",
      goals: ["Master basic stance", "Learn proper grip", "Build basic strength", "Overcome height fear"],
      tips: "Focus on fundamentals, don't rush",
    },
    {
      level: "Beginner Level",
      difficulty: "V1-V2",
      duration: "2-4 months",
      goals: ["Improve core strength", "Learn footwork", "Master weight transfer", "Complete simple traverses"],
      tips: "Practice footwork more, reduce arm dependence",
    },
    {
      level: "Advanced Prep",
      difficulty: "V2-V3",
      duration: "4-6 months",
      goals: ["Strengthen fingers", "Learn dynamic moves", "Improve endurance", "Complete hanging training"],
      tips: "Start systematic training, focus on rest and recovery",
    },
  ];

  const commonMistakes = [
    {
      mistake: "Over-relying on arm strength",
      solution: "Learn to power with legs, keep center close to wall",
      icon: "💪",
    },
    {
      mistake: "Ignoring footwork",
      solution: "Practice precise footholds, improve foot stability",
      icon: "👟",
    },
    {
      mistake: "Stiff climbing posture",
      solution: "Relax body, maintain fluid movements",
      icon: "🧘",
    },
    {
      mistake: "Lack of patience and regular training",
      solution: "Create training plan, maintain 2-3 times per week",
      icon: "📅",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f9f5]">
      {/* Top Navigation */}
      <div className="bg-gradient-to-br from-[#7eb662] to-[#6a9b54] px-4 pt-6 pb-20 relative">
        <Link to="/" className="inline-block mb-4">
          <button className="flex items-center gap-2 text-white">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Beginner's Guide</h1>
            <p className="text-sm text-white/90 mt-1">Start from zero, climb safely</p>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,40 C300,100 500,40 700,80 C900,120 1100,60 1200,100 L1200,120 L0,120 Z"
              fill="#f5f9f5"
            />
          </svg>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="px-4 -mt-12 mb-6 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          <a href="#equipment">
            <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#d4e7c5] to-[#c0ddb0] rounded-xl flex items-center justify-center mb-2">
                <Package className="w-5 h-5 text-[#5a8a3f]" />
              </div>
              <h3 className="font-bold text-gray-900">Gear Guide</h3>
              <p className="text-xs text-gray-500 mt-1">Essential equipment</p>
            </div>
          </a>
          
          <a href="#venues">
            <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#d4e7c5] to-[#c0ddb0] rounded-xl flex items-center justify-center mb-2">
                <MapPin className="w-5 h-5 text-[#5a8a3f]" />
              </div>
              <h3 className="font-bold text-gray-900">Friendly Gyms</h3>
              <p className="text-xs text-gray-500 mt-1">Beginner-friendly</p>
            </div>
          </a>
          
          <a href="#learning">
            <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#d4e7c5] to-[#c0ddb0] rounded-xl flex items-center justify-center mb-2">
                <GraduationCap className="w-5 h-5 text-[#5a8a3f]" />
              </div>
              <h3 className="font-bold text-gray-900">Learning Path</h3>
              <p className="text-xs text-gray-500 mt-1">Growth roadmap</p>
            </div>
          </a>
          
          <a href="#safety">
            <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#d4e7c5] to-[#c0ddb0] rounded-xl flex items-center justify-center mb-2">
                <ShieldCheck className="w-5 h-5 text-[#5a8a3f]" />
              </div>
              <h3 className="font-bold text-gray-900">Safety Tips</h3>
              <p className="text-xs text-gray-500 mt-1">Important reminders</p>
            </div>
          </a>
        </div>
      </div>

      {/* Equipment Guide */}
      <div id="equipment" className="px-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-[#7eb662]" />
            <h2 className="text-lg font-bold text-gray-900">Gear Guide</h2>
          </div>

          {equipmentGuide.map((category) => (
            <div key={category.id} className="mb-6 last:mb-0">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#7eb662] rounded-full"></span>
                {category.category}
              </h3>
              
              <div className="space-y-3">
                {category.items.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{item.name}</h4>
                          <Badge
                            className={`text-xs ${
                              item.priority === "High"
                                ? "bg-red-100 text-red-700 border-red-200"
                                : "bg-blue-100 text-blue-700 border-blue-200"
                            }`}
                          >
                            {item.priority === "High" ? "Essential" : "Recommended"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {item.description}
                        </p>
                        <p className="text-sm font-medium text-[#7eb662]">
                          {item.price}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700">{item.tips}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-4 p-4 bg-gradient-to-br from-[#f0f7ec] to-[#e8f5e0] rounded-xl border border-[#d4e7c5]">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[#7eb662] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  💡 Gear Rental Tips
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Beginners can rent equipment at gyms initially, then purchase after commitment. Most gyms offer shoe and chalk bag rentals ($3-5/visit).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Beginner-Friendly Gyms */}
      <div id="venues" className="px-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#7eb662]" />
              <h2 className="text-lg font-bold text-gray-900">Beginner-Friendly Gyms</h2>
            </div>
            <Badge className="bg-[#d4e7c5] text-[#5a8a3f] border-none">
              {beginnerVenues.length} Recommended
            </Badge>
          </div>

          <div className="space-y-4">
            {beginnerVenues.map((venue) => (
              <Link key={venue.id} to={`/venue/${venue.id}`}>
                <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#7eb662] hover:shadow-md transition-all">
                  <div className="relative h-32">
                    <ImageWithFallback
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-green-500 text-white border-none">
                        ⭐ Beginner Friendly
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{venue.name}</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm font-medium">{venue.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3">{venue.highlights}</p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span>📍 {venue.distance}</span>
                      <span className="text-[#7eb662] font-medium">{venue.price}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {venue.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {venue.features.map((feature) => (
                        <span
                          key={feature}
                          className="text-xs bg-[#f0f7ec] text-[#5a8a3f] px-2 py-1 rounded-lg"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Link to="/venues">
            <Button className="w-full mt-4 bg-[#7eb662] hover:bg-[#6a9b54] text-white">
              View More Gyms →
            </Button>
          </Link>
        </div>
      </div>

      {/* Learning Path */}
      <div id="learning" className="px-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-[#7eb662]" />
            <h2 className="text-lg font-bold text-gray-900">Learning Path</h2>
          </div>

          <div className="space-y-4">
            {learningPath.map((stage, idx) => (
              <div key={idx} className="relative">
                {/* Connecting Line */}
                {idx < learningPath.length - 1 && (
                  <div className="absolute left-4 top-12 w-0.5 h-full bg-gradient-to-b from-[#7eb662] to-[#d4e7c5]" />
                )}
                
                <div className="flex gap-3">
                  <div className="relative z-10 w-8 h-8 bg-gradient-to-br from-[#7eb662] to-[#6a9b54] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white text-sm font-bold">{idx + 1}</span>
                  </div>
                  
                  <div className="flex-1 bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{stage.level}</h3>
                      <Badge className="bg-[#7eb662] text-white border-none text-xs">
                        {stage.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-3">
                      Estimated: {stage.duration}
                    </p>
                    
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">Learning Goals:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {stage.goals.map((goal, goalIdx) => (
                          <div key={goalIdx} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3 h-3 text-[#7eb662] flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-gray-600">{goal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2">
                      <span className="text-xs">💡</span>
                      <p className="text-xs text-amber-700">{stage.tips}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      <div id="safety" className="px-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-[#7eb662]" />
            <h2 className="text-lg font-bold text-gray-900">Safety Tips</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-5">
            {safetyTips.map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <div key={idx} className="bg-gradient-to-r from-[#f0f7ec] to-white rounded-xl p-4 border border-[#d4e7c5]">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Icon className="w-5 h-5 text-[#7eb662]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{tip.title}</h4>
                        <Badge
                          className={`text-xs ${
                            tip.importance === "Must"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : tip.importance === "Important"
                              ? "bg-orange-100 text-orange-700 border-orange-200"
                              : "bg-blue-100 text-blue-700 border-blue-200"
                          }`}
                        >
                          {tip.importance}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{tip.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-800 mb-2">⚠️ Emergency Alert</p>
                <p className="text-xs text-red-700 leading-relaxed">
                  Stop immediately if you feel pain in fingers, wrists, shoulders. Climbing is high-intensity. Over-training may cause injuries. Rest 1-2 days per week for full recovery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Mistakes */}
      <div className="px-4 mb-6 pb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Common Mistakes</h2>
          
          <div className="space-y-3">
            {commonMistakes.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-red-500 text-sm">✗</span>
                      <p className="text-sm font-medium text-gray-900">
                        {item.mistake}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 text-sm">✓</span>
                      <p className="text-sm text-gray-600">{item.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Chat Widget */}
      <AIChatWidget />
    </div>
  );
}
