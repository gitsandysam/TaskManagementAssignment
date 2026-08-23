import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
  StyleSheet
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { RealmRepository } from "@/db/RealmRepository";
import { SyncService } from "@/services/sync/SyncService";
import { signOut } from "@/services/firebase/auth";
import { useAppSelector } from "@/store/hooks";
import { TaskRecord } from "@/types/task";
import { useTheme } from "@/theme/Theme";
import { useNetwork } from "@/context/NetworkContext";

const repo = new RealmRepository();
const sync = new SyncService(repo);

export default function TaskListScreen({ navigation }: any) {
  const { palette, dark, toggle } = useTheme();
  const { isConnected } = useNetwork();
  const userId = useAppSelector((s) => s.auth.userId)!;
  const [items, setItems] = useState<TaskRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load tasks from local database
  const load = useCallback(async () => {
    setItems(await repo.list(userId));
  }, [userId]);

  // Load tasks when the screen is focused
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // Refresh control
  const refresh = async () => {
    setRefreshing(true);
    try {
      // console.log("Syncing tasks...");
      // const { synced, skipped } = await sync.sync(userId);
      // console.log(`Synced ${synced} tasks, skipped ${skipped}`);
      // if (skipped){
      //   Alert.alert("Sync skipped", "There is no internet connection, please check your connection and try again.");
      // }
      
      if (!isConnected) {
        Alert.alert("Sync skipped", "There is no internet connection, please check your connection and try again.");
      }else{
        await sync.sync(userId);
      }
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  // Remove a task
  const remove = async (id: string) => {
    await repo.remove(id);
    await load();
    await refresh();
  };

  // Render a single task item
  const render = ({ item }: { item: TaskRecord }) => (
    <Pressable
      onPress={() => navigation.navigate("TaskEditor", { task: item })}
      onLongPress={() =>
        Alert.alert("Delete task?", item.title, [
          { text: "Cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => remove(item.id),
          },
        ])
      }
      style={{...styles.itemContainer, backgroundColor: palette.card, borderColor: palette.border,}}
    >
      <Text
        style={{...styles.txtItemTitle, color: palette.text, textDecorationLine: item.status === "completed" ? "line-through" : "none"}}
      >
        {item.title}
      </Text>
      <Text style={{ ...styles.txtItemDescription, color: palette.muted }}>
        {item.description || "No description"} · {item.syncStatus}
      </Text>
    </Pressable>
  );
  
  return (
    <View style={{...styles.container, backgroundColor: palette.bg}}>
      {/* Header */}
      <View
        style={styles.header}
      >
        <Text style={{...styles.txtHeader, color: palette.text}}>
          Tasks
        </Text>
        <View style={styles.headerActions}>
          <Pressable onPress={toggle}>
            <Text style={{ color: palette.primary }}>
              {dark ? "LightMode" : "DarkMode"}
            </Text>
          </Pressable>
          <Pressable onPress={() => signOut()}>
            <Text style={{ color: palette.primary }}>Logout</Text>
          </Pressable>
        </View>
      </View>
      {/* Listing */}
      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        renderItem={render}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        ListEmptyComponent={
          <Text
            style={{...styles.txtEmpty, color: palette.muted}}
          >
            No tasks. Tap + to create one.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      {/* Floating Action Button for creating tasks */}
      <Pressable
        onPress={() => navigation.navigate("TaskEditor")}
        style={{...styles.createBtn, backgroundColor: palette.primary}}
      >
        <Text style={styles.createBtnText}>+</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header:{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        },
  txtHeader:{ fontSize: 28, fontWeight: "700" },
  headerActions:{ flexDirection: "row", gap: 8 },
  txtEmpty:{ textAlign: "center", marginTop: 40 },
  createBtn:{
          position: "absolute",
          right: 24,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
        },
  createBtnText:{ fontSize: 28, color: "#fff" },
  itemContainer:{
        padding: 16,
        
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        
      },
  txtItemTitle:{
          fontSize: 17,
          fontWeight: "600",
          
        },
  txtItemDescription:{  marginTop: 5 }
});