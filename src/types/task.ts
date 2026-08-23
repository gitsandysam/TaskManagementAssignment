export type TaskStatus = "pending" | "completed";
export type SyncStatus = "synced" | "pending" | "failed";

export interface TaskRecord {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueAt: number | null;
  reminderAt: number | null;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
  syncStatus: SyncStatus;
  syncError: string | null;
}

export interface TaskInput {
  title: string;
  description?: string;
  dueAt?: number | null;
  reminderAt?: number | null;
}
