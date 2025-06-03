import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Power, Sun, Moon, Timer } from 'lucide-react-native';
import { controlLight } from '@/api/controlLight';
import { useAuth } from '@/context/AuthProvider'; // ✅ Import the custom hook

const { width, height } = Dimensions.get('window');

const lights = [
  { id: 1, location: 'living room', isOn: true },
  { id: 2, location: 'Kitchen', isOn: false },
  { id: 3, location: 'living room', isOn: false },
  { id: 4, location: 'living room', isOn: false },
  { id: 5, location: 'living room', isOn: false },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth(); // ✅ Use the context
  const [lightStates, setLightStates] = useState(lights);
  const [selectedLightId, setSelectedLightId] = useState<number | null>(null);

  const toggleLight = async (id: number) => {
    const updatedLights = [...lightStates];
    const index = updatedLights.findIndex((light) => light.id === id);

    if (index !== -1) {
      const light = updatedLights[index];
      const newStatus = light.isOn ? 'OFF' : 'ON';

      try {
        if (!user?.email) {
          Alert.alert('Error', 'User email not found.');
          return;
        }

        await controlLight(user.email, newStatus, `light-${light.id}`);
        updatedLights[index].isOn = !light.isOn;
        setLightStates(updatedLights);
      } catch (error) {
        Alert.alert('Error', `Failed to toggle light ${id}.`);
      }
    }
  };

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
        <Text className="text-white text-5xl font-bold">Home</Text>
      </View>

      {/* Add connection */}
      <TouchableOpacity className="px-4 py-3">
        <Text className="text-white text-lg font-semibold">+ Add a connection</Text>
      </TouchableOpacity>

      {/* Light List */}
      <ScrollView className="px-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {lightStates.map((light) => {
          const isSelected = selectedLightId === light.id;
          return (
            <TouchableOpacity
              key={light.id}
              onPress={() => toggleLight(light.id)}
              onLongPress={() => handleLongPress(light.id)}
              className={`px-5 py-4 mb-3 rounded-2xl ${
                light.isOn ? 'bg-[#0a3d62]' : 'bg-[#2f2f2f]'
              }`}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white text-lg font-bold">Light #{light.id}</Text>
                  <Text className="text-gray-300">Location: {light.location}</Text>
                </View>
                <Power color={light.isOn ? '#00ff00' : '#ff0000'} size={32} />
              </View>

              {isSelected && (
                <View className="mt-4">
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-white text-lg font-semibold">Routines</Text>
                    <TouchableOpacity onPress={closeDetails}>
                      <Text className="text-white font-semibold">Back</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity className="bg-[#0a3d62] p-4 mb-2 rounded-xl flex-row items-center">
                    <Sun color="white" />
                    <Text className="text-white ml-2">Wake up</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-[#0a3d62] p-4 mb-2 rounded-xl flex-row items-center">
                    <Moon color="white" />
                    <Text className="text-white ml-2">Go to sleep</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-[#0a3d62] p-4 rounded-xl flex-row items-center">
                    <Timer color="white" />
                    <Text className="text-white ml-2">Timers</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
