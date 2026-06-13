import React, {FC} from 'react';
import {
  ActivityIndicator,
  ColorValue,
  GestureResponderEvent,
  Image,
  ImageResizeMode,
  ImageStyle,
  ImageURISource,
  Insets,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import { moderateScale } from '../styles/responsiveSize';

interface Props {
  onPress?: (event: GestureResponderEvent) => void;
  btnStyle?: StyleProp<ViewStyle>;
  imgSrc?: ImageURISource;
  disabled?: boolean;
  hitSlop?: Insets;
  imgStyle?: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
  tintColor?: ColorValue;
  activeOpacity?: number;
  loaderColor?: ColorValue;
  indicatorSize?: number;
  isLoading?: boolean;
}

const ImageButton: FC<Props> = props => {
  const {
    onPress = () => {},
    btnStyle = {},
    imgSrc = imagePath.back_top,
    disabled = false,
    hitSlop = {},
    imgStyle = {},
    resizeMode = 'cover' || 'contain' || 'stretch' || 'repeat' || 'center',
    tintColor = undefined,
    activeOpacity = 0.8,
    loaderColor = colors.themeColor,
    indicatorSize = 20,
    isLoading = false,
  } = props;

  return (
    <TouchableOpacity
      style={{
        ...styles.btnTouchContainer,
        ...(btnStyle as object),
      }}
      hitSlop={hitSlop}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={activeOpacity}>
      {isLoading ? (
        <ActivityIndicator size={indicatorSize} color={loaderColor} />
      ) : (
        <Image
          source={imgSrc}
          style={{...(imgStyle as object)}}
          resizeMode={resizeMode}
          tintColor={tintColor}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnTouchContainer: {
  },
});

export default React.memo(ImageButton);
