import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View, StyleSheet } from "react-native";
import { signUp } from "@/services/firebase/auth";
import { useTheme } from "@/theme/Theme";
export default function SignUpScreen() {
  const { palette } = useTheme();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [busy, setBusy] = useState(false);
  
  // Handle the sign-up submission
  const submit = async () => {
    try {
      setBusy(true);
      await signUp(email, pwd);
    } catch (e: any) {
      Alert.alert("Sign up failed", e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View
      style={{...styles.container, backgroundColor: palette.bg}}
    >
      {/* H1 text */}
      <Text style={{...styles.txtTitle, color: palette.text}}>
        Create account
      </Text>
      {/* Email input */}
      <TextInput
        placeholder="Email"
        placeholderTextColor={palette.muted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{...styles.txtInputEmail, backgroundColor: palette.card, color: palette.text}}
      />
      {/* Password input */}
      <TextInput
        placeholder="Password (6+ chars)"
        placeholderTextColor={palette.muted}
        value={pwd}
        onChangeText={setPwd}
        secureTextEntry
        style={{...styles.txtInputPassword, backgroundColor: palette.card, color: palette.text}}
      />
      <Button
        title={busy ? "Creating…" : "Create account"}
        onPress={submit}
        disabled={busy}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
      },
  txtTitle:{ fontSize: 28, fontWeight: "700" },
  txtInputEmail:{
          padding: 14,
          marginVertical: 12,
          borderRadius: 10,
        },
  txtInputPassword:{
          padding: 14,
          borderRadius: 10,
          marginBottom: 16,
        },
  

});
