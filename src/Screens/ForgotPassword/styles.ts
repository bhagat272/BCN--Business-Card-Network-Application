import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {moderateScale} from '../../styles/responsiveSize';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.AppWhite,
    paddingHorizontal: moderateScale(12),
  },
  keyboard: {
    flex: 1,
    paddingHorizontal: moderateScale(12),
    paddingBottom: moderateScale(10),
  },
  footerButton: {
    position: 'absolute',
    bottom: moderateScale(10),
    start: 0,
    end: 0,
  },
});

export default styles;
