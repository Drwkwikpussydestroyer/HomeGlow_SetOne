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
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebaseConfig';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'expo-router';

//Sign up screen authentication
const SignupScreen = () => {
  const { loading } = useAuth();
  const router = useRouter();

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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          email,
          createdAt: serverTimestamp(),
          light_timeout_seconds: 600,
          auto_timeout_enabled: true,
        });
        
        //email verification pop up
        await sendEmailVerification(user);
        Alert.alert(
          'Verify Your Email',
          'A verification email has been sent. Please check your inbox.'
        );

        await auth.signOut();
        router.replace('/login');
      }
    } catch (error: any) {
      console.error('[SignupScreen] Error:', error);
      Alert.alert('Signup Failed', error.message || 'Something went wrong.');
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
        <Text className="text-white text-2xl font-bold text-center mb-6">Sign Up</Text>

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
          className="h-12 border border-gray-600 rounded-md px-4 mb-4 bg-[#1e1e1e] text-white"
          placeholderTextColor="#aaa"
        />

        <Text className="text-white mb-1">Confirm Password</Text>
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          className="h-12 border border-gray-600 rounded-md px-4 mb-6 bg-[#1e1e1e] text-white"
          placeholderTextColor="#aaa"
        />

        {/* Create Account Button */}
        <TouchableOpacity
          onPress={handleSignup}
          disabled={submitting || loading}
          className="bg-green-600 py-3 rounded-full items-center mb-4"
        >
          {submitting || loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-bold">Create Account</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Link */}
      <TouchableOpacity onPress={() => router.push('/login')} className="mt-8">
        <Text className="text-center text-white">
          Already have an account?{' '}
          <Text className="text-green-400">Log In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
