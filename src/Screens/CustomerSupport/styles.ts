import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {moderateScale, moderateScaleVertical} from '../../styles/responsiveSize';
import commonStyles from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';

const styles = StyleSheet.create({
 
  safeArea: {
    flex: 1,
    backgroundColor: colors.AppWhite,
    paddingHorizontal:moderateScale(18)
  },
  inputContainer: {
    marginBottom: moderateScale(16),
  },
  label: {
   ...commonStyles.boldFont16,
   },
 
  input: {
     marginHorizontal:moderateScale(-10),
    },
  textarea: {
       ...commonStyles.font14,
      borderRadius: moderateScale(12),
      textAlignVertical: 'top', // Ensure text starts from the top
      height: moderateScaleVertical(184),
     },
  radioContainer: {
    paddingTop:moderateScale(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: moderateScale(25),
  },
  radioText: {
    ...commonStyles.font15,
    marginLeft: moderateScale(8),
   },
  submitButton: {
    backgroundColor: 'purple',
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
 
  footerButton:{
    position: 'absolute',
    bottom: moderateScale(30),
    start: 0,
    end: 0,
  }
});

export default styles;
