import {Dimensions, Platform, StatusBar} from 'react-native';
import {isIos} from '../utils/helperFunctions';

const {width, height} = Dimensions.get('window');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

//Default guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const scale = (size: number) => (shortDimension / guidelineBaseWidth) * size;
const verticalScale = (size: number) =>
  (longDimension / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;
const moderateScaleVertical = (size: number, factor = 0.5) =>
  size + (verticalScale(size) - size) * factor;
const textScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const isIPhoneX = () =>
  isIos
    ? (width === X_WIDTH && height === X_HEIGHT) ||
      (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
    : false;

const StatusBarHeight = Platform.select({
  ios: isIPhoneX() ? 44 : 20,
  android: StatusBar.currentHeight,
  default: 0,
});

// resolution of image height
const imageHeightResolution = (height: number) => height / 1.5;
const videoHeightResolution = (height: number) => height / 1.8;

export {
  verticalScale,
  moderateScale,
  moderateScaleVertical,
  textScale,
  height,
  width,
  StatusBarHeight,
  imageHeightResolution,
  videoHeightResolution,
};
