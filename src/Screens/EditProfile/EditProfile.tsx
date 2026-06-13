import React, { useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import ButtonComp from '../../Components/ButtonComp';
import ButtonWithImage from '../../Components/ButtonWithImage';
import DropDown from '../../Components/DropDown';
import FastImageLoad from '../../Components/FastImageLoad';
import Header from '../../Components/Header';
import ImagePicker from '../../Components/ImagePicker';
import KeyboardAwareScroll from '../../Components/KeyboardAwareScroll';
import PhoneInputField from '../../Components/PhoneInputField';
import Spacer from '../../Components/Spacer';
import TextInputWithLabel from '../../Components/TextInputWithLabel';
import WrapperContainer from '../../Components/WrapperContainer';
import { getCompleteImageUrl } from '../../config/urls';
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
  APP_LOG,
  compressMedia,
  errorMethod,
  isIos,
  showSuccess,
} from '../../utils/helperFunctions';
import { openCamera, openPicker } from '../../utils/ImagePicker';
import {
  requestCameraPermission,
  requestStoragePermission,
} from '../../utils/permissions';
import validations, { regx } from '../../utils/validations';
import styles from './styles';
import { appConfig } from '../../constants/appConfig';
import { Countries, COUNTRIES_CODE_FLAG } from '../../utils/commonData';
import CountryCodePicker from '../../Components/CountryCodePicker';
import ImageButton from '../../Components/ImageButton';
import { hitSlopProp } from '../../styles/commonStyles';
import ImageCropPicker from 'react-native-image-crop-picker';

let countries: Countries[] = COUNTRIES_CODE_FLAG;

