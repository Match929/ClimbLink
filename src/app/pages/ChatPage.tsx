import { useState } from "react";
import { ArrowLeft, Send, Phone, Video, MoreVertical, Image, Smile } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface Message {
  id: number;
  senderId: number;
  content: string;
  time: string;
  type: "text" | "image";
  imageUrl?: string;
}

export function ChatPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderId: 2,
      content: "Hey! Are you free this Saturday for a climb session?",
      time: "10:30 AM",
      type: "text",
    },
    {
      id: 2,
      senderId: 1,
      content: "Sure! What time were you thinking?",
      time: "10:32 AM",
      type: "text",
    },
    {
      id: 3,
      senderId: 2,
      content: "How about 2 PM at Rock Time Gym?",
      time: "10:35 AM",
      type: "text",
    },
    {
      id: 4,
      senderId: 1,
      content: "Perfect! I'll bring my gear. See you there! 🧗‍♂️",
      time: "10:37 AM",
      type: "text",
    },
    {
      id: 5,
      senderId: 2,
      content: "Awesome! Looking forward to it 💪",
      time: "10:38 AM",
      type: "text",
    },
  ]);

  // Mock user data based on userId
  const chatUser = {
    id: Number(userId) || 1,
    name: "Alex Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    level: "V4",
    online: true,
  };

  const currentUserId = 1; // Current user

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        senderId: currentUserId,
        content: newMessage,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        type: "text",
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ec] to-[#f5f9f5] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>

            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <ImageWithFallback
                  src={chatUser.avatar}
                  alt={chatUser.name}
                  className="w-10 h-10 rounded-full"
                />
                {chatUser.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-gray-900">{chatUser.name}</h1>
                  <span className="px-2 py-0.5 bg-[#d4e7c5] text-[#5a8a3f] text-xs rounded-full">
                    {chatUser.level}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {chatUser.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] ${
                    isCurrentUser ? "order-2" : "order-1"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-[#7eb662] to-[#6a9b54] text-white rounded-br-sm"
                        : "bg-white text-gray-900 rounded-bl-sm shadow-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <p
                    className={`text-xs text-gray-400 mt-1 ${
                      isCurrentUser ? "text-right" : "text-left"
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 sticky bottom-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-3">
            <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
              <Image className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex-1 flex items-end gap-2 bg-gray-50 rounded-2xl px-4 py-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400 resize-none max-h-24"
                rows={1}
              />
              <button className="flex-shrink-0 pb-1">
                <Smile className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                newMessage.trim()
                  ? "bg-[#7eb662] text-white hover:bg-[#6a9b54]"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}