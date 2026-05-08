import { useState, useRef, useEffect } from "react";
import { MapPin, Search, Navigation } from "lucide-react";

interface Venue {
  id: string;
  name: string;
  address: string;
  distance?: string;
}

interface VenueSearchModalProps {
  value: string;
  onChange: (venue: Venue) => void;
  onClose: () => void;
}

export function VenueSearchModal({ value, onChange, onClose }: VenueSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"search" | "map">("search");
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock venue data
  const venues: Venue[] = [
    {
      id: "1",
      name: "Rock Time Gym",
      address: "123 Mountain Ave, Suzhou",
      distance: "1.2 km",
    },
    {
      id: "2",
      name: "Climber's Paradise",
      address: "456 Boulder St, Suzhou",
      distance: "2.5 km",
    },
    {
      id: "3",
      name: "Peak Climbing Center",
      address: "789 Summit Rd, Suzhou",
      distance: "3.8 km",
    },
    {
      id: "4",
      name: "Cloud Nine Climbing Club",
      address: "321 Heights Blvd, Suzhou",
      distance: "5.1 km",
    },
    {
      id: "5",
      name: "Vertical Limits Gym",
      address: "654 Cliff Dr, Suzhou",
      distance: "6.3 km",
    },
    {
      id: "6",
      name: "Ascent Indoor Climbing",
      address: "987 Crag Way, Suzhou",
      distance: "7.9 km",
    },
  ];

  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSelect = (venue: Venue) => {
    onChange(venue);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Cancel
          </button>
          <h2 className="flex-1 text-lg font-bold text-gray-900">Select Venue</h2>
        </div>

        {/* Tab switcher */}
        <div className="flex px-4 pb-3">
          <button
            onClick={() => setSelectedTab("search")}
            className={`flex-1 py-2 font-semibold transition-all ${
              selectedTab === "search"
                ? "text-[#7eb662] border-b-2 border-[#7eb662]"
                : "text-gray-400"
            }`}
          >
            <Search className="w-4 h-4 inline mr-1" />
            Search
          </button>
          <button
            onClick={() => setSelectedTab("map")}
            className={`flex-1 py-2 font-semibold transition-all ${
              selectedTab === "map"
                ? "text-[#7eb662] border-b-2 border-[#7eb662]"
                : "text-gray-400"
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-1" />
            Map
          </button>
        </div>
      </div>

      {/* Content */}
      {selectedTab === "search" ? (
        <div className="flex-1 overflow-y-auto">
          {/* Search input */}
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search venue name or address..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#7eb662] transition-colors"
              />
            </div>
          </div>

          {/* Venue list */}
          <div className="px-4 space-y-2">
            {filteredVenues.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No venues found</p>
              </div>
            ) : (
              filteredVenues.map((venue) => (
                <button
                  key={venue.id}
                  onClick={() => handleSelect(venue)}
                  className="w-full bg-white hover:bg-gray-50 rounded-2xl p-4 border border-gray-100 transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#7eb662] to-[#6a9b54] rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 mb-1">
                        {venue.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {venue.address}
                      </div>
                      {venue.distance && (
                        <div className="flex items-center gap-1 mt-2">
                          <Navigation className="w-3 h-3 text-[#7eb662]" />
                          <span className="text-xs text-[#7eb662] font-medium">
                            {venue.distance}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      ) : (
        // Map view placeholder
        <div className="flex-1 bg-gray-100 relative">
          {/* Map placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-[#7eb662]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Map View
              </h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Tap on a venue marker on the map to select it
              </p>
            </div>
          </div>

          {/* Mock venue markers */}
          {venues.slice(0, 3).map((venue, index) => (
            <button
              key={venue.id}
              onClick={() => handleSelect(venue)}
              className="absolute bg-[#7eb662] hover:bg-[#6a9b54] text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-all"
              style={{
                left: `${30 + index * 20}%`,
                top: `${40 + index * 10}%`,
              }}
            >
              <MapPin className="w-4 h-4 inline mr-1" />
              {venue.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}