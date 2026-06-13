import {Dimensions, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import commonStyles from '../../styles/commonStyles';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: colors.AppWhite,
  },
  keyboardContainer: {
    flex: 1,
    width: '100%',
    // justifyContent: 'center',
  },
  activeDot: {
    width: moderateScale(28),
    height: moderateScale(6),
    backgroundColor: colors.themeColor,
    marginHorizontal: moderateScale(2),
    marginTop: 10,
  },
  inactiveDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    backgroundColor: colors.slateGray,
    marginHorizontal: moderateScale(2),
    marginTop: 10,
  },
  childItemContainer: {
    // width: WIDTH,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: moderateScale(20),
  },
  childItemImage: {
    // width: WIDTH * 0.9,
    // height: WIDTH,
  },
  title: {
    flexDirection: 'row',
    color: colors.darkblue,
    fontSize: textScale(24),
    textAlign: 'left',
    fontFamily: fontFamily.montserratSemiBold,
    marginTop: moderateScale(24),
    marginHorizontal: moderateScale(30),
  },
  desc: {
    fontSize: textScale(16),
    marginTop: moderateScale(10),
    textAlign: 'left',
    fontFamily: fontFamily.montserratMedium,
    color: colors.dimGrey,
    marginHorizontal: moderateScale(30),
  },
  // skip: {
  //   backgroundColor: colors.transparent,
  // },
  skipText: {
    color: colors.darkblue,
    textDecorationLine: 'underline',
    fontFamily: fontFamily.montserratMedium,
  },

  paginationContainer: {
    ...commonStyles.flexRowCenter,
    alignSelf: 'center',
    marginVertical: moderateScaleVertical(20),
  },
  paginationDot: {
    height: moderateScale(6),
    width: moderateScale(6),
    borderRadius: moderateScale(3),
  },
});

export default styles;
