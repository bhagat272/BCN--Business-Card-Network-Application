import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';

export default StyleSheet.create({
  cardWrapper: {
    position: 'relative',
    // marginVertical: moderateScaleVertical(5),
    paddingHorizontal: moderateScale(18),
  },
  flatListContent: {
    paddingBottom: moderateScaleVertical(80),
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.appWhite,
  },
  header: {
    paddingStart: moderateScale(8),
    paddingTop: moderateScaleVertical(8),
  },
  loader: {
    marginTop: moderateScale(20),
    alignSelf: 'center',
  },
  footerLoader: {
    ...commonStyles.footerComp2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height / 1.5,
    // backgroundColor: 'red',
    width: width,
  },
  emptyText: {
    ...commonStyles.font16,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: moderateScale(9),
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    height: moderateScaleVertical(40),
    alignItems: 'center',
    borderColor: colors.grey12,
    borderWidth: 1,
    borderRadius: moderateScale(30),
    paddingRight: moderateScale(10),
    marginRight: moderateScale(6),
    backgroundColor: colors.white,
  },
  searchIcon: {
    height: moderateScale(15),
    width: moderateScale(15),
    marginStart: moderateScale(10),
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    marginStart: moderateScale(5),
    ...commonStyles.font13,
    color: colors.blackOpacity40,
  },
  filterIcon: {
    maxHeight: moderateScaleVertical(40),
  },
  filterButton: {
    right: moderateScale(10),
    bottom: moderateScale(4),
    borderRadius: moderateScale(33),
  },
  activityLoader: {
    width: moderateScale(10),
    height: moderateScale(10),
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(10),
  },
  exportButton: {
    backgroundColor: colors.orange,
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(16),
    minHeight: moderateScale(32),
  },
  listContainer: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScaleVertical(10),
  },
  exportText: {
    ...commonStyles.mediumFont14,
    color: colors.white,
  },
  selectAllButton: {
    backgroundColor: colors.transparent,
    minWidth: moderateScale(151),
    height: moderateScale(32),
    borderColor: colors.AppWhite,
  },

  selectAllText: {
    ...commonStyles.mediumFont18,
    color: colors.darkblue,
    marginStart: 60,
  },
  customContentContainer: {
    marginBottom: moderateScale(10), // Add spacing as needed
  },
  errorText: {
    ...commonStyles.mediumFont14,
    color: colors.red, // Use red for error text
  },
});
