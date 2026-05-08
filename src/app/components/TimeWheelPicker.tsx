import { useState, useRef, useEffect } from "react";

interface TimeWheelPickerProps {
  value: { start: string; end: string };
  onChange: (value: { start: string; end: string }) => void;
  onClose: () => void;
}

export function TimeWheelPicker({ value, onChange, onClose }: TimeWheelPickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];

  const [startHour, setStartHour] = useState(value.start.split(":")[0] || "09");
  const [startMinute, setStartMinute] = useState(value.start.split(":")[1] || "00");
  const [endHour, setEndHour] = useState(value.end.split(":")[0] || "12");
  const [endMinute, setEndMinute] = useState(value.end.split(":")[1] || "00");

  const scrollToItem = (ref: HTMLDivElement | null, index: number) => {
    if (ref) {
      const itemHeight = 44;
      ref.scrollTop = index * itemHeight - 88; // Center the item
    }
  };

  const startHourRef = useRef<HTMLDivElement>(null);
  const startMinuteRef = useRef<HTMLDivElement>(null);
  const endHourRef = useRef<HTMLDivElement>(null);
  const endMinuteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToItem(startHourRef.current, parseInt(startHour));
    scrollToItem(startMinuteRef.current, minutes.indexOf(startMinute));
    scrollToItem(endHourRef.current, parseInt(endHour));
    scrollToItem(endMinuteRef.current, minutes.indexOf(endMinute));
  }, []);

  const handleConfirm = () => {
    onChange({
      start: `${startHour}:${startMinute}`,
      end: `${endHour}:${endMinute}`,
    });
    onClose();
  };

  const WheelColumn = ({
    items,
    selected,
    onSelect,
    scrollRef,
  }: {
    items: string[];
    selected: string;
    onSelect: (value: string) => void;
    scrollRef: React.RefObject<HTMLDivElement>;
  }) => {
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = e.currentTarget.scrollTop;
      const itemHeight = 44;
      const index = Math.round(scrollTop / itemHeight);
      const newValue = items[index];
      if (newValue && newValue !== selected) {
        onSelect(newValue);
      }
    };

    return (
      <div className="relative h-[220px] overflow-hidden">
        {/* Highlight overlay */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-11 bg-[#7eb662]/10 border-y border-[#7eb662]/30 pointer-events-none z-10 rounded-lg" />
        
        {/* Scrollable area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Top padding */}
          <div className="h-[88px]" />
          
          {items.map((item) => (
            <div
              key={item}
              className="h-11 flex items-center justify-center snap-center text-lg transition-all"
              style={{
                opacity: item === selected ? 1 : 0.3,
                fontWeight: item === selected ? 600 : 400,
              }}
            >
              {item}
            </div>
          ))}
          
          {/* Bottom padding */}
          <div className="h-[88px]" />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onClose}>
      <div
        className="bg-white w-full rounded-t-3xl p-6 pb-8 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            Cancel
          </button>
          <h3 className="font-bold text-gray-900">Select Time Range</h3>
          <button
            onClick={handleConfirm}
            className="text-[#7eb662] hover:text-[#6a9b54] font-semibold"
          >
            Confirm
          </button>
        </div>

        {/* Time pickers */}
        <div className="space-y-6">
          {/* Start Time */}
          <div>
            <div className="text-sm font-medium text-gray-600 mb-2 text-center">
              Start Time
            </div>
            <div className="flex gap-2 items-center justify-center">
              <WheelColumn
                items={hours}
                selected={startHour}
                onSelect={setStartHour}
                scrollRef={startHourRef}
              />
              <div className="text-2xl font-bold text-gray-400">:</div>
              <WheelColumn
                items={minutes}
                selected={startMinute}
                onSelect={setStartMinute}
                scrollRef={startMinuteRef}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">to</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* End Time */}
          <div>
            <div className="text-sm font-medium text-gray-600 mb-2 text-center">
              End Time
            </div>
            <div className="flex gap-2 items-center justify-center">
              <WheelColumn
                items={hours}
                selected={endHour}
                onSelect={setEndHour}
                scrollRef={endHourRef}
              />
              <div className="text-2xl font-bold text-gray-400">:</div>
              <WheelColumn
                items={minutes}
                selected={endMinute}
                onSelect={setEndMinute}
                scrollRef={endMinuteRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
