import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import {AuthSlice} from "./Slices";
import DashboardReducer from "./Slices/DashboardSlice";
import UserListReducer from "./Slices/UserListSlice";
import AgentListReducer from "./Slices/AgentListSlice";
import SellListReducer from "./Slices/SellListSlice";
import RentListReducer from "./Slices/RentListSlice";
import SubscriptionReducer from "./Slices/SubscriptionSlice";
import adminProfileReducer from "./Slices/AdminProfileSlice";
import NotificationSlice from './Slices/AdminNotidicationSlice';
const persistConfig = {
    key: "root",
    storage,
};
import AgentDetailsReducer from "./Slices/AgentDetailsSlice";
import UserDetailsReducer from "./Slices/UserDetailsSlice";

const rootReducer = combineReducers({
    Auth: persistReducer(persistConfig, AuthSlice),
    Dashboard: DashboardReducer,
    UserList: UserListReducer,
    AgentList: AgentListReducer,
    SellList: SellListReducer,
    RentList: RentListReducer,
    Subscription: SubscriptionReducer,
    adminProfile: adminProfileReducer,
    agentDetails: AgentDetailsReducer,
    userDetails: UserDetailsReducer,
    notifications: NotificationSlice,  // Add this line
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
