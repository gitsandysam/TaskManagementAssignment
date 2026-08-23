import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { signIn } from "@/services/firebase/auth";
import { useTheme } from "@/theme/Theme";

export default function LoginScreen({ navigation }: any) {
  var { palette } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  
  // Handle the login submission
  const submit = async () => {
    try {
      setBusy(true);
      await signIn(email, password);
    } catch (e: any) {
      Alert.alert("Login failed", e.message);
    } finally {
      setBusy(false);
    }
  };
  
  return (
    <View
      style={{...styles.container,backgroundColor: palette.bg}}
    >
      {/* H1 text */}
      <Text style={{...styles.titleTxt, color: palette.text}}>
        Task Manager
      </Text>
      {/* Subtitle */}
      <Text style={{...styles.subtitleTxt, color: palette.muted}}>
        Sign in to continue
      </Text>
      {/* Email input */}
      <TextInput
        placeholder="Email"
        placeholderTextColor={palette.muted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{...styles.txtInputEmail,backgroundColor: palette.card, color: palette.text}}
      />
      {/* Password input */}
      <TextInput
        placeholder="Password"
        placeholderTextColor={palette.muted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{...styles.txtInputPassword,backgroundColor: palette.card,color: palette.text}}
      />
      <Button
        title={busy ? "Signing in…" : "Login"}
        onPress={submit}
        disabled={busy}
      />
      {/* Create account button */}
      <View style={styles.spacer} />
      <Button
        title="Create account"
        onPress={() => navigation.navigate("SignUp")}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
        flex: 1,
        padding: 24,
        justifyContent: "center"
      },
  titleTxt:{ fontSize: 30, fontWeight: "700" },
  subtitleTxt:{ marginBottom: 24 },
  txtInputEmail:{
          padding: 14,
          borderRadius: 10,
          marginBottom: 12,
        },
        txtInputPassword:{
          
          padding: 14,
          borderRadius: 10,
          marginBottom: 16,
        },
  spacer:{ height: 12 },
});