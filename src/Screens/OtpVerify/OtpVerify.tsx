import moment from 'moment';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import { useSelector } from 'react-redux';
import AuthHeader from '../../Components/AuthHeader';
import ButtonComp from '../../Components/ButtonComp';
import NativeLoader from '../../Components/NativeLoader';
import { OTPInput } from '../../Components/OtpInput';
import Spacer from '../../Components/Spacer';
import WrapperContainer from '../../Components/WrapperContainer';
import { appConfig } from '../../constants/appConfig';
import imagePath from '../../constants/imagePath';
import { useTranslate } from '../../constants/lang';
import navigationStrings from '../../constants/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStyles, { hitSlopProp } from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import { APP_LOG, errorMethod, showSuccess } from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import styles from './styles';

const OtpVerify = (props: any) => {
  const { navigation, route } = props;
  const { userDetails, verify_type, previousEmail, isFromDelete }: any =
    route?.params || {
      useDetails: null,
      verify_type: null,
    };

  const timerIdRef = useRef<number | any>(undefined);
  const refs: RefObject<TextInput>[] = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];
  const { userData } = useSelector((state: any) => state?.auth || {});
  const { otpAttemptData } = useSelector((state: any) => state?.settings || {});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [getEmail, setEmail] = useState<String>(userDetails?.email || '');
  const [getError, setError] = useState<String>();
  const [seconds, setSeconds] = useState<number>(appConfig.OTP_TIMER);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [errorMessages, setErrorMessages] = useState<string[]>();
  const [codes, setCodes] = useState<string[] | undefined>(Array(6).fill(''));

  useEffect(() => {
    timerIdRef.current = BackgroundTimer.setInterval(() => {
      setSeconds(prevTimer => prevTimer - 1);
    }, 1000);

    return () => {
      BackgroundTimer.clearInterval(timerIdRef.current);
    };
  }, [seconds == appConfig.OTP_TIMER]);

  useEffect(() => {
    if (seconds === 0) {
      BackgroundTimer.clearInterval(timerIdRef.current);
    }
  }, [seconds]);

  const onChangeCode = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) {
      return; // Exit if text contains non-numeric characters
    }
    if (text.length > 1) {
      setError(undefined);
      const newCodes = text.split('');
      setCodes(newCodes);
      refs[5]!.current?.focus();
      return;
    }
    setError(undefined);
    const newCodes = [...codes!];
    newCodes[index] = text;
    setCodes(newCodes);
    if (text !== '' && index < 5) {
      refs[index + 1]!.current?.focus();
    }
  };

  const handleValidation = () => {
    let inputOtp = codes?.join('').trim();
    setError('');
    let otpError = validations({ otp: inputOtp });
    if (!!otpError) {
      setError(!!otpError ? otpError.toString() : '');
    } else {
      setIsLoading(true);
      verify_type == 'FORGOT_PASSWORD' || verify_type == 'EDIT_EMAIL'
        ? verifyUser()
        : registerUser();
    }
  };

  const resendClick = () => {
    setIsResendLoading(true);
    let json = {
      email: getEmail.toString().trim(),
      is_resend: !isResendLoading ? 1 : 0,
      ...userDetails,
      request_type:
        verify_type == 'FORGOT_PASSWORD' || verify_type == 'EDIT_EMAIL'
          ? ''
          : 'signup',
    };
    actions
      .resendOtp(json)
      .then((res: any) => {
        if (otpAttemptData?.attempts !== 4) {
          actions.saveOtpAttemptsAsync({
            time: '',
            attempts:
              otpAttemptData?.attempts >= 5 ? 1 : otpAttemptData?.attempts + 1,
          });
        } else {
          actions.saveOtpAttemptsAsync({
            time: new Date().toISOString(),
            attempts: otpAttemptData?.attempts + 1,
          });
        }
        showSuccess(res?.message);
        setCodes(Array(6).fill(''));
        setSeconds(appConfig.OTP_TIMER);
      })
      .catch(errorMethod)
      .finally(() => setIsResendLoading(false));
  };

  const handleBack = () => {
    if (isOtpVerified) {
      // Disable back functionality
      return;
    }
    if (verify_type == 'FORGOT_PASSWORD') {
      if (isFromDelete) {
        navigation.goBack();
      } else {
        navigation.reset({
          index: 1,
          routes: [{ name: navigationStrings.LOGIN }],
        });
      }
    } else {
      navigation.goBack();
    }
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleBack();
        return true; // Prevent default back action
      },
    );
    return () => backHandler.remove();
  }, [isOtpVerified]);

  const verifyUser = () => {
    let inputOtp = codes?.join('').trim();
    let json = {
      otp: inputOtp,
      ...userDetails,
    };
    actions
      .userVerifyOtp(json)
      .then((response: any) => {
        if (response != null) {
          showSuccess(response?.message);
          APP_LOG(response.status);
          if (response.status == 'true') {
            if (verify_type == 'FORGOT_PASSWORD') {
              setIsOtpVerified(true); // Set OTP verified state to true
              if (isFromDelete) {
                navigation.replace(navigationStrings.RESET_PASSWORD, {
                  userData: response.data,
                  requestData: json,
                  isFromDelete: isFromDelete || false,
                });
              } else {
                navigation.navigate(navigationStrings.RESET_PASSWORD, {
                  userData: response.data,
                  requestData: json,
                });
              }
            } else if (verify_type == 'EDIT_EMAIL') {
              actions.onSaveUserDataInKeyChain({
                ...userData,
                email: response?.data?.email,
              });
              navigation.navigate(navigationStrings.EDIT_PROFILE, {
                isVerifiedEmail: true,
                verified_email: response?.data?.email,
              });
            }
          } else {
            setCodes(Array(6).fill(''));
          }
        }
      })
      .catch(errorMethod)
      .finally(() => [setIsLoading(false)]);
  };

  const registerUser = () => {
    let inputOtp = codes?.join('').trim();
    let json = {
      otp: inputOtp,
      ...userDetails,
    };
    actions
      .userSignUp(json)
      .then((response: any) => {
        if (response != null) {
          showSuccess(response?.message);
        }
      })
      .catch(errorMethod)
      .finally(() => setIsLoading(false));
  };

  const formatTime = (time: number) => {
    return time.toString().padStart(2, '0');
  };

  const isAttemptTimeOlderThanFiveMinutes = () => {
    if (!otpAttemptData?.time) {
      return true;
    }
    const attemptMoment = moment(otpAttemptData.time);
    const differenceInMinutes = moment().diff(attemptMoment, 'minutes');

    return differenceInMinutes >= 5;
  };

  return (
    <WrapperContainer isLoading={isLoading || isResendLoading}>
      <Spacer space={40} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <AuthHeader
          icon={imagePath.logo}
          title={useTranslate('OTP_VERIFICATION')}
          desc={`${useTranslate(
            'A_SIX_DIGIT_VERIFICATION_CODE_SENT_TO',
          )}${getEmail}`}
        />
        <Spacer space={20} />
        <View style={styles.otpContainer}>
          <View>
            <OTPInput
              codes={codes!}
              errorMessages={errorMessages}
              onChangeCode={onChangeCode}
              refs={refs}
              config={undefined}
            />
          </View>
          <Spacer />
          {!!getError && (
            <Text allowFontScaling={false} style={styles.error}>
              {getError}
            </Text>
          )}
          {seconds !== 0 && (
            <View style={styles.resendContainer}>
              <Text allowFontScaling={false} style={styles.resend}>
                {useTranslate('RESNED_IN')}{' '}
                <Text
                  allowFontScaling={false}
                  style={styles.counter}
                >{`${formatTime(seconds)} sec`}</Text>
              </Text>
            </View>
          )}

          {seconds === 0 && (
            <View>
              <View style={styles.resendView}>
                {!isResendLoading ? (
                  <TouchableOpacity
                    hitSlop={hitSlopProp}
                    disabled={
                      isResendLoading || !isAttemptTimeOlderThanFiveMinutes()
                    }
                    onPress={resendClick}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...styles.resendButton,
                        color: !isAttemptTimeOlderThanFiveMinutes()
                          ? colors.grey2
                          : colors.black,
                      }}
                    >
                      {useTranslate('RESNED')}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <NativeLoader size={16} />
                )}
              </View>
              {!isAttemptTimeOlderThanFiveMinutes() && (
                <Text
                  allowFontScaling={false}
                  style={{
                    ...commonStyles.font10,
                    color: colors.red,
                    textAlign: 'center',
                  }}
                >
                  {useTranslate('OTP_ATTEMPTS_MSG')}
                </Text>
              )}
            </View>
          )}
        </View>
        <ButtonComp
          title={useTranslate('VERIFY')}
          onPress={handleValidation}
          btnStyle={{
            marginTop: moderateScaleVertical(30),
            marginHorizontal: moderateScale(12),
          }}
          isLoading={isLoading}
        />
      </ScrollView>
    </WrapperContainer>
  );
};

export default OtpVerify;
