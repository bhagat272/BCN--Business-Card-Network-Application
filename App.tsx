import React, { useEffect } from 'react';
import {
  DeviceEventEmitter,
  Linking,
  LogBox,
  StatusBar,
  Text,
  TextInput,
} from 'react-native';
// import RNBootSplash from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import Routes from './src/navigation/Routes';
import {
  saveIntroScreenStatus,
  saveRememberedData,
  saveUserData,
} from './src/redux/reducers/auth';
import { saveOtpAttempts } from './src/redux/reducers/settings';
import store from './src/redux/store';
import colors from './src/styles/colors';
import { APP_LOG, DEVICE_INFO, isIos } from './src/utils/helperFunctions';
import {
  requestAndroidNotificationPermission,
  updateDeviceToken,
} from './src/utils/notification';
import { toastConfig } from './src/utils/toastConfig';
import { getItem } from './src/utils/utils';
import AppMaintenance from './src/AppMaintenance';
import SplashScreen from 'react-native-splash-screen';

const { dispatch } = store;
// LogBox.ignoreAllLogs();
function App(): React.JSX.Element {
  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    disableFontScaling();
    initApp();
    const timer = setTimeout(() => {
      // RNBootSplash.hide({fade: true});
      SplashScreen.hide();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  const generateToken = async () => {
    if (!isIos) {
      await requestAndroidNotificationPermission();
    }
    let token = await updateDeviceToken();

    if (token) {
      DEVICE_INFO.device_id = token;
    }
  };

  const disableFontScaling = () => {
    // Disable font scaling for Text components
    if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
    (Text as any).defaultProps.allowFontScaling = false;

    // Disable font scaling for TextInput components
    if ((TextInput as any).defaultProps == null)
      (TextInput as any).defaultProps = {};
    (TextInput as any).defaultProps.allowFontScaling = false;
  };

  const initApp = async () => {
    generateToken();
    getUserSession();
  };

  const getUserSession = async () => {
    const isIntroFinished = await getItem('isIntroFinished');
    if (isIntroFinished) {
      dispatch(saveIntroScreenStatus(isIntroFinished));
    }
    const userData = await getItem('userData');

    if (userData) {
      dispatch(saveUserData(userData));
    }
    const rememberedData = await getItem('rememberedData');

    if (rememberedData) {
      dispatch(saveRememberedData(rememberedData));
    }
    const otpAttemptData = await getItem('otpAttemptData');

    if (otpAttemptData) {
      dispatch(saveOtpAttempts(otpAttemptData));
    }
  };
  const handleDeepLink = (url: string | null) => {
    if (url) {
      const parts = url.split('/');

      let uuid = parts[parts.length - 1];
      let type = parts[parts.length - 2];

      // APP_LOG('handleDeepLink', {
      //   url,
      //   uuid,
      //   type,
      // });
      DeviceEventEmitter.emit(type, uuid);
    }
  };
  useEffect(() => {
    Linking.getInitialURL()
      .then(initialUrl => {
        handleDeepLink(initialUrl);
      })
      .catch(err => {});

    const deepLinkListener = Linking.addEventListener('url', event => {
      handleDeepLink(event?.url);
    });

    return () => {
      deepLinkListener.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.appWhite} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <KeyboardProvider>
            <Routes />
            <AppMaintenance />
          </KeyboardProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>

      <Toast position="top" topOffset={isIos ? 46 : 20} config={toastConfig} />
    </Provider>
  );
}

export default App;
