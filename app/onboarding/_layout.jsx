import { Stack } from 'expo-router';
import { Text } from 'react-native';

// Disable font scaling
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="onboarding" 
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
