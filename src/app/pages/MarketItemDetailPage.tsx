import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Heart, Share2, MapPin, Clock, User, MessageCircle, Shield } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

export function MarketItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  // Mock data - in real app, fetch based on id
  const item = {
    id: Number(id),
    title: "La Sportiva Solution Climbing Shoes",
    price: 80,
    originalPrice: 180,
    condition: "Like New",
    category: "shoes",
    seller: {
      name: "Alex Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      location: "Downtown",
      memberSince: "2024",
      rating: 4.8,
      reviewCount: 23,
    },
    images: [
      "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYmluZyUyMHNob2VzfGVufDF8fHx8MTc3NDI5MDk5NXww&ixlib=rb-4.1.0&q=80&w=800",
      "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYmluZyUyMHNob2VzfGVufDF8fHx8MTc3NDI5MDk5NXww&ixlib=rb-4.1.0&q=80&w=800",
      "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYmluZyUyMHNob2VzfGVufDF8fHx8MTc3NDI5MDk5NXww&ixlib=rb-4.1.0&q=80&w=800",
    ],
    description:
      "Excellent condition La Sportiva Solution climbing shoes. Used only 3 times indoors. Size US 9. No visible wear on the rubber. Perfect for intermediate to advanced climbers looking for precision and performance. Originally bought for $180, selling for $80. Comes with original box and shoe bag.",
    postedAt: "2 hours ago",
    likes: 12,
    tags: ["Size 9", "Like New", "Indoor Only"],
    specifications: [
      { label: "Brand", value: "La Sportiva" },
      { label: "Model", value: "Solution" },
      { label: "Size", value: "US 9" },
      { label: "Color", value: "White/Yellow" },
      { label: "Usage", value: "Indoor Climbing" },
    ],
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="min-h-screen bg-[#f5f9f5]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-b border-gray-100" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                liked ? "bg-red-100 hover:bg-red-200" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${liked ? "text-red-500 fill-red-500" : "text-gray-700"}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-14" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top))' }}>
        {/* Image Gallery */}
        <div className="bg-white">
          <div className="relative aspect-square max-h-96">
            <ImageWithFallback
              src={item.images[currentImageIndex]}
              alt={item.title}
              className="w-full h-full object-cover"
            />

            {/* Image indicators */}
            {item.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {item.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white w-6"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {item.images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? "border-[#7eb662]"
                      : "border-gray-200"
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${item.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item Info */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            {/* Price and condition */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-[#7eb662]">${item.price}</span>
                  <span className="text-lg text-gray-400 line-through">
                    ${item.originalPrice}
                  </span>
                  <Badge className="bg-red-100 text-red-600 border-none">
                    -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                  </Badge>
                </div>
              </div>
              <Badge className="bg-[#f0f7ec] text-[#5a8a3f] border-none">
                {item.condition}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-gray-100 text-gray-600 border-none"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Meta info */}
            <div className="flex items-center gap-4 text-sm text-gray-500 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{item.postedAt}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{item.likes} likes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>
        </div>

        {/* Specifications */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-3">Specifications</h2>
            <div className="space-y-3">
              {item.specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-gray-500 text-sm">{spec.label}</span>
                  <span className="text-gray-900 font-medium text-sm">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="px-4 mt-4 pb-28">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Seller Information</h2>

            <div className="flex items-center gap-3 mb-4">
              <ImageWithFallback
                src={item.seller.avatar}
                alt={item.seller.name}
                className="w-14 h-14 rounded-full border-2 border-[#7eb662]"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{item.seller.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{item.seller.location}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <User className="w-3 h-3" />
                    <span>Since {item.seller.memberSince}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-gray-900">{item.seller.rating}</span>
                <span className="text-yellow-500">★</span>
              </div>
              <span className="text-sm text-gray-500">
                ({item.seller.reviewCount} reviews)
              </span>
            </div>

            <Link to={`/chat/${item.seller.name}`}>
              <Button
                variant="outline"
                className="w-full border-[#7eb662] text-[#7eb662] hover:bg-[#f0f7ec]"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Seller
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
        <div className="max-w-md mx-auto">
          <Button className="w-full h-12 bg-gradient-to-r from-[#7eb662] to-[#6a9b54] hover:from-[#6a9b54] hover:to-[#5a8a3f] text-white font-semibold rounded-xl shadow-lg">
            <MessageCircle className="w-5 h-5 mr-2" />
            Contact Seller
          </Button>
        </div>
      </div>
    </div>
  );
}
