import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Home, Clock, LineChart, Settings, Power, Sun, Moon, Timer } from "lucide-react-native";

const { width, height } = Dimensions.get("window");



export default function HomeScreen() {
  const router = useRouter();
  const [selectedLightId, setSelectedLightId] = useState<number | null>(null);



  const handleLongPress = (id: number) => {
    setSelectedLightId(id);
  };

  const closeDetails = () => {
    setSelectedLightId(null);
  };

  return (
    <View className="flex-1 bg-[#121212]">
      {/* Header */}
      <View className="bg-[#2a2b33] py-6 px-4 items-center justify-center">
        <Text className="text-white text-5xl font-bold ">Analytics</Text>
      </View>

      

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 flex-row justify-around w-full bg-[#121212] py-3 border-t border-gray-700">
        <TouchableOpacity onPress={() => router.push("/home")} className="items-center">
          <Home color="white" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/schedule")} className="items-center">
          <Clock color="white" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/analytics")} className="items-center">
          <LineChart color="white" size={24} />
          <View className="h-1 w-6 bg-white mt-1 rounded-full" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/settings")} className="items-center">
          <Settings color="white" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
