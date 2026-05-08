import { useState } from "react";
import { Search, Plus, MapPin, Clock, Heart, Tag, Package, Grip, Shirt, Backpack, Shield } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

export function MarketPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { value: "all", label: "All", icon: Package },
    { value: "shoes", label: "Shoes", icon: Grip },
    { value: "clothing", label: "Clothing", icon: Shirt },
    { value: "bags", label: "Bags", icon: Backpack },
    { value: "protection", label: "Protection", icon: Shield },
  ];

  // Mock data for marketplace items
  const marketItems = [
    {
      id: 1,
      title: "La Sportiva Solution Climbing Shoes",
      price: 80,
      originalPrice: 180,
      condition: "Like New",
      category: "shoes",
      seller: {
        name: "Alex Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
        location: "Downtown",
      },
      images: [
        "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYmluZyUyMHNob2VzfGVufDF8fHx8MTc3NDI5MDk5NXww&ixlib=rb-4.1.0&q=80&w=400",
      ],
      description: "Used only 3 times, size US 9. Great condition!",
      postedAt: "2 hours ago",
      likes: 12,
      tags: ["Size 9", "Like New"],
    },
    {
      id: 2,
      title: "Climbing Chalk Bag with Belt",
      price: 15,
      originalPrice: 35,
      condition: "Good",
      category: "bags",
      seller: {
        name: "Sarah Kim",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        location: "East Side",
      },
      images: [
        "https://images.unsplash.com/photo-1522163182402-834f871fd851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYmluZyUyMGNoYWxrJTIwYmFnfGVufDF8fHx8MTc3NDI5MDk5N3ww&ixlib=rb-4.1.0&q=80&w=400",
      ],
      description: "Durable chalk bag with adjustable belt. Clean and ready to use.",
      postedAt: "5 hours ago",
      likes: 8,
      tags: ["Adjustable"],
    },
    {
      id: 3,
      title: "Outdoor Climbing Rope 70m",
      price: 120,
      originalPrice: 250,
      condition: "Good",
      category: "protection",
      seller: {
        name: "Mike Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
        location: "West Hills",
      },
      images: [
        "https://images.unsplash.com/photo-1609097136144-c0bb783d68e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYmluZyUyMHJvcGV8ZW58MXx8fHwxNzc0MjkwOTk4fDA&ixlib=rb-4.1.0&q=80&w=400",
      ],
      description: "70m dynamic rope, used for outdoor climbing. Well maintained.",
      postedAt: "1 day ago",
      likes: 23,
      tags: ["70m", "Dynamic"],
    },
    {
      id: 4,
      title: "Quick Draw Set (10 pieces)",
      price: 90,
      originalPrice: 180,
      condition: "Like New",
      category: "protection",
      seller: {
        name: "Emma Lee",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
        location: "North Park",
      },
      images: [
        "https://images.unsplash.com/photo-1564769625905-50e93615e769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYmluZyUyMGdlYXJ8ZW58MXx8fHwxNzc0MjkwOTk5fDA&ixlib=rb-4.1.0&q=80&w=400",
      ],
      description: "Set of 10 quickdraws, barely used. Perfect for sport climbing.",
      postedAt: "1 day ago",
      likes: 15,
      tags: ["10 pieces", "Sport Climbing"],
    },
    {
      id: 5,
      title: "Climbing T-shirt Collection",
      price: 25,
      originalPrice: 60,
      condition: "Good",
      category: "clothing",
      seller: {
        name: "David Park",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
        location: "Central",
      },
      images: [
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMHRzaGlydHxlbnwxfHx8fDE3NzQyOTEwMDB8MA&ixlib=rb-4.1.0&q=80&w=400",
      ],
      description: "3 climbing t-shirts, size M. Breathable and comfortable.",
      postedAt: "2 days ago",
      likes: 6,
      tags: ["Size M", "3 pieces"],
    },
    {
      id: 6,
      title: "Climbing Harness - Petzl",
      price: 60,
      originalPrice: 120,
      condition: "Good",
      category: "protection",
      seller: {
        name: "Lisa Wang",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
        location: "South Bay",
      },
      images: [
        "https://images.unsplash.com/photo-1522163182402-834f871fd851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjbGltYmluZyUyMGdlYXJ8ZW58MXx8fHwxNzc0MjkxMDAxfDA&ixlib=rb-4.1.0&q=80&w=400",
      ],
      description: "Petzl climbing harness, adjustable size. Safety tested.",
      postedAt: "3 days ago",
      likes: 18,
      tags: ["Petzl", "Adjustable"],
    },
  ];

  // Filter items based on category and search
  const filteredItems = marketItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f5f9f5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#7eb662] to-[#6a9b54] px-4 pt-6 pb-6 rounded-b-3xl shadow-lg" style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Market</h1>
            <p className="text-sm text-white/90 mt-1">
              Buy & Sell Climbing Gear
            </p>
          </div>
          <Link to="/market-create">
            <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
            </button>
          </Link>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search gear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-none outline-none text-sm shadow-sm"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-2 shadow-sm">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.value;
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#7eb662] text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 mt-4">
        <p className="text-sm text-gray-600">
          Found <span className="font-bold text-[#7eb662]">{filteredItems.length}</span>{" "}
          {filteredItems.length === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Market Items Grid */}
      <div className="px-4 mt-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <Link key={item.id} to={`/market/${item.id}`}>
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Image */}
                <div className="relative aspect-square">
                  <ImageWithFallback
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Condition badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-white/95 text-gray-900 border-none backdrop-blur-sm text-xs">
                      {item.condition}
                    </Badge>
                  </div>

                  {/* Like button */}
                  <button className="absolute top-2 right-2 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-3">
                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                    {item.title}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-bold text-[#7eb662]">
                      ${item.price}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ${item.originalPrice}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-gray-100 text-gray-600 border-none text-xs px-2 py-0"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Seller info */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <ImageWithFallback
                      src={item.seller.avatar}
                      alt={item.seller.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="truncate">{item.seller.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location and time */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{item.seller.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.postedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No items found</h3>
            <p className="text-sm text-gray-500 mb-6">
              Try adjusting your search or filters
            </p>
            <Link to="/market-create">
              <Button className="bg-gradient-to-r from-[#7eb662] to-[#6a9b54] hover:from-[#6a9b54] hover:to-[#5a8a3f] text-white">
                <Plus className="w-4 h-4 mr-2" />
                List Your First Item
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
