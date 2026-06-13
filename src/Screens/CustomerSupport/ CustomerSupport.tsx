import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import imagePath from '../../constants/imagePath';
import Header from '../../Components/Header';
import { useTranslate } from '../../constants/lang';
import WrapperContainer from '../../Components/WrapperContainer';
import colors from '../../styles/colors';
import KeyboardAwareScroll from '../../Components/KeyboardAwareScroll';
import ButtonComp from '../../Components/ButtonComp';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import Spacer from '../../Components/Spacer';
import { hitSlopProp } from '../../styles/commonStyles';
import TextInputWithLabel from '../../Components/TextInputWithLabel';
import validations from '../../utils/validations';
import styles from './styles';
import actions from '../../redux/actions';
import {
  errorMethod,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import { useSelector } from 'react-redux';
import { use } from 'i18next';
import { appConfig } from '../../constants/appConfig';

const CustomerSupport = (props: any) => {
  const { navigation } = props;
  const { userData } = useSelector((state: any) => state.auth);
  const [priority, setPriority] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [getTitleError, setNameError] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState<string>('');
  const [email, setEmail] = useState<string>(''); // State for email
  const [emailError, setEmailError] = useState<string>(''); // Email error state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userData) {
      setName(userData.user_name ? userData.user_name : '');
      setEmail(userData.email ? userData.email : '');
    }
  }, [userData]);

  const onSubmit = () => {
    setNameError('');
    setDescriptionError('');
    setEmailError('');

    // Validate name
    let titleValidationError = validations({ name: name.trim() });

    // Validate description
    let descriptionValidationError = validations({
      description: description.trim(),
    });

    // Validate email (add email validation logic here)
    let emailValidationError = validations({ email: email.trim() });

    if (
      titleValidationError ||
      descriptionValidationError ||
      emailValidationError
    ) {
      setNameError(titleValidationError || '');
      setDescriptionError(descriptionValidationError || '');
      setEmailError(emailValidationError || '');
    } else {
      setIsLoading(true);
      let json = {
        name: name.trim(),
        email: email.trim(),
        description: description.trim(),
      };
      actions
        .contactUs(json)
        .then(response => {
          if (response?.status === 'true') {
            showSuccess(response?.message);
            // setEmail('');
            setDescription('');
            // setName('');
            navigation?.goBack();
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
      <Header
        centerTitle={useTranslate('CUSTOMER_SUPPORT')}
        onPressLeftImg={() => navigation.goBack()}
      />
      <KeyboardAwareScroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.safeArea}
      >
        <Spacer space={20} />
        <View style={styles.inputContainer}>
          <View style={styles.input}>
            <TextInputWithLabel
              isLabel={true}
              label={useTranslate('NAME')}
              contentType={'Name'}
              keyboardType={'default'}
              placeholder={useTranslate('ENTER_NAME')}
              fontColor={colors.black}
              getError={getTitleError}
              onGetData={name}
              onSetData={(data: React.SetStateAction<string>) => [
                setName(data),
                setNameError(''),
              ]}
              placeHolderTextColor={colors.slateGray}
              secureTextEntry={false}
              returnType="next"
              maxLength={appConfig.NAME_TEXT_INPUT_LENGTH}
            />
          </View>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <View style={styles.input}>
            <TextInputWithLabel
              isLabel={true}
              label={useTranslate('EMAIL')}
              contentType={'email'}
              keyboardType={'email-address'}
              placeholder={useTranslate('ENTER_EMAIL')}
              fontColor={colors.black}
              getError={emailError}
              onGetData={email}
              onSetData={(data: React.SetStateAction<string>) => [
                setEmail(data),
                setEmailError(''),
              ]}
              placeHolderTextColor={colors.slateGray}
              secureTextEntry={false}
              returnType="next"
              maxLength={100}
            />
          </View>
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <View style={styles.input}>
            <TextInputWithLabel
              isLabel={true}
              label={useTranslate('DESCRIPTION')}
              placeholder={useTranslate('ENTER_DESCRIPTION')}
              placeHolderTextColor={colors.slateGray2}
              keyboardType={'default'}
              contentType={'Description'}
              fontColor={colors.black}
              onGetData={description}
              getError={descriptionError}
              onSetData={(data: React.SetStateAction<string>) => [
                setDescription(data),
                setDescriptionError(''),
              ]}
              maxLength={500}
              secureTextEntry={false}
              returnType="next"
              inputStyle={styles.textarea}
              multiline={true}
            />
          </View>
        </View>
        <View style={styles.footerButton}>
          <ButtonComp
            title={useTranslate('SUBMIT')}
            onPress={onSubmit}
            isLoading={isLoading}
            disabled={isLoading}
            btnStyle={{
              marginTop: moderateScaleVertical(30),
              marginHorizontal: moderateScale(0),
            }}
          />
        </View>
      </KeyboardAwareScroll>
    </WrapperContainer>
  );
};

export default CustomerSupport;
