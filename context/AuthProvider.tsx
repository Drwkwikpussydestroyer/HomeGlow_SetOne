import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification, // ✅ Correct import
} from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import {
  saveToken,
  deleteToken,
  TokenKey,
} from "@/utils/secureStore";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  reloadUser: () => Promise<User | null>;
  sendEmailVerificationSafe: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      console.log("[Auth] onAuthStateChanged triggered. User:", fbUser?.uid || "null");

      if (fbUser) {
        setUser(fbUser);
        try {
          const idToken = await fbUser.getIdToken(true);
          await saveToken(TokenKey.FirebaseID, idToken);
          console.log("[Auth] Saved fresh ID token");
        } catch (e) {
          console.error("[Auth] Failed to save ID token:", e);
        }

        try {
          const { uid, email, displayName, phoneNumber } = fbUser;
          const userDto = JSON.stringify({ uid, email, displayName, phoneNumber });
          await saveToken(TokenKey.User, userDto);
          console.log("[Auth] Saved user info:", userDto);
        } catch (e) {
          console.error("[Auth] Failed to save user info:", e);
        }
      } else {
        console.log("[Auth] No user found. Clearing SecureStore...");
        setUser(null);
        try {
          await deleteToken(TokenKey.FirebaseID);
          await deleteToken(TokenKey.User);
          console.log("[Auth] Cleared secure tokens");
        } catch (e) {
          console.error("[Auth] Failed to clear secure store:", e);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const creds = await signInWithEmailAndPassword(auth, email, password);
      const { uid, email: e, displayName, phoneNumber } = creds.user;

      const idToken = await creds.user.getIdToken(true);
      await saveToken(TokenKey.FirebaseID, idToken);
      console.log("[signIn] Saved fresh ID token");

      const userDto = JSON.stringify({ uid, email: e, displayName, phoneNumber });
      await saveToken(TokenKey.User, userDto);
      console.log("[signIn] Saved user info:", userDto);

      setUser(creds.user);
    } catch (e) {
      console.error("[signIn] Sign-in failed:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    console.log("[signOut] User signed out");
  };

  const reloadUser = async (): Promise<User | null> => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const refreshedUser = auth.currentUser;
      setUser(refreshedUser);
      return refreshedUser;
    }
    return null;
  };

  const sendEmailVerificationSafe = async (): Promise<boolean> => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      try {
        await sendEmailVerification(auth.currentUser); // ✅ Correct usage
        console.log("[sendEmailVerificationSafe] Verification email sent");
        return true;
      } catch (e) {
        console.error("[sendEmailVerificationSafe] Failed to send:", e);
      }
    }
    return false;
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        reloadUser,
        sendEmailVerificationSafe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
