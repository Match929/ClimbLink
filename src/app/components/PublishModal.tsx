import { MessageSquare, Users, Calendar } from "lucide-react";
import { Link } from "react-router";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PublishModal({ isOpen, onClose }: PublishModalProps) {
  if (!isOpen) return null;

  const publishOptions = [
    {
      id: "post",
      title: "Post",
      icon: MessageSquare,
      color: "from-blue-500 to-blue-600",
      path: "/post-create",
      angle: -45, // Left fan position
    },
    {
      id: "match",
      title: "Partner",
      icon: Users,
      color: "from-[#7eb662] to-[#6a9b54]",
      path: "/climb-request",
      angle: 0, // Center position
    },
    {
      id: "event",
      title: "Event",
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      path: "/event-create",
      angle: 45, // Right fan position
    },
  ];

  return (
    <>
      {/* Background overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Fan wheel menu */}
      <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-center pb-20">
        <div className="relative pointer-events-auto">
          {/* Fan buttons */}
          {publishOptions.map((option, index) => {
            const Icon = option.icon;
            // Calculate position for fan layout
            const radius = 140; // Distance from center
            const angleInRadians = (option.angle * Math.PI) / 180;
            const x = Math.sin(angleInRadians) * radius;
            const y = -Math.cos(angleInRadians) * radius;

            return (
              <Link
                key={option.id}
                to={option.path}
                onClick={onClose}
                className="absolute group"
                style={{
                  left: "50%",
                  bottom: "0",
                  transform: isOpen
                    ? `translate(calc(-50% + ${x}px), ${y}px) scale(1)`
                    : `translate(-50%, 0) scale(0)`,
                  transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${
                    index * 0.05
                  }s`,
                }}
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${option.color} rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity`}
                  />

                  {/* Main button */}
                  <div
                    className={`relative w-16 h-16 bg-gradient-to-br ${option.color} rounded-full shadow-2xl group-hover:shadow-3xl transition-all group-active:scale-90 flex flex-col items-center justify-center`}
                  >
                    {/* Inner glow */}
                    <div className="absolute inset-[3px] bg-gradient-to-br from-white/20 to-transparent rounded-full" />

                    {/* Icon */}
                    <Icon className="w-7 h-7 text-white relative z-10" strokeWidth={2.5} />
                  </div>

                  {/* Label */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                      <span className="text-xs font-bold text-gray-900">
                        {option.title}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Center close button */}
          <button
            onClick={onClose}
            className="absolute left-1/2 bottom-0 -translate-x-1/2 w-14 h-14 bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-gray-700 transition-all active:scale-90"
            style={{
              transition: "all 0.3s ease",
            }}
          >
            <div className="relative">
              {/* Close icon (X) */}
              <div className="w-5 h-0.5 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45" />
              <div className="w-5 h-0.5 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45" />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}