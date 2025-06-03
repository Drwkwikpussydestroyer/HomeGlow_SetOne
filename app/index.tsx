import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    // Simulate loading, then navigate to login
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4b59c1" />
      <Text style={styles.text}>Loading, please wait...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 15,
    color: '#4b59c1',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
