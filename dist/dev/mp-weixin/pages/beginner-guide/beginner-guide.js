"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  AiChatWidget();
}
const AiChatWidget = () => "../../components/ai-chat-widget/ai-chat-widget.js";
const _sfc_main = {
  __name: "beginner-guide",
  setup(__props) {
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
            image: "https://images.unsplash.com/photo-1606814893907-c2e42943c91f?w=400"
          },
          {
            name: "Chalk Bag",
            description: "Keeps hands dry, increases friction",
            price: "$10-30",
            priority: "High",
            tips: "Liquid chalk is eco-friendly, powder chalk is traditional",
            image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400"
          }
        ]
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
            image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400"
          },
          {
            name: "Training Board",
            description: "Home training, improves finger strength",
            price: "$50-150",
            priority: "Medium",
            tips: "Purchase after building a solid foundation",
            image: "https://images.unsplash.com/photo-1731176116069-86205f376088?w=400"
          }
        ]
      }
    ];
    const beginnerVenues = [
      {
        id: 1,
        name: "Rock Time Gym",
        image: "https://images.unsplash.com/photo-1721885876144-25863108be60?w=1080",
        distance: "1.2km",
        rating: 4.8,
        reviews: 234,
        price: "$18/visit",
        beginnerFriendly: true,
        features: ["Beginner Classes", "Well Equipped", "Patient Coaches", "Friendly Environment"],
        difficulty: "V0-V3",
        highlights: "Dedicated beginner area, regular beginner courses"
      },
      {
        id: 2,
        name: "Climber's Paradise",
        image: "https://images.unsplash.com/photo-1659666287295-7da26c3f80d4?w=1080",
        distance: "2.5km",
        rating: 4.9,
        reviews: 189,
        price: "$22/visit",
        beginnerFriendly: true,
        features: ["1-on-1 Coaching", "Gear Rental", "Beginner Discounts", "Active Community"],
        difficulty: "V0-V4",
        highlights: "Free beginner trial classes, full equipment rental"
      }
    ];
    const safetyTips = [
      {
        icon: "🔥",
        title: "Warm Up Properly",
        description: "5-10 minutes warm-up before climbing, activate fingers, wrists, shoulders",
        importance: "Must"
      },
      {
        icon: "👀",
        title: "Study the Route",
        description: "Observe the route before climbing, plan your moves, don't climb blindly",
        importance: "Important"
      },
      {
        icon: "👥",
        title: "Climb with Partners",
        description: "Beginners should climb with experienced partners for protection and guidance",
        importance: "Recommended"
      },
      {
        icon: "💚",
        title: "Know Your Limits",
        description: "Don't rush high difficulty routes, gradual progression is key",
        importance: "Must"
      }
    ];
    const learningPath = [
      {
        level: "Entry Level",
        difficulty: "V0-V1",
        duration: "1-2 months",
        goals: ["Master basic stance", "Learn proper grip", "Build basic strength", "Overcome height fear"],
        tips: "Focus on fundamentals, don't rush"
      },
      {
        level: "Beginner Level",
        difficulty: "V1-V2",
        duration: "2-4 months",
        goals: ["Improve core strength", "Learn footwork", "Master weight transfer", "Complete simple traverses"],
        tips: "Practice footwork more, reduce arm dependence"
      },
      {
        level: "Advanced Prep",
        difficulty: "V2-V3",
        duration: "4-6 months",
        goals: ["Strengthen fingers", "Learn dynamic moves", "Improve endurance", "Complete hanging training"],
        tips: "Start systematic training, focus on rest and recovery"
      }
    ];
    const commonMistakes = [
      {
        mistake: "Over-relying on arm strength",
        solution: "Learn to power with legs, keep center close to wall",
        icon: "💪"
      },
      {
        mistake: "Ignoring footwork",
        solution: "Practice precise footholds, improve foot stability",
        icon: "👟"
      },
      {
        mistake: "Stiff climbing posture",
        solution: "Relax body, maintain fluid movements",
        icon: "🧘"
      },
      {
        mistake: "Lack of patience and regular training",
        solution: "Create training plan, maintain 2-3 times per week",
        icon: "📅"
      }
    ];
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const sectionPositions = {
      "equipment": 0,
      "venues": 700,
      "learning": 1500,
      "safety": 2200
    };
    const scrollToSection = (sectionId) => {
      console.log("scrollToSection called with:", sectionId);
      const targetPosition = sectionPositions[sectionId] || 0;
      common_vendor.index.pageScrollTo({
        scrollTop: targetPosition,
        duration: 300
      });
    };
    const goToVenueDetail = (id) => {
      common_vendor.index.navigateTo({
        url: "/pages/venue-detail/venue-detail"
      });
    };
    const goToVenues = () => {
      common_vendor.index.switchTab({
        url: "/pages/venues/venues"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goBack),
        b: common_vendor.o(($event) => scrollToSection("equipment")),
        c: common_vendor.o(($event) => scrollToSection("venues")),
        d: common_vendor.o(($event) => scrollToSection("learning")),
        e: common_vendor.o(($event) => scrollToSection("safety")),
        f: common_vendor.f(equipmentGuide, (category, k0, i0) => {
          return {
            a: common_vendor.t(category.category),
            b: common_vendor.f(category.items, (item, k1, i1) => {
              return {
                a: item.image,
                b: common_vendor.t(item.name),
                c: common_vendor.t(item.priority === "High" ? "Essential" : "Recommended"),
                d: common_vendor.n(item.priority === "High" ? "high" : "medium"),
                e: common_vendor.t(item.description),
                f: common_vendor.t(item.price),
                g: common_vendor.t(item.tips),
                h: item.name
              };
            }),
            c: category.id
          };
        }),
        g: common_vendor.t(beginnerVenues.length),
        h: common_vendor.f(beginnerVenues, (venue, k0, i0) => {
          return {
            a: venue.image,
            b: common_vendor.t(venue.name),
            c: common_vendor.t(venue.rating),
            d: common_vendor.t(venue.highlights),
            e: common_vendor.t(venue.distance),
            f: common_vendor.t(venue.price),
            g: common_vendor.t(venue.difficulty),
            h: common_vendor.f(venue.features, (feature, k1, i1) => {
              return {
                a: common_vendor.t(feature),
                b: feature
              };
            }),
            i: venue.id,
            j: common_vendor.o(($event) => goToVenueDetail(venue.id), venue.id)
          };
        }),
        i: common_vendor.o(goToVenues),
        j: common_vendor.f(learningPath, (stage, idx, i0) => {
          return common_vendor.e({
            a: idx < learningPath.length - 1
          }, idx < learningPath.length - 1 ? {} : {}, {
            b: common_vendor.t(idx + 1),
            c: common_vendor.t(stage.level),
            d: common_vendor.t(stage.difficulty),
            e: common_vendor.t(stage.duration),
            f: common_vendor.f(stage.goals, (goal, goalIdx, i1) => {
              return {
                a: common_vendor.t(goal),
                b: goalIdx
              };
            }),
            g: common_vendor.t(stage.tips),
            h: idx
          });
        }),
        k: common_vendor.f(safetyTips, (tip, idx, i0) => {
          return {
            a: common_vendor.t(tip.icon),
            b: common_vendor.t(tip.title),
            c: common_vendor.t(tip.importance),
            d: common_vendor.n(tip.importance.toLowerCase()),
            e: common_vendor.t(tip.description),
            f: idx
          };
        }),
        l: common_vendor.f(commonMistakes, (item, idx, i0) => {
          return {
            a: common_vendor.t(item.icon),
            b: common_vendor.t(item.mistake),
            c: common_vendor.t(item.solution),
            d: idx
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-64f346c4"]]);
wx.createPage(MiniProgramPage);
