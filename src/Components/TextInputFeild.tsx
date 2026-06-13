import React, { Ref, useState } from 'react';
import {
  ColorValue,
  Image,
  ImageURISource,
  KeyboardType,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../styles/colors';
import imagePath from '../constants/imagePath';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import fontFamily from '../styles/fontFamily';
import commonStyles from '../styles/commonStyles';

const TextInputFelid = ({
  reference = undefined,
  leftIcon = undefined,
  title = '',
  contentType = 'none',
  keyboardType = 'default',
  placeholder = '',
  onGetData = '',
  onSetData,
  placeHolderTextColor = colors.darkGrey,
  fontColor = colors.black,
  secureTextEntry = false,
  getError = '',
  returnType = 'done',
  isEnabled = false,
  onSubmitEditing = () => {},
  isTitle = false,
  isRequired = true,
  maxLength = undefined,
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
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
  isTitle?: boolean;
  isRequired?: boolean;
  maxLength?: number;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [getShow, setShow] = useState(secureTextEntry);
  return (
    <View>
      {isTitle && (
        <Text allowFontScaling={false} style={styles.title}>
          {title}
          {isRequired && (
            <Text allowFontScaling={false} style={styles.asterisk}>
              *
            </Text>
          )}
        </Text>
      )}
      <View style={styles.emailContainer}>
        {!!leftIcon && (
          <Image
            style={styles.emailIcon}
            resizeMode="contain"
            source={leftIcon}
          />
        )}
        {!!leftIcon && (
          <View
            style={[
              styles.lineView,
              {
                backgroundColor: isFocused ? colors.skyBlue : colors.lightGrey,
              },
            ]}
          />
        )}

        <TextInput
          allowFontScaling={false}
          ref={reference}
          editable={!isEnabled}
          style={[
            styles.emailFelid,
            onGetData.length == 0 && commonStyles.font14,
          ]}
          textContentType={contentType}
          keyboardType={keyboardType}
          placeholder={placeholder}
          value={onGetData}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          onChange={data => onSetData(data.nativeEvent.text.toString())}
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
      </View>

      {!!getError && (
        <Text allowFontScaling={false} style={styles.error}>
          {getError}
        </Text>
      )}
    </View>
  );
};

export default TextInputFelid;

const styles = StyleSheet.create({
  emailContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.white,

    alignSelf: 'center',
    borderRadius: moderateScale(10),
    marginTop: moderateScale(10),
    shadowColor: colors.grey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    alignItems: 'center',
    marginHorizontal: moderateScale(10),
  },
  emailIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
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
    flex: 1,
    ...commonStyles.mediumFont14,
    marginHorizontal: moderateScale(10),
    height: moderateScale(60),
  },
  title: {
    ...commonStyles.boldFont13,
    marginStart: moderateScaleVertical(10),
    color: colors.black,
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
