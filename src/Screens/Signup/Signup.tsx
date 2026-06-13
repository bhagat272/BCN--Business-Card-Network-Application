import React, { useCallback, useRef, useState } from 'react';
import {
  BackHandler,
  findNodeHandle,
  Keyboard,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AuthFooter from '../../Components/AuthFooter';
import AuthHeader from '../../Components/AuthHeader';
import ButtonComp from '../../Components/ButtonComp';
import Checkbox from '../../Components/Checkbox';
import DropDown from '../../Components/DropDown';
import KeyboardAwareScroll from '../../Components/KeyboardAwareScroll';
import Spacer from '../../Components/Spacer';
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
  isIos,
  showSuccess,
} from '../../utils/helperFunctions';
import validations, { regx } from '../../utils/validations';
import styles from './styles';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import TextInputWithLabel from '../../Components/TextInputWithLabel';
import PhoneInputField from '../../Components/PhoneInputField';
import { Countries } from '../../utils/commonData';
import CountryCodePicker from '../../Components/CountryCodePicker';
import { ScrollView } from 'react-native';

const Signup = (props: any) => {
  const { navigation } = props;
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [getName, setName] = useState<string>('');
  const [getEmail, setEmail] = useState<string>('');
  const [getPhoneNumber, setPhoneNumber] = useState<string>('');
  const [getPassword, setPassword] = useState<string>('');
  const [getConfirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null); // Ref for the ScrollView

  const [getNameError, setNameError] = useState<string>('');
  const [getEmailError, setEmailError] = useState<string>('');
  const [getPhoneNumberError, setPhoneNumberError] = useState<string>('');
  const [getPasswordError, setPasswordError] = useState<string>('');
  const [getConfirmPasswordError, setConfirmPasswordError] =
    useState<string>('');
  const [getError, setError] = useState<string>('');
  const [getCheck, setCheck] = useState<boolean>(false);
  const [getTypeError, setTypeError] = useState<string>('');

  const [isCountryCodePicker, setIsCountryCodePicker] =
    useState<boolean>(false);
  const [countryDialCodeData, setCountryDialCodeData] = useState<Countries>(
    appConfig.DEFAULT_COUNTRY_CODE_DATA,
  );

  const handleValidation = () => {
    setNameError('');
    setEmailError('');
    setTypeError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setError('');
    setPhoneNumberError('');

    let nameError = validations({ name: getName.toString().trim() });
    let emailError = validations({ email: getEmail.toString().trim() });
    let phoneNumberError = validations({
      phoneNumber: getPhoneNumber.toString().trim(),
    });
    let passwordError = validations({
      password: getPassword.toString().trim(),
    });
    let termsError = validations({ isAcceptTerms: getCheck });
    let confirmPasswordError: any = null;

    if (!passwordError && !!getConfirmPassword) {
      confirmPasswordError = validations({
        password: getPassword.toString().trim(),
        confirmPassword: getConfirmPassword.toString().trim(),
      });
    } else {
      confirmPasswordError = validations({
        confirmPassword: getConfirmPassword.toString().trim(),
      });
    }
    if (
      !!nameError ||
      !!emailError ||
      !!phoneNumberError ||
      !!passwordError ||
      !!confirmPasswordError ||
      !!termsError
    ) {
      setNameError(!!nameError ? nameError.toString() : '');
      setEmailError(!!emailError ? emailError.toString() : '');
      setPhoneNumberError(
        !!phoneNumberError ? phoneNumberError.toString() : '',
      );
      setPasswordError(!!passwordError ? passwordError.toString() : '');
      setConfirmPasswordError(
        !!confirmPasswordError ? confirmPasswordError.toString() : '',
      );
      setError(!!termsError ? termsError.toString() : '');

      const errorFields = [
        { error: nameError, ref: nameRef },
        { error: emailError, ref: emailRef },
        { error: phoneNumberError, ref: phoneRef },
        { error: passwordError, ref: passwordRef },
        { error: confirmPasswordError, ref: confirmPasswordRef },
      ];

      for (const field of errorFields) {
        if (field.error) {
          field.ref.current?.focus();

          if (scrollViewRef.current && field.ref.current) {
            const nodeHandle = findNodeHandle(field.ref.current); // Get the node handle
            if (nodeHandle) {
              scrollViewRef.current.scrollTo({
                y: 0, // Scroll to the top
                animated: true,
              });
            }
          }
          break; // Stop after focusing the first error
        }
      }
    } else {
      setIsLoading(true);
      let json = {
        user_name: getName.toString().trim(),
        email: getEmail.toLowerCase().toString().trim(),
        country_code: countryDialCodeData.dial_code,
        country_code_name: countryDialCodeData.code,
        password: getPassword.toString().trim(),
        password_confirmation: getConfirmPassword.toString().trim(),
        terms_conditions: getCheck === true ? 1 : 0,
        phone_number: getPhoneNumber.toString().trim(),
        ...DEVICE_INFO,
      };

      actions
        .userCheck(json)
        .then((res: any) => {
          showSuccess(res?.message);
          navigation.navigate(navigationStrings.OTP_VERIFY, {
            userDetails: json,
          });
          setIsLoading(true);
        })
        .catch(errorMethod)
        .finally(() => setIsLoading(false));
    }
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => {
        backHandler.remove();
      };
    }, []),
  );

  const onCountryChange = (data: Countries) => {
    setCountryDialCodeData(data);
  };

  const onChangeTxt = (text: string = '') => {
    if (text !== '' && !regx.numericRegex.test(text)) {
      return;
    }
    setPhoneNumber(text);
    setPhoneNumberError('');
  };

  return (
    <WrapperContainer isLoading={isLoading}>
      <KeyboardAwareScroll
        scrollRef={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.safeArea}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View
            style={{
              flex: 1,
            }}
          >
            <Spacer space={moderateScaleVertical(10)} />
            <AuthHeader
              icon={imagePath.logo}
              title={useTranslate('SIGN_UP')}
              desc={useTranslate('ENTER_YOUR_DETAIL_TO_CREATE')}
            />
            <TextInputWithLabel
              reference={nameRef}
              isLabel={true}
              label={useTranslate('NAME')}
              contentType={'name'}
              keyboardType={'default'}
              placeholder={useTranslate('ENTER_NAME')}
              fontColor={colors.black}
              getError={getNameError}
              onGetData={getName}
              onSetData={(data: React.SetStateAction<string>) => [
                setName(data),
                setNameError(''),
              ]}
              placeHolderTextColor={colors.lightGrey}
              secureTextEntry={false}
              returnType="next"
              onSubmitEditing={() =>
                !!emailRef.current && emailRef.current.focus()
              }
              maxLength={appConfig.NAME_TEXT_INPUT_LENGTH}
            />

            <Spacer space={10} />

            <TextInputWithLabel
              reference={emailRef}
              isLabel={true}
              autoCapitalize={'none'}
              label={useTranslate('EMAIL_ADDRESS')}
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
            <Spacer space={1} />

            <Spacer space={10} />

            <PhoneInputField
              reference={phoneRef}
              title={useTranslate('MOBILE_NUMBER')}
              placeholder={useTranslate('ENTER_MOBILE_NUMBER')}
              keyboardType="numeric"
              onGetData={getPhoneNumber}
              onSetData={onChangeTxt}
              getError={getPhoneNumberError}
              isTitle={true}
              isRequired={true}
              onSubmitEditing={() =>
                !!phoneRef.current && phoneRef.current.focus()
              }
              contentType={undefined}
              placeHolderTextColor={''}
              fontColor={''}
              secureTextEntry={false}
              dialCode={countryDialCodeData.dial_code}
              onChangeCountryCode={() => {
                Keyboard.dismiss();
                setIsCountryCodePicker(true);
              }}
              flag={countryDialCodeData.flag}
              maxLength={appConfig.PHONE_NUMBER_MAX_LENGTH}
            />

            <Spacer space={10} />

            <TextInputWithLabel
              reference={passwordRef}
              isLabel={true}
              label={useTranslate('PASSWORD')}
              contentType={'name'}
              keyboardType={'default'}
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
              returnType="next"
              onSubmitEditing={() =>
                !!confirmPasswordRef.current &&
                confirmPasswordRef.current.focus()
              }
              maxLength={appConfig.PASSWORD_MAX_LENGTH}
            />
            <Spacer space={10} />

            <TextInputWithLabel
              reference={confirmPasswordRef}
              isLabel={true}
              label={useTranslate('CONFIRM_PASSWORD')}
              contentType={'name'}
              keyboardType={'default'}
              placeholder={useTranslate('ENTER_CONFIRM_PASSWORD')}
              fontColor={colors.black}
              getError={getConfirmPasswordError}
              onGetData={getConfirmPassword}
              onSetData={(data: React.SetStateAction<string>) => [
                setConfirmPassword(data),
                setConfirmPasswordError(''),
              ]}
              placeHolderTextColor={colors.lightGrey}
              secureTextEntry={true}
              maxLength={appConfig.PASSWORD_MAX_LENGTH}
            />
            {/* <TextInput allowFontScaling={false} style={{height: 1}} /> */}
            <Spacer space={20} />
            <View style={styles.checkboxContainer}>
              <Checkbox
                text=""
                getChecked={getCheck}
                setChecked={() => [setCheck(!getCheck), setError('')]}
                isPrivacy={true}
                privacyAction={() =>
                  navigation.navigate(navigationStrings.CMS, {
                    title: useTranslate('PRIVACY_POLICY'),
                  })
                }
                termsAction={() =>
                  navigation.navigate(navigationStrings.CMS, {
                    title: useTranslate('TERMS_&_CONDITIONS'),
                  })
                }
              />
            </View>
            {!!getError && (
              <Text allowFontScaling={false} style={styles.error}>
                {getError}
              </Text>
            )}
            <ButtonComp
              title={useTranslate('SIGN_UP')}
              onPress={handleValidation}
              btnStyle={{
                marginTop: moderateScaleVertical(16),
                marginHorizontal: moderateScale(10),
              }}
              isLoading={isLoading}
            />
            <AuthFooter
              // or={useTranslate('OR_SIGN_UP_WITH')}
              // google={imagePath.google_icon}
              // googleAction={() => []}
              // facebook={undefined}
              // facebookAction={() => []}
              // apple={isIos ? imagePath.apple_icon : undefined}
              // appleAction={() => []}
              message={useTranslate('HAVE_AN_ACCOUNT')}
              actionText={useTranslate('LOGIN')}
              actionOnText={handleBackPress}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScroll>

      {isCountryCodePicker && (
        <CountryCodePicker
          isVisible={isCountryCodePicker}
          onClosePickerModal={() => setIsCountryCodePicker(false)}
          onCountryChange={onCountryChange}
        />
      )}
    </WrapperContainer>
  );
};

export default Signup;
