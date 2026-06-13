import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import { moderateScale, moderateScaleVertical } from '../../styles/responsiveSize';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header:{
    paddingTop:moderateScaleVertical(10),
    paddingStart:moderateScale(5)
  },
  keyboard: {
    flex: 1,
    backgroundColor: colors.AppWhite,
  },
});

export default styles;
