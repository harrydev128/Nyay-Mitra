import { Redirect } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { isLoggedIn, isLoading } = useAppContext();
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#141B3C' }}>
        <ActivityIndicator size="large" color="#E8610A" />
      </View>
    );
  }
  
  return <Redirect href={isLoggedIn ? '/(tabs)' : '/auth/login'} />;
}
