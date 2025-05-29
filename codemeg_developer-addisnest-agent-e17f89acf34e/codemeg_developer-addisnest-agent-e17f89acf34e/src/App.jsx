import { Route, Routes } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import { Header, SideBar } from "./components/common";
import {
    AccountManagementPage,
    ChatPage,
    ChoosePromotionPage,
    ContactusPage,
    EditPropertyFormPage,
    ForgotPasswordPage,
    HomePage,
    MyProfilePage,
    NewPasswordPage,
    NotificationPage,
    OtpPage,
    PaymentMethodPage,
    PaymentSuccessPage,
    PropertListFormPage,
    PropertListPage,
    SigninPage,
    SignUpPage
} from "./RoutesMain";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "../src/utils/ProtectedRoute";
import { toast } from "react-toastify";
const App = () => {
    const routes = useRoutes([
        {
            path: "/login",
            element: <SigninPage />,
        },
        {
            path: "/sign-up",
            element: <SignUpPage/>,
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
                            <Route path="/property-list" element={<PropertListPage />} />
                            <Route path="/my-profile" element={<MyProfilePage />} />
                            <Route path="/property-form" element={<PropertListFormPage />} />
                            <Route path="/edit-property" element={<EditPropertyFormPage />} />
                            <Route
                                path="/choose-promotion"
                                element={<ChoosePromotionPage />}
                            />
                            <Route path="/payment" element={<PaymentMethodPage />} />
                            <Route path="/success-payment" element={<PaymentSuccessPage />} />
                            <Route path="/notification" element={<NotificationPage />} />
                            <Route path="/chat" element={<ChatPage />} />
                            <Route
                                path="/account-management"
                                element={<AccountManagementPage />}
                            />
                            <Route path="/contact-us" element={<ContactusPage />} />
                        </Routes>
                        </ProtectedRoute>
                    </main>
                </div>
            ),
        },
    ]);

    return (
        <>
            {routes}
            <ToastContainer position="bottom-right" autoClose={2000} />
        </>
    );
};
export default App;
