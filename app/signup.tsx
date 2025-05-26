import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';
import { useAuth } from '@/context/AuthProvider';

const SignupScreen = () => {
  const { loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        await sendEmailVerification(user);
        Alert.alert(
          'Verify Your Email',
          'A verification email has been sent. Please check your inbox.'
        );
      }
    } catch (error: any) {
      console.error('[SignupScreen] Error:', error);
      Alert.alert('Signup Failed', error.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold text-center text-gray-800 mb-8">Sign Up</Text>

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
        className="h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-gray-50 text-base"
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        className="h-12 border border-gray-300 rounded-lg px-4 mb-6 bg-gray-50 text-base"
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        onPress={handleSignup}
        disabled={submitting || loading}
        className="bg-green-600 py-3 rounded-lg items-center"
      >
        {submitting || loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-semibold">Create Account</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
