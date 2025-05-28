import { Route, Routes } from "react-router-dom";
import { useRoutes, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import {
    AccountManagementPage,
    ChatPage,
    ChoosePromotionPage,
    ContactusPage,
    FavoritePage,
    FindAgentListPage,
    FindAgentPage,
    HelpSupportPage,
    HomePage,
    MortagageCalcuatorPage,
    NotificationPage,
    PaymentMethodPage,
    PaymentSuccessPage,
    PropertyDeatilPage,
    PropertyFormPage,
    PropertyListPage,
    PropertySellListPage,
    PropertyRentListPage
} from "./RoutesMain";
import { Footer, Header } from "./components/common";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const App = () => {
    const location = useLocation();
    useEffect(() => {
        const path = location.pathname;

        switch (path) {
            case "/":
                document.body.classList.add('home-body');
                break;
            default:
                document.body.classList.remove('home-body');
                break;
        }
    }, [location]);
    const routes = useRoutes([
        {
            path: "/*",
            element: (
                <>
                    <Header />
                    <main className="main">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/property-list" element={<PropertyListPage />} />
                            <Route path="/property-rent-list" element={<PropertyRentListPage />} />
                            <Route path="/property-detail/:id" element={<PropertyDeatilPage />} />
                            <Route
                                path="/mortagage-calcuator"
                                element={<MortagageCalcuatorPage />}
                            />
                            <Route path="/my-list" element={<PropertySellListPage />} />
                            <Route path="/property-form" element={<PropertyFormPage />} />
                            <Route
                                path="/choose-promotion"
                                element={<ChoosePromotionPage />}
                            />
                            <Route path="/payment" element={<PaymentMethodPage />} />
                            <Route path="/success-payment" element={<PaymentSuccessPage />} />
                            <Route path="/find-agent" element={<FindAgentPage />} />
                            <Route path="/find-agent-list" element={<FindAgentListPage />} />
                            <Route path="/notification" element={<NotificationPage />} />
                            <Route path="/help-support" element={<HelpSupportPage />} />
                            <Route path="/favorite" element={<FavoritePage />} />
                            <Route
                                path="/account-management"
                                element={<AccountManagementPage />}
                            />
                            <Route path="/chat" element={<ChatPage />} />
                            <Route path="/contact-us" element={<ContactusPage />} />
                        </Routes>
                    </main>
                    <Footer />
                </>
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
