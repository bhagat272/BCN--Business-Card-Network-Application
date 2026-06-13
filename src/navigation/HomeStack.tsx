import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import navigationStrings from '../constants/navigationStrings';
import {Home} from '../Screens';
 
const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={navigationStrings.HOME} component={Home} />
 
    </Stack.Navigator>
  );
}
