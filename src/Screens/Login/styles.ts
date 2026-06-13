import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import commonStyles from '../../styles/commonStyles';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.AppWhite,
  },
  keyboard: {
    flex: 1,
    paddingHorizontal: moderateScale(12),
  },
  forgotContainer: {
    flexDirection: 'row',
    marginTop: moderateScaleVertical(20),
    alignSelf: 'center',
    // marginHorizontal: moderateScale(0),
    marginEnd: moderateScale(14),
  },
  forgot: {
    ...commonStyles.mediumFont14,
    flex: 1,
    flexDirection: 'row',
    textAlign: 'right',
    textDecorationLine: 'underline',
    color: colors.bottomBarColor,
  },
  button: {
    alignSelf: 'center',
    marginTop: moderateScaleVertical(30),
  },
});

export default styles;
