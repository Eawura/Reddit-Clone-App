// Utility to get auth token from AsyncStorage (React Native)
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getAuthToken() {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (e) {
    return null;
  }
}
