import { StyleSheet } from 'react-native';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import { isIos } from '../../utils/helperFunctions';

const SCAN_AREA_WIDTH = width * 0.9;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraPreview: {
    flex: 1,
    width: width,
    height: height,
    alignSelf: 'center',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFill,

    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningLine: {
    position: 'absolute',
    width: SCAN_AREA_WIDTH,
    height: 2,
    backgroundColor: 'orange',
  },
  scanningArea: {
    width: width * 0.9,
    height: moderateScaleVertical(197),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(10),
  },
  cornerStyle: {
    position: 'absolute',
    width: moderateScale(20),
    height: moderateScaleVertical(20),
    borderColor: colors.red,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderLeftWidth: moderateScale(3),
    borderTopWidth: moderateScale(3),
    borderTopLeftRadius: moderateScale(10),
  },
  topRight: {
    top: 0,
    right: 0,
    borderRightWidth: moderateScale(3),
    borderTopWidth: moderateScale(3),
    borderTopRightRadius: moderateScale(10),
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderLeftWidth: moderateScale(3),
    borderBottomWidth: moderateScale(3),
    borderBottomLeftRadius: moderateScale(10),
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: moderateScale(3),
    borderBottomWidth: moderateScale(3),
    borderBottomRightRadius: moderateScale(10),
  },
  galleryButton: {
    position: 'absolute',
    bottom: moderateScale(18),
    left: moderateScale(15),
  },
  flashButton: {
    position: 'absolute',
    bottom: moderateScale(18),
    right: moderateScale(15),
  },
  overlay: {
    width: '100%',
    position: 'absolute',
    top: moderateScaleVertical(10),
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
    paddingTop: isIos ? moderateScale(30) : 0,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: moderateScale(10),
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: moderateScale(8),
  },
  optionsContainer: {
    flexDirection: 'row',
    marginBottom: moderateScale(8),
    paddingHorizontal: moderateScale(25),
    marginRight: moderateScale(100),
  },
  optionButton: {
    alignItems: 'center',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(14),
  },
  optionText: {
    ...commonStyles.font16,
    color: colors.whiteOpacity80,
  },
  captureButton: {
    width: moderateScale(66),
    height: moderateScale(66),
    borderRadius: moderateScale(33),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: moderateScale(2),
    borderColor: colors.white,
  },
  innerCaptureButton: {
    width: moderateScale(53),
    height: moderateScale(53),
    borderRadius: moderateScale(26.5),
    borderWidth: moderateScale(3),
    borderColor: colors.white,
    backgroundColor: colors.white,
  },
});

export default styles;
