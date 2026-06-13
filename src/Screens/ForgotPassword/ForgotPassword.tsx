import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import AuthHeader from '../../Components/AuthHeader';
import ButtonComp from '../../Components/ButtonComp';
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
  errorMethod,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import styles from './styles';
import TextInputWithLabel from '../../Components/TextInputWithLabel';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import KeyboardAwareScroll from '../../Components/KeyboardAwareScroll';
import Spacer from '../../Components/Spacer';

const ForgotPassword = ({ navigation }: { navigation: any }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [getEmail, setEmail] = useState<String>('');
  const [getEmailError, setEmailError] = useState<String>('');

  const handleValidation = () => {
    setEmailError('');
    let emailError = validations({ email: getEmail.toString().trim() });

    if (!!emailError) {
      setEmailError(!!emailError ? emailError.toString() : '');
    } else {
      setIsLoading(true);
      let json = {
        email: getEmail.toLowerCase().toString().trim(),
      };
      actions
        .forgotPassword(json)
        .then(response => {
          if (response?.status) {
            showSuccess(response?.message);
            navigation.navigate(navigationStrings.OTP_VERIFY, {
              userDetails: json,
              verify_type: 'FORGOT_PASSWORD',
            });
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
      <Spacer space={40} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <AuthHeader
          icon={imagePath.logo}
          title={useTranslate('FORGOT_PASSWORD_')}
          desc={useTranslate('ENTER_YOUR_REGISTERED_EMAIL_TO_RECEIVE_OTP')}
        />
        <TextInputWithLabel
          isRequired={false}
          isLabel={true}
          autoCapitalize={'none'}
          label={useTranslate('EMAIL_ADDRESS')}
          contentType={'name'}
          keyboardType={'email-address'}
          placeholder={useTranslate('ENTER_EMAIL')}
          fontColor={colors.black}
          getError={getEmailError}
          onGetData={getEmail.toLowerCase()}
          onSetData={(data: String) => {
            setEmail(data);
            setEmailError('');
          }}
          placeHolderTextColor={colors.lightGrey}
          secureTextEntry={false}
        />
        <View style={styles.footerButton}>
          <ButtonComp
            title={useTranslate('VERIFY')}
            onPress={() => handleValidation()}
            btnStyle={{
              marginHorizontal: moderateScale(18),
            }}
            isLoading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

export default ForgotPassword;
