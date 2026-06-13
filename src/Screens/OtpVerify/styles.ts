import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {moderateScale} from '../../styles/responsiveSize';
import commonStyles from '../../styles/commonStyles';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
    backgroundColor: colors.AppWhite,
  },
  logoStyle: {
    flexDirection: 'row',
    width: moderateScale(150),
    height: moderateScale(150),
    alignSelf: 'center',
    borderRadius: moderateScale(75),
    marginTop: moderateScale(10),
  },
  loginTitle: {
    flexDirection: 'row',
    textAlign: 'center',
    color: colors.black,
    fontSize: 20,
    marginTop: moderateScale(20),
    fontFamily: fontFamily.montserratSemiBold,
  },
  loginDesc: {
    flexDirection: 'row',
    textAlign: 'center',
    marginTop: moderateScale(5),
    fontFamily: fontFamily.montserratRegular,
    fontSize: 13,
  },
  textInput: {
   
    fontSize: 14,
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: moderateScale(10),
    backgroundColor: colors.white,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: moderateScale(50),
  },
  button: {
    width: '95%',
    alignSelf: 'center',
    marginTop: moderateScale(30),
  },
  otpContainer: {
     alignSelf: 'center',
     marginHorizontal:moderateScale(18)
  },
  resendContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: moderateScale(10),
  },
  resend: {
    ...commonStyles.mediumFont12,
  },
  counter: {
    ...commonStyles.mediumFont12,
    color: colors.orange2,
  },
  resendButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    textDecorationLine: 'underline',
    color: colors.black,
    fontFamily: fontFamily.montserratMedium,
  },
  error: {
    color: colors.red,
    width: '80%',
    alignSelf: 'center',
    fontFamily: fontFamily.montserratRegular,
  },
  resendView: {
    marginTop: moderateScale(10),
    flexDirection: 'row',
    alignSelf: 'center',
  },
});

export default styles;
