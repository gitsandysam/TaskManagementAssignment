import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";

// Initialize Firebase Authentication
const auth = getAuth();

// Sign up a new user
export const signUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email.trim(), password);

// Sign in an existing user
export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email.trim(), password);

// Sign out the current user
export const signOut = () => auth.signOut();

// Observe authentication state changes
export const observeAuth = (
  listener: Parameters<typeof auth.onAuthStateChanged>[0],
) => auth.onAuthStateChanged(listener);
