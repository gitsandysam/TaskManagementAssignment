import Realm from 'realm';

// Define the Task schema for Realm
export class Task extends Realm.Object<Task> {
  id!: string;
  userId!: string;
  title!: string;
  description!: string;
  status!: string;
  dueAt!: number | null;
  reminderAt!: number | null;
  createdAt!: number;
  updatedAt!: number;
  deletedAt!: number | null;
  syncStatus!: string;
  syncError!: string | null;

  // Define the schema for the Task model
  static schema: Realm.ObjectSchema = {
    name: 'Task',
    primaryKey: 'id',
    properties: {
      id: 'string', userId: 'string', title: 'string', description: 'string',
      status: 'string', dueAt: 'int?', reminderAt: 'int?', createdAt: 'int',
      updatedAt: 'int', deletedAt: 'int?', syncStatus: 'string', syncError: 'string?'
    }
  };
}

// Define the Realm configuration for the application
export const realmConfig: Realm.Configuration = {
  schemaVersion: 1,
  schema: [Task],
  path: 'task-manager.realm'
};
