import { Outlet, useLocation, Link } from "react-router";
import { Home, Users, MapPin, User, Plus } from "lucide-react";
import { useState } from "react";
import { PublishModal } from "./PublishModal";

export function Layout() {
  const location = useLocation();
  const [showPublishModal, setShowPublishModal] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/community", label: "Community", icon: Users },
    { path: "/venues", label: "Venues", icon: MapPin },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#f5f9f5]" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
      <Outlet />
      
      {/* 底部导航栏 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-md mx-auto relative flex justify-around items-center h-16">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all ${
                  isActive ? "text-[#7eb662]" : "text-gray-400"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
                <span className={`text-[10px] ${isActive ? "font-medium" : ""}`}>{item.label}</span>
              </Link>
            );
          })}
          
          {/* 中间发布按钮 - 优化样式 */}
          <div className="flex-1 flex justify-center">
            <button
              onClick={() => setShowPublishModal(true)}
              className="absolute -top-3 group"
            >
              {/* 外层发光效果 - 降低强度 */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#7eb662] to-[#6a9b54] rounded-[16px] rotate-45 blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
              
              {/* 主按钮 - 菱形设计，缩小尺寸 */}
              <div className="relative w-14 h-14 bg-gradient-to-br from-[#7eb662] to-[#6a9b54] rounded-[16px] rotate-45 shadow-[0_4px_16px_rgba(126,182,98,0.25)] group-hover:shadow-[0_6px_20px_rgba(126,182,98,0.35)] transition-all group-active:scale-95">
                {/* 内部装饰 */}
                <div className="absolute inset-[2.5px] bg-gradient-to-br from-white/15 to-transparent rounded-[14px]" />
                
                {/* 加号图标 - 缩小 */}
                <div className="absolute inset-0 flex items-center justify-center -rotate-45">
                  <Plus className="w-7 h-7 text-white stroke-[2.5]" />
                </div>
              </div>
            </button>
          </div>
          
          {navItems.slice(2).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all ${
                  isActive ? "text-[#7eb662]" : "text-gray-400"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
                <span className={`text-[10px] ${isActive ? "font-medium" : ""}`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 发布选择弹窗 */}
      <PublishModal 
        isOpen={showPublishModal} 
        onClose={() => setShowPublishModal(false)} 
      />
    </div>
  );
}