"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_cloud = require("../../utils/cloud.js");
if (!Math) {
  CustomTabBar();
}
const CustomTabBar = () => "../../components/custom-tab-bar/custom-tab-bar.js";
const _sfc_main = {
  __name: "venues",
  setup(__props) {
    const selectedFilter = common_vendor.ref("All");
    const mapMode = common_vendor.ref(false);
    const mapFullscreen = common_vendor.ref(false);
    const selectedVenue = common_vendor.ref(null);
    const searchText = common_vendor.ref("");
    const isLoading = common_vendor.ref(false);
    const centerLat = common_vendor.ref(31.3089);
    const centerLng = common_vendor.ref(120.7294);
    const filters = [
      { id: "All", name: "All" },
      { id: "Beginner", name: "Beginner Friendly" },
      { id: "Advanced", name: "Advanced" },
      { id: "Nearest", name: "Nearest" },
      { id: "Top Rated", name: "Top Rated" }
    ];
    const venues = common_vendor.ref([]);
    const filteredVenues = common_vendor.ref([]);
    const mapMarkers = common_vendor.computed(() => {
      return filteredVenues.value.map((venue, index) => ({
        id: index,
        latitude: venue.latitude || 31.3089,
        longitude: venue.longitude || 120.7294,
        iconPath: "/static/marker.png",
        width: 30,
        height: 40,
        callout: {
          content: venue.name,
          color: "#333",
          fontSize: 12,
          borderRadius: 10,
          bgColor: "#fff",
          padding: 5,
          display: "BYCLICK"
        }
      }));
    });
    const nearbyVenues = common_vendor.computed(() => {
      return filteredVenues.value.slice(0, 3);
    });
    const loadVenues = async () => {
      isLoading.value = true;
      try {
        const data = await utils_cloud.cloud.venue.getVenues();
        venues.value = data || [];
        filteredVenues.value = data || [];
      } catch (error) {
        console.error("加载场馆数据失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        isLoading.value = false;
      }
    };
    const filterVenues = () => {
      let result = [...venues.value];
      if (searchText.value) {
        const searchLower = searchText.value.toLowerCase();
        result = result.filter(
          (v) => v.name.toLowerCase().includes(searchLower) || v.address && v.address.toLowerCase().includes(searchLower)
        );
      }
      filteredVenues.value = result;
    };
    const toggleMapMode = () => {
      mapMode.value = !mapMode.value;
      if (mapMode.value) {
        selectedVenue.value = null;
      }
    };
    const toggleFullscreen = () => {
      mapFullscreen.value = !mapFullscreen.value;
    };
    const onMarkerTap = (e) => {
      const markerId = e.detail.markerId;
      if (filteredVenues.value[markerId]) {
        selectedVenue.value = filteredVenues.value[markerId];
      }
    };
    const resetLocation = () => {
      centerLat.value = 31.3089;
      centerLng.value = 120.7294;
      selectedVenue.value = null;
    };
    const navigateToVenue = (venue) => {
      const venueId = venue._id || venue.id;
      console.log("导航到场馆详情，ID:", venueId, "场馆数据:", venue);
      common_vendor.index.navigateTo({
        url: "/pages/venue-detail/venue-detail?id=" + venueId,
        fail: (err) => {
          console.error("Navigation failed:", err);
          common_vendor.index.showToast({
            title: "页面即将上线",
            icon: "none"
          });
        }
      });
    };
    common_vendor.onMounted(() => {
      loadVenues();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(mapMode.value ? "📋" : "🗺️"),
        b: common_vendor.o(toggleMapMode),
        c: common_vendor.o([($event) => searchText.value = $event.detail.value, filterVenues]),
        d: searchText.value,
        e: common_vendor.f(filters, (filter, k0, i0) => {
          return {
            a: common_vendor.t(filter.name),
            b: filter.id,
            c: common_vendor.n({
              active: selectedFilter.value === filter.id
            }),
            d: common_vendor.o(($event) => {
              selectedFilter.value = filter.id;
              filterVenues();
            }, filter.id)
          };
        }),
        f: mapMode.value
      }, mapMode.value ? common_vendor.e({
        g: common_vendor.o(toggleFullscreen),
        h: centerLat.value,
        i: centerLng.value,
        j: mapMarkers.value,
        k: common_vendor.o(onMarkerTap),
        l: common_vendor.t(mapFullscreen.value ? "⬇️" : "⬆️"),
        m: common_vendor.o(toggleFullscreen),
        n: common_vendor.o(resetLocation),
        o: selectedVenue.value
      }, selectedVenue.value ? {
        p: selectedVenue.value.images && selectedVenue.value.images.length > 0 ? selectedVenue.value.images[0] : "",
        q: common_vendor.t(selectedVenue.value.name),
        r: common_vendor.t(selectedVenue.value.address),
        s: common_vendor.t(selectedVenue.value.rating),
        t: common_vendor.o(($event) => navigateToVenue(selectedVenue.value))
      } : {}, {
        v: mapFullscreen.value ? 1 : ""
      }) : {
        w: common_vendor.f(nearbyVenues.value, (venue, index, i0) => {
          return {
            a: common_vendor.t(venue.name),
            b: common_vendor.t(venue.address),
            c: index,
            d: common_vendor.o(($event) => navigateToVenue(venue), index)
          };
        })
      }, {
        x: common_vendor.t(filteredVenues.value.length),
        y: isLoading.value
      }, isLoading.value ? {} : {
        z: common_vendor.f(filteredVenues.value, (venue, k0, i0) => {
          return {
            a: venue.images && venue.images.length > 0 ? venue.images[0] : "",
            b: common_vendor.t(venue.name),
            c: common_vendor.t(venue.address),
            d: common_vendor.t(venue.rating),
            e: common_vendor.t(venue.city),
            f: common_vendor.t(venue.climbing_level),
            g: venue.id,
            h: common_vendor.o(($event) => navigateToVenue(venue), venue.id)
          };
        })
      }, {
        A: common_vendor.t(venues.value.length),
        B: common_vendor.t(venues.value.filter((v) => v.city).length),
        C: common_vendor.p({
          currentPath: "pages/venues/venues"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-67d09326"]]);
wx.createPage(MiniProgramPage);
