import {Platform} from 'react-native';
import {openSettings, PERMISSIONS, request} from 'react-native-permissions';
import {i18n} from '../constants/lang';
import {APP_LOG, isIos, showAlert} from './helperFunctions';
import {openAppSetting} from './nativeCommonFunctions';
const t = i18n.t;

export const checkLocationPermission = async (
  isAlert = true,
): Promise<string> => {
  try {
    const result = await request(
      isIos
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );

    if (result === 'granted') {
      return result;
    } else if (result === 'blocked') {
      if (isAlert) {
        showAlert({
          title: t('LOCATION_PERMISSION_NOT'),
          message: t(
            isIos
              ? 'YOU_CANT_NOT_USE_THIS_FEATURE'
              : 'YOU_CAN_ALLOW_PERMISSION',
          ),
          yesText: t(isIos ? 'CONTINUE' : 'CONFIRM'),
          isNoButton: !isIos,
          onYes: () =>
            isIos
              ? Promise.resolve(result)
              : openAppSetting('LOCATION_SERVICES'),
        });
      }
      throw new Error(result);
    } else {
      throw new Error(result);
    }
  } catch (error) {
    throw error;
  }
};

export const requestCameraPermission = () =>
  new Promise(async (resolve, reject) => {
    try {
      await request(isIos ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA)
        .then(res => {
          if (res == 'granted') {
            return resolve('granted');
          } else if (res === 'denied') {
            return resolve('denied');
          } else {
            showAlert({
              title: t('CAMERA_PERMISSION_NOT'),
              message: t(
                isIos
                  ? 'YOU_CANT_NOT_USE_THIS_FEATURE'
                  : 'YOU_CAN_ALLOW_PERMISSION',
              ),
              yesText: t(isIos ? 'CONTINUE' : 'CONFIRM'),
              isNoButton: !isIos,
              onYes: () => (isIos ? Promise.resolve(res) : openSettings()),
            });
            return resolve('denied');
          }
        })
        .catch(error => {
          return reject(error);
        });
    } catch (error) {
      return reject(error);
    }
  });

export const requestStoragePermission = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await request(
        isIos
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : Platform.Version >= '33'
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      )
        .then(res => {
          // APP_LOG('ressfjhbdljhgjlfghlfjd', res);
          if (res == 'granted') {
            return resolve('granted');
          } else if (res === 'denied') {
            showAlert({
              title: t('READ_EXTERNAL_PERMISSION_NOT'),
              message: t(
                isIos
                  ? 'YOU_CANT_NOT_USE_THIS_FEATURE'
                  : 'YOU_CAN_ALLOW_PERMISSION',
              ),
              yesText: t(isIos ? 'CONTINUE' : 'CONFIRM'),
              isNoButton: !isIos,
              onYes: () => (isIos ? Promise.resolve(res) : openSettings()),
            });
            return resolve('denied');
          } else if (res === 'limited') {
            return resolve('granted');
          }
        })
        .catch(error => {
          return reject(error);
        });
    } catch (error) {
      return reject(error);
    }
  });
};
