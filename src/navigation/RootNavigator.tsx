import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSelector } from "@/store/hooks";
import LoginScreen from "@/screens/LoginScreen";
import SignUpScreen from "@/screens/SignUpScreen";
import TaskListScreen from "@/screens/TaskListScreen";
import TaskEditorScreen from "@/screens/TaskEditorScreen";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {

  const safeAreaInsets = useSafeAreaInsets();

  const ready = useAppSelector((s) => s.auth.initialized);
  const user = useAppSelector((s) => s.auth.userId);
  
  if (!ready) return null;

  return (
    <SafeAreaProvider style={{ paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Tasks" component={TaskListScreen} />
              <Stack.Screen name="TaskEditor" component={TaskEditorScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
