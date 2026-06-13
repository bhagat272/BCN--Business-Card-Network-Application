import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthorizationStatus,
  getMessaging,
} from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { check, request } from 'react-native-permissions';
import { APP_LOG, DEVICE_INFO } from './helperFunctions';
import { setItem } from './utils';

export async function updateDeviceToken() {
  let token = null;
  if (Platform.OS === 'android') {
    token = await checkPermission();
  } else {
    token = await checkPermission();
  }
  return token;
}

export async function getAPNSToken() {
  try {
    let apnsToken = await getMessaging().getAPNSToken();

    let retry = 0;
    while (!apnsToken && retry < 5) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      apnsToken = await getMessaging().getAPNSToken();
      retry++;
    }

    APP_LOG('APNS Token:', apnsToken);

    if (apnsToken != null) {
      getMessaging().setAPNSToken(apnsToken);
    }
  } catch (error) {
    // APP_LOG('Error getting APNs token:', error);
  }
}
export async function getToken(): Promise<string | null> {
  let fcmToken: string | null = null;

  if (Platform.OS === 'ios') {
    if (!getMessaging().isDeviceRegisteredForRemoteMessages) {
      await getMessaging().registerDeviceForRemoteMessages();
    }
  }

  try {
    const storedToken = await AsyncStorage.getItem('fcmTokenAsync');
    fcmToken = storedToken ? JSON.parse(storedToken) : null;
  } catch (error) {
    APP_LOG('Error reading FCM token from storage:', error);
  }

  if (!fcmToken) {
    APP_LOG('fcmToken-------getting');
    try {
      // Step 2: Wait until APNS token available
      await getAPNSToken();
      fcmToken = await getMessaging().getToken();
      await setItem('fcmTokenAsync', fcmToken);
      APP_LOG('fcmToken-------getMessaging', fcmToken);
    } catch (error) {
      APP_LOG('token---error', error);
    }
  }

  if (fcmToken) {
    DEVICE_INFO.device_id = fcmToken;
  }

  APP_LOG('fcmToken-------returning', fcmToken);

  return fcmToken;
}

export function isJsonString(str: any) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export async function checkPermission() {
  return await getMessaging()
    .hasPermission()
    .then(async enabled => {
      APP_LOG('enabled-checkPermission', enabled);
      if (enabled > AuthorizationStatus.DENIED) {
        return await getToken();
      } else {
        return await requestPermission();
      }
    });
}
export async function requestPermission() {
  try {
    return getMessaging()
      .requestPermission()
      .then(async (enabled: any) => {
        if (enabled > AuthorizationStatus.DENIED) {
          return await getToken();
        }
      });
  } catch (error) {}
}
export const requestAndroidNotificationPermission = async () => {
  return new Promise(resolve => {
    check('android.permission.POST_NOTIFICATIONS')
      .then(result => {
        if (
          result === 'blocked' ||
          result === 'unavailable' ||
          result === 'denied'
        ) {
          request('android.permission.POST_NOTIFICATIONS')
            .then(() => {
              resolve(true);
            })
            .catch(() => {
              resolve(false);
            });
        } else {
          resolve(true);
        }
      })
      .catch(() => {
        resolve(false);
      });
  });
};
