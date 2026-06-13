import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import commonStyles from '../../styles/commonStyles';

export default StyleSheet.create({
  container: {
    marginHorizontal: moderateScale(18),
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: moderateScale(1),
  },
  profileImage: {
    height: 105,
    width: 105,
    borderRadius: 52.5,
  },
  nameText: {
    ...commonStyles.boldFont20,
    color: colors.darkblue,
    marginTop: moderateScale(12),
  },
  roleText: {
    ...commonStyles.font14,
    color: colors.lightGrey,
    marginVertical: moderateScale(4),
  },
  tagsContainer: {
    flexDirection: 'row',
    marginVertical: moderateScale(10),
    // paddingHorizontal:moderateScale(5),
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagBox: {
    ...commonStyles.flexRowCenter,
    paddingHorizontal: moderateScale(8),
    minHeight: moderateScaleVertical(32),
    borderRadius: moderateScale(16),
    backgroundColor: colors.lightGreen,
    marginHorizontal: moderateScale(4),
    marginVertical: moderateScaleVertical(2),
  },
  tagText: {
    ...commonStyles.mediumFont14,
    color: colors.green,
  },
  contactIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // height: moderateScale(108),
    backgroundColor: colors.themeColor,
    padding: moderateScale(3),
    borderRadius: moderateScale(16),
    marginBottom:moderateScale(20)
  },
  contactIconBox: {
    flex: 1,
    width: moderateScale(80),
    alignItems: 'center',
  },
  contactIcon: {
    resizeMode: 'contain',
  },
  header: {
    paddingTop: moderateScaleVertical(10),
    paddingStart: moderateScale(5),
  },
  iconLabel: {
    ...commonStyles.font12,
    color: colors.white,
    marginBottom: moderateScale(10),
    marginEnd: moderateScale(-2),
  },
  detailsContainer: {
    marginVertical: moderateScale(12),
  },
  detailLabel: {
    ...commonStyles.font14,
    color: colors.lightGrey,
    marginBottom: moderateScale(4),
  },
  detailValue: {
    ...commonStyles.mediumFont16,
    color: colors.darkblue,
    marginBottom: moderateScale(15),
  },

  exportButton: {
    backgroundColor: colors.themeColor,
    marginTop: moderateScale(15),
    marginHorizontal: moderateScale(18),
  },

  buttonText: {
    ...commonStyles.mediumFont16,
    color: colors.white,
  },
  savedbutton: {
    ...commonStyles.mediumFont16,
    color: colors.white,
  },
  buttonText2: {
    ...commonStyles.mediumFont16,
    color: colors.orange,
  },
  additionalInformation: {
    paddingHorizontal: moderateScale(18),
    paddingVertical: moderateScaleVertical(5),
    marginTop: moderateScaleVertical(-15),
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(6),
  },
  customContentContainer: {
    marginBottom: moderateScale(10), // Add spacing as needed
     
  },
  errorText: {
    ...commonStyles.mediumFont14,
    color: colors.red, // Use red for error text
  },
   
});
