import React, { Children, FC } from 'react';
import {
  ActivityIndicator,
  ColorValue,
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
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';

interface Props {
  onPress?: any;
  title?: string;
  btnStyle?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  loaderColor?: string;
  disabled?: boolean;
  btnTxtStyle?: StyleProp<TextStyle>;
  indicatorSize?: number;
  isLeftImg?: boolean;
  isRightImg?: boolean;
  leftImgSrc?: ImageURISource;
  rightImgSrc?: ImageURISource;
  leftImgStyle?: StyleProp<ViewStyle>;
  mainViewStyle?: StyleProp<ViewStyle>;
  numberOfLines?: number;
  activeOpacity?: number;
  isLoaderOnImage?: boolean;
  leftImgTintColor?: ColorValue;
}

const ButtonWithImage: FC<Props> = props => {
  const {
    onPress = () => {},
    title = '',
    btnStyle = {},
    isLoading = false,
    loaderColor = colors.white,
    disabled = false,
    btnTxtStyle = {},
    indicatorSize = 20,
    isLeftImg = true,
    isRightImg = false,
    leftImgSrc = imagePath.back_arrow,
    rightImgSrc = imagePath.back_arrow,
    leftImgStyle = {},
    mainViewStyle = {},
    numberOfLines,
    activeOpacity = 0.8,
    isLoaderOnImage = false,
    leftImgTintColor = undefined,
  } = props;

  return (
    <TouchableOpacity
      style={{
        ...styles.btnTouchContainer,
        ...(btnStyle as object),
      }}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={activeOpacity}
    >
      {isLoading && !isLoaderOnImage ? (
        <ActivityIndicator size={indicatorSize} color={loaderColor} />
      ) : (
        <View
          style={{
            ...styles.container,
            ...(mainViewStyle as object),
          }}
        >
          {isLeftImg && (
            <Image
              tintColor={leftImgTintColor}
              source={leftImgSrc}
              style={{
                ...styles.leftImg,
                ...(leftImgStyle as object),
              }}
            />
          )}
          <Text
            allowFontScaling={false}
            numberOfLines={numberOfLines}
            style={{
              ...styles.title,
              ...(btnTxtStyle as object),
            }}
          >
            {title}
          </Text>
          {isRightImg && (
            <View>
              {isLoading && isLoaderOnImage ? (
                <ActivityIndicator size={indicatorSize} color={loaderColor} />
              ) : (
                <Image source={rightImgSrc} />
              )}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnTouchContainer: {
    // backgroundColor: colors.transparent,
    height: moderateScaleVertical(50),
    justifyContent: 'center',
    borderRadius: moderateScale(15),
    borderColor: colors.grey,
    borderWidth: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...commonStyles.font12,
    color: colors.themeColor,
  },
  leftImg: {
    position: 'absolute',
    left: moderateScale(25),
  },
});

export default React.memo(ButtonWithImage);
