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
import { userReducer } from "./auth.redux";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import { invitationReducer } from "./invitation.redux";
import { contactReducer } from "./contact.redux";
import { conversationReducer } from "./conversation.redux";
import { chatReducer } from "./chat.redux";
import { callReducer } from "./call.redux";
import { blockReducer } from "./block.redux";
const storage = createWebStorage("local");

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  user: userReducer,
  invitation: invitationReducer,
  contact: contactReducer,
  conversation: conversationReducer,
  chat: chatReducer,
  call: callReducer,
  block: blockReducer
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
