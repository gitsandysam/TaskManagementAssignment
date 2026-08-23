import { TaskRecord } from "@/types/task";
import { collection, doc, getDocs, getFirestore, setDoc } from '@react-native-firebase/firestore';

// Initialize Firestore
const db = getFirestore();

// Reference to the tasks collection for a specific user
const tasks = (userId: string) => collection(db, 'Users', userId, 'Tasks');
// const tasks = (userId: string) => firestore().collection("users").doc(userId).collection("tasks");

// Upsert a task in Firestore 
export async function upsertTask(task: TaskRecord) {
  await setDoc(doc(tasks(task.userId), task.id), { ...task }, { merge: true });
}

// Delete a task in Firestore by marking it as deleted
export async function deleteTask(task: TaskRecord) {
  await setDoc(
    doc(tasks(task.userId), task.id),
    {
      deletedAt: task.deletedAt,
      updatedAt: task.updatedAt,
      syncStatus: "synced",
    },
    { merge: true },
  );
}

// Fetch all tasks for a user from Firestore
export async function fetchRemoteTasks(userId: string): Promise<TaskRecord[]> {
  const snap = await getDocs(tasks(userId));
  return snap.docs.map((d) => d.data() as TaskRecord);
}
