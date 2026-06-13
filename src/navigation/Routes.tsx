import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import navigationStrings from '../constants/navigationStrings';
import {Cms} from '../Screens';
import {APP_LOG} from '../utils/helperFunctions';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import actions from '../redux/actions';
import {Text} from 'react-native';

const Stack = createNativeStackNavigator();

export default function Routes() {
  const {userData, isIntroFinished} = useSelector(
    (state: any) => state?.auth || {},
  );
  const linking = {
    prefixes: ['myapp://localhost'],
    config: {
      screens: {
        Home: 'home',
        changePassword: 'changePassword',
        customerSupport: 'customerSupport',
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {/* <Stack.Screen
          name={navigationStrings.CREATE_PROFILE_GUIDE}
          component={CreateProfileGuide}
        /> */}
        {!!userData ? MainStack(Stack) : AuthStack(Stack, isIntroFinished)}
        <Stack.Screen name={navigationStrings.CMS} component={Cms} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
