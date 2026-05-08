import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { CommunityPage } from "./pages/CommunityPage";
import { VenuesPage } from "./pages/VenuesPage";
import { ProfilePage } from "./pages/ProfilePage";
import { VenueDetailPage } from "./pages/VenueDetailPage";
import { MatchingPage } from "./pages/MatchingPage";
import { BlindBoxPage } from "./pages/BlindBoxPage";
import { PostCreatePage } from "./pages/PostCreatePage";
import { ClimbRequestPage } from "./pages/ClimbRequestPage";
import { EventCreatePage } from "./pages/EventCreatePage";
import { ActivityDetailPage } from "./pages/ActivityDetailPage";
import { EditProfilePage } from "./pages/EditProfilePage";
import { BeginnerGuidePage } from "./pages/BeginnerGuidePage";
import { ChatPage } from "./pages/ChatPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SmartPartnerPage } from "./pages/SmartPartnerPage";
import { ClimbRecordsPage } from "./pages/ClimbRecordsPage";
import { MarketPage } from "./pages/MarketPage";
import { MarketItemDetailPage } from "./pages/MarketItemDetailPage";
import { MarketItemCreatePage } from "./pages/MarketItemCreatePage";
import { EventListPage } from "./pages/EventListPage";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/market/:id",
    Component: MarketItemDetailPage,
  },
  {
    path: "/market-create",
    Component: MarketItemCreatePage,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "community", Component: CommunityPage },
      { path: "venues", Component: VenuesPage },
      { path: "market", Component: MarketPage },
      { path: "profile", Component: ProfilePage },
      { path: "profile/edit", Component: EditProfilePage },
      { path: "venue/:id", Component: VenueDetailPage },
      { path: "matching", Component: MatchingPage },
      { path: "blindbox", Component: BlindBoxPage },
      { path: "smart-partner", Component: SmartPartnerPage },
      { path: "climb-records", Component: ClimbRecordsPage },
      { path: "post-create", Component: PostCreatePage },
      { path: "climb-request", Component: ClimbRequestPage },
      { path: "event-create", Component: EventCreatePage },
      { path: "activity/:id", Component: ActivityDetailPage },
      { path: "events", Component: EventListPage },
      { path: "beginner-guide", Component: BeginnerGuidePage },
      { path: "chat/:userId", Component: ChatPage },
    ],
  },
]);