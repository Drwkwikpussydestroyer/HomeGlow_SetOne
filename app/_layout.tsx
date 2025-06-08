import { Slot } from 'expo-router';
import '../global.css';
import { AuthProvider } from '@/context/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <Slot />
      </SafeAreaView>
    </AuthProvider>
  );
}
