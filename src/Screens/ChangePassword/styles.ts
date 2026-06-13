import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.appWhite,
  },
  header: {
    paddingTop: moderateScaleVertical(10),
  },
  content: {
    flex: 1,
    paddingHorizontal: moderateScale(12),
  },
});

export default styles;
