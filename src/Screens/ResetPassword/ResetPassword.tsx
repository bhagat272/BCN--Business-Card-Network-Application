import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import AuthHeader from '../../Components/AuthHeader';
import ButtonComp from '../../Components/ButtonComp';
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
import { errorMethod, showSuccess } from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import styles from './styles';
import KeyboardAwareScroll from '../../Components/KeyboardAwareScroll';

const ResetPassword = (props: any) => {
  const { navigation, route } = props;
  const { requestData }: any = route?.params || { requestData: null };
  const confirmPasswordRef = useRef<TextInput>(null);

  const [getPassword, setPassword] = useState<string>('');
  const [getConfirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [getPasswordError, setPasswordError] = useState<string>('');
  const [getConfirmPasswordError, setConfirmPasswordError] =
    useState<string>('');

  const handleValidation = () => {
    setPasswordError('');
    setConfirmPasswordError('');
    let passwordError = validations({
      password: getPassword.toString().trim(),
    });
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
    if (!!passwordError || !!confirmPasswordError) {
      setPasswordError(!!passwordError ? passwordError.toString() : '');
      setConfirmPasswordError(
        !!confirmPasswordError ? confirmPasswordError.toString() : '',
      );
    } else {
      setIsLoading(true);
      let json = {
        password: getPassword.toString().trim(),
        // confirm_password: getConfirmPassword.toString().trim(),
        password_confirmation: getConfirmPassword.toString().trim(),
        ...requestData,
      };

      actions
        .resetPassword(json)
        .then((res: any) => {
          showSuccess(res?.message || '');
          if (route?.params?.isFromDelete) {
            navigation.goBack();
          } else {
            navigation.reset({
              index: 1,
              routes: [{ name: navigationStrings.LOGIN }],
            });
          }
        })
        .catch(errorMethod)
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
    return true;
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const handleBackPress = () => {
    if (route?.params?.isFromDelete) {
      navigation.goBack();
    } else {
      navigation.navigate(navigationStrings.FORGOT_PASSWORD);
    }
    return true;
  };

  return (
    <WrapperContainer>
      {/* <Header
        onPressLeftImg={() =>
          navigation.navigate(navigationStrings.FORGOT_PASSWORD)
        }
      /> */}
      <Spacer space={50} />
      <KeyboardAwareScroll
        contentContainerStyle={{ flexGrow: 1, marginTop: -18 }}
        style={styles.safeArea}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
              }}
            >
              <AuthHeader
                icon={imagePath.logo}
                title={useTranslate('RESET_PASSWORD')}
                desc={useTranslate('CREATE_A_NEW_PASSWORD')}
              />
              <TextInputWithLabel
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
                maxLength={appConfig.PASSWORD_MAX_LENGTH}
                placeHolderTextColor={colors.lightGrey}
                secureTextEntry={true}
                returnType="next"
                onSubmitEditing={() =>
                  !!confirmPasswordRef.current &&
                  confirmPasswordRef.current.focus()
                }
              />
              <Spacer space={10} />
              <TextInputWithLabel
                reference={confirmPasswordRef}
                isLabel={true}
                label={useTranslate('CONFIRM_PASSWORD')}
                contentType={'name'}
                keyboardType={'default'}
                maxLength={appConfig.PASSWORD_MAX_LENGTH}
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
              />

              {/* <View style={styles.footerButton}>
              <ButtonComp
                title={useTranslate('SUBMIT')}
                onPress={() => handleValidation()}
                btnStyle={{
                  marginHorizontal: moderateScale(10),
                }}
                isLoading={isLoading}
              />
            </View> */}
            </View>
            {/* <View style={styles.footerButton}> */}
            <ButtonComp
              title={useTranslate('SUBMIT')}
              onPress={() => handleValidation()}
              btnStyle={{
                marginHorizontal: moderateScale(10),
                marginTop: moderateScaleVertical(30),
              }}
              isLoading={isLoading}
            />
            {/* </View> */}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScroll>
      {/* <View style={styles.footerButton}>
        <ButtonComp
          title={useTranslate('SUBMIT')}
          onPress={() => handleValidation()}
          btnStyle={{
            marginHorizontal: moderateScale(10),
          }}
          isLoading={isLoading}
        />
      </View> */}
    </WrapperContainer>
  );
};

export default ResetPassword;
