import { Route, Routes } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import { Header, SideBar } from "./components/common";
import {
  AgentDetailPage,
  AgentListPage,
  FinanceListPage,
  ForgotPasswordPage,
  HomePage,
  MyProfilePage,
  NewPasswordPage,
  NotificationListPage,
  OtpPage,
  PropertyDetailPage,
  PropertyEditPage,
  PropertyListPage,
  RentListPage,
  SellListPage,
  SigninPage,
  SubscriptionListPage,
  UserDetailPage,
  UserListPage,
} from "./RoutesMain";
// import { UserDetail } from "./components/user/user-detail/sub-component";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "../src/utils/ProtectedRoute";

// 
const App = () => {
  const routes = useRoutes([
    {
      path: "/login",
      element: <SigninPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "/otp",
      element: <OtpPage />,
    },
    {
      path: "/new-password",
      element: <NewPasswordPage />,
    },
    {
      path: "/*",
      element: (
        <div className="grid-container">
          <Header />
          <SideBar />
          <main className="main">
          <ProtectedRoute>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/my-profile" element={<MyProfilePage />} />
              <Route path="/user-list" element={<UserListPage />} />
              <Route path="/user-detail/:id" element={<UserDetailPage />} />
              <Route path="/agent-list" element={<AgentListPage />} />
              <Route path="/agent-detail/:id" element={<AgentDetailPage />} />
              <Route path="/sell-list" element={<SellListPage />} />
              <Route path="/rent-list" element={<RentListPage />} />
              <Route path="/property-list" element={<PropertyListPage />} />
              <Route path="/property-detail/:agentId/:propertyId" element={<PropertyDetailPage />} />
              <Route path="/property-detail/:propertyId" element={<PropertyDetailPage />} />
              <Route path="/property-edit/:id" element={<PropertyEditPage />} />
              <Route path="/notification" element={<NotificationListPage />} />
              <Route path="/finance" element={<FinanceListPage />} />
              <Route path="/subscription" element={<SubscriptionListPage />} />
            </Routes>
            </ProtectedRoute>
          </main>
        </div>
      ),
    },
  ]);

  return <>
  {routes}
  <ToastContainer position="bottom-right" autoClose={2000} />
  </>;
  
};
export default App;
