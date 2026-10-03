import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { userReducer } from "./client/auth.redux";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import { invitationReducer } from "./client/invitation.redux";
import { contactReducer } from "./client/contact.redux";
import { conversationReducer } from "./client/conversation.redux";
import { chatReducer } from "./client/chat.redux";
import { callReducer } from "./client/call.redux";
import { blockReducer } from "./client/block.redux";
import { adminReducer } from "./admin/authAdmin.redux";
const storage = createWebStorage("local");

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["user", "admin"],
};

const rootReducer = combineReducers({
  user: userReducer,
  invitation: invitationReducer,
  contact: contactReducer,
  conversation: conversationReducer,
  chat: chatReducer,
  call: callReducer,
  block: blockReducer,
  //admin
  admin: adminReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
