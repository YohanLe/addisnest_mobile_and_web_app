import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import {ServicesListSlice,AuthSlice,ChatlistSlice,ClientlistSlice,HomeSlice, CitylistSlice, PropertyListSlice, LocationaddSlice, DashboardListSlice } from "./Slices";
import RatesListSlice from "./Slices/RatesListSlice";
import NotificationsListSlice from "./Slices/NotificationsListSlice";
import AllUserListSlice from "./Slices/AllUserListSlice";

const persistConfig = {
    key: "root",
    storage,
};
const rootReducer = combineReducers({
    Auth: persistReducer(persistConfig, AuthSlice),
    Home: HomeSlice,
    Citylist: CitylistSlice,
    Clientlist:ClientlistSlice,
    Chatlist:ChatlistSlice,
    ServicesList:ServicesListSlice,
    RatesList:RatesListSlice,
    PropertyList:PropertyListSlice,
    NotificationsList:NotificationsListSlice,
    DashboardList:DashboardListSlice,
    AllUserList:AllUserListSlice,
    Locationadd:persistReducer(persistConfig, LocationaddSlice)
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

const persistedStore = persistStore(store);

export { store, persistedStore };
