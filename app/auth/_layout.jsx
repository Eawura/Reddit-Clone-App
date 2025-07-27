import { Stack } from 'expo-router';
import { Text } from 'react-native';

// Disable font scaling
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="auth" 
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
