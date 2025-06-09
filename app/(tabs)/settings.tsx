import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import { pairDevice } from '@/api/pair';
import {
  fetchNotificationSettings,
  updateNotificationSettings,
} from '@/api/notifcationSetting';

const { width } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const { signOut, user, token } = useAuth();
  const [deviceId, setDeviceId] = useState('');
  const [pairingLoading, setPairingLoading] = useState(false);
  const [notifyHours, setNotifyHours] = useState('0');
  const [notifyMinutes, setNotifyMinutes] = useState('0');
  const [notifySeconds, setNotifySeconds] = useState('0');
  const [loadingNotificationSettings, setLoadingNotificationSettings] = useState(false);
  const [savingNotificationSettings, setSavingNotificationSettings] = useState(false);
  // Ask the user if they are really sure to log out with a pop up
  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/login');
            } catch (error) {
              console.error('Logout failed:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handlePairDevice = async () => {
    if (!deviceId.trim()) {
      Alert.alert('Error', 'Please enter a device ID.');
      return;
    }

    if (!user?.email) {
      Alert.alert('Error', 'Your account email is not available. Please check your profile.');
      return;
    }

    try {
      setPairingLoading(true);
      const result = await pairDevice(
        deviceId.trim(),
        user.email ?? undefined,
        token ?? undefined
      );
      console.log(' Device paired:', result);

      Alert.alert('Success', `Device "${deviceId}" paired successfully!`);
      setDeviceId('');
    } catch (error: any) {
      console.error(' Error pairing device:', error);
      Alert.alert('Error', error.message || 'Failed to pair device.');
    } finally {
      setPairingLoading(false);
    }
  };
  // converts the values to seconds required by my backend
  useEffect(() => {
    const loadNotificationSettings = async () => {
      if (!token) return;
      try {
        setLoadingNotificationSettings(true);
        const durationInSeconds = await fetchNotificationSettings(token);

        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = durationInSeconds % 60;

        setNotifyHours(hours.toString());
        setNotifyMinutes(minutes.toString());
        setNotifySeconds(seconds.toString());
      } catch (error: any) {
        console.error(' Failed to load notification settings:', error);
        Alert.alert('Error', error.message || 'Failed to load notification settings.');
      } finally {
        setLoadingNotificationSettings(false);
      }
    };

    loadNotificationSettings();
  }, [token]);

  const handleSaveNotificationSettings = async () => {
    if (!token) return;

    const hours = parseInt(notifyHours) || 0;
    const minutes = parseInt(notifyMinutes) || 0;
    const seconds = parseInt(notifySeconds) || 0;

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds <= 0) {
      Alert.alert('Error', 'Please enter a duration greater than 0.');
      return;
    }

    try {
      setSavingNotificationSettings(true);
      const updated = await updateNotificationSettings(totalSeconds, token);

      const updatedHours = Math.floor(updated / 3600);
      const updatedMinutes = Math.floor((updated % 3600) / 60);
      const updatedSeconds = updated % 60;

      setNotifyHours(updatedHours.toString());
      setNotifyMinutes(updatedMinutes.toString());
      setNotifySeconds(updatedSeconds.toString());

      Alert.alert('Success', 'Notification settings updated!');
    } catch (error: any) {
      console.error(' Failed to update notification settings:', error);
      Alert.alert('Error', error.message || 'Failed to update notification settings.');
    } finally {
      setSavingNotificationSettings(false);
    }
  };

  return (
  <View className="flex-1 bg-[#121212]">

    
          {/* Background Shapes */}
          <View
            style={{
              position: 'absolute',
              top: 20,
              left: -60,
              width: 160,
              height: 100,
              backgroundColor: '#4b145b',
              borderBottomRightRadius: 120,
              opacity: 0.2,
              zIndex: 0,
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: -40,
              right: -40,
              width: 180,
              height: 180,
              backgroundColor: '#ff6f61',
              borderRadius: 90,
              opacity: 0.15,
              zIndex: 0,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 180,
              right: 40,
              width: 80,
              height: 200,
              backgroundColor: '#20a39e',
              borderTopLeftRadius: 100,
              borderBottomRightRadius: 80,
              opacity: 0.2,
              zIndex: 0,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 240,
              left: -20,
              width: 140,
              height: 100,
              backgroundColor: '#efc7b7',
              borderBottomLeftRadius: 80,
              borderTopRightRadius: 60,
              opacity: 0.15,
              zIndex: 0,
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 30,
              left: 120,
              width: 100,
              height: 100,
              backgroundColor: '#005f73',
              borderRadius: 30,
              opacity: 0.15,
              zIndex: 0,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 120,
              height: 80,
              backgroundColor: '#ffb703',
              borderBottomLeftRadius: 100,
              opacity: 0.2,
              zIndex: 0,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 140,
              left: 100,
              width: 90,
              height: 90,
              backgroundColor: '#8ecae6',
              borderRadius: 45,
              opacity: 0.12,
              zIndex: 0,
            }}
          />
    

    {/* Header */}
    <View className="bg-[#2a2b33] py-6 px-4 items-center justify-center">
      <Text className="text-white text-5xl font-bold">Settings</Text>
    </View>

    {/* Main content */}
    <View className="flex-1 justify-between">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: 20,
          alignItems: 'center',
        }}
      >
        {/* Pair Device */}
        <View
          className="border border-white rounded-lg px-4 py-4 mb-4"
          style={{ width: width * 0.9 }}
        >
          <Text className="text-white text-base font-semibold mb-2">Pair New Device</Text>
          <TextInput
            placeholder="Enter Device ID"
            placeholderTextColor="#999"
            value={deviceId}
            onChangeText={setDeviceId}
            className="text-white border border-gray-500 rounded px-3 py-2 mb-3"
          />
          <TouchableOpacity
            onPress={handlePairDevice}
            disabled={pairingLoading}
            className={`rounded-lg flex-row items-center justify-center px-4 py-3 ${
              pairingLoading ? 'bg-gray-600' : 'bg-green-600'
            }`}
          >
            <Text className="text-white text-base font-semibold">
              {pairingLoading ? 'Pairing...' : 'Pair Device'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notification Settings */}
        <View
          className="border border-white rounded-lg px-4 py-4 mb-4"
          style={{ width: width * 0.9 }}
        >
          <Text className="text-white text-base font-semibold mb-2">Notification Settings</Text>
          {loadingNotificationSettings ? (
            <Text className="text-white mb-2">Loading...</Text>
          ) : (
            <>
              <Text className="text-white text-xs mb-1">Notification duration</Text>
              <TextInput
                placeholder="Hours"
                placeholderTextColor="#999"
                value={notifyHours}
                onChangeText={setNotifyHours}
                keyboardType="numeric"
                className="text-white border border-gray-500 rounded px-3 py-2 mb-3"
              />
              <TextInput
                placeholder="Minutes"
                placeholderTextColor="#999"
                value={notifyMinutes}
                onChangeText={setNotifyMinutes}
                keyboardType="numeric"
                className="text-white border border-gray-500 rounded px-3 py-2 mb-3"
              />
              <TextInput
                placeholder="Seconds"
                placeholderTextColor="#999"
                value={notifySeconds}
                onChangeText={setNotifySeconds}
                keyboardType="numeric"
                className="text-white border border-gray-500 rounded px-3 py-2 mb-3"
              />

              <TouchableOpacity
                onPress={handleSaveNotificationSettings}
                disabled={savingNotificationSettings}
                className={`rounded-lg flex-row items-center justify-center px-4 py-3 ${
                  savingNotificationSettings ? 'bg-gray-600' : 'bg-blue-600'
                }`}
              >
                <Text className="text-white text-base font-semibold">
                  {savingNotificationSettings ? 'Saving...' : 'Save Settings'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {/* Logout Button at bottom */}
      <TouchableOpacity
        onPress={handleLogout}
        className="flex-row items-center justify-center px-4 py-4 border border-red-600 bg-red-600 rounded-lg mb-6"
        style={{ width: '90%', alignSelf: 'center' }}
        >
        <Text className="text-white text-base font-semibold">Log Out</Text>
        </TouchableOpacity>
    </View>
  </View>
);
}
