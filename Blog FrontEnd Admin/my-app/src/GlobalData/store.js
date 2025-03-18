import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // LocalStorage ke liye
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import userReducer from "./slices/userSlice.js"; 

// 🔹 Redux Persist Config
const persistConfig = {
  key: "root", // Storage key
  storage, // LocalStorage use ho raha hai
};

// 🔹 Root Reducer
const rootReducer = combineReducers({
  user: userReducer, 
});

// 🔹 Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Store Setup
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Redux Persist ke saath zaroori hai
    }),
});

// 🔹 Persistor Export
const persistor = persistStore(store);

export { store, persistor };
