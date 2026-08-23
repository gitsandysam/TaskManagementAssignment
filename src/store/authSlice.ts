import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface AuthState {
  userId: string | null;
  email: string | null;
  initialized: boolean;
}
const initialState: AuthState = {
  userId: null,
  email: null,
  initialized: false,
};
const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authInitialized: (
      s,
      a: PayloadAction<{ userId: string | null; email: string | null }>,
    ) => {
      s.userId = a.payload.userId;
      s.email = a.payload.email;
      s.initialized = true;
    },
  },
});
export const { authInitialized } = slice.actions;
export default slice.reducer;
