import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import BottomTabCustom from '../Components/BottomTabCustom';
import imagePath from '../constants/imagePath';
import {useTranslate} from '../constants/lang';
import navigationStrings from '../constants/navigationStrings';
import colors from '../styles/colors';
import {moderateScale, moderateScaleVertical} from '../styles/responsiveSize';
import {Home, ScanDocs, Settings} from '../Screens';
const Tab = createBottomTabNavigator();

export default function BottomTabs({navigation}: any) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      backBehavior="initialRoute"
      initialRouteName={navigationStrings.HOME}
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <BottomTabCustom {...props} />}>
      {/* Home Tab */}
      <Tab.Screen
        name={navigationStrings.HOME}
        component={Home}
        options={{
          tabBarLabel: useTranslate('Contacts'),
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: focused => (
            <Image
              style={!focused && styles.tabIcon}
              source={
                focused
                  ? imagePath.active_contacts
                  : imagePath.inactive_contacts
              }
            />
          ),
        }}
      />

      {/* Floating Scan Button */}
      <Tab.Screen
        name={navigationStrings.SCAN_DOCS}
        component={ScanDocs}
        options={{
          tabBarLabel: '',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: () => (
            <TouchableOpacity
              style={styles.floatingButtonContainer}
              onPress={() => navigation.navigate(navigationStrings.SCAN_DOCS)}>
              <View style={styles.floatingButton}>
                <Image
                  source={imagePath.card_scan}
                  style={styles.scanIcon}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      {/* Settings Tab */}
      <Tab.Screen
        name={navigationStrings.SETTINGS}
        component={Settings}
        options={{
          tabBarLabel: useTranslate('PROFILE'),
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: focused => (
            <Image
              source={imagePath.profile_icon}
              style={!focused && styles.tabIcon}
              tintColor={focused ? colors.white : colors.unSelectColor}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignSelf: 'center',
    height: moderateScale(24),
    width: moderateScale(24),
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: moderateScaleVertical(48),
    zIndex: 10,
  },
  floatingButton: {
    borderWidth: moderateScale(4),
    borderRadius: moderateScale(36),
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIcon: {
    maxHeight: moderateScaleVertical(64),
  },
});
