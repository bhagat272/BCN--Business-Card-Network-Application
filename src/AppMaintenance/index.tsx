import React, { useEffect } from 'react';
import { AppState, Dimensions, Image, Text, View } from 'react-native';
import { useAppVersionGuard } from './useAppVersionGuard';
import { Platform } from 'react-native';
import { firebaseRemoteConfigData } from '../config/firebaseRemoteConfigData';
import imagePath from '../constants/imagePath';

const AppMaintenanceDialog: React.FC = () => {
  const { showMaintenance, checkVersion } = useAppVersionGuard();

  useEffect(() => {
    checkVersion();

    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        checkVersion();
      }
    });

    return () => sub.remove();
  }, []);

  if (!showMaintenance) return null;

  const textConfig =
    Platform.OS === 'android'
      ? firebaseRemoteConfigData?.android_version
      : firebaseRemoteConfigData?.ios_version;

  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 10,
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <Image
        source={imagePath.appIcon}
        resizeMode="contain"
        style={{
          width: Dimensions.get('window').width - 50,
          height: Dimensions.get('window').width - 50,
        }}
      />
      <Text
        allowFontScaling={false}
        style={{ fontSize: 18, textAlign: 'center' }}
      >
        {textConfig?.maintenance_h1}
      </Text>
      <Text
        allowFontScaling={false}
        style={{ fontSize: 15, color: 'grey', textAlign: 'center' }}
      >
        {textConfig?.maintenance_h2}
      </Text>
    </View>
  );
};

export default React.memo(AppMaintenanceDialog);
