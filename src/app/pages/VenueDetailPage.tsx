import { useState } from "react";
import { ArrowLeft, MapPin, Phone, Clock, DollarSign, Star, Navigation, Heart, Share2, Image as ImageIcon } from "lucide-react";
import { Link, useParams } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function VenueDetailPage() {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  const venue = {
    id: 1,
    name: "Rock Time Gym",
    images: [
      "https://images.unsplash.com/photo-1721885876144-25863108be60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBneW0lMjBpbmRvb3J8ZW58MXx8fHwxNzc0MjkwOTkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1659666287295-7da26c3f80d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3VsZGVyaW5nJTIwd2FsbCUyMGNvbG9yZnVsJTIwaG9sZHN8ZW58MXx8fHwxNzc0MjkwOTkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    rating: 4.8,
    reviewCount: 234,
    address: "328 Xinghu Street, Suzhou Industrial Park",
    phone: "0512-6688-8888",
    hours: "10:00 AM - 10:00 PM",
    distance: "1.2km",
    crowd: "Moderate",
    tags: ["Beginner Friendly", "Well Equipped", "Pro Coaches"],
    prices: [
      { type: "Day Pass", price: "$18", description: "Unlimited daily access" },
      { type: "10-Visit Pass", price: "$150", description: "Valid for 3 months" },
      { type: "Monthly Pass", price: "$180", description: "30 days unlimited" },
    ],
    facilities: {
      difficulty: "V0-V8",
      boulderingArea: "200㎡",
      topRopeArea: "150㎡",
      equipment: ["Harness", "Climbing Shoes", "Chalk Bag"],
      amenities: ["Lockers", "Showers", "Rest Area", "Vending Machines"],
    },
    routeDistribution: {
      "V0-V2": 18,
      "V3-V4": 15,
      "V5-V6": 12,
      "V7-V8": 8,
      "V9-V10": 3,
    },
    totalRoutes: 56,
    activities: [
      {
        id: 1,
        title: "Weekend Beginner Class",
        time: "Sat 2:00 PM",
        price: "$25/person",
        spots: "5 spots left",
      },
      {
        id: 2,
        title: "Advanced Technique Workshop",
        time: "Sun 10:00 AM",
        price: "$40/person",
        spots: "3 spots left",
      },
    ],
    userReviews: [
      {
        id: 1,
        user: "NewClimber",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
        rating: 5,
        date: "2026-03-20",
        content: "Perfect for beginners! Very patient coaches and excellent facilities. Clean and well-maintained.",
        images: [],
        helpful: 12,
      },
      {
        id: 2,
        user: "VeteranClimber",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user2",
        rating: 5,
        date: "2026-03-18",
        content: "Routes are updated frequently with great difficulty distribution. Always find the perfect challenge. Highly recommend!",
        images: [],
        helpful: 8,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f5f9f5] pb-20">
      {/* 顶部图片轮播 */}
      <div className="relative">
        <ImageWithFallback
          src={venue.images[0]}
          alt={venue.name}
          className="w-full h-64 object-cover"
        />
        
        {/* 返回按钮 */}
        <Link to="/">
          <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </div>
        </Link>

        {/* 操作按钮 */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
              }`}
            />
          </button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* 图片指示器 */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
          {venue.images.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full ${
                index === 0 ? "w-6 bg-white" : "w-1 bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* 实时客流 */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
          🟢 {venue.crowd}
        </div>
      </div>

      {/* 基本信息 */}
      <div className="bg-white px-4 py-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{venue.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{venue.rating}</span>
                <span className="text-sm text-gray-500">({venue.reviewCount} reviews)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-600">{venue.distance}</span>
            </div>
          </div>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {venue.tags.map((tag) => (
            <Badge
              key={tag}
              className="bg-[#d4e7c5] text-[#5a8a3f] border-none"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* 联系方式 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700 flex-1">{venue.address}</span>
            <Button
              size="sm"
              variant="outline"
              className="text-[#7eb662] border-[#7eb662]"
            >
              <Navigation className="w-4 h-4 mr-1" />
              Navigate
            </Button>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-5 h-5 text-gray-400" />
            <a href={`tel:${venue.phone}`} className="text-gray-700">
              {venue.phone}
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">{venue.hours}</span>
          </div>
        </div>
      </div>

      {/* 详细信息 Tabs */}
      <div className="mt-2">
        <Tabs defaultValue="price" className="w-full">
          <TabsList className="w-full bg-white border-b border-gray-200 rounded-none h-12">
            <TabsTrigger value="price" className="flex-1 data-[state=active]:text-[#7eb662] data-[state=active]:border-b-2 data-[state=active]:border-[#7eb662]">
              Price
            </TabsTrigger>
            <TabsTrigger value="facility" className="flex-1 data-[state=active]:text-[#7eb662] data-[state=active]:border-b-2 data-[state=active]:border-[#7eb662]">
              Facilities
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex-1 data-[state=active]:text-[#7eb662] data-[state=active]:border-b-2 data-[state=active]:border-[#7eb662]">
              Events
            </TabsTrigger>
            <TabsTrigger value="review" className="flex-1 data-[state=active]:text-[#7eb662] data-[state=active]:border-b-2 data-[state=active]:border-[#7eb662]">
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="price" className="bg-white p-4">
            <div className="space-y-3">
              {venue.prices.map((price) => (
                <div
                  key={price.type}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div>
                    <div className="font-medium text-gray-900">{price.type}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {price.description}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-[#7eb662]">
                    {price.price}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="facility" className="bg-white p-4">
            <div className="space-y-4">
              {/* 路线难度分布 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  Route Difficulty Distribution
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    (Total {venue.totalRoutes} routes)
                  </span>
                </h3>
                <div className="space-y-3">
                  {Object.entries(venue.routeDistribution).map(([level, count]) => {
                    const percentage = (count / venue.totalRoutes) * 100;
                    
                    return (
                      <div key={level}>
                        <div className="flex items-center justify-between mb-1.5">
                          <Badge className="bg-[#7eb662] text-white border-none text-xs px-2.5 py-1">
                            {level}
                          </Badge>
                          <span className="text-sm font-medium text-gray-900">
                            {count} routes ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#7eb662] to-[#6a9b54] rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="font-medium text-gray-900 mb-2">Overall Difficulty Range</h3>
                <div className="text-sm text-gray-600">{venue.facilities.difficulty}</div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Area Size</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500">Bouldering Area</div>
                    <div className="font-medium text-gray-900 mt-1">
                      {venue.facilities.boulderingArea}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500">Top Rope Area</div>
                    <div className="font-medium text-gray-900 mt-1">
                      {venue.facilities.topRopeArea}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Equipment Rental</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.facilities.equipment.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 bg-[#d4e7c5] text-[#5a8a3f] rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {venue.facilities.amenities.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="text-[#7eb662]">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="bg-white p-4">
            <div className="space-y-3">
              {venue.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <h3 className="font-medium text-gray-900 mb-2">
                    {activity.title}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <div>Time: {activity.time}</div>
                    <div>Cost: {activity.price}</div>
                    <div className="text-orange-600">{activity.spots}</div>
                  </div>
                  <Button size="sm" className="w-full bg-[#7eb662] hover:bg-[#6a9b54] text-white">
                    Register Now
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="review" className="bg-white p-4">
            {/* 评分概览 */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {venue.rating}
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-1">
                    Based on {venue.reviewCount} reviews
                  </div>
                  <div className="space-y-1">
                    {["Environment", "Facilities", "Service", "Routes", "Value"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-20">{item}</span>
                        <div className="flex-1 bg-gray-200 h-1.5 rounded-full">
                          <div
                            className="bg-[#7eb662] h-full rounded-full"
                            style={{ width: "90%" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 评价列表 */}
            <div className="space-y-4">
              {venue.userReviews.map((review) => (
                <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-start gap-3 mb-2">
                    <ImageWithFallback
                      src={review.avatar}
                      alt={review.user}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">
                          {review.user}
                        </span>
                        <span className="text-xs text-gray-500">
                          {review.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{review.content}</p>
                  <button className="text-xs text-gray-500">
                    👍 Helpful ({review.helpful})
                  </button>
                </div>
              ))}
            </div>

            {/* 写评价按钮 */}
            <Button
              variant="outline"
              className="w-full mt-4 border-[#7eb662] text-[#7eb662] hover:bg-[#f0f7ec]"
            >
              Write Review
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-[#7eb662] text-[#7eb662]"
          >
            Check In
          </Button>
          <Button className="flex-1 bg-[#7eb662] hover:bg-[#6a9b54] text-white">
            Find Partner
          </Button>
        </div>
      </div>
    </div>
  );
}