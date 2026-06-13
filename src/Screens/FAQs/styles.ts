import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import commonStyles from '../../styles/commonStyles';

export default StyleSheet.create({
  wrapperContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.AppWhite,
    paddingHorizontal: moderateScale(18),
  }, 
  card: {
    backgroundColor: colors.grey10,
    marginVertical: moderateScaleVertical(5),
    borderRadius: moderateScale(12),
    padding: moderateScale(10),
  },
  cardExpansion:{
    flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center' ,
      padding:moderateScale(5)
  },
  title:{
    ...commonStyles.mediumFont14,

  },
  description:{
    ...commonStyles.font13,
     marginStart:moderateScale(6),
    marginTop:moderateScaleVertical(12)
  }
});
