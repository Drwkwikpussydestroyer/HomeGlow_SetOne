import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import {
  fetchLightSchedule,
  updateLightSchedule,
} from '@/api/schedule';
import {
  getLightTimeout,
  setLightTimeout,
  getAutoTimeoutStatus,
  toggleAutoTimeout,
} from '@/api/timerApi';
import { getLightList } from '@/api/lightIdList';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

export default function ScheduleScreen() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [wakeUpTime, setWakeUpTime] = useState<string | null>(null);
  const [sleepTime, setSleepTime] = useState<string | null>(null);
  const [timerTimeout, setTimerTimeout] = useState<number | null>(null);
  const [autoTimeoutEnabled, setAutoTimeoutEnabled] = useState<boolean>(true);

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimerType, setSelectedTimerType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [pendingWakeUpTime, setPendingWakeUpTime] = useState<string | null>(null);
  const [pendingSleepTime, setPendingSleepTime] = useState<string | null>(null);
  const [wakeUpLightId, setWakeUpLightId] = useState<string | null>(null);
  const [sleepLightId, setSleepLightId] = useState<string | null>(null);

  const [lightOptions, setLightOptions] = useState<string[]>([]);

  // Patch: add selectedHours / Minutes / Seconds state:
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [selectedSeconds, setSelectedSeconds] = useState(0);

  const schedules = ['Wake Up', 'Go to Sleep', 'Timer'];

  useEffect(() => {
    async function fetchData() {
      if (!user?.email || !token) return;

      try {
        const scheduleData = await fetchLightSchedule(token);
        const schedule = scheduleData?.schedule || {};
        setWakeUpTime(schedule?.wake_up || null);
        setSleepTime(schedule?.sleep || null);
        setWakeUpLightId(schedule?.wake_up_light_id || null);
        setSleepLightId(schedule?.sleep_light_id || null);

        try {
          console.log(`(DEBUG) About to fetch light list with token=${token?.slice(0, 10)}...`);

          const lights = await getLightList(token);

          console.log(`(DEBUG) Fetched lights:`, lights);

          setLightOptions(lights);
        } catch (err) {
          console.error('(DEBUG) Error fetching lights:', err);
        }

        // PATCHED TIMER CALLS BELOW:
        const timeoutData = await getLightTimeout(token);
        setTimerTimeout(timeoutData?.timeout?.total_seconds || null);

        const autoTimeoutData = await getAutoTimeoutStatus(token);
        setAutoTimeoutEnabled(autoTimeoutData?.auto_timeout_enabled ?? true);
      } catch (err) {
        console.error('❌ Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user?.email, token]);

  const handleSchedulePress = (type: string) => {
    setSelectedTimerType(type);
    setShowTimePicker(true);
  };

  const onTimeConfirm = (selectedDate: Date) => {
    setShowTimePicker(false);

    const formattedTime = `${selectedDate.getHours().toString().padStart(2, '0')}:${selectedDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    if (selectedTimerType === 'Wake Up') {
      setPendingWakeUpTime(formattedTime);
    } else if (selectedTimerType === 'Go to Sleep') {
      setPendingSleepTime(formattedTime);
    }

    setSelectedTimerType(null);
  };

  const saveSchedule = async (type: 'Wake Up' | 'Go to Sleep') => {
    if (!token) return;

    try {
      if (type === 'Wake Up' && pendingWakeUpTime && wakeUpLightId) {
        await updateLightSchedule(
          {
            wake_up: pendingWakeUpTime,
            wake_up_light_id: wakeUpLightId,
          },
          token
        );
        console.log('✅ Wake Up schedule saved!');
        setWakeUpTime(pendingWakeUpTime);
        setPendingWakeUpTime(null);
      } else if (type === 'Go to Sleep' && pendingSleepTime && sleepLightId) {
        await updateLightSchedule(
          {
            sleep: pendingSleepTime,
            sleep_light_id: sleepLightId,
          },
          token
        );
        console.log('✅ Sleep schedule saved!');
        setSleepTime(pendingSleepTime);
        setPendingSleepTime(null);
      } else {
        console.warn('Please select both time and light ID.');
      }
    } catch (err) {
      console.error('❌ Failed to save schedule:', err);
    }
  };

  const renderScheduleContent = (scheduleType: string) => {
    if (scheduleType === 'Wake Up') {
      return (
        <View className="py-4 space-y-2">
          <TouchableOpacity onPress={() => handleSchedulePress('Wake Up')}>
            <Text className="text-white text-2xl font-semibold">
              {pendingWakeUpTime || wakeUpTime || 'Not set'}
            </Text>
            <Text className="text-gray-400">Wake Up Time</Text>
          </TouchableOpacity>

          <Picker
            selectedValue={wakeUpLightId ?? ''}
            onValueChange={(itemValue) => setWakeUpLightId(itemValue)}
            style={{ color: 'white', backgroundColor: '#222' }}
          >
            <Picker.Item label="Select Light ID" value="" />
            {lightOptions.map((lightId) => (
              <Picker.Item key={lightId} label={lightId} value={lightId} />
            ))}
          </Picker>

          <TouchableOpacity
            className="bg-blue-500 p-3 rounded mt-2 items-center"
            onPress={() => saveSchedule('Wake Up')}
          >
            <Text className="text-white font-bold">Save Schedule</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (scheduleType === 'Go to Sleep') {
      return (
        <View className="py-4 space-y-2">
          <TouchableOpacity onPress={() => handleSchedulePress('Go to Sleep')}>
            <Text className="text-white text-2xl font-semibold">
              {pendingSleepTime || sleepTime || 'Not set'}
            </Text>
            <Text className="text-gray-400">Sleep Time</Text>
          </TouchableOpacity>

          <Picker
            selectedValue={sleepLightId ?? ''}
            onValueChange={(itemValue) => setSleepLightId(itemValue)}
            style={{ color: 'white', backgroundColor: '#222' }}
          >
            <Picker.Item label="Select Light ID" value="" />
            {lightOptions.map((lightId) => (
              <Picker.Item key={lightId} label={lightId} value={lightId} />
            ))}
          </Picker>

          <TouchableOpacity
            className="bg-blue-500 p-3 rounded mt-2 items-center"
            onPress={() => saveSchedule('Go to Sleep')}
          >
            <Text className="text-white font-bold">Save Schedule</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (scheduleType === 'Timer') {
      const saveTimerTimeout = async () => {
        const totalSeconds = selectedHours * 3600 + selectedMinutes * 60 + selectedSeconds;

        if (totalSeconds === 0) {
          console.warn('⚠️ Timer duration is 0 — not sending request.');
          return;
        }

        console.log('Sending to /timer:', { selectedHours, selectedMinutes, selectedSeconds });

        try {
          await setLightTimeout(selectedHours, selectedMinutes, selectedSeconds, token ?? undefined);
          console.log('✅ Timer timeout set!');
          setTimerTimeout(totalSeconds);
        } catch (err) {
          console.error('❌ Failed to set timer timeout:', err);
        }
      };

      return (
        <View className="py-4">

          {/* Compact header */}
          <TouchableOpacity
            onPress={() => setSelectedSchedule((prev) => (prev === 'Timer' ? null : 'Timer'))}
            className="flex-row justify-between items-center mb-2"
          >
            <View>
              <Text className="text-white text-2xl font-semibold">
                {timerTimeout !== null
                  ? timerTimeout >= 3600
                    ? `${Math.floor(timerTimeout / 3600)} hr`
                    : `${Math.floor(timerTimeout / 60)} min`
                  : 'Not set'}
              </Text>
              <Text className="text-gray-400">Light Timeout</Text>
            </View>

            <Switch
              value={autoTimeoutEnabled}
              onValueChange={async () => {
                try {
                  const newValue = !autoTimeoutEnabled;
                  await toggleAutoTimeout(newValue, token ?? undefined);

                  const updatedStatus = await getAutoTimeoutStatus(token ?? undefined);
                  setAutoTimeoutEnabled(updatedStatus?.auto_timeout_enabled ?? newValue);

                  console.log('✅ Auto-timeout toggled:', updatedStatus?.auto_timeout_enabled);
                } catch (err) {
                  console.error('❌ Failed to toggle auto-timeout:', err);
                }
              }}
              trackColor={{ false: '#666', true: '#0af' }}
              thumbColor={autoTimeoutEnabled ? '#fff' : '#ccc'}
            />
          </TouchableOpacity>

          {/* Expanded dropdowns */}
          {selectedSchedule === 'Timer' && (
            <View className="mt-4 bg-[#121212] px-2 py-4 rounded-lg space-y-2">

              <Text className="text-white text-xl font-semibold mb-2">Set Timeout Duration</Text>

              <View className="flex-row justify-between">

                {/* Hours */}
                <View style={{ flex: 1, marginRight: 5 }}>
                  <Text className="text-gray-400 mb-1">Hours</Text>
                  <Picker
                    selectedValue={selectedHours}
                    onValueChange={(itemValue) => setSelectedHours(itemValue)}
                    style={{ color: 'white', backgroundColor: '#222' }}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <Picker.Item key={i} label={`${i}`} value={i} />
                    ))}
                  </Picker>
                </View>

                {/* Minutes */}
                <View style={{ flex: 1, marginRight: 5 }}>
                  <Text className="text-gray-400 mb-1">Minutes</Text>
                  <Picker
                    selectedValue={selectedMinutes}
                    onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
                    style={{ color: 'white', backgroundColor: '#222' }}
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <Picker.Item key={i} label={`${i}`} value={i} />
                    ))}
                  </Picker>
                </View>

                {/* Seconds */}
                <View style={{ flex: 1 }}>
                  <Text className="text-gray-400 mb-1">Seconds</Text>
                  <Picker
                    selectedValue={selectedSeconds}
                    onValueChange={(itemValue) => setSelectedSeconds(itemValue)}
                    style={{ color: 'white', backgroundColor: '#222' }}
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <Picker.Item key={i} label={`${i}`} value={i} />
                    ))}
                  </Picker>
                </View>

              </View>

              {/* Save Button */}
              <TouchableOpacity
                className="bg-blue-500 p-3 rounded mt-4 items-center"
                onPress={saveTimerTimeout}
              >
                <Text className="text-white font-bold">Save Timer</Text>
              </TouchableOpacity>

            </View>
          )}

        </View>
      );
    }

    return null;
  };

  const getOrderedSchedules = () => {
    if (!selectedSchedule) return schedules;
    const index = schedules.indexOf(selectedSchedule);
    return [...schedules.slice(0, index), selectedSchedule, ...schedules.slice(index + 1)];
  };

  return (
    <View className="flex-1 bg-black relative">
      <View className="bg-[#2a2b33] py-6 items-center">
        <Text className="text-white text-3xl font-extrabold">Schedules</Text>
      </View>

      {loading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0af" />
        </View>
      )}

      {!loading && (
        <ScrollView className="mt-2 px-4 mb-24">
          {getOrderedSchedules().map((schedule) => (
            <View key={schedule} className="mb-2">
              <TouchableOpacity
                onPress={() =>
                  setSelectedSchedule((prev) => (prev === schedule ? null : schedule))
                }
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
      )}

      <DateTimePickerModal
        isVisible={showTimePicker}
        mode="time"
        onConfirm={onTimeConfirm}
        onCancel={() => setShowTimePicker(false)}
      />
    </View>
  );
}
