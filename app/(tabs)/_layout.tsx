import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthProvider';
import ProtectedRoute from '@/components/Protected';

export default function TabLayout() {
  const { user } = useAuth(); // 👈 Trigger re-render on login

  return (
    <ProtectedRoute>
      <Tabs key={user?.uid || 'guest'} screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="order-history"
          options={{
            title: 'Orders',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="receipt-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="notifications" // <-- Changed from "settings" to "notifications"
          options={{
            title: 'Notifications', // <-- New title
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="notifications-outline" size={size} color={color} /> // <-- New icon
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
