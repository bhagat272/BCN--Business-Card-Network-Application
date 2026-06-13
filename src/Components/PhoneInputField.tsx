import React, { Ref, useState } from 'react';
import {
  ColorValue,
  Image,
  ImageURISource,
  KeyboardType,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputFocusEventData,
  TextInputSubmitEditingEventData,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { appConfig } from '../constants/appConfig';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import commonStyles, { hitSlopProp } from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';

const PhoneInputField = ({
  reference = undefined,
  leftIcon = undefined,
  inputStyle = {},
  title = '',
  contentType = 'none',
  keyboardType = 'phone-pad', // Changed to phone-pad for numeric input
  placeholder = '',
  onGetData = '',
  onSetData,
  placeHolderTextColor = colors.darkGrey,
  fontColor = colors.black,
  secureTextEntry = false,
  isCustomRight = false,
  CustomRight = () => null,
  getError = '',
  returnType = 'done',
  isEnabled = false,
  onSubmitEditing = () => {},
  onFocus = () => {},
  isTitle = false,
  isRequired = true,
  maxLength = appConfig.PHONE_NUMBER_MAX_LENGTH,
  dialCode = appConfig.DEFAULT_COUNTRY_CODE_DATA.dial_code,
  onChangeCountryCode = () => {},
  flag = appConfig.DEFAULT_COUNTRY_CODE_DATA.flag,
}: {
  reference?: Ref<TextInput>;
  leftIcon?: ImageURISource;
  title?: string;
  contentType: any;
  keyboardType: KeyboardType;
  placeholder: string;
  onGetData: any;
  onSetData: any;
  placeHolderTextColor: ColorValue;
  fontColor: ColorValue;
  secureTextEntry: boolean;
  returnType?: ReturnKeyTypeOptions;
  getError: any;
  isEnabled?: boolean;
  isCustomRight?: boolean;
  CustomRight?: FC;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
  isTitle?: boolean;
  isRequired?: boolean;
  maxLength?: number;
  dialCode?: string;
  flag?: string;
  onChangeCountryCode?: () => void;
  inputStyle?: StyleProp<TextStyle>;
  onFocus?:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [getShow, setShow] = useState(secureTextEntry);

  const handleChangeText = (text: string) => {
    // Allow only numeric characters and '+' at the start
    const numericRegex = /^(\+)?[1-9]\d*$/; // Allows '+' followed by non-zero digit, then any digits
    if (!numericRegex.test(text)) {
      // If invalid, revert to the previous valid value or clear if empty
      if (text.length === 0) {
        onSetData(''); // Allow clearing the field
      } else if (onGetData && onGetData.length > 0) {
        onSetData(onGetData); // Revert to previous valid value
      }
      return;
    }

    // Limit to maxLength
    if (text.length > maxLength) {
      onSetData(text.slice(0, maxLength));
      return;
    }

    onSetData(text); // Update the value if valid
  };

  return (
    <View>
      {isTitle && (
        <Text allowFontScaling={false} style={styles.title}>
          {title}
          {/* {isRequired && <Text allowFontScaling={false} style={styles.asterisk}>*</Text>} */}
        </Text>
      )}
      <View
        style={[
          styles.emailContainer,
          inputStyle,
          {
            borderColor: isFocused ? colors.teal : colors.grey12,
          },
        ]}
      >
        <TouchableOpacity
          onPress={onChangeCountryCode}
          hitSlop={hitSlopProp}
          style={styles.dropdownContainer}
        >
          <Text allowFontScaling={false} style={{ fontSize: textScale(20) }}>
            {flag}
          </Text>
          <Text
            allowFontScaling={false}
            style={{ padding: moderateScale(5), color: colors.black }}
          >
            {dialCode}
          </Text>
          <Image source={imagePath.down_arrow} />
        </TouchableOpacity>
        <TextInput
          allowFontScaling={false}
          ref={reference}
          editable={!isEnabled}
          style={[
            styles.emailFelid,
            onGetData.length === 0 && commonStyles.font14,
          ]}
          textContentType={contentType}
          keyboardType={keyboardType}
          placeholder={placeholder}
          value={onGetData}
          onBlur={() => setIsFocused(false)}
          onFocus={e => {
            setIsFocused(true);
            onFocus(e);
          }}
          onChange={e => handleChangeText(e.nativeEvent.text)} // Use the custom handler
          placeholderTextColor={
            isFocused ? placeHolderTextColor : colors.lightGrey
          }
          secureTextEntry={getShow}
          numberOfLines={1}
          returnKeyType={returnType}
          onSubmitEditing={onSubmitEditing}
          maxLength={maxLength}
        />
        {secureTextEntry === true && (
          <TouchableOpacity onPress={() => setShow(!getShow)}>
            <Image
              style={[styles.rightIconContainer]}
              source={getShow ? imagePath.close_eye : imagePath.open_eye}
            />
          </TouchableOpacity>
        )}
        {isCustomRight && (
          <View style={{ marginRight: moderateScale(10) }}>
            <CustomRight />
          </View>
        )}
      </View>
      {!!title && !isTitle && (
        <Text allowFontScaling={false} style={styles.emailTitle}>
          {title}
          <Text allowFontScaling={false} style={styles.asterisk}>
            *
          </Text>
        </Text>
      )}
      {!!getError && (
        <Text allowFontScaling={false} style={styles.error}>
          {getError}
        </Text>
      )}
    </View>
  );
};

export default PhoneInputField;

const styles = StyleSheet.create({
  emailContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.white,
    elevation: 1,
    alignSelf: 'center',
    borderRadius: moderateScale(16),
    marginTop: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: colors.grey9,
    shadowColor: colors.grey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    marginHorizontal: moderateScale(10),
  },
  emailIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    alignSelf: 'center',
    marginStart: moderateScale(10),
  },
  lineView: {
    width: 1,
    height: moderateScale(20),
    backgroundColor: colors.orange,
    marginStart: moderateScale(10),
    alignSelf: 'center',
  },
  emailFelid: {
    ...commonStyles.mediumFont14,
    flex: 1,
    marginHorizontal: moderateScale(10),
    height: moderateScale(60),
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: moderateScale(15),
  },
  title: {
    ...commonStyles.boldFont16,
    marginStart: moderateScale(12),
    marginTop: moderateScale(5),
    alignSelf: 'flex-start',
    color: colors.deepBlue3,
  },
  emailTitle: {
    position: 'absolute',
    top: 1,
    start: moderateScale(55),
    fontFamily: fontFamily.montserratMedium,
    color: colors.darkGrey,
  },
  error: {
    color: colors.red,
    fontFamily: fontFamily.montserratRegular,
    marginHorizontal: moderateScale(10),
    marginTop: moderateScaleVertical(2),
  },
  rightIconContainer: {
    marginEnd: moderateScale(10),
    resizeMode: 'contain',
    width: moderateScale(25),
    height: moderateScale(25),
  },
  asterisk: {
    color: colors.red,
  },
});
