import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'expo-router';
 
const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
 
  useEffect(() => {
    console.log('[Protected] 🔍 useEffect triggered. loading:', loading, 'user:', user?.uid || null);
 
    if (!loading && user === null) {
      console.log('[Protected] 🚫 No user. Redirecting to /');
      router.replace('/');
    }
  }, [loading, user]);
 
  if (loading) {
    console.log('[Protected] ⏳ Still loading...');
    return (
<View style={styles.container}>
<ActivityIndicator size="large" />
</View>
    );
  }
 
  if (user === null) {
    console.log('[Protected] 🧭 Redirecting... (returning null)');
    return null;
  }
 
  console.log('[Protected] ✅ Authenticated. Rendering children.');
  return <>{children}</>;
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
 
export default Protected;