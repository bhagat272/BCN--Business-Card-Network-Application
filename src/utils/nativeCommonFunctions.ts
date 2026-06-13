import {Linking, Share} from 'react-native';
import {isIos} from './helperFunctions';

export function openAppSetting(path?: string) {
  if (isIos) {
    Linking.openURL(`App-Prefs:${path}`);
  } else {
    Linking.openSettings();
  }
}

export function openURL(url = '', callBack = () => {}) {
  if (!!url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        callBack();
      }
    });
  } else {
    callBack();
  }
}

export function openMapWithLatLng(latitude: string, longitude: string) {
  const location = `${latitude},${longitude}`;

  openURL(
    isIos
      ? `maps://0,0?q=${location}`
      : `geo:0,0?q=${location}?center=${location}&q=${location}&z=16`,
  );
}

export const onShareContent = async (message: string) => {
  try {
    const result = await Share.share({
      message: message,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error: any) {}
};
