import Realm from "realm";
// import NetInfo from "@react-native-community/netinfo";
import { RealmRepository } from "@/db/RealmRepository";
import {
  deleteTask,
  fetchRemoteTasks,
  upsertTask,
} from "@/services/firebase/firestore";

export class SyncService {
  constructor(private readonly repo: RealmRepository) {}

  // Synchronize local tasks with the remote server
  async sync(userId: string) {
    // const { isConnected } = useNetwork();
    // console.log(`Network state: ${isConnected ? "online" : "offline"}`);
    // if (!isConnected) return { synced: 0, skipped: true };

    const pending = await this.repo.pending(userId);// Get all tasks that are pending synchronization
    const localList = await this.repo.list(userId);// Get the current list of local tasks for the user
    const remote = await fetchRemoteTasks(userId);// Fetch tasks from the remote server
    const remoteById = new Map(remote.map((t) => [t.id, t]));// Create a map of remote tasks by their ID for quick lookup
    const localById = new Map(localList.map((t) => [t.id, t]));// Create a map of local tasks by their ID for quick lookup

    // Last-write-wins: the record with the highest updatedAt wins.
    for (const local of pending) {//
      const server = remoteById.get(local.id);// Get the corresponding server task if it exists
      if (!server || local.updatedAt >= server.updatedAt) {// Local is newer or server doesn't exist: push local state to server
        // console.log(`Local is newer for task ${local.id}, pushing to server`);
        if (local.deletedAt) await deleteTask(local);// If the local task is marked as deleted, delete it on the server
        else await upsertTask(local);// Otherwise, upsert the local task to the server
        await this.repo.markSynced(local.id);// Mark the local task as successfully synchronized
      } else {
        // console.log(`Server is newer for task ${local.id}, replacing local state`);
        // Server is newer: replace local state through a normal upsert path.
        await this.repo.open().then((realm) =>
          realm.write(() => {
            realm.create(
              "Task",
              { ...server, syncStatus: "synced", syncError: null },
              Realm.UpdateMode.Modified,
            );
          }),
        );
      }
    }

    // Add any remote tasks that don't exist locally
    const localIds = new Set((await this.repo.list(userId)).map((t) => t.id));// Create a set of local task IDs for quick lookup
    for (const server of remote) {// For each server task, check if it exists locally
        const serverTemp = localById.get(server.id);
        // console.log(`Checking server task ${server.id} against local tasks *** ${server.updatedAt} > ${serverTemp?.updatedAt}`);
      if (!localIds.has(server.id) || (server.updatedAt > serverTemp.updatedAt)) {// If it doesn't exist locally, add it to the local database
        await this.repo.open().then((realm) =>
          realm.write(() => {
            realm.create(
              "Task",
              { ...server, syncStatus: "synced", syncError: null },
              Realm.UpdateMode.Modified,
            );
          }),
        );
      }
    }
    return { synced: pending.length, skipped: false };
  }
}
