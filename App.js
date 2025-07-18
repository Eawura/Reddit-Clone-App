import React, { useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnimatedSplash from './screens/AnimatedSplash';
import OnboardingScreen from './screens/onboarding';
import AuthScreen from './screens/authpage';
import LoginPage from './screens/loginpage';
import SignUp from './screens/signUp';
import MainTabs from "./MainTabs"
import ForgotPasswordScreen from './screens/ForgotPassword';  
import CreateAccount from './screens/CreateAccount';
import { View, StyleSheet } from 'react-native';


const Stack = createNativeStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleAnimationEnd = () => {
    setShowSplash(false); // move to real app
  };
  
  return (
     <View style={styles.container}>
      {showSplash ? (
        <AnimatedSplash onAnimationEnd={handleAnimationEnd} />
      ) : (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Auth" component={AuthScreen} options={{headerShown: false}}/>
        <Stack.Screen name= "Login" component={LoginPage} options={{headerShown:false}}/>
        <Stack.Screen name= "Signup" component={SignUp} options={{headerShown:false}}/>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
