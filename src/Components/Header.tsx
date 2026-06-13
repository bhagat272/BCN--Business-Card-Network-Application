import React, { FC } from 'react';
import {
  ActivityIndicator,
  ColorValue,
  GestureResponderEvent,
  Image,
  ImageURISource,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import commonStyles, { hitSlopProp } from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import { isIos } from '../utils/helperFunctions';
import ImageButton from './ImageButton';

interface Props {
  leftImg?: ImageURISource;
  centerImg?: ImageURISource;
  rightImg?: ImageURISource;
  onPressLeftImg?: (event: GestureResponderEvent) => void;
  onPressCenterImg?: (event: GestureResponderEvent) => void;
  onPressRightImg?: (event: GestureResponderEvent) => void;
  onPressRightText?: (event: GestureResponderEvent) => void;
  isLeftTitle?: boolean;
  leftTitle?: string;
  isRight?: boolean;
  isCenterTitle?: boolean;
  centerTitle?: string;
  isRightIcon?: boolean;
  mainContainer?: StyleProp<ViewStyle>;
  leftContainer?: StyleProp<ViewStyle>;
  leftTitleStyle?: StyleProp<TextStyle>;
  isLeftImg?: boolean;
  isLeftTitleImg?: boolean;
  rightImg1?: ImageURISource;
  tintColor?: ColorValue;
  rightImg1BtnDisabled?: boolean;
  leftImgBtnDisabled?: boolean;
  rightImg1Loading?: boolean;
  rightImg1TintColor?: ColorValue;
  isLoadingRight?: boolean;
  loaderColor?: ColorValue;
  isRightIcon2?: boolean;
  onPressRightImg2?: (event: GestureResponderEvent) => void;
  rightImg2?: ImageURISource;
  centerTitleStyle?: StyleProp<TextStyle>;
  isSpace?: boolean;
  isRightText?: boolean;
}

const Header: FC<Props> = props => {
  const {
    leftImg = imagePath.back_ic,
    centerImg = imagePath.back_ic,
    rightImg = imagePath.back_ic,
    onPressLeftImg = () => {},
    onPressCenterImg = () => {},
    onPressRightImg = () => {},
    isLeftTitle = false,
    leftTitle = '',
    isRight = false,
    isCenterTitle = true,
    centerTitle = '',
    isRightIcon = false,
    onPressRightText = () => {},
    isRightText = false,
    mainContainer = {},
    isSpace = false,
    leftContainer = {},
    leftTitleStyle = {},
    isLeftImg = true,
    isLeftTitleImg = true,
    rightImg1 = imagePath.back_top,
    tintColor = undefined,
    rightImg1BtnDisabled = false,
    leftImgBtnDisabled = false,
    rightImg1Loading = false,
    rightImg1TintColor = undefined,
    isLoadingRight = false,
    loaderColor = colors.themeColor,
    isRightIcon2 = false,
    centerTitleStyle = {},
    onPressRightImg2 = () => {},
    rightImg2 = imagePath.back_top,
  } = props;

  const insets = useSafeAreaInsets();
  const isModernIPhone = insets.top > 20;
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        ...styles.mainCont,
        marginTop: isModernIPhone ? 0 : isIos ? 20 : 7,
        ...(mainContainer as object),
      }}
    >
      {isLeftTitle ? (
        <View style={{ ...styles.container, ...(leftContainer as object) }}>
          <View style={styles.leftTitleContainer}>
            {isLeftTitleImg && (
              <ImageButton
                disabled={leftImgBtnDisabled}
                imgSrc={leftImg}
                hitSlop={hitSlopProp}
                onPress={onPressLeftImg}
                tintColor={tintColor}
                resizeMode="contain"
              />
            )}
            <Text
              allowFontScaling={false}
              style={{ ...styles.leftTitle, ...(leftTitleStyle as object) }}
            >
              {leftTitle}
            </Text>
          </View>
          {isRight && (
            <View>
              {isLoadingRight ? (
                <ActivityIndicator color={loaderColor} size={'small'} />
              ) : (
                <ImageButton
                  disabled={rightImg1BtnDisabled || rightImg1Loading}
                  onPress={onPressRightImg}
                  imgSrc={rightImg1}
                  hitSlop={hitSlopProp}
                  tintColor={rightImg1TintColor}
                />
              )}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.centerContainer}>
          {isLeftImg ? (
            <ImageButton
              imgSrc={leftImg}
              hitSlop={hitSlopProp}
              onPress={onPressLeftImg}
              resizeMode="contain"
            />
          ) : (
            <View />
          )}
          {isCenterTitle ? (
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text
                allowFontScaling={false}
                style={[styles.centerTitle, centerTitleStyle]}
              >
                {centerTitle}
              </Text>
            </View>
          ) : (
            <ImageButton imgSrc={centerImg} onPress={onPressCenterImg} />
          )}
          {isRightIcon || isRightIcon2 ? (
            <View style={commonStyles.flexRowCenter}>
              {isRightIcon && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  hitSlop={hitSlopProp}
                  onPress={onPressRightImg}
                >
                  <Image
                    source={rightImg}
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                      height: 34,
                      width: 34,
                    }}
                  />
                </TouchableOpacity>
              )}
              {isSpace && <View style={styles.space} />}
              {isRightIcon2 && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  hitSlop={hitSlopProp}
                  onPress={onPressRightImg2}
                >
                  <Image
                    source={rightImg2}
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                      height: 34,
                      width: 34,
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.dummyView} />
          )}
          {isRightText && (
            <TouchableOpacity
              activeOpacity={0.8}
              hitSlop={hitSlopProp}
              onPress={onPressRightText}
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ position: 'absolute', right: 10 }}
            >
              <Text
                allowFontScaling={false}
                style={{
                  ...commonStyles.mediumFont15,
                  color: colors.themeColor,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default React.memo(Header);

const styles = StyleSheet.create({
  container: {
    ...commonStyles.flexRowJustifySpaceBtwn,
    alignItems: 'center',
    paddingHorizontal: moderateScale(18),
  },
  leftTitleContainer: {
    ...commonStyles.flexRowCenter,
  },
  leftTitle: {
    ...commonStyles.mediumFont20,
    color: colors.themeColor,
    marginLeft: moderateScale(12),
  },
  centerTitle: {
    ...commonStyles.mediumFont18,
    fontFamily: fontFamily.montserratSemiBold,
    // color: colors.white,
  },
  cartCountView: {
    backgroundColor: colors.themeColor,
    height: moderateScale(16),
    width: moderateScale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -4,
    top: -4,
    zIndex: 1,
  },
  cartCountText: {
    ...commonStyles.font10,
    fontSize: textScale(8),
    color: colors.white,
  },
  mainCont: {
    marginVertical: isIos ? 0 : moderateScaleVertical(7),
  },
  centerTitleView: {
    alignSelf: 'center',
  },
  centerContainer: {
    paddingHorizontal: moderateScale(18),
    flexDirection: 'row',
    alignItems: 'center',
  },
  dummyView: { height: '100%', width: moderateScale(44) },
  space: {
    paddingLeft: moderateScale(10),
  },
});
