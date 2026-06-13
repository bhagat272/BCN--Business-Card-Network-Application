import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {getMessaging} from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import {Platform} from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';
import colors from '../styles/colors';
import {APP_LOG} from './helperFunctions';
const PushNotificationConfig = (props: any) => {
  useEffect(() => {
    const unsubscribe = getMessaging().onMessage(async remoteMessage => {
      APP_LOG('getMessaging().onMessage', remoteMessage);
      if (Platform.OS === 'ios') {
        // :white_check_mark: Display iOS notification manually
        PushNotificationIOS.addNotificationRequest({
          id: String(remoteMessage?.messageId),
          title: remoteMessage?.notification?.title,
          body: remoteMessage?.notification?.body,
          userInfo: remoteMessage?.data,
        });
      } else {
        // :white_check_mark: Create Notification Channel for Android
        PushNotification.createChannel(
          {
            channelId: 'channel-id',
            channelName: 'My Channel',
            channelDescription: 'A channel to categorize your notifications',
            playSound: true,
            soundName: 'default',
            importance: Importance.HIGH,
            vibrate: true,
          },
          created => {},
        );

        // :white_check_mark: Show Android notification
        PushNotification.localNotification({
          channelId: 'channel-id',
          smallIcon: 'notify_top',
          color: colors.themeColor,
          message: String(remoteMessage?.notification?.body),
          title: remoteMessage?.notification?.title,
          userInfo: remoteMessage?.data,
        });
      }
    });

    return unsubscribe;
  }, []);

  // :white_check_mark: PushNotification Configuration
  PushNotification.configure({
    onNotification: notification => {
      if (notification) {
        props?.onPress(notification);
      }
    },
    requestPermissions: true,
  });

  return null;
};

export default PushNotificationConfig;
