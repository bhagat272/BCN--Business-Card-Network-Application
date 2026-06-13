import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flexGrow: 1,
    paddingTop: moderateScaleVertical(10),
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    padding: moderateScale(12),
    alignItems: 'center',
    marginBottom: moderateScaleVertical(8),
    borderRadius: moderateScale(16),
    marginHorizontal: moderateScale(16),
    backgroundColor: colors.white,
    // shadowColor: colors.transparentBlack,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.0,
    elevation: 5,
    marginTop: 10,
  },
  cardDetails: {
    flex: 1,
  },
  profileImage: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    marginRight: moderateScale(12),
  },
  name: {
    ...commonStyles.boldFont18,
    color: colors.darkblue,
  },
  email: {
    ...commonStyles.font14,
    color: colors.darkGrey,
  },
  rightImage: {
    height: moderateScale(22),
    width: moderateScale(22),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...commonStyles.font14,
    color: colors.darkblue,
  },
  footerButton: {
    position: 'absolute',
    bottom: moderateScale(10),
    start: 0,
    end: 0,
    marginHorizontal: moderateScale(15),
  },
  footerLoader: {
    ...commonStyles.footerComp2,
  },
  customContentContainer: {
    marginBottom: moderateScale(10), // Add spacing as needed
  },
  errorText: {
    ...commonStyles.mediumFont14,
    color: colors.red, // Use red for error text
  },
});

export default styles;
