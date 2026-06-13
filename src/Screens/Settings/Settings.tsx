import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Image, SectionList, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import FastImageLoad from '../../Components/FastImageLoad';
import Header from '../../Components/Header';
import Logout from '../../Components/Logout';
import NativeLoader from '../../Components/NativeLoader';
import Spacer from '../../Components/Spacer';
import { getCompleteImageUrl } from '../../config/urls';
import imagePath from '../../constants/imagePath';
import { useTranslate } from '../../constants/lang';
import navigationStrings from '../../constants/navigationStrings';
import actions from '../../redux/actions';
import { removeUserSession } from '../../redux/actions/auth';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {
  APP_LOG,
  DEVICE_INFO,
  errorMethod,
  showSuccess,
} from '../../utils/helperFunctions';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MenuItemData {
  id: string;
  iconImage: any;
  text: string;
  onPress: () => void;
}

const HIT_SLOP = {
  top: 5,
  bottom: 5,
  left: 5,
  right: 5,
};

const tooltipContent = {
  NOTIFICATIONS_SETTINGS: 'Turn app notifications on or off.',
  // PRIVACY_SETTINGS: `Hide or show your email and phone number to other users:
  // * On = Details hidden
  // * Off = Details visible`,
  PRIVACY_SETTINGS: `Hide or show your email and phone number to your connections:
  
ON = Details hidden
OFF = Details visible`,
};

