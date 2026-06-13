import React, { useEffect, useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import ButtonComp from '../../Components/ButtonComp';
import FastImageLoad from '../../Components/FastImageLoad';
import Header from '../../Components/Header';
import KeyboardAwareScroll from '../../Components/KeyboardAwareScroll';
import NativeLoader from '../../Components/NativeLoader';
import Spacer from '../../Components/Spacer';
import TextInputWithLabel from '../../Components/TextInputWithLabel';
import WrapperContainer from '../../Components/WrapperContainer';
import { getCompleteImageUrl } from '../../config/urls';
import imagePath from '../../constants/imagePath';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  APP_LOG,
  errorMethod,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import styles from './styles';
import { saveConnectionRefresh } from '../../redux/reducers/settings';
import { changeConnectionRefresh } from '../../redux/actions/connections';
import { ConnectionDetailSimmer } from '../../Components/ShimmerComp';
import { useSelector } from 'react-redux';
import { t } from 'i18next';
import navigationStrings from '../../constants/navigationStrings';
import { useTranslate } from '../../constants/lang';

interface ConnectionData {
  id: number;
  uuid: string;
  user_id: number;
  other_user_id: number;
  status: number; // 0: Pending, 1: Accepted, 2: Rejected
  created_at: string;
  updated_at: string;
}

const ConnectionDetails = (props: any) => {
  const { route, navigation } = props;
  const params = route?.params;
  const isAllUser = params?.title === useTranslate('USER_DETAIL');

  const phoneRef = useRef(null);
  // Get user data from Redux store
  const { userData } = useSelector((state: any) => state?.auth || {});

  // State variables
  const [getEmail, setEmail] = useState<string>('');
  const [getPhoneNumber, setPhoneNumber] = useState<string>('');
  const [getCompanyName, setCompanyName] = useState<string>('');
  const [getName, setName] = useState('');
  const [connectionsData, setConnectionsData] = useState<ConnectionData | null>(
    null,
  );
  const [privacySettings, setPrivacySettings] = useState<ConnectionData | null>(
    null,
  );
  const [countryDialCodeData, setCountryDialCodeData] = useState({
    dial_code: '+1',
    flag: null,
  });
  const [getFile, setFile] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isLoader, setLoader] = useState<boolean>(false);
  const [isNumberShow, setIsNumberShow] = useState<boolean>(false);
  const [isEmailShow, setIsEmailShow] = useState<boolean>(false);
  const [uuId, setUuId] = useState<string>('');
  const [loaderSecond, setLoaderSecond] = useState<boolean>(false);

  useEffect(() => {
    callApi();
  }, []);

  const callApi = () => {
    setLoading(true);
    actions
      .getUserDetails({ uuid: route?.params?.uuid })
      .then((res: any) => {
        if (res.data) {
          const {
            email,
            mobile,
            company_name = '',
            user_name = '',
            country_code,
            country_code_name,
            privacy_settings,
            connection,
            uuid,
            profile_picture,
          } = res.data;
          APP_LOG(connection, '=====>connections');

          setEmail(email);
          setPhoneNumber(mobile);
          setConnectionsData(connection); // Set connection data
          setPrivacySettings(privacy_settings);
          setTimeout(() => {
            APP_LOG(connectionsData, '=====>connectionsData');
          }, 0);
          setCompanyName(company_name || '');
          setName(user_name);
          setUuId(uuid);
          setCountryDialCodeData({
            dial_code: country_code,
            flag: null, // Consider fetching flag if needed
          });
          setFile(profile_picture);
        }
      })
      .catch(errorMethod)
      .finally(() => setLoading(false));
  };

  // Masking logic for sensitive information
  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name?.replace(/./g, 'X')}@${domain}`;
  };

  const maskPhoneNumber = (phone: string) => {
    return `${countryDialCodeData.dial_code} ${phone.replace(/./g, 'X')}`;
  };

  const onSendRequest = () => {
    if (
      Number(userData?.is_premium) === 1 &&
      userData?.connection_count < userData?.total_connection_count
    ) {
      setLoader(true);
      actions
        .sendConnectionRequest({ other_user_uuid: route?.params?.uuid })
        .then((res: any) => {
          if (res?.status === 'true') {
            showSuccess(res?.message);
            actions.getUserData({});

            navigation.goBack();
          }
        })
        .catch(errorMethod)
        .finally(() => setLoader(false));
    } else {
      if (userData?.is_premium === 0) {
        navigation.navigate(navigationStrings.SUBSCRIPTION_PLANS);
      } else {
        showError(
          'You have reached todays connection limit. Please try again tomorrow.',
        );
      }
    }
  };

  const handleDisconnect = () => {
    setLoader(true);
    actions
      .disconnect({ connection_id: connectionsData?.uuid })
      .then((res: any) => {
        changeConnectionRefresh(true);
        if (res?.status === 'true') {
          showSuccess(res?.message);
          navigation.goBack();
        }
      })
      .catch(errorMethod)
      .finally(() => setLoader(false));
  };

  const handleAccept = () => {
    setLoader(true);
    actions
      .respondConnectionRequest({ other_user_uuid: uuId, type: 'accept' })
      .then((res: any) => {
        if (res?.status === 'true') {
          showSuccess(res?.message);
          navigation.goBack();
        }
      })
      .catch(errorMethod)
      .finally(() => setLoader(false));
  };

  const handleReject = () => {
    setLoaderSecond(true);
    actions
      .respondConnectionRequest({ other_user_uuid: uuId, type: 'reject' })
      .then((res: any) => {
        if (res?.status === 'true') {
          showSuccess(res?.message);
          navigation.goBack();
        }
      })
      .catch(errorMethod)
      .finally(() => setLoaderSecond(false));
  };

  // Determine button visibility based on user ID and connection status
  const getButtonConfig = () => {
    const isCurrentUser = userData?.id === connectionsData?.user_id;

    if (!connectionsData) {
      return {
        primaryButton: {
          title: t('SEND_REQUEST'),
          onPress: onSendRequest,
        },
        secondaryButtons: [],
      };
    }

    if (isCurrentUser) {
      switch (connectionsData.status) {
        case 0: // Pending
          return {
            primaryButton: {
              title: t('REQUEST_SENT'),
              onPress: handleDisconnect,
            }, // Disable action
            secondaryButtons: [],
          };
        case 1: // Accepted
          return {
            primaryButton: {
              title: t('DISCONNECT'),
              onPress: handleDisconnect,
            },
            secondaryButtons: [],
          };
        case 2: // Rejected
          return {
            primaryButton: null,
            secondaryButtons: [],
          };
        default:
          return {
            primaryButton: null,
            secondaryButtons: [],
          };
      }
    } else {
      // For other users (not the current user)
      switch (connectionsData.status) {
        case 0: // Pending
          return {
            primaryButton: null,
            secondaryButtons: [
              { title: t('REJECT'), onPress: handleReject },
              { title: t('ACCEPT'), onPress: handleAccept },
            ],
          };
        case 1: // Accepted
          return {
            primaryButton: {
              title: t('DISCONNECT'),
              onPress: handleDisconnect,
            },
            secondaryButtons: [],
          };
        case 2: // Rejected
          return {
            primaryButton: null,
            secondaryButtons: [],
          };
        default:
          return {
            primaryButton: null,
            secondaryButtons: [],
          };
      }
    }
  };

  const { primaryButton, secondaryButtons } = getButtonConfig();

  return (
    <WrapperContainer>
      <Header
        centerTitle={params?.title ? params?.title : t('MY_CONNECTIONS')}
        onPressLeftImg={() => {
          navigation.goBack();
        }}
      />

      {isLoading ? (
        <ConnectionDetailSimmer />
      ) : (
        <View style={{ flex: 1 }}>
          <KeyboardAwareScroll
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            style={styles.safeArea}
          >
            <Spacer space={30} />

            {/* Profile Image */}
            <View style={styles.profileContainer}>
              <FastImageLoad
                style={styles.profileImage}
                source={{ uri: getCompleteImageUrl(getFile) }}
                defaultImage={imagePath.user_icon}
              />
              <Spacer space={10} />
              <Text allowFontScaling={false} style={styles.name}>
                {getName}
              </Text>
            </View>

            <Spacer space={10} />

            {/* Email Display */}
            {!isAllUser && (
              <>
                <TextInputWithLabel
                  isEnabled={true} // Disabled for display only
                  isRequired={true}
                  label={t('EMAIL_ADDRESS')}
                  isLabel={true}
                  keyboardType="email-address"
                  placeholder={t('ENTER_EMAIL')}
                  fontColor={colors.black}
                  onGetData={privacySettings ? maskEmail(getEmail) : getEmail}
                  onSetData={setEmail}
                  placeHolderTextColor={colors.lightGrey}
                  inputStyle={styles.inputStyle}
                />

                <Spacer space={10} />

                {/* Phone Display */}
                <TextInputWithLabel
                  reference={phoneRef}
                  isRequired={true}
                  isEnabled={true} // Disabled for display only
                  isLabel={true}
                  label={t('MOBILE_NUMBER')}
                  placeholder={t('ENTER_MOBILE_NUMBER')}
                  keyboardType="numeric"
                  onGetData={
                    privacySettings
                      ? `${maskPhoneNumber(getPhoneNumber)}`
                      : `${countryDialCodeData.dial_code} ${getPhoneNumber}`
                  }
                  onSetData={setPhoneNumber}
                  inputStyle={styles.inputStyle}
                />

                <Spacer space={10} />
              </>
            )}

            {/* Company Name Display */}
            <TextInputWithLabel
              isRequired={true}
              isLabel={true}
              isEnabled={true} // Disabled for display only
              label={t('COMPANY_NAME')}
              keyboardType="default"
              placeholder={t('ENTER_COMPANY_NAME')}
              fontColor={colors.black}
              onGetData={getCompanyName || 'NA'}
              onSetData={setCompanyName}
              placeHolderTextColor={colors.lightGrey}
              inputStyle={styles.inputStyle}
            />

            <Spacer space={20} />
          </KeyboardAwareScroll>
          <View style={styles.footerButton}>
            {primaryButton && (
              <ButtonComp
                title={primaryButton.title}
                onPress={primaryButton.onPress}
                isLoading={isLoader}
              />
            )}
            {secondaryButtons.length > 0 && (
              <View style={styles.buttonContainer}>
                {secondaryButtons.map((button, index) => (
                  <ButtonComp
                    key={index}
                    title={button.title}
                    onPress={button.onPress}
                    isLoading={index === 0 ? loaderSecond : isLoader}
                    loaderColor={
                      index === 0 ? colors.grayishBlue : colors.white
                    }
                    btnStyle={
                      index === 0 ? styles.clearButton : styles.applyButton
                    }
                    gradientColors={
                      index === 0
                        ? [colors.AppWhite, colors.AppWhite]
                        : undefined
                    }
                    btnTxtStyle={index === 0 ? styles.clearText : undefined}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      )}
    </WrapperContainer>
  );
};

export default ConnectionDetails;
