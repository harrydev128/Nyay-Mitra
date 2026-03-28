import { Alert, Platform } from 'react-native';

export const showAlert = (
  title: string,
  message: string,
  buttons?: { text: string; onPress?: () => void }[]
) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    if (buttons && buttons[0]?.onPress) {
      buttons[0].onPress();
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};