const EditProfile = (props: any) => {
  const { route, navigation } = props;

  const paramData = route?.params;
  const { userData } = useSelector((state: any) => state?.auth);
  const [isMediaPickerModal, setMediaPickerModal] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const userNameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const { userType } = useSelector((state: any) => state?.auth || {});
  const [getEmail, setEmail] = useState<string>(userData?.email || '');
  const [getName, setName] = useState<string>(userData?.user_name || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [getEmailError, setEmailError] = useState<string>('');
  const [getNameError, setNameError] = useState<string>('');
  const [getPhoneNumberError, setPhoneNumberError] = useState<string>('');
  const [getPhoneNumber, setPhoneNumber] = useState<string>(
    userData?.mobile || '',
  );
  const [getFile, setFile] = useState<any>(
    !!userData?.profile_picture
      ? {
          path: getCompleteImageUrl(userData?.profile_picture),
        }
      : null,
  );

  const [getCompanyName, setCompanyName] = useState<string>(
    userData?.company_name || '',
  );
  const [getCompanyNameError, setCompanyNameError] = useState<string>('');

  const [countryDialCodeData, setCountryDialCodeData] = useState<Countries>(
    !!userData?.country_code
      ? COUNTRIES_CODE_FLAG.find(
          country => country.code === userData?.country_code_name,
        ) || appConfig.DEFAULT_COUNTRY_CODE_DATA
      : // ? COUNTRIES_CODE_FLAG.find(country => country.dial_code === userData?.country_code) || appConfig.DEFAULT_COUNTRY_CODE_DATA
        appConfig.DEFAULT_COUNTRY_CODE_DATA,
  );

  const [getType, setType] = useState<string>(
    userType == 'user' ? '1' : userType == 'nonprofit' ? '2' : '3',
  );
  const [getTypeError, setTypeError] = useState<string>('');
  const [loadingIndexProfile, setLoadingIndexProfile] = useState<number | null>(
    null,
  );

  const [isCountryCodePicker, setIsCountryCodePicker] =
    useState<boolean>(false);

  const [isLoadingVerifyEmail, setIsLoadingVerifyEmail] = useState(false);

  const updateProfile = () => {
    setNameError('');
    setEmailError('');
    setTypeError('');
    setPhoneNumberError('');

    let nameError = validations({ name: (getName || '').toString().trim() });
    let emailError = validations({ email: (getEmail || '').toString().trim() });
    let phoneNumberError = validations({
      phoneNumber: (getPhoneNumber || '').toString().trim(),
    });
    // let companyNameError = validations({
    //   name: (getCompanyName || '').toString().trim(),
    // });

    if (
      !!nameError ||
      !!emailError ||
      // !!companyNameError ||
      !!phoneNumberError ||
      (paramData?.isVerifiedEmail
        ? paramData?.verified_email !== getEmail
        : getEmail !== userData?.email)
    ) {
      // setCompanyNameError(
      //   !!companyNameError ? companyNameError.toString() : '',
      // );

      setNameError(!!nameError ? nameError.toString() : '');
      setEmailError(() => {
        if (emailError) {
          return emailError.toString();
        }

        if (paramData?.isVerifiedEmail) {
          // If the email is verified, check against `paramData.verified_email`
          return paramData?.verified_email !== getEmail
            ? useTranslate('PLEASE_VERIFY_EMAIL')
            : '';
        } else {
          // If the email is not verified, check against `userData.email`
          return getEmail !== userData?.email
            ? useTranslate('PLEASE_VERIFY_EMAIL')
            : '';
        }
      });
      setPhoneNumberError(
        !!phoneNumberError ? phoneNumberError.toString() : '',
      );
    } else {
      setIsLoading(true);
      let formData = new FormData();
      formData.append('user_name', getName.toString().trim());
      formData.append('phone_number', getPhoneNumber.toString().trim());
      formData.append('country_code', countryDialCodeData.dial_code);
      formData.append('company_name', getCompanyName.toString().trim());
      formData.append('email', getEmail.toString().trim());
      formData.append('country_code_name', countryDialCodeData.code);

      userData?.profile_picture !== getFile?.path &&
        !!getFile?.path &&
        getFile?.path.includes('file://') &&
        formData.append('profile_picture', {
          name: getFile?.path.substring(getFile?.path.lastIndexOf('/') + 1),
          uri: getFile?.path,
          type: getFile?.type || getFile?.mime,
        });
      actions
        .retryAdditionalImage(formData)
        .then(async (response: any) => {
          showSuccess(response?.message);

          actions.onSaveUserDataInKeyChain({ ...userData, ...response?.data });
          navigation?.goBack();
        })
        .catch(errorMethod)
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const onCamera = async () => {
    try {
      const permissionRes = await requestCameraPermission();
      if (permissionRes !== 'granted') {
        APP_LOG('Permission not granted');
        return;
      }
      const res: any = await openCamera({ mediaType: 'photo' });
      const newMediaPath = await compressMedia(res?.path);
      setFile({ ...res, path: newMediaPath });
    } catch (error) {
    } finally {
      setMediaPickerModal(false);
    }
  };
  const onPhotoGallery = async () => {
    try {
      if (isIos) {
        const permissionRes = await requestStoragePermission();
        if (permissionRes !== 'granted') {
          APP_LOG('Permission not granted');
          return;
        }
      }
      const res: any = await openPicker({ mediaType: 'photo' });
      const newMediaPath = await compressMedia(res?.path);
      setFile({ ...res, path: newMediaPath });
    } catch (error) {
    } finally {
      setMediaPickerModal(false);
    }
  };

  const onUpdateEmail = () => {
    setEmailError('');
    let emailError = validations({ email: getEmail.toString().trim() });
    if (emailError) {
      setEmailError(!!emailError ? emailError.toString() : '');
    } else {
      Keyboard.dismiss();
      setIsLoadingVerifyEmail(true);

      let apiData = {
        email: getEmail,
        previous_email: userData?.email,
      };
      actions
        .sendOtpToEmail(apiData)
        .then((res: any) => {
          showSuccess(res?.message);
          navigation.navigate(navigationStrings.OTP_VERIFY_TOKEN, {
            userDetails: apiData,
            verify_type: 'EDIT_EMAIL',
          });
        })
        .catch(errorMethod)
        .finally(() => setIsLoadingVerifyEmail(false));
    }
  };

  const onCountryChange = (data: Countries) => {
    setCountryDialCodeData(data);
  };

  const isProfileNotEditable = () => {
    const isProfilePictureSame =
      (userData?.profile_picture
        ? getCompleteImageUrl(userData?.profile_picture)
        : userData?.profile_picture || '') === (getFile?.path || '');

    const isNameSame = userData?.name === getName.trim();
    const isCompanyNameSame = userData?.company_name === getCompanyName.trim();
    const isEmailSame = userData?.email === getEmail.trim();

    const isPhoneCodeSame =
      userData?.phone_code === countryDialCodeData.dial_code;

    const isPhoneNumberSame = userData?.phone_number === getPhoneNumber.trim();

    return (
      isProfilePictureSame &&
      isNameSame &&
      isEmailSame &&
      isPhoneCodeSame &&
      isCompanyNameSame &&
      isPhoneNumberSame
    );
  };

  const onChangeTxt = (text: string = '') => {
    if (text !== '' && !regx.numericRegex.test(text)) {
      return;
    }
    setPhoneNumber(text);
    setPhoneNumberError('');
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const CustomRight = () => (
    <ButtonWithImage
      disabled={
        paramData?.isVerifiedEmail && paramData?.verified_email == getEmail
      }
      isLoading={isLoadingVerifyEmail}
      loaderColor={colors.themeColor}
      onPress={onUpdateEmail}
      title={useTranslate(
        paramData?.isVerifiedEmail && paramData?.verified_email == getEmail
          ? 'VERIFIED'
          : 'VERIFY',
      )}
      btnStyle={styles.verifyBtn}
      isLeftImg={true}
      leftImgStyle={styles.leftImg}
      leftImgTintColor={colors.themeColor}
      leftImgSrc={imagePath.verify}
    />
  );

  return (
    <WrapperContainer>
      <View style={styles.header}>
        <Header
          centerTitle={useTranslate('EDIT_PROFILE')}
          onPressLeftImg={() => navigation.goBack()}
        />
      </View>
      <KeyboardAwareScroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.safeArea}
      >
        {/* profile image */}
        <View style={styles.profileContainer}>
          <FastImageLoad
            parentStyle={styles.profileImage2}
            style={{ ...styles.profileImage }}
            resizeMode="cover"
            source={
              !!getFile?.path
                ? {
                    uri: getFile?.path,
                  }
                : imagePath.default_user
            }
            defaultImage={imagePath.name_icon}
          />
          <ImageButton
            imgSrc={imagePath.edit_icon}
            btnStyle={styles.editIconImage}
            imgStyle={{
              height: moderateScaleVertical(38),
              width: moderateScale(38),
            }}
            onPress={() => {
              Keyboard.dismiss();
              setMediaPickerModal(true);
            }}
            hitSlop={hitSlopProp}
          />
        </View>

        <TextInputWithLabel
          isRequired={true}
          reference={userNameRef}
          isLabel={true}
          label={useTranslate('NAME')}
          contentType={'name'}
          keyboardType={'default'}
          placeholder={useTranslate('ENTER_USERNAME')}
          fontColor={colors.black}
          getError={getNameError}
          onGetData={getName}
          onSetData={(data: React.SetStateAction<string>) => [
            setName(data),
            setNameError(''),
          ]}
          placeHolderTextColor={colors.lightGrey}
          secureTextEntry={false}
          maxLength={appConfig.NAME_TEXT_INPUT_LENGTH}
        />
        <Spacer space={10} />
        <TextInputWithLabel
          // isEnabled={true}
          reference={emailRef}
          isRequired={true}
          label={useTranslate('EMAIL_ADDRESS')}
          isLabel={true}
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
            !!userNameRef.current && userNameRef.current.focus()
          }
          isCustomRight={!!getEmail && getEmail !== userData?.email}
          CustomRight={CustomRight}
        />
        <Spacer space={10} />
        <PhoneInputField
          reference={phoneRef}
          isRequired={true}
          title={useTranslate('MOBILE_NUMBER')}
          placeholder={useTranslate('ENTER_MOBILE_NUMBER')}
          keyboardType="numeric"
          onGetData={getPhoneNumber}
          onSetData={onChangeTxt}
          // onSetData={(data: React.SetStateAction<string>) => [
          //   setPhoneNumber(data),
          //   setPhoneNumberError(''),
          // ]}
          getError={getPhoneNumberError}
          isTitle={true}
          onSubmitEditing={() => !!phoneRef.current && phoneRef.current.focus()}
          contentType={undefined}
          placeHolderTextColor={''}
          fontColor={''}
          secureTextEntry={false}
          dialCode={countryDialCodeData.dial_code}
          onChangeCountryCode={() => setIsCountryCodePicker(true)}
          flag={countryDialCodeData.flag}
        />
        {/* Company Name */}
        <Spacer space={10} />
        <TextInputWithLabel
          isRequired={true}
          isLabel={true}
          label={useTranslate('COMPANY_NAME')}
          contentType={'organizationName'}
          keyboardType={'default'}
          placeholder={useTranslate('ENTER_COMPANY_NAME')}
          fontColor={colors.black}
          getError={getCompanyNameError}
          onGetData={getCompanyName}
          maxLength={30}
          onSetData={(data: React.SetStateAction<string>) => [
            setCompanyName(data),
            setCompanyNameError(''),
          ]}
          placeHolderTextColor={colors.lightGrey}
          secureTextEntry={false}
        />

        <Spacer space={20} />

        <ButtonComp
          disabled={isProfileNotEditable() || isLoadingVerifyEmail}
          title={useTranslate('UPDATE')}
          gradientColors={
            isProfileNotEditable()
              ? [colors.grey2, colors.grey2]
              : [colors.themeColor, colors.deepTeal]
          }
          isLoading={isLoading}
          onPress={updateProfile}
        />
      </KeyboardAwareScroll>
      {isMediaPickerModal && (
        <ImagePicker
          isVisible={isMediaPickerModal}
          onCamera={onCamera}
          onCloseReportUserModal={() => setMediaPickerModal(false)}
          onPhotoGallery={onPhotoGallery}
        />
      )}
      {isCountryCodePicker && (
        <CountryCodePicker
          isVisible={isCountryCodePicker}
          onClosePickerModal={() => {
            setIsCountryCodePicker(false);
            setTimeout(() => {
              Keyboard.dismiss();
            }, 500);
          }}
          onCountryChange={onCountryChange}
        />
      )}
    </WrapperContainer>
  );
};

export default EditProfile;
