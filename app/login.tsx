import React, { useState, useEffect } from 'react';
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
import { auth } from '@/config/firebaseConfig';

const LoginScreen = () => {
  const { user, signIn, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)/home');
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await signIn(email, password);
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        console.log('[LoginScreen] Bearer token:', `Bearer ${token}`);
      }
    } catch (error: any) {
      console.error('[LoginScreen] Login failed:', error);
      Alert.alert('Login Failed', error?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      {/* HomeGlow Title */}
      <Text className="text-white text-4xl font-extrabold text-center mb-10">HomeGlow</Text>

      {/* Card */}
      <View className="bg-[#2a2b33] rounded-2xl px-6 py-8 shadow-lg">
        <Text className="text-white text-2xl font-bold text-center mb-6">Log in</Text>

        <Text className="text-white mb-1">Email</Text>
        <TextInput
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          className="h-12 border border-gray-600 rounded-md px-4 mb-4 bg-[#1e1e1e] text-white"
          placeholderTextColor="#aaa"
        />

        <Text className="text-white mb-1">Password</Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="h-12 border border-gray-600 rounded-md px-4 mb-2 bg-[#1e1e1e] text-white"
          placeholderTextColor="#aaa"
        />

        {/* Forgot Password */}
        <TouchableOpacity onPress={() => router.push('/forgotpassword')}>
          <Text className="text-right text-blue-400 mb-6">Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          className="bg-blue-500 py-3 rounded-full items-center"
          onPress={handleLogin}
          disabled={submitting || loading}
        >
          {submitting || loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-bold">Log in</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Link */}
      <TouchableOpacity onPress={() => router.push('/signup')} className="mt-8">
        <Text className="text-center text-white">
          Do you have an account?{' '}
          <Text className="text-blue-400">Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
