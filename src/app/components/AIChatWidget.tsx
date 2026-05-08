import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hi! I'm your AI climbing assistant. Ask me anything about climbing techniques, equipment, or safety! 🧗",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("shoe") || lowerMessage.includes("equipment") || lowerMessage.includes("gear")) {
      return "For beginners, I recommend starting with comfortable climbing shoes that fit snugly but not painfully tight. A good pair of entry-level shoes costs around $80-120. Also, get a chalk bag ($10-30) to keep your hands dry. Don't forget to rent a harness at the gym initially!";
    } else if (lowerMessage.includes("warm up") || lowerMessage.includes("warmup")) {
      return "Great question! Always warm up for 5-10 minutes before climbing. Focus on: finger stretches, wrist rotations, shoulder circles, and light cardio. This prevents injuries and improves performance!";
    } else if (lowerMessage.includes("v0") || lowerMessage.includes("v1") || lowerMessage.includes("beginner") || lowerMessage.includes("start")) {
      return "Welcome to climbing! Start with V0-V1 routes to build fundamentals. Focus on: proper footwork, body positioning, and using your legs more than arms. Don't rush - mastering basics takes 1-2 months. You've got this! 💪";
    } else if (lowerMessage.includes("technique") || lowerMessage.includes("skill")) {
      return "Key techniques for beginners: 1) Keep your hips close to the wall, 2) Use precise footwork, 3) Look ahead to plan your route, 4) Rest on straight arms, 5) Breathe steadily. Practice these and you'll improve quickly!";
    } else if (lowerMessage.includes("fear") || lowerMessage.includes("scared") || lowerMessage.includes("height")) {
      return "Height fear is completely normal! Tips to overcome it: Start low and gradually increase height, focus on the next hold instead of looking down, practice falling safely on mats, and climb with supportive partners. Your confidence will build with time!";
    } else if (lowerMessage.includes("train") || lowerMessage.includes("practice") || lowerMessage.includes("how often")) {
      return "For beginners, I recommend 2-3 climbing sessions per week with rest days in between. Each session should be 1-2 hours. This gives your body time to recover and adapt. Consistency is more important than intensity!";
    } else if (lowerMessage.includes("injury") || lowerMessage.includes("pain") || lowerMessage.includes("hurt")) {
      return "⚠️ If you feel sharp pain, stop immediately! Common beginner issues: finger strain, elbow tendinitis. Prevention: warm up properly, don't overtrain, rest 1-2 days/week, and listen to your body. See a doctor if pain persists.";
    } else if (lowerMessage.includes("grade") || lowerMessage.includes("level") || lowerMessage.includes("difficulty")) {
      return "Climbing grades (V-scale): V0-V1 (Beginner), V2-V3 (Novice), V4-V5 (Intermediate), V6-V7 (Advanced), V8+ (Expert). Don't rush grades - focus on technique over difficulty. Progress naturally over months!";
    } else if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "You're welcome! Feel free to ask anything else about climbing. Happy climbing! 🧗✨";
    } else {
      return "That's an interesting question! For climbing-related queries, I can help with: techniques, equipment, safety tips, training schedules, overcoming fears, and grade progressions. What would you like to know more about?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "What gear do I need as a beginner?",
    "How do I overcome fear of heights?",
    "What's a good warm-up routine?",
    "How often should I practice?",
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-gradient-to-br from-[#7eb662] to-[#6a9b54] rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="relative">
            <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#7eb662] to-[#6a9b54] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">AI Climbing Assistant</h3>
                  <p className="text-white/80 text-xs">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 bg-gray-50 space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      message.role === "user"
                        ? "bg-[#7eb662] text-white"
                        : "bg-white text-gray-900 shadow-sm border border-gray-100"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {messages.length === 1 && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-gray-500 text-center mb-2">Quick questions:</p>
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputValue(question);
                        setTimeout(() => handleSend(), 100);
                      }}
                      className="w-full text-left p-2.5 bg-white hover:bg-[#f0f7ec] border border-gray-200 hover:border-[#7eb662] rounded-xl transition-colors text-xs text-gray-700"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 h-10 rounded-xl border-gray-200 focus:border-[#7eb662] focus:ring-[#7eb662] text-sm"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className={`w-10 h-10 rounded-xl p-0 ${
                    inputValue.trim()
                      ? "bg-[#7eb662] hover:bg-[#6a9b54]"
                      : "bg-gray-200 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
