import React, { useState } from 'react';
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AuthHeader from '../../Components/AuthHeader';
import ButtonComp from '../../Components/ButtonComp';
import Header from '../../Components/Header';
import KeyboardAwareScroll from '../../Components/KeyboardAwareScroll';
import Logout from '../../Components/Logout';
import Spacer from '../../Components/Spacer';
import TextInputWithLabel from '../../Components/TextInputWithLabel';
import WrapperContainer from '../../Components/WrapperContainer';
import { appConfig } from '../../constants/appConfig';
import imagePath from '../../constants/imagePath';
import { useTranslate } from '../../constants/lang';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import {
  errorMethod,
  isIos,
  showAlert,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import styles from './styles';
import navigationStrings from '../../constants/navigationStrings';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import { t } from 'i18next';
import { useSelector } from 'react-redux';
import { set } from 'lodash';
import NativeLoader from '../../Components/NativeLoader';

const DeleteAccount = ({ navigation }: { navigation: any }) => {
  const { userData } = useSelector((state: any) => state?.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [getPassword, setPassword] = useState<String>('');
  const [getPasswordError, setPasswordError] = useState<String>('');
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoadingDeleteAc, setIsLoadingDeleteAc] = useState(false);

  const handleValidation = () => {
    setPasswordError('');
    let passwordError = validations({
      password: getPassword.toString().trim(),
    });

    if (!!passwordError) {
      setPasswordError(!!passwordError ? passwordError.toString() : '');
    } else {
      // Show confirmation modal when validation is successful
      setModalVisible(true);
    }
  };

  const onForgottPassword = () => {
    setIsLoading(true);
    let json = {
      email: userData.email?.toLowerCase().toString().trim(),
    };
    actions
      .forgotPassword(json)
      .then(response => {
        if (response?.status) {
          showSuccess(response?.message);
          navigation.navigate(navigationStrings.OTP_VERIFY_TOKEN, {
            userDetails: json,
            verify_type: 'FORGOT_PASSWORD',
            isFromDelete: true,
          });
        } else {
          showError(response?.message);
        }
      })
      .catch(errorMethod)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteAccount = (check: boolean) => {
    if (check) {
      setIsLoadingDeleteAc(true); // Start loading indicator
      let json = {
        password: getPassword.toString().trim(),
      };

      actions
        .deleteAccount(json)
        .then((response: any) => {
          if (response?.status) {
            showSuccess(response?.message);
          }
        })
        .catch(errorMethod)
        .finally(() => {
          setModalVisible(false); // Close the modal
          setIsLoadingDeleteAc(false);
        });
    } else {
      setModalVisible(false); // Close the modal
    }
  };

  return (
    <WrapperContainer>
      {isLoading && <NativeLoader />}
      <View style={styles.header}>
        <Header
          centerTitle={useTranslate('DELETE_ACCOUNT')}
          onPressLeftImg={() => navigation.goBack()}
        />
      </View>
      <Spacer space={10} />
      <AuthHeader
        icon={imagePath.logo}
        desc={useTranslate('ENTER_PASSWORD_DELETE_ACCOUNT')}
      />
      <KeyboardAwareScroll
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.keyboard}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View
            style={{
              flex: 1,
            }}
          >
            <TextInputWithLabel
              isLabel={true}
              isRequired={false}
              label={useTranslate('PASSWORD')}
              contentType={'name'}
              keyboardType={'default'}
              placeholder={useTranslate('ENTER_PASSWORD')}
              fontColor={colors.black}
              getError={getPasswordError}
              maxLength={appConfig.PASSWORD_MAX_LENGTH}
              onGetData={getPassword}
              onSetData={(data: String) => {
                setPassword(data);
                setPasswordError('');
              }}
              placeHolderTextColor={colors.lightGrey}
              secureTextEntry={true}
            />
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                // navigation.navigate(navigationStrings.FORGOT_PASSWORD);
                showAlert({
                  title: t('FORGOT_PASSWORD'),
                  message: t('FORGOT_PASSWORD_DESCRIPTION'),
                  yesText: t('CONTINUE'),
                  isNoButton: true,
                  onYes: onForgottPassword,
                });
              }}
              style={{
                ...styles.forgot,
                marginHorizontal: moderateScale(12),
                marginTop: moderateScaleVertical(5),
              }}
            >
              <Text
                allowFontScaling={false}
                allowFontScaling={false}
                style={styles.forgot}
              >
                {useTranslate('FORGOT_PASSWORD')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScroll>
      <View style={styles.footerButton}>
        <ButtonComp
          title={useTranslate('DELETE_ACCOUNT')}
          onPress={handleValidation} // Trigger validation first
        />
      </View>

      {/* CommonModal for confirmation */}
      <View style={commonStyles.alignJustifyCenter}>
        <Logout
          isVisible={isModalVisible}
          message={useTranslate('CONFIRM_DELETE_ACCOUNT')}
          ok={useTranslate('CONFIRM')}
          cancel={useTranslate('CANCEL')}
          onClose={handleDeleteAccount}
          isLoadingLogout={isLoadingDeleteAc}
        />
      </View>
    </WrapperContainer>
  );
};

export default DeleteAccount;
