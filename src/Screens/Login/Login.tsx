import React, { useRef, useState } from 'react';
import {
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import AuthFooter from '../../Components/AuthFooter';
import AuthHeader from '../../Components/AuthHeader';
import ButtonComp from '../../Components/ButtonComp';
import Checkbox from '../../Components/Checkbox';
import KeyboardAwareScroll from '../../Components/KeyboardAwareScroll';
import Spacer from '../../Components/Spacer';
import TextInputWithLabel from '../../Components/TextInputWithLabel';
import WrapperContainer from '../../Components/WrapperContainer';
import { appConfig } from '../../constants/appConfig';
import imagePath from '../../constants/imagePath';
import { useTranslate } from '../../constants/lang';
import navigationStrings from '../../constants/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {
  DEVICE_INFO,
  errorMethod,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import styles from './styles';

const Login = (props: any) => {
  const { navigation } = props;
  const { rememberedData } = useSelector((state: any) => state?.auth || {});

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [getEmail, setEmail] = useState<string>(rememberedData?.email || '');
  const [getEmailError, setEmailError] = useState<string>('');

  const [getPassword, setPassword] = useState<string>(
    rememberedData?.password || '',
  );
  const [getPasswordError, setPasswordError] = useState<string>('');

  const [getCheck, setCheck] = useState<boolean>(!!rememberedData);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleValidation = () => {
    setEmailError('');
    setPasswordError('');
    let emailError = validations({
      email: getEmail.toString().trim().toLowerCase(),
    });
    let passwordError = validations({
      password: getPassword.toString().trim(),
    });
    if (!!emailError || !!passwordError) {
      setEmailError(!!emailError ? emailError.toString() : '');
      setPasswordError(!!passwordError ? passwordError.toString() : '');
    } else {
      setIsLoading(true);
      let json = {
        email: getEmail.toString().trim().toLowerCase(),
        password: getPassword.toString().trim(),
        remember_me: getCheck,
        ...DEVICE_INFO,
      };
      actions
        .userLogin(json)
        .then(async (response: any) => {
          Keyboard.dismiss();
          if (response.status) {
            if (getCheck) {
              actions.onSaveRememberedDataInKeyChain(json);
            } else if (!!rememberedData) {
              actions.removeRememberedData();
            }
            showSuccess(response?.message || useTranslate('LOGIN_SUCCESS'));
          } else {
            showError(response?.message);
          }
        })
        .catch(errorMethod)
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <WrapperContainer>
      <KeyboardAwareScroll
        contentContainerStyle={{
          flexGrow: 1,
        }}
        style={styles.keyboard}
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View
            style={{
              flex: 1,
            }}
          >
            <View style={{ flex: 1 }}>
              <Spacer space={moderateScaleVertical(10)} />
              <AuthHeader
                icon={imagePath.logo}
                title={useTranslate('LOGIN')}
                desc={useTranslate('ENTER_YOUR_LOGIN_DETAILS')}
              />
              <TextInputWithLabel
                reference={emailRef}
                label={useTranslate('EMAIL_ADDRESS')}
                isLabel={true}
                autoCapitalize={'none'}
                contentType={'name'}
                keyboardType={'email-address'}
                placeholder={useTranslate('ENTER_EMAIL')}
                fontColor={colors.black}
                getError={getEmailError}
                onGetData={getEmail.toLowerCase()}
                onSetData={(data: React.SetStateAction<string>) => [
                  setEmail(data),
                  setEmailError(''),
                ]}
                placeHolderTextColor={colors.lightGrey}
                secureTextEntry={false}
                returnType="next"
                onSubmitEditing={() =>
                  !!passwordRef.current && passwordRef.current.focus()
                }
              />
              <Spacer space={10} />
              {Platform.OS == 'ios' && (
                <TextInput allowFontScaling={false} style={{ height: 0.01 }} />
              )}
              <TextInputWithLabel
                reference={passwordRef}
                isLabel={true}
                label={useTranslate('PASSWORD')}
                contentType={'name'}
                keyboardType={undefined}
                placeholder={useTranslate('ENTER_PASSWORD')}
                fontColor={colors.black}
                getError={getPasswordError}
                onGetData={getPassword}
                onSetData={(data: React.SetStateAction<string>) => [
                  setPassword(data),
                  setPasswordError(''),
                ]}
                placeHolderTextColor={colors.lightGrey}
                secureTextEntry={true}
                maxLength={appConfig.PASSWORD_MAX_LENGTH}
              />
              <View style={styles.forgotContainer}>
                <Checkbox
                  text={useTranslate('REMEMBER_ME')}
                  getChecked={getCheck}
                  setChecked={() => setCheck(!getCheck)}
                  isPrivacy={false}
                  privacyAction={undefined}
                  termsAction={undefined}
                />
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    navigation.navigate(navigationStrings.FORGOT_PASSWORD);
                  }}
                  style={styles.forgot}
                >
                  <Text allowFontScaling={false} style={styles.forgot}>
                    {useTranslate('FORGOT_PASSWORD')}
                  </Text>
                </TouchableOpacity>
              </View>

              <ButtonComp
                title={useTranslate('LOGIN')}
                onPress={handleValidation}
                btnStyle={{
                  marginTop: moderateScaleVertical(16),
                  marginHorizontal: moderateScale(12),
                }}
                isLoading={isLoading}
              />
            </View>

            <AuthFooter
              //  or={useTranslate('OR_LOGIN_WITH')}
              // google={imagePath.google_icon}
              // googleAction={() => []}
              // facebook={undefined}
              // facebookAction={() => []}
              // apple={isIos ? imagePath.apple_icon : undefined}
              // appleAction={() => []}
              message={useTranslate('DONT_HAVE_AN_ACCOUNT')}
              actionText={useTranslate('SIGN_UP')}
              actionOnText={() => {
                Keyboard.dismiss();
                navigation.navigate(navigationStrings.SIGNUP);
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScroll>
    </WrapperContainer>
  );
};

export default Login;
