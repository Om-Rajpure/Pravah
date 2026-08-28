import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { TabNavigator } from './TabNavigator';

import { AlertDetailScreen } from '../screens/secondary/AlertDetailScreen';
import { HospitalityScreen } from '../screens/secondary/HospitalityScreen';
import { MobilityScreen } from '../screens/secondary/MobilityScreen';
import { WelfareScreen } from '../screens/secondary/WelfareScreen';
import { PredictionsScreen } from '../screens/secondary/PredictionsScreen';
import { RecommendationsScreen } from '../screens/secondary/RecommendationsScreen';
import { ScenariosScreen } from '../screens/secondary/ScenariosScreen';
import { GlassBoxScreen } from '../screens/secondary/GlassBoxScreen';
import { VisitorExperienceScreen } from '../screens/secondary/VisitorExperienceScreen';
import { SettingsScreen } from '../screens/secondary/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {/* Authentication Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Main 5-Tab Application */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />

        {/* Secondary Modules */}
        <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />
        <Stack.Screen name="Hospitality" component={HospitalityScreen} />
        <Stack.Screen name="Mobility" component={MobilityScreen} />
        <Stack.Screen name="Welfare" component={WelfareScreen} />
        <Stack.Screen name="Predictions" component={PredictionsScreen} />
        <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
        <Stack.Screen name="Scenarios" component={ScenariosScreen} />
        <Stack.Screen name="GlassBox" component={GlassBoxScreen} />
        <Stack.Screen name="VisitorExperience" component={VisitorExperienceScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
