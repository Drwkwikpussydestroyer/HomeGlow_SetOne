import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const { signIn, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

 const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Validation Error', 'Please enter email and password.');
    return;
  }

  setSubmitting(true);
  try {
    await signIn(email, password);
    router.replace('/(tabs)/home'); // 👈 Redirect to tabs home screen
  } catch (error: any) {
    console.error('[LoginScreen] Login failed:', error);
    Alert.alert('Login Failed', error?.message || 'Please try again.');
  } finally {
    setSubmitting(false);
  }
};


  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold text-center text-gray-800 mb-8">
        Login
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-gray-50 text-base"
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="h-12 border border-gray-300 rounded-lg px-4 mb-2 bg-gray-50 text-base"
        placeholderTextColor="#999"
      />

      {/* Forgot Password Link */}
      <TouchableOpacity onPress={() => router.push('/forgot-password')}>
        <Text className="text-right text-blue-600 mb-4">Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-blue-500 py-3 rounded-lg items-center"
        onPress={handleLogin}
        disabled={submitting || loading}
      >
        {submitting || loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-semibold">Sign In</Text>
        )}
      </TouchableOpacity>

      {/* Create Account Redirect */}
      <TouchableOpacity
        onPress={() => router.push('/signup')}
        className="mt-6"
      >
        <Text className="text-center text-blue-600 underline">
          Create an account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
