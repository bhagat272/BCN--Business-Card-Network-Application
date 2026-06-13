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
    paddingBottom: moderateScale(10),
  },
  header: {
    paddingStart: moderateScale(10),
    paddingTop: moderateScaleVertical(10),
  },
  footerButton: {
    position: 'absolute',
    bottom: moderateScale(30),
    start: 0,
    end: 0,
    marginHorizontal: moderateScale(12),
  },
  forgot: {
    ...commonStyles.mediumFont14,
    textAlign: 'right',
    textDecorationLine: 'underline',
    color: colors.bottomBarColor,
    alignSelf: 'flex-end',
  },
});

export default styles;
