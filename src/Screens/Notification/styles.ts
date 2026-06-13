import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';

const styles = StyleSheet.create({
  sectionHeader: {
    flex: 1,
    paddingVertical: moderateScaleVertical(8),
    paddingHorizontal: moderateScale(16),
    backgroundColor: colors.white,
  },
  sectionTitle: {
    ...commonStyles.mediumFont16,
    color: colors.teal,
  },
  markAllRead: {
    alignSelf: 'flex-end',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScaleVertical(8),
  },
  markAllReadText: {
    ...commonStyles.font14,
    color: colors.orange,
  },
  sectionHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(1),
    paddingVertical: moderateScaleVertical(8),
    paddingStart: moderateScale(15),
    backgroundColor: colors.white, // Match the background for a seamless look
  },
  markAllReadButton: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScaleVertical(5),
    alignSelf: 'flex-end',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScaleVertical(16),
    backgroundColor: colors.white,
  },
  selectAll: {
    ...commonStyles.mediumFont14,
    color: colors.blue,
  },
  delete: {
    ...commonStyles.mediumFont14,
    color: colors.red,
  },
});

export default styles;
