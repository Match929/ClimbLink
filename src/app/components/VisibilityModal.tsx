import { useState } from "react";
import { Globe, Lock, Eye, EyeOff, X } from "lucide-react";
import { Button } from "./ui/button";

export type VisibilityType = "public" | "private" | "visible-to" | "hidden-from";

interface VisibilitySettings {
  type: VisibilityType;
  users: string[];
}

interface VisibilityModalProps {
  value: VisibilitySettings;
  onChange: (value: VisibilitySettings) => void;
  onClose: () => void;
}

export function VisibilityModal({ value, onChange, onClose }: VisibilityModalProps) {
  const [selected, setSelected] = useState<VisibilityType>(value.type);
  const [customUsers, setCustomUsers] = useState<string[]>(value.users);
  const [inputValue, setInputValue] = useState("");

  // Mock friends list for demo
  const friendsList = [
    { id: "1", name: "Alex Chen", avatar: "👤" },
    { id: "2", name: "Sarah Johnson", avatar: "👤" },
    { id: "3", name: "Mike Wang", avatar: "👤" },
    { id: "4", name: "Emma Davis", avatar: "👤" },
  ];

  const options = [
    {
      id: "public" as VisibilityType,
      icon: Globe,
      title: "Public",
      description: "Everyone can see this post",
    },
    {
      id: "private" as VisibilityType,
      icon: Lock,
      title: "Private",
      description: "Only you can see this post",
    },
    {
      id: "visible-to" as VisibilityType,
      icon: Eye,
      title: "Visible to...",
      description: "Only selected people can see",
    },
    {
      id: "hidden-from" as VisibilityType,
      icon: EyeOff,
      title: "Hidden from...",
      description: "Everyone except selected people",
    },
  ];

  const handleConfirm = () => {
    onChange({
      type: selected,
      users: customUsers,
    });
    onClose();
  };

  const toggleUser = (userId: string) => {
    setCustomUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md rounded-3xl p-6 max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Who can see this?</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-2 mb-6">
          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = selected === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => setSelected(option.id)}
                className={`w-full flex items-start gap-3 p-4 rounded-2xl transition-all ${
                  isSelected
                    ? "bg-[#7eb662] text-white shadow-md"
                    : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "bg-white/20" : "bg-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#7eb662]"}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold mb-0.5">{option.title}</div>
                  <div
                    className={`text-sm ${
                      isSelected ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {option.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom user selection */}
        {(selected === "visible-to" || selected === "hidden-from") && (
          <div className="mb-6">
            <div className="text-sm font-semibold text-gray-900 mb-3">
              {selected === "visible-to" ? "Select people who can see:" : "Select people to hide from:"}
            </div>
            
            {/* Friends list */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {friendsList.map((friend) => {
                const isChecked = customUsers.includes(friend.id);
                return (
                  <button
                    key={friend.id}
                    onClick={() => toggleUser(friend.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isChecked
                        ? "bg-[#e8f5e0] border-2 border-[#7eb662]"
                        : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#7eb662] to-[#6a9b54] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {friend.avatar}
                    </div>
                    <div className="flex-1 text-left font-medium text-gray-900">
                      {friend.name}
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isChecked
                          ? "bg-[#7eb662] border-[#7eb662]"
                          : "border-gray-300"
                      }`}
                    >
                      {isChecked && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {customUsers.length > 0 && (
              <div className="mt-3 text-sm text-gray-500">
                {customUsers.length} {customUsers.length === 1 ? "person" : "people"} selected
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 h-12 text-base font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 h-12 text-base font-semibold bg-[#7eb662] hover:bg-[#6a9b54] text-white"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
