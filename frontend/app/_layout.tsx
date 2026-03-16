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
          <Stack.Screen name="rent-agreement" options={{ headerShown: false }} />
          <Stack.Screen name="salary-calculator" options={{ headerShown: false }} />
          <Stack.Screen name="govt-schemes" options={{ headerShown: false }} />
          <Stack.Screen name="rti-writer" options={{ headerShown: false }} />
          <Stack.Screen name="doc-generator" options={{ headerShown: false }} />
          <Stack.Screen name="doc-scanner" options={{ headerShown: false }} />
          <Stack.Screen name="referral" options={{ headerShown: false }} />
          <Stack.Screen name="bookmarks" options={{ headerShown: false }} />
          <Stack.Screen name="my-cases" options={{ headerShown: false }} />
          <Stack.Screen name="property-guide" options={{ headerShown: false }} />
          <Stack.Screen name="challan-checker" options={{ headerShown: false }} />
          <Stack.Screen name="court-tracker" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="success-stories" options={{ headerShown: false }} />
          <Stack.Screen name="problem-solver" options={{ headerShown: false }} />
        </Stack>
      </AppProvider>
    </ErrorBoundary>
  );
}
