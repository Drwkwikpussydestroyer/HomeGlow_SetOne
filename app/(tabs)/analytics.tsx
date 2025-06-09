import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LineChart as EnergyLineChart } from 'react-native-chart-kit';
import { useAuth } from '@/context/AuthProvider';
import { getLightEnergy } from '@/api/energy';

const { width } = Dimensions.get('window');
const chartWidth = width - 32;

export default function HomeScreen() {
  const router = useRouter();
  const { token, user } = useAuth();

  const [energyData, setEnergyData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [averagePerHour, setAveragePerHour] = useState<number | null>(null); // new state for average

  const formatTimestampToHour = (timestamp: any): string => {
    let dateObj;
    if (timestamp?.seconds) {
      dateObj = new Date(timestamp.seconds * 1000);
    } else {
      dateObj = new Date(timestamp);
    }

    const hours = dateObj.getHours().toString().padStart(2, '0');
    return `${hours}:00`;
  };

  useEffect(() => {
    async function fetchEnergy() {
      if (!user?.email) return;

      setLoading(true);
      setError(null);

      try {
        console.log('📡 Fetching energy data for', user.email);
        const response = await getLightEnergy(user.email ?? '', token ?? undefined);

        console.log('API response:', response);

        const readings = Array.isArray(response.energy_readings) ? response.energy_readings : [];
        // Its for 24 hours
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const recentReadings = readings.filter((reading: any) => {
          const readingTime = reading.timestamp?.seconds
            ? new Date(reading.timestamp.seconds * 1000)
            : new Date(reading.timestamp);

          return readingTime >= oneDayAgo && readingTime <= now;
        });

        console.log(`✅ Found ${recentReadings.length} readings from last 24 hours.`);
        const grouped: { [key: string]: any[] } = {};
        recentReadings.forEach((reading: any) => {
          const lightId = reading.light_id;
          if (!grouped[lightId]) grouped[lightId] = [];
          grouped[lightId].push(reading);
        });

        const fullHourLabels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

        const colors = ['#0af', '#f06', '#ff0', '#0f0', '#f90', '#09f'];

        const datasets = Object.entries(grouped).map(([lightId, lightReadings], index) => {
          const energyMap: { [key: string]: number } = {};
          lightReadings.forEach((reading: any) => {
            const hourLabel = formatTimestampToHour(reading.timestamp);
            energyMap[hourLabel] = (energyMap[hourLabel] ?? 0) + (Number(reading.energy_wh) || 0);
          });
          const data = fullHourLabels.map((label) => energyMap[label] ?? 0);

          return {
            data,
            color: (opacity = 1) => colors[index % colors.length],
            strokeWidth: 2,
            label: lightId,
          };
        });

        const chartData = {
          labels: fullHourLabels,
          datasets,
          legend: Object.keys(grouped),
        };

        console.log('Chart labels:', fullHourLabels);
        console.log('Chart datasets:', datasets);

        if (recentReadings.length === 0) {
          console.log('No energy readings in last 24h. Using fallback chart.');
          setEnergyData({
            labels: fullHourLabels,
            datasets: [
              {
                data: fullHourLabels.map(() => 0),
              },
            ],
          });
          setAveragePerHour(0); // fallback case
        } else {
          setEnergyData(chartData);

          // New: calculate average per hour
          const allValues = datasets.flatMap(ds => ds.data);
          const totalEnergy = allValues.reduce((sum, val) => sum + val, 0);
          const avgEnergy = totalEnergy / fullHourLabels.length;
          setAveragePerHour(avgEnergy);
        }
      } catch (err: any) {
        console.error('Failed to fetch energy data:', err);
        setError(err?.message || 'Failed to fetch energy data.');
      } finally {
        setLoading(false);
      }
    }

    fetchEnergy();
  }, [user?.email, token]);

  return (
    <View className="flex-1 bg-[#121212]">
      {/* Background Shapes */}
      <View
        style={{
          position: "absolute",
          bottom: 100,
          right: -30,
          width: 120,
          height: 160,
          backgroundColor: "#ef476f",
          borderTopLeftRadius: 80,
          borderBottomRightRadius: 50,
          transform: [{ rotate: "15deg" }],
          opacity: 0.13,
          zIndex: 0,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 170,
          right: 100,
          width: 90,
          height: 90,
          backgroundColor: "#118ab2",
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 40,
          transform: [{ rotate: "-20deg" }],
          opacity: 0.18,
          zIndex: 0,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 60,
          left: 130,
          width: 120,
          height: 70,
          backgroundColor: "#8338ec",
          borderBottomRightRadius: 100,
          borderTopLeftRadius: 20,
          transform: [{ rotate: "30deg" }],
          opacity: 0.16,
          zIndex: 0,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 200,
          right: 30,
          width: 100,
          height: 220,
          backgroundColor: "#20a39e",
          borderTopLeftRadius: 120,
          borderBottomRightRadius: 100,
          transform: [{ rotate: "-10deg" }],
          opacity: 0.2,
          zIndex: 0,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 250,
          left: -30,
          width: 160,
          height: 120,
          backgroundColor: "#efc7b7",
          borderBottomLeftRadius: 100,
          borderTopRightRadius: 80,
          transform: [{ rotate: "25deg" }],
          opacity: 0.15,
          zIndex: 0,
        }}
      />
      {/* Header */}
      <View className="bg-[#2a2b33] py-6 px-4 items-center justify-center">
        <Text className="text-white text-5xl font-bold">Analytics</Text>
      </View>

      {/* Energy Chart */}
      <ScrollView className="px-4 mt-4">
        <Text className="text-white text-xl font-bold mb-2">Energy Usage (Watts per Hour)</Text>

        {loading && <ActivityIndicator size="large" color="#0af" className="mt-4" />}

        {error && <Text className="text-red-400 mt-4">{error}</Text>}

        {!loading && !error && energyData && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <EnergyLineChart
              data={energyData}
              width={chartWidth * 2} // doubled width for horizontal scroll
              height={300}
              chartConfig={{
                backgroundGradientFrom: '#1E2923',
                backgroundGradientTo: '#08130D',
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                strokeWidth: 2,
                decimalPlaces: 2,
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#0af',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </ScrollView>
        )}

        {/* Average per hour in a nice box */}
        {!loading && !error && averagePerHour !== null && (
          <View
            style={{
              backgroundColor: '#0a1a40', // dark blue
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 12,
              marginTop: 16,
              alignSelf: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
              Average Energy per Hour
            </Text>
            <Text
              style={{
                color: '#4fc3f7',
                fontSize: 28,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 4,
              }}
            >
              {averagePerHour.toFixed(2)} Watts
            </Text>
          </View>
        )}

        {!loading && !error && !energyData && (
          <Text className="text-gray-400">No energy data available.</Text>
        )}
      </ScrollView>
    </View>
  );
}

