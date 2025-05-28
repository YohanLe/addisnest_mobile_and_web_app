import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import {ServicesListSlice,AuthSlice,PropertyDetailSlice,ChatlistSlice,ClientlistSlice,TicketListSlice,HomeSlice, CitylistSlice, WishListSlice, AgentAllSlice, AgentDetailsSlice, LocationaddSlice } from "./Slices";
import RatesListSlice from "./Slices/RatesListSlice";


const persistConfig = {
    key: "root",
    storage,
};
const rootReducer = combineReducers({
    Auth: persistReducer(persistConfig, AuthSlice),
    Home: HomeSlice,
    Citylist: CitylistSlice,
    TicketList:TicketListSlice,
    Clientlist:ClientlistSlice,
    Chatlist:ChatlistSlice,
    ServicesList:ServicesListSlice,
    RatesList:RatesListSlice,
    WishList:WishListSlice,
    PropertyDetail:PropertyDetailSlice,
    AgentAll:AgentAllSlice,
    AgentDetails:AgentDetailsSlice,
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
