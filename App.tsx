import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { getAuth } from "@react-native-firebase/auth";
import { store } from "@/store/store";
import { authInitialized } from "@/store/authSlice";
import RootNavigator from "@/navigation/RootNavigator";
import { ThemeProvider } from "@/theme/Theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { env } from "@/config/env";
import { NetworkProvider } from "@/context/NetworkContext";



function Bootstrap() {
  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) =>
      store.dispatch(
        authInitialized({
          userId: user?.uid ?? null,
          email: user?.email ?? null,
        }),
      )
    );
    return unsubscribe;
  }, []);
  
  return (
  <RootNavigator />);
}
export default function App() {
  console.log(`App config: ${env.API_ENV} - ${env.APP_NAME}`);
  return (
    <SafeAreaProvider>
      <NetworkProvider>
      <Provider store={store}>
        <ThemeProvider>
            <Bootstrap />
        </ThemeProvider>
      </Provider>
      </NetworkProvider>
    </SafeAreaProvider> 
  );
}
