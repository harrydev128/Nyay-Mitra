import { Stack } from 'expo-router';
import { AppProvider } from '../context/AppContext';
import ErrorBoundary from '../components/ErrorBoundary';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 200,
          }}
        >
          <Stack.Screen name="emergency" options={{ headerShown: false }} />
        </Stack>
      </AppProvider>
    </ErrorBoundary>
  );
}
