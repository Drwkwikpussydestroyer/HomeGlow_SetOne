import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  User2,
  Home,
  Clock,
  LineChart,
  Settings,
  Bell,
  Lightbulb,
  Camera,
  HelpCircle,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();

  const settingsOptions = [
    {
      icon: () => <User2 color="white" size={24} />,
      title: () => <Text className="text-white text-base font-semibold">Account</Text>,
      subtitle: () => <Text className="text-white text-xs">Change account information</Text>,
    },
    {
      icon: () => <Bell color="white" size={24} />,
      title: () => <Text className="text-white text-base font-semibold">Notification</Text>,
      subtitle: () => <Text className="text-white text-xs">Manage notifications</Text>,
    },
    {
      icon: () => <Lightbulb color="white" size={24} />,
      title: () => <Text className="text-white text-base font-semibold">Light setup</Text>,
      subtitle: () => (
        <Text className="text-white text-xs">Set default light setup, motion detecting</Text>
      ),
    },
    {
      icon: () => <Camera color="white" size={24} />,
      title: () => <Text className="text-white text-base font-semibold">Camera setup</Text>,
      subtitle: () => <Text className="text-white text-xs">Motion detection settings</Text>,
    },
    {
      icon: () => <HelpCircle color="white" size={24} />,
      title: () => <Text className="text-white text-base font-semibold">Help Desk</Text>,
      subtitle: () => <Text className="text-white text-xs">Motion detection settings</Text>,
    },
  ];

  return (
    <View className="flex-1 bg-[#121212]">
      {/* Header Shape */}
      <View className="bg-[#2a2b33] py-6 px-4 items-center justify-center">
        <Text className="text-white text-5xl font-bold">Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Connected Lights */}
        <View className="items-center mb-6">
          <View className="bg-[#1d2144] px-7 py-4 rounded-2xl items-center">
            <Text className="text-white text-base mb-1">Connected Lights:</Text>
            <Text className="text-white text-3xl font-bold">10</Text>
          </View>
        </View>

        {/* Option List */}
        <View className="items-center">
          {settingsOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => console.log(`${item.title} Pressed`)}
              className="border border-white rounded-lg flex-row items-center justify-between px-4 py-4 mb-2"
              style={{ width: width * 0.9 }}
            >
              <View className="flex-row items-center">
                <View className="mr-3">{item.icon()}</View>
                <View>
                  {item.title()}
                  {item.subtitle()}
                </View>
              </View>
              <Text className="text-white text-xl">›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 flex-row justify-around w-full bg-[#121212] py-3 border-t border-gray-700">
        <TouchableOpacity onPress={() => router.push('/home')} className="items-center">
          <Home color="white" size={24} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/schedule')} className="items-center">
          <Clock color="white" size={24} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/analytics')} className="items-center">
          <LineChart color="white" size={24} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/settings')} className="items-center">
          <Settings color="white" size={24} />
          <View className="h-1 w-6 bg-white mt-1 rounded-full" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
