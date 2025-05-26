import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const cleanInput = (str: string): string =>
    str.normalize('NFKC').replace(/\u200B/g, '').trim();

  const handleReset = async () => {
    const trimmedEmail = cleanInput(email);

    if (!trimmedEmail) {
      Alert.alert('Missing Email', 'Please enter your email.');
      return;
    }

    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, trimmedEmail);
      Alert.alert(
        'Reset Email Sent',
        'Please check your inbox for the password reset link.'
      );
      router.back(); // Navigate back to login
    } catch (error: any) {
      console.error('Password Reset Error:', error);

      let errorMessage = 'Failed to send reset email.';

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-primaryBackground">
      <Text className="text-2xl font-bold text-center mb-6 text-blue-600">
        Forgot Password
      </Text>

      <Text className="text-base text-gray-700 mb-4 text-center">
        Enter the email linked to your account. We’ll send a password reset link.
      </Text>

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-[14px] mb-4 text-[17px] bg-white"
        placeholder="Your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <TouchableOpacity
        onPress={handleReset}
        className={`bg-blue-600 rounded-lg py-3 mb-4 ${
          isLoading ? 'opacity-50' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Send Reset Link
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text className="text-blue-500 text-center underline">Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}
