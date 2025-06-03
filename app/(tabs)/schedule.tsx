import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Dimensions } from 'react-native';
import { Home, Clock, LineChart, Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const wakeUpTimes = [
  { id: 1, time: '5:00 AM', light: 'Light #1', isOn: true },
  { id: 2, time: '6:00 AM', light: 'Light #2', isOn: false },
  { id: 3, time: '7:36 AM', light: 'Light #3', isOn: true },
];

const goToSleepTimes = [
  { id: 1, time: '9:00 PM', light: 'Light #1', isOn: true },
  { id: 2, time: '10:00 PM', light: 'Light #2', isOn: false },
];

const timerTimes = [
  { id: 1, time: '30 mins', light: 'Light #1', isOn: true },
  { id: 2, time: '1 hr', light: 'Light #2', isOn: false },
];

export default function ScheduleScreen() {
  const router = useRouter();
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [wakeUpSchedule, setWakeUpSchedule] = useState(wakeUpTimes);
  const [goToSleepSchedule, setGoToSleepSchedule] = useState(goToSleepTimes);
  const [timerSchedule, setTimerSchedule] = useState(timerTimes);

  const schedules = ['Wake Up', 'Go to Sleep', 'Timer'];

  const toggleSwitch = (id: number, scheduleType: string) => {
    const updater = (prev: any[]) =>
      prev.map((item) => (item.id === id ? { ...item, isOn: !item.isOn } : item));

    if (scheduleType === 'Wake Up') {
      setWakeUpSchedule(updater);
    } else if (scheduleType === 'Go to Sleep') {
      setGoToSleepSchedule(updater);
    } else {
      setTimerSchedule(updater);
    }
  };

  const renderScheduleContent = (scheduleType: string) => {
    const currentData =
      scheduleType === 'Wake Up'
        ? wakeUpSchedule
        : scheduleType === 'Go to Sleep'
          ? goToSleepSchedule
          : timerSchedule;

    return currentData.map(({ id, time, light, isOn }) => (
      <View
        key={id}
        className="flex-row items-center justify-between border-b border-gray-700 py-4"
      >
        <View>
          <Text className={`text-white text-2xl font-semibold ${!isOn ? 'opacity-50' : ''}`}>
            {time}
          </Text>
          <Text className="text-gray-400">{light}</Text>
        </View>
        <Switch
          value={isOn}
          onValueChange={() => toggleSwitch(id, scheduleType)}
          trackColor={{ false: '#666', true: '#0af' }}
          thumbColor={isOn ? '#fff' : '#ccc'}
        />
      </View>
    ));
  };

  const getOrderedSchedules = () => {
    if (!selectedSchedule) return schedules;
    const index = schedules.indexOf(selectedSchedule);
    return [...schedules.slice(0, index), selectedSchedule, ...schedules.slice(index + 1)];
  };

  return (
    <View className="flex-1 bg-black relative">
      {/* Header */}
      <View className="bg-[#2a2b33] py-6 items-center">
        <Text className="text-white text-3xl font-extrabold">Schedules</Text>
      </View>

      {/* Schedule Buttons and Expanding Content */}
      <ScrollView className="mt-2 px-4 mb-24">
        {getOrderedSchedules().map((schedule) => (
          <View key={schedule} className="mb-2">
            <TouchableOpacity
              onPress={() => setSelectedSchedule((prev) => (prev === schedule ? null : schedule))}
              className={`rounded-xl py-7 px-4 ${
                selectedSchedule === schedule ? 'bg-[#333]' : 'bg-[#2a2b33]'
              }`}
            >
              <Text className="text-white text-lg font-extrabold">{schedule}</Text>
            </TouchableOpacity>

            {selectedSchedule === schedule && (
              <View className="mt-2 bg-[#121212] px-2 pb-4 rounded-lg">
                {renderScheduleContent(schedule)}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 flex-row justify-around w-full bg-[#121212] py-3 border-t border-gray-700">
        <TouchableOpacity onPress={() => router.push('/home')} className="items-center">
          <Home color="white" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/schedule')} className="items-center">
          <Clock color="white" size={24} />
          <View className="h-1 w-6 bg-white mt-1 rounded-full" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/analytics')} className="items-center">
          <LineChart color="white" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/settings')} className="items-center">
          <Settings color="white" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
