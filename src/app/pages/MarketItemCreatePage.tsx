import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Upload, X, DollarSign, Package, Grip, Shirt, Backpack, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

export function MarketItemCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    originalPrice: "",
    category: "",
    condition: "",
    description: "",
    location: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: "shoes", label: "Shoes", icon: Grip },
    { value: "clothing", label: "Clothing", icon: Shirt },
    { value: "bags", label: "Bags", icon: Backpack },
    { value: "protection", label: "Protection", icon: Shield },
    { value: "other", label: "Other", icon: Package },
  ];

  const conditions = [
    { value: "new", label: "Brand New" },
    { value: "likenew", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Mock image upload - in real app, upload to server
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages].slice(0, 6)); // Max 6 images
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock submission - in real app, send to server
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message
      alert("Your item has been submitted for review! We'll notify you once it's approved.");
      navigate("/market");
    }, 2000);
  };

  const isFormValid =
    formData.title &&
    formData.price &&
    formData.category &&
    formData.condition &&
    formData.description &&
    images.length > 0;

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
          <h1 className="text-lg font-bold text-gray-900">List Item</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit} className="pt-14 pb-24" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top))' }}>
        <div className="px-4 space-y-4">
          {/* Image Upload */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">Photos (Required)</h3>
            <p className="text-sm text-gray-500 mb-4">
              Add up to 6 photos. First photo will be the cover image.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                  <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-[#7eb662] text-white text-xs px-2 py-0.5 rounded">
                      Cover
                    </div>
                  )}
                </div>
              ))}

              {images.length < 6 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#7eb662] hover:bg-[#f0f7ec] transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Item Details */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 mb-1">Item Details</h3>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="E.g., La Sportiva Solution Climbing Shoes"
                className="w-full h-11 rounded-xl border-gray-200 focus:border-[#7eb662] focus:ring-[#7eb662]"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: category.value })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.category === category.value
                          ? "border-[#7eb662] bg-[#f0f7ec]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-1 ${
                        formData.category === category.value ? "text-[#7eb662]" : "text-gray-600"
                      }`} />
                      <div className="text-xs font-medium text-gray-900">{category.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {conditions.map((condition) => (
                  <button
                    key={condition.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, condition: condition.value })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.condition === condition.value
                        ? "border-[#7eb662] bg-[#f0f7ec]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-900">{condition.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="80"
                    className="pl-10 h-11 rounded-xl border-gray-200 focus:border-[#7eb662] focus:ring-[#7eb662]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="180"
                    className="pl-10 h-11 rounded-xl border-gray-200 focus:border-[#7eb662] focus:ring-[#7eb662]"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the item condition, usage, size, etc."
                className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7eb662] focus:ring-[#7eb662] resize-none"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="E.g., Downtown"
                className="h-11 rounded-xl border-gray-200 focus:border-[#7eb662] focus:ring-[#7eb662]"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="E.g., Size 9"
                  className="flex-1 h-10 rounded-xl border-gray-200 focus:border-[#7eb662] focus:ring-[#7eb662]"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  className="px-4 border-[#7eb662] text-[#7eb662] hover:bg-[#f0f7ec]"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-[#f0f7ec] text-[#5a8a3f] border-none pr-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-[#7eb662] hover:text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Review Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Review Process</h4>
                <p className="text-sm text-gray-600">
                  Your listing will be reviewed by our team to ensure quality and safety.
                  This usually takes 1-2 business days. You'll be notified once approved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
        <div className="max-w-md mx-auto">
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            onClick={handleSubmit}
            className={`w-full h-12 rounded-xl font-semibold shadow-lg ${
              isFormValid
                ? "bg-gradient-to-r from-[#7eb662] to-[#6a9b54] hover:from-[#6a9b54] hover:to-[#5a8a3f] text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Submitting for Review..." : "Submit for Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}
