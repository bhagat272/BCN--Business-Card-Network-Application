import React, { useRef, useState } from 'react';
import {
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AuthHeader from '../../Components/AuthHeader';
import ButtonComp from '../../Components/ButtonComp';
import Header from '../../Components/Header';
import KeyboardAwareScroll from '../../Components/KeyboardAwareScroll';
import Spacer from '../../Components/Spacer';
import TextInputWithLabel from '../../Components/TextInputWithLabel';
import WrapperContainer from '../../Components/WrapperContainer';
import { appConfig } from '../../constants/appConfig';
import imagePath from '../../constants/imagePath';
import { useTranslate } from '../../constants/lang';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import { errorMethod, showSuccess } from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import styles from './styles';
import ResetPassword from '../ResetPassword/ResetPassword';

const ChangePassword = (props: any) => {
  const { navigation, route } = props;
  const { requestData }: any = route?.params || { requestData: null };

  const confirmPasswordRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [getOldPassword, setOldPassword] = useState<string>('');
  const [getPassword, setPassword] = useState<string>('');
  const [getConfirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [getOldPasswordError, setOldPasswordError] = useState<string>('');
  const [getPasswordError, setPasswordError] = useState<string>('');
  const [getConfirmPasswordError, setConfirmPasswordError] =
    useState<string>('');

  const handleValidation = () => {
    setOldPasswordError('');
    setPasswordError('');
    setConfirmPasswordError('');

    const oldPasswordError = validations({
      oldPassword: getOldPassword.trim(),
    });
    const passwordError = validations({ password: getPassword.trim() });
    let confirmPasswordError = validations({
      confirmPassword: getConfirmPassword.trim(),
    });

    if (!confirmPasswordError && getPassword !== getConfirmPassword) {
      confirmPasswordError = useTranslate('CONFIRM_PASSWORD_COMPARE');
    }

    if (oldPasswordError || passwordError || confirmPasswordError) {
      setOldPasswordError(oldPasswordError || '');
      setPasswordError(passwordError || '');
      setConfirmPasswordError(confirmPasswordError || '');
      return;
    }
    if (getOldPassword === getPassword) {
      setPasswordError(useTranslate('OLD_PASS_SAME_VALID_MSG'));
      return;
    }

    setIsLoading(true);

    // const payload = {
    //   old_password: getOldPassword.trim(),
    //   password: getPassword.trim(),
    //   password_confirmation: getConfirmPassword.trim(),
    //   ...requestData,
    // };

    const payload = {
      current_password: getOldPassword.trim(),
      new_password: getPassword.trim(),
      new_password_confirmation: getConfirmPassword.trim(),
      ...requestData,
    };

    actions
      .changePassword(payload)
      .then((res: any) => {
        showSuccess(res?.message || 'Password changed successfully.');
        actions.removeUserSession();
      })
      .catch(errorMethod)
      .finally(() => {
        setIsLoading(false);
      });
  };

  // return <ResetPassword />;

  return (
    <WrapperContainer>
      <View style={styles.header}>
        <Header
          centerTitle={useTranslate('CHANGE_PASSWORD')}
          onPressLeftImg={() => navigation.goBack()}
        />
      </View>
      <KeyboardAwareScroll
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
            <AuthHeader
              icon={imagePath.logo}
              desc={useTranslate('SET_NEW_PASSWORD')}
            />
            <View style={styles.content}>
              <TextInputWithLabel
                isLabel={true}
                label={useTranslate('OLD_PASSWORD')}
                contentType="password"
                keyboardType={'default'}
                placeholder={useTranslate('ENTER_OLD_PASSWORD')}
                fontColor={colors.black}
                getError={getOldPasswordError}
                onGetData={getOldPassword}
                onSetData={(data: string) => [
                  setOldPassword(data),
                  setOldPasswordError(''),
                ]}
                placeHolderTextColor={colors.lightGrey}
                secureTextEntry={true}
                returnType="next"
                onSubmitEditing={() =>
                  !!passwordRef.current && passwordRef.current.focus()
                }
                maxLength={appConfig.PASSWORD_MAX_LENGTH}
              />
              {/* <TextInput allowFontScaling={false} style={{height: 1}} /> */}
              <Spacer space={10} />
              <TextInputWithLabel
                reference={passwordRef}
                isLabel={true}
                label={useTranslate('NEW_PASSWORD')}
                contentType="password"
                keyboardType={'default'}
                maxLength={appConfig.PASSWORD_MAX_LENGTH}
                placeholder={useTranslate('ENTER_NEW_PASSWORD')}
                fontColor={colors.black}
                getError={getPasswordError}
                onGetData={getPassword}
                onSetData={(data: string) => [
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
              />
              {/* <TextInput allowFontScaling={false} style={{height: 1}} /> */}

              <Spacer space={10} />
              <TextInputWithLabel
                reference={confirmPasswordRef}
                isLabel={true}
                label={useTranslate('CONFIRM_NEW_PASSWORD')}
                contentType="password"
                keyboardType={'default'}
                placeholder={useTranslate('RE_ENTER_NEW_PASSWORD')}
                fontColor={colors.black}
                maxLength={appConfig.PASSWORD_MAX_LENGTH}
                getError={getConfirmPasswordError}
                onGetData={getConfirmPassword}
                onSetData={(data: string) => [
                  setConfirmPassword(data),
                  setConfirmPasswordError(''),
                ]}
                placeHolderTextColor={colors.lightGrey}
                secureTextEntry={true}
              />

              <TextInput allowFontScaling={false} style={{ height: 1 }} />
            </View>
            <ButtonComp
              title={useTranslate('UPDATE')}
              onPress={handleValidation}
              btnStyle={{
                // ...styles.footer,
                marginVertical: moderateScaleVertical(30),
                marginHorizontal: moderateScale(22),
              }}
              isLoading={isLoading}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScroll>
    </WrapperContainer>
  );
};

export default ChangePassword;
