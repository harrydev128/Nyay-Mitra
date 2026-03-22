import { Redirect } from 'expo-router';
import { useAppContext } from '../context/AppContext';

export default function Index() {
  const { isLoggedIn } = useAppContext();
  return <Redirect href={isLoggedIn ? '/(tabs)' : '/auth/login'} />;
}