const Settings = (props: any) => {
  const { navigation } = props;
  const { userData } = useSelector((state: any) => state?.auth || {});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLogoutModal, setIsLogoutModal] = useState(false);
  const [isLoadingLogout, setLoadingLogout] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const getUserProfileApi = () => {
    actions.getUserData({});
  };

  useFocusEffect(
    useCallback(() => {
      getUserProfileApi();

      return () => {
        setShowTooltip(null);
      };
    }, []),
  );

  const menuItems = [
    {
      section: useTranslate('ACCOUNT'),
      data: [
        {
          id: 'SHARED_CONTACTS',
          iconImage: imagePath.shared_contacts_icon,
          text: useTranslate('SHARED_CONTACTS'),
          onPress: () => {
            setShowTooltip(null);
            navigation.navigate(navigationStrings.SHARED_CONTACTS);
          },
        },
        {
          id: 'YOUR_CONNECTIONS',
          iconImage: imagePath.connection_icon,
          text: useTranslate('YOUR_CONNECTIONS'),
          onPress: () => {
            setShowTooltip(null);
            navigation.navigate(navigationStrings.YOUR_CONNECTIONS);
          },
        },
        {
          id: 'CHANGE_PASSWORD',
          iconImage: imagePath.change_password_icon,
          text: useTranslate('CHANGE_PASSWORD'),
          onPress: () => {
            setShowTooltip(null);
            navigation.navigate(navigationStrings.CHANGE_PASSWORD);
          },
        },
        {
          id: 'SUBSCRIPTION_PLAN',
          iconImage: imagePath.subscription_icon,
          text: useTranslate('SUBSCRIPTION_PLAN'),
          onPress: () => {
            setShowTooltip(null);
            navigation.navigate(navigationStrings.SUBSCRIPTION_PLANS);
          },
        },

        {
          id: 'NOTIFICATIONS_SETTINGS',
          iconImage: imagePath.notification_icon,
          text: useTranslate('NOTIFICATIONS_SETTINGS'),
          onPress: () => {
            onPressNotificationSetting();
          },
        },
        {
          id: 'PRIVACY_SETTINGS',
          iconImage: imagePath.change_password_icon,
          text: useTranslate('PRIVACY_SETTINGS'),
          onPress: () => {
            onPressPrivacySetting();
          },
        },
      ],
    },
    {
      section: useTranslate('SETTINGS'),
      data: [
        {
          id: 'INVITE_A_FRIEND',
          iconImage: imagePath.invite_icon,
          text: useTranslate('INVITE_A_FRIEND'),
          onPress: () => {
            setShowTooltip(null);
            navigation.navigate(navigationStrings.INVITE_FRIEND);
          },
        },
        {
          id: 'CUSTOMER_SUPPORT',
          iconImage: imagePath.customer_support_icon,
          text: useTranslate('CUSTOMER_SUPPORT'),
          onPress: () => {
            setShowTooltip(null);
            navigation.navigate(navigationStrings.CUSTOMER_SUPPORT);
          },
        },
        {
          id: 'FAQS',
          iconImage: imagePath.faqsIcon,
          text: useTranslate('FAQS'),
          onPress: () => {
            setShowTooltip(null);
            navigation.navigate(navigationStrings.FAQS);
          },
        },
        {
          id: 'ABOUT_US',
          iconImage: imagePath.about_icon,
          text: useTranslate('ABOUT_US'),
          onPress: () => {
            setShowTooltip(null);
            navigation.navigate(navigationStrings.CMS, {
              title: useTranslate('ABOUT_US'),
            });
          },
        },

        {
          id: 'TERMS_&_CONDITIONS',
          iconImage: imagePath.termsConditionIcon,
          text: useTranslate('TERMS_&_CONDITIONS'),
          onPress: () => {
            setShowTooltip(null);
            navigation.navigate(navigationStrings.CMS, {
              title: useTranslate('TERMS_&_CONDITIONS'),
            });
          },
        },
        {
          id: 'PRIVACY_POLICY',
          iconImage: imagePath.privacy_icon,
          text: useTranslate('PRIVACY_POLICY'),
          onPress: () => {
            setShowTooltip(null);
            navigation.navigate(navigationStrings.CMS, {
              title: useTranslate('PRIVACY_POLICY'),
            });
          },
        },
        {
          id: 'LOGOUT',
          iconImage: imagePath.logout_icon,
          text: useTranslate('LOGOUT'),
          onPress: () => {
            setShowTooltip(null);
            setIsLogoutModal(true);
          },
        },
        {
          id: 'DELETE_ACCOUNT',
          iconImage: imagePath.delete_account_icon,
          text: useTranslate('DELETE_ACCOUNT'),
          onPress: () => {
            setShowTooltip(null);
            navigation.navigate(navigationStrings.DELETE_ACCOUNT);
          },
        },
      ],
    },
  ];

  const hideDialog = (check: boolean) => {
    if (check) {
      setLoadingLogout(true);
      actions
        .onLogout({ ...DEVICE_INFO })
        .then((res: any) => {
          showSuccess(res?.message);

          removeUserSession();
        })
        .catch(errorMethod)
        .finally(() => {
          setIsLogoutModal(false);
          setLoadingLogout(false);
        });
    } else {
      setIsLogoutModal(false);
    }
  };

  const onPressNotificationSetting = () => {
    setShowTooltip(null);
    setIsLoading(true);
    actions
      .toggleNotificationSetting({
        notification_status: !!userData?.notification_status ? 0 : 1,
      })
      .then(response => {
        if (response?.status || response?.status === 'true') {
          actions.userDataSave({
            ...userData,
            notification_status: response?.data?.notification_status,
          });
        }
      })
      .catch(errorMethod)
      .finally(() => {
        setIsLoading(false);
      });
  };
  const onPressPrivacySetting = () => {
    setShowTooltip(null);
    setIsLoading(true);
    actions
      .togglePrivacySetting({
        privacy_settings: !!userData?.privacy_settings ? 0 : 1,
      })
      .then(response => {
        if (response?.status || response?.status === 'true') {
          actions.userDataSave({
            ...userData,
            privacy_settings: response?.data?.privacy_settings,
          });
        }
      })
      .catch(errorMethod)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTooltip = (id: string) => {
    setShowTooltip(prev => {
      if (prev === id) {
        return null;
      } else {
        return id;
      }
    });
  };

  const renderMenuItem = ({ item }: { item: MenuItemData }) => (
    <TouchableOpacity
      disabled={
        item.id === 'NOTIFICATIONS_SETTINGS' || item.id === 'PRIVACY_SETTINGS'
      }
      activeOpacity={0.8}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <Image source={item.iconImage} style={styles.menuIcon} />
        <Text allowFontScaling={false} style={styles.menuText}>
          {item.text}
        </Text>
        {(item.id === 'NOTIFICATIONS_SETTINGS' ||
          item.id === 'PRIVACY_SETTINGS') && (
          <TouchableOpacity
            style={{ marginLeft: moderateScale(5) }}
            hitSlop={HIT_SLOP}
            onPress={() => handleTooltip(item.id)}
            activeOpacity={1}
          >
            <Image source={imagePath.infoMessage} style={styles.infoMessage} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.menuItemRight}>
        {item.id === 'NOTIFICATIONS_SETTINGS' ? (
          <TouchableOpacity
            activeOpacity={1}
            onPress={onPressNotificationSetting}
          >
            <Image
              source={
                !!userData?.notification_status
                  ? imagePath.toggle_on
                  : imagePath.toggle_off
              }
              // style={styles.toggle}
            />
          </TouchableOpacity>
        ) : item.id === 'PRIVACY_SETTINGS' ? (
          <TouchableOpacity activeOpacity={1} onPress={onPressPrivacySetting}>
            <Image
              source={
                !!userData?.privacy_settings
                  ? imagePath.toggle_on
                  : imagePath.toggle_off
              }
              // style={styles.toggle}
            />
          </TouchableOpacity>
        ) : (
          <Image source={imagePath.right_arrow} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderListHeader = () => (
    <TouchableOpacity
      activeOpacity={0.3}
      onPress={() => navigation.navigate(navigationStrings.EDIT_PROFILE)}
      style={styles.profileButton}
    >
      <FastImageLoad
        style={styles.profileImage}
        source={
          !!userData?.profile_picture
            ? {
                uri: getCompleteImageUrl(userData?.profile_picture),
              }
            : imagePath.default_user
        }
        defaultImage={imagePath.name_icon}
      />
      <View style={styles.profileInfo}>
        <Text
          allowFontScaling={false}
          style={styles.profileName}
          numberOfLines={1}
        >
          {userData?.user_name}
        </Text>
        <Text
          allowFontScaling={false}
          style={styles.profileEmail}
          numberOfLines={1}
        >
          {userData?.email}
        </Text>
      </View>
      <Image style={styles.arrow} source={imagePath.right_arrow} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading && <NativeLoader size="large" />}
      <View style={styles.header}>
        <Header
          leftImg={imagePath.header_Icon}
          isLeftTitle={true}
          isRight={true}
          isRightIcon
          onPressRightImg={() => navigation.navigate(navigationStrings.QR_CODE)}
          rightImg1={imagePath.qrCode_icon}
        />
      </View>
      <Spacer space={10} />
      <SectionList
        sections={menuItems}
        keyExtractor={item => item.id}
        renderItem={renderMenuItem}
        ListHeaderComponent={renderListHeader}
        renderSectionHeader={({ section }) => (
          <Text allowFontScaling={false} style={styles.account}>
            {section.section}
          </Text>
        )}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ flexGrow: 1 }}
        ListFooterComponent={
          <View style={{ height: moderateScaleVertical(100) }} />
        }
        showsVerticalScrollIndicator={false}
      />
      {showTooltip && (
        <View style={styles.tooltipContainer}>
          <Text allowFontScaling={false} style={styles.tooltipText}>
            {tooltipContent[showTooltip as keyof typeof tooltipContent]}
          </Text>
          <TouchableOpacity
            style={styles.tooltipCloseButton}
            onPress={() => setShowTooltip(null)}
          >
            <Text
              allowFontScaling={false}
              style={styles.tooltipCloseButtonText}
            >
              X
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {isLogoutModal && (
        <Logout
          isVisible={isLogoutModal}
          message={useTranslate('ARE_YOU_SURE_YOU_WANT_TO_LOGOUT_ACCOUNT')}
          ok={useTranslate('CONFIRM')}
          cancel={useTranslate('CANCEL')}
          onClose={hideDialog}
          isLoadingLogout={isLoadingLogout}
        />
      )}
    </SafeAreaView>
  );
};

export default Settings;
