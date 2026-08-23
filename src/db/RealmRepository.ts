import Realm from "realm";
import { Task, realmConfig } from "./TaskSchema";
import { TaskInput, TaskRecord } from "@/types/task";

export class RealmRepository {
  private realm: Realm | null = null;

  // Open a Realm instance
  async open() {
    if (!this.realm || this.realm.isClosed)
      this.realm = await Realm.open(realmConfig);
    return this.realm;
  }

  // Close the Realm instance
  async close() {
    this.realm?.close();
    this.realm = null;
  }

  // List all tasks for a user
  async list(userId: string): Promise<TaskRecord[]> {
    const realm = await this.open();
    return realm
      .objects<Task>(Task)
      .filtered("userId == $0 AND deletedAt == nil", userId)
      .sorted("updatedAt", true)
      .map(toRecord);
  }

  // Upsert a task (create or update)
  async upsert(
    userId: string,
    input: TaskInput,
    id = cryptoRandomId(),
    now = Date.now(),
  ): Promise<TaskRecord> {
    const realm = await this.open();
    let result!: TaskRecord;
    realm.write(() => {
      realm.create(
        Task,
        {
          id,
          userId,
          title: input.title.trim(),
          description: input.description?.trim() ?? "",
          status: "pending",
          dueAt: input.dueAt ?? null,
          reminderAt: input.reminderAt ?? null,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
          syncStatus: "pending",
          syncError: null,
        },
        Realm.UpdateMode.Modified,
      );
      result = toRecord(realm.objectForPrimaryKey<Task>(Task, id)!);
    });
    return result;
  }

  // Update an existing task
  async update(
    id: string,
    patch: Partial<TaskInput> & { status?: "pending" | "completed" },
  ) {
    const realm = await this.open();
    realm.write(() => {
      const task = realm.objectForPrimaryKey<Task>(Task, id);
      if (!task) return;
      if (patch.title !== undefined) task.title = patch.title.trim();
      if (patch.description !== undefined)
        task.description = patch.description.trim();
      if (patch.dueAt !== undefined) task.dueAt = patch.dueAt;
      if (patch.reminderAt !== undefined) task.reminderAt = patch.reminderAt;
      if (patch.status !== undefined) task.status = patch.status;
      task.updatedAt = Date.now();
      task.syncStatus = "pending";
      task.syncError = null;
    });
  }

  // Soft-delete a task
  async remove(id: string) {
    const realm = await this.open();
    realm.write(() => {
      const task = realm.objectForPrimaryKey<Task>(Task, id);
      if (!task) return;
      task.deletedAt = Date.now();
      task.updatedAt = Date.now();
      task.syncStatus = "pending";
    });
  }

  // List all tasks that are pending synchronization
  async pending(userId: string): Promise<TaskRecord[]> {
    const realm = await this.open();
    return realm
      .objects<Task>(Task)
      .filtered('userId == $0 AND syncStatus != "synced"', userId)
      .map(toRecord);
  }

  // Mark a task as successfully synchronized
  async markSynced(id: string) {
    const realm = await this.open();
    realm.write(() => {
      const t = realm.objectForPrimaryKey<Task>(Task, id);
      if (t) {
        t.syncStatus = "synced";
        t.syncError = null;
      }
    });
  }

  // Mark a task as failed to synchronize
  async markFailed(id: string, error: string) {
    const realm = await this.open();
    realm.write(() => {
      const t = realm.objectForPrimaryKey<Task>(Task, id);
      if (t) {
        t.syncStatus = "failed";
        t.syncError = error;
      }
    });
  }
}

// Generate a random ID for a new task
const cryptoRandomId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

// Convert a Realm Task object to a TaskRecord
const toRecord = (t: Task): TaskRecord => ({
  id: t.id,
  userId: t.userId,
  title: t.title,
  description: t.description,
  status: t.status as TaskRecord["status"],
  dueAt: t.dueAt,
  reminderAt: t.reminderAt,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
  deletedAt: t.deletedAt,
  syncStatus: t.syncStatus as TaskRecord["syncStatus"],
  syncError: t.syncError,
});
