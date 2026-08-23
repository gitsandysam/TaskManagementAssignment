import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice";
import tasks from "./taskSlice";
export const store = configureStore({
  reducer: { auth, tasks },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
