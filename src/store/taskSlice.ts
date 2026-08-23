import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskRecord } from "@/types/task";
interface State {
  items: TaskRecord[];
  loading: boolean;
  syncing: boolean;
  error: string | null;
}
const initialState: State = {
  items: [],
  loading: false,
  syncing: false,
  error: null,
};
const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (s, a: PayloadAction<TaskRecord[]>) => {
      s.items = a.payload;
      s.loading = false;
      s.error = null;
    },
    setLoading: (s, a: PayloadAction<boolean>) => {
      s.loading = a.payload;
    },
    setSyncing: (s, a: PayloadAction<boolean>) => {
      s.syncing = a.payload;
    },
    setError: (s, a: PayloadAction<string | null>) => {
      s.error = a.payload;
      s.loading = false;
    },
    replaceTask: (s, a: PayloadAction<TaskRecord>) => {
      const i = s.items.findIndex((x) => x.id === a.payload.id);
      if (i >= 0) s.items[i] = a.payload;
      else s.items.unshift(a.payload);
    },
    removeTask: (s, a: PayloadAction<string>) => {
      s.items = s.items.filter((x) => x.id !== a.payload);
    },
  },
});
export const {
  setTasks,
  setLoading,
  setSyncing,
  setError,
  replaceTask,
  removeTask,
} = slice.actions;
export default slice.reducer;
