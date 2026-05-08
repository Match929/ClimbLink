import { useState } from "react";
import { Link } from "react-router";
import { Search, MapPin, Clock, Users, Calendar, Filter, TrendingUp, Star } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";

export function EventListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filters = [
    { value: "all", label: "All Events" },
    { value: "upcoming", label: "Upcoming" },
    { value: "thisWeek", label: "This Week" },
    { value: "thisMonth", label: "This Month" },
    { value: "free", label: "Free" },
  ];

  // Mock data for events
  const events = [
    {
      id: 1,
      title: "Weekend Beginner Session",
      venue: "Rock Time Gym",
      time: "Sat, Apr 25, 2:00 PM",
      duration: "2 hours",
      participants: 8,
      maxParticipants: 12,
      level: "V0-V2",
      tag: "Beginner Friendly",
      image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYmluZyUyMGdyb3VwJTIwaW5kb29yfGVufDF8fHx8MTc3NDI5MDk5M3ww&ixlib=rb-4.1.0&q=80&w=400",
      price: "Free",
      featured: true,
      distance: "1.2km",
    },
    {
      id: 2,
      title: "Intermediate Training",
      venue: "Climber's Paradise",
      time: "Sun, Apr 26, 10:00 AM",
      duration: "3 hours",
      participants: 5,
      maxParticipants: 8,
      level: "V3-V5",
      tag: "Coach Guided",
      image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYmluZyUyMHRyYWluaW5nJTIwY2xhc3N8ZW58MXx8fHwxNzc0MjkwOTk0fDA&ixlib=rb-4.1.0&q=80&w=400",
      price: "$15",
      featured: false,
      distance: "2.5km",
    },
    {
      id: 3,
      title: "Spring Climbing Competition",
      venue: "Peak Climbing Center",
      time: "Wed, Apr 30, 9:00 AM",
      duration: "Full Day",
      participants: 12,
      maxParticipants: 20,
      level: "V4-V7",
      tag: "Competition",
      image: "https://images.unsplash.com/photo-1731176116069-86205f376088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBwZW9wbGUlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzQyOTA5OTJ8MA&ixlib=rb-4.1.0&q=80&w=400",
      price: "$20",
      featured: true,
      distance: "3.8km",
    },
    {
      id: 4,
      title: "Ladies Climbing Night",
      venue: "Rock Time Gym",
      time: "Fri, Apr 24, 7:00 PM",
      duration: "2 hours",
      participants: 10,
      maxParticipants: 15,
      level: "All Levels",
      tag: "Women Only",
      image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYmluZyUyMGdyb3VwJTIwaW5kb29yfGVufDF8fHx8MTc3NDI5MDk5M3ww&ixlib=rb-4.1.0&q=80&w=400",
      price: "$10",
      featured: false,
      distance: "1.2km",
    },
    {
      id: 5,
      title: "Bouldering Workshop",
      venue: "Climber's Paradise",
      time: "Sat, Apr 25, 3:00 PM",
      duration: "3 hours",
      participants: 6,
      maxParticipants: 10,
      level: "V2-V4",
      tag: "Workshop",
      image: "https://images.unsplash.com/photo-1659666287295-7da26c3f80d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3VsZGVyaW5nJTIwd2FsbCUyMGNvbG9yZnVsJTIwaG9sZHN8ZW58MXx8fHwxNzc0MjkwOTkxfDA&ixlib=rb-4.1.0&q=80&w=400",
      price: "$25",
      featured: false,
      distance: "2.5km",
    },
    {
      id: 6,
      title: "Youth Climbing Club",
      venue: "Peak Climbing Center",
      time: "Sun, Apr 26, 2:00 PM",
      duration: "2 hours",
      participants: 15,
      maxParticipants: 20,
      level: "Youth",
      tag: "Kids & Teens",
      image: "https://images.unsplash.com/photo-1731176116069-86205f376088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBwZW9wbGUlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzQyOTA5OTJ8MA&ixlib=rb-4.1.0&q=80&w=400",
      price: "Free",
      featured: false,
      distance: "3.8km",
    },
    {
      id: 7,
      title: "Advanced Lead Climbing",
      venue: "Rock Time Gym",
      time: "Mon, Apr 27, 6:00 PM",
      duration: "2.5 hours",
      participants: 4,
      maxParticipants: 6,
      level: "V5+",
      tag: "Advanced",
      image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYmluZyUyMHRyYWluaW5nJTIwY2xhc3N8ZW58MXx8fHwxNzc0MjkwOTk0fDA&ixlib=rb-4.1.0&q=80&w=400",
      price: "$30",
      featured: true,
      distance: "1.2km",
    },
    {
      id: 8,
      title: "Social Climbing Meetup",
      venue: "Climber's Paradise",
      time: "Thu, Apr 23, 7:30 PM",
      duration: "2 hours",
      participants: 18,
      maxParticipants: 25,
      level: "All Levels",
      tag: "Social",
      image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYmluZyUyMGdyb3VwJTIwaW5kb29yfGVufDF8fHx8MTc3NDI5MDk5M3ww&ixlib=rb-4.1.0&q=80&w=400",
      price: "Free",
      featured: false,
      distance: "2.5km",
    },
  ];

  // Filter events based on selection
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "free" && event.price === "Free") ||
      (selectedFilter === "upcoming" && event.featured) ||
      (selectedFilter === "thisWeek" && event.featured) ||
      (selectedFilter === "thisMonth" && true);

    return matchesSearch && matchesFilter;
  });

  // Separate featured events
  const featuredEvents = filteredEvents.filter((event) => event.featured);
  const regularEvents = filteredEvents.filter((event) => !event.featured);

  return (
    <div className="min-h-screen bg-[#f5f9f5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#7eb662] to-[#6a9b54] px-4 pt-6 pb-6 rounded-b-3xl shadow-lg" style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">All Events</h1>
            <p className="text-sm text-white/90 mt-1">
              Join climbing events and activities
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search events or venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-none outline-none text-sm shadow-sm"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedFilter === filter.value
                  ? "bg-[#7eb662] text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 mt-4">
        <p className="text-sm text-gray-600">
          Found <span className="font-bold text-[#7eb662]">{filteredEvents.length}</span>{" "}
          {filteredEvents.length === 1 ? "event" : "events"}
        </p>
      </div>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <div className="px-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="text-lg font-bold text-gray-900">Featured Events</h2>
          </div>

          <div className="space-y-3">
            {featuredEvents.map((event) => (
              <Link key={event.id} to={`/activity/${event.id}`}>
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="flex gap-4">
                    {/* Event image */}
                    <div className="w-32 h-32 flex-shrink-0 relative">
                      <ImageWithFallback
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-yellow-500 text-white border-none text-xs shadow-md">
                          ⭐ Featured
                        </Badge>
                      </div>
                    </div>

                    {/* Event info */}
                    <div className="flex-1 p-4 pl-0">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                        {event.title}
                      </h3>

                      <div className="space-y-1.5 mb-2">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-[#7eb662]" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-[#7eb662]" />
                          <span className="truncate">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-[#7eb662]" />
                          <span>
                            {event.participants}/{event.maxParticipants} joined
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge className="bg-[#f0f7ec] text-[#5a8a3f] border-none text-xs">
                          {event.tag}
                        </Badge>
                        <span className="text-sm font-bold text-[#7eb662]">
                          {event.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All Events */}
      <div className="px-4 mt-6 pb-6">
        {regularEvents.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-3">All Events</h2>
            <div className="space-y-3">
              {regularEvents.map((event) => (
                <Link key={event.id} to={`/activity/${event.id}`}>
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="flex gap-4">
                      {/* Event image */}
                      <div className="w-28 h-28 flex-shrink-0 relative">
                        <ImageWithFallback
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-[#7eb662]/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-bold shadow-md">
                          {event.price}
                        </div>
                      </div>

                      {/* Event info */}
                      <div className="flex-1 p-4 pl-0">
                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                          {event.title}
                        </h3>

                        <div className="space-y-1 mb-2">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <MapPin className="w-3 h-3 text-[#7eb662]" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Clock className="w-3 h-3 text-[#7eb662]" />
                            <span className="truncate">{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Users className="w-3 h-3 text-[#7eb662]" />
                            <span>
                              {event.participants}/{event.maxParticipants}
                            </span>
                          </div>
                        </div>

                        <Badge className="bg-gray-100 text-gray-600 border-none text-xs">
                          {event.tag}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No events found</h3>
            <p className="text-sm text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
