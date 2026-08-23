import React, { useState } from "react";
import { Button, Text, TextInput, View, Alert, StyleSheet } from "react-native";
import { RealmRepository } from "@/db/RealmRepository";
// import { scheduleTaskReminder } from "@/services/notifications/NotificationService";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/Theme";

const repo = new RealmRepository();

export default function TaskEditorScreen({ route, navigation }: any) {
  const existing = route.params?.task;
  const { palette } = useTheme();
  const userId = useAppSelector((s) => s.auth.userId)!;
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [busy, setBusy] = useState(false);
  
  // Save the task (either create new or update existing)
  const save = async () => {
    if (!title.trim()) {
      Alert.alert("Title required");
      return;
    }
    setBusy(true);
    try {
      if (existing) {
        await repo.update(existing.id, { title, description });
      } else {
        await repo.upsert(userId, { title, description });
      }
      navigation.goBack();
    } finally {
      setBusy(false);
    }
  };
  
  // Toggle the completion status of the task
  const complete = async () => {
    if (existing) {
      await repo.update(existing.id, {
        status: existing.status === "completed" ? "pending" : "completed",
      });
      navigation.goBack();
    }
  };
  
  return (
    <View style={{...styles.container, backgroundColor: palette.bg}}>
      {/* Header text */}
      <Text
        style={{...styles.txtHeader, color: palette.text}}
      >
        {existing ? "Edit task" : "New task"}
      </Text>
      {/* Title input */}
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor={palette.muted}
        style={{...styles.txtInputTitle, backgroundColor: palette.card, color: palette.text}}
      />
      {/* Description input */}
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        placeholderTextColor={palette.muted}
        multiline
        style={{...styles.txtInputDescription, backgroundColor: palette.card, color: palette.text}}
      />
      {/* Save button */}
      <Button
        title={busy ? "Saving…" : "Save"}
        onPress={save}
        disabled={busy}
      />
      {/* Completion toggle */}
      {existing && (
        <View style={styles.statusAction}>
          <Button
            title={
              existing.status === "completed"
                ? "Mark incomplete"
                : "Mark complete"
            }
            onPress={complete}
          />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  txtHeader:{
          fontSize: 26,
          fontWeight: "700",
          marginBottom: 20,
        },
  txtInputTitle:{
          
          padding: 14,
          borderRadius: 10,
          marginBottom: 12,
        },
  txtInputDescription:{
    padding: 14,
          borderRadius: 10,
          height: 130,
          textAlignVertical: "top",
          marginBottom: 16,
  },
  statusAction:
          { marginTop: 12 }
        
});