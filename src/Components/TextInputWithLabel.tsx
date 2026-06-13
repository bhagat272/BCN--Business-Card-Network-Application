import React, { FC, Ref, useState } from 'react';
import {
  ColorValue,
  Image,
  ImageStyle,
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
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';

const TextInputWithLabel = ({
  reference = undefined,
  leftIcon = undefined,
  label = '',
  contentType = 'none',
  keyboardType = 'default',
  placeholder = '',
  onGetData = '',
  onSetData,
  placeHolderTextColor = colors.stoneGray,
  secureTextEntry = false,
  clearSearch = false,
  fontColor = colors.black,
  getError = '',
  returnType = 'done',
  isEnabled = false,
  onSubmitEditing = () => {},
  isLabel = false,
  maxLength = undefined,
  isCustomRight = false,
  CustomRight = () => null,
  inputStyle = {}, // New inputStyle prop added
  multiline = false,
  leftIconStyle = {},
  onClearPress = () => {},
  onKeyboardClear = () => {},
  autoCapitalize = undefined,

  onFocus = () => {},
  onBlur = () => {},
}: {
  reference?: Ref<TextInput>;
  leftIcon?: ImageURISource;
  label?: string;
  contentType?: any;
  keyboardType: KeyboardType | undefined;
  placeholder: string;
  onGetData: any;
  onSetData: any;
  placeHolderTextColor?: ColorValue;
  fontColor?: ColorValue;
  secureTextEntry?: boolean;
  returnType?: ReturnKeyTypeOptions;
  getError?: string;
  isEnabled?: boolean;
  clearSearch?: boolean;
  isLabel?: boolean;
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
  isTitle?: boolean;
  onClearPress?: () => void;
  onKeyboardClear?: () => void;
  isRequired?: boolean;
  maxLength?: number;
  isCustomRight?: boolean;
  CustomRight?: FC;
  inputStyle?: StyleProp<TextStyle>; // Type for inputStyle
  leftIconStyle?: StyleProp<ImageStyle>;
  onFocus?:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
  onBlur?:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [getShow, setShow] = useState(secureTextEntry);
  // const [lastText, setLastText] = useState(''); // Store the last text value
  // const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for the timeout

  return (
    <View>
      {isLabel && (
        <Text allowFontScaling={false} style={styles.label}>
          {label}
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
        {!!leftIcon && (
          <Image
            style={[styles.emailIcon, leftIconStyle]}
            resizeMode="contain"
            source={leftIcon}
          />
        )}
        {/* {!!leftIcon && (
          <View
            style={[
              styles.lineView,
              {
                backgroundColor: isFocused
                  ? colors.teal
                  : colors.grey11,
              },
            ]}
          />
        )} */}

        <TextInput
          allowFontScaling={false}
          ref={reference}
          editable={!isEnabled}
          autoCapitalize={autoCapitalize}
          style={[
            styles.emailFelid,
            inputStyle,
            onGetData.length === 0 && commonStyles.font14,
          ]}
          textContentType={contentType}
          keyboardType={keyboardType}
          placeholder={placeholder}
          value={onGetData}
          onBlur={event => {
            setIsFocused(false);
            onBlur(event);
          }}
          onFocus={event => {
            setIsFocused(true);
            onFocus(event);
          }}
          onChangeText={textIn => {
            const trimmedText = textIn.replace(/^[\s]+/g, '');
            const formattedText = trimmedText.replace(/[ ]+/g, ' ');
            if (formattedText === '') {
              // Check if the text is now empty
              onKeyboardClear(); // Call the keyboard clear callback
            }
            onSetData(formattedText);
          }}
          placeholderTextColor={
            isFocused ? placeHolderTextColor : colors.lightGrey
          }
          secureTextEntry={getShow}
          returnKeyType={returnType}
          onSubmitEditing={onSubmitEditing}
          maxLength={maxLength}
          multiline={multiline} // Enable multiline
          numberOfLines={multiline ? undefined : 1} // Set conditional value for numberOfLines
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShow(!getShow)}>
            <Image
              style={[styles.rightIconContainer]}
              source={getShow ? imagePath.close_eye : imagePath.open_eye}
            />
          </TouchableOpacity>
        )}

        {clearSearch && (
          <TouchableOpacity onPress={onClearPress}>
            <Image
              style={[styles.rightIconContainer]}
              source={imagePath.cross_black}
            />
          </TouchableOpacity>
        )}

        {isCustomRight && (
          <View style={{ marginRight: moderateScale(10) }}>
            <CustomRight />
          </View>
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

export default TextInputWithLabel;

const styles = StyleSheet.create({
  emailContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
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
  label: {
    ...commonStyles.boldFont16,
    marginStart: moderateScale(12),
    marginTop: moderateScale(5),
    alignSelf: 'flex-start',
    color: colors.deepBlue3,
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
