import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'expo-router';

export default function VerifyEmailScreen() {
  const { reloadUser, sendEmailVerificationSafe, user } = useAuth();
  const router = useRouter();

  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [isVerified, setIsVerified] = useState(user?.emailVerified ?? false);

  useEffect(() => {
    const checkInitialVerification = async () => {
      if (!user?.emailVerified) {
        try {
          const refreshedUser = await reloadUser();
          if (refreshedUser?.emailVerified) {
            setIsVerified(true);
            router.replace('/');
          }
        } catch (e) {
          console.warn('[VerifyEmailScreen] Initial check failed:', e);
        }
      } else {
        setIsVerified(true);
      }
    };

    checkInitialVerification();
  }, [user]);

  const handleCheckVerification = async () => {
    try {
      setVerifying(true);
      const refreshedUser = await reloadUser();

      if (refreshedUser?.emailVerified) {
        setIsVerified(true);
        Alert.alert('Verified \ud83c\udf89', 'Your email has been verified.');
        router.replace('/'); // Redirect to home or main screen
      } else {
        Alert.alert('Not Verified', 'Please verify your email first.');
      }
    } catch (error) {
      console.error('Verification check error:', error);
      Alert.alert('Error', 'Unable to check verification status.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      setResending(true);
      const sent = await sendEmailVerificationSafe();

      if (sent) {
        Alert.alert('Sent', 'Verification email has been resent.');
      } else {
        Alert.alert('Error', 'Failed to send verification email.');
      }
    } catch (error) {
      console.error('Resend verification email error:', error);
      Alert.alert('Error', 'Could not resend verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-50 px-6">
      <Text className="text-2xl font-bold text-center text-black mb-2">
        Verify Your Email
      </Text>
      <Text className="text-center text-gray-600 mb-8 leading-relaxed">
        We've sent a verification link to your email. Tap the link, then return here.
      </Text>

      <TouchableOpacity
        disabled={verifying || isVerified}
        onPress={handleCheckVerification}
        className={`w-full py-4 rounded-lg mb-4 ${
          verifying || isVerified ? 'bg-gray-300' : 'bg-black'
        }`}
      >
        {verifying ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold text-base">
            I Verified My Email
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        disabled={resending || isVerified}
        onPress={handleResendEmail}
        className={`w-full py-4 rounded-lg ${
          resending || isVerified ? 'bg-gray-300' : 'bg-gray-700'
        }`}
      >
        {resending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold text-base">
            Resend Verification Email
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
