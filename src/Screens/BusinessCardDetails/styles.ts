import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.AppWhite,
    // marginTop: moderateScaleVertical(40),
  },
  keyboard: {
    flex: 1,
    marginHorizontal: moderateScale(8),
  },
  addMoreButton: {
    backgroundColor: colors.white,
    borderColor: colors.orange,
    borderWidth: 1,
    marginVertical: moderateScale(16),
  },
  addMoreButtonText: {
    ...commonStyles.boldFont16,
    color: colors.orange,
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: moderateScale(12),
    marginHorizontal: moderateScale(16),
  },
  tagsText: {
    ...commonStyles.boldFont16,
    color: colors.black,
  },
  addMoreTagsText: {
    ...commonStyles.boldFont16,
    color: colors.orange,
    textDecorationLine: 'underline',
  },
  updateButton: {
    backgroundColor: colors.themeColor,
    marginTop: moderateScaleVertical(20),
  },
  updateButtonText: {
    ...commonStyles.mediumFont16,
    color: colors.white,
  },

  modal: {
    marginTop: moderateScaleVertical(13),
    justifyContent: 'center',
  },
  textarea: {
    ...commonStyles.font14,
    borderRadius: moderateScale(12),
    textAlignVertical: 'top', // Ensure text starts from the top
    height: moderateScaleVertical(184),
  },
  modalHeader: {
    ...commonStyles.boldFont16,
    marginTop: moderateScaleVertical(15),
    color: colors.grayishBlue,
  },
  crossIcon: {
    top: moderateScaleVertical(20),
    borderWidth: moderateScale(1.5),
    borderRadius: moderateScale(35),
    borderColor: colors.grey11,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: moderateScale(100),
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(8), // Space between tags,
    marginHorizontal: moderateScale(18),
    paddingTop: moderateScaleVertical(10),
  },
  tagSuggestionList: {
    maxHeight: 150, // Set a max height for the list
    borderColor: colors.lightGrey,
    backgroundColor: colors.white,
  },
  tagSuggestionItem: {
    padding: 10,
    borderBottomColor: colors.lightGrey,
  },
  tagBox: {
    backgroundColor: colors.red,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  loadingText: {
    marginTop: moderateScale(80),
    fontSize: moderateScale(16),
    color: colors.deepBlue,
  },

  extractedDataCardContainer: {
    ...commonStyles.elevationShadow,
    marginHorizontal: moderateScale(16),
    borderRadius: moderateScaleVertical(6),
    padding: moderateScaleVertical(10),
    gap: moderateScaleVertical(5),
    backgroundColor: colors.white,
    marginVertical: moderateScaleVertical(20),
    maxHeight: moderateScaleVertical(170),
  },
  extractedDataTxtContainer: {
    paddingVertical: moderateScaleVertical(5),
  },
  extractedDataTxt: {
    ...commonStyles.mediumFont13,
  },
  extractedDataTitleContainer: {
    ...commonStyles.flexRowSpaceBtwn,
  },
  extractedDataTitleTxt: {
    ...commonStyles.boldFont14,
    marginVertical: moderateScaleVertical(8),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalCloseButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  modalCloseButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  modalButton: {
    // position: 'relative',
    // right: 10,
    // top: 10,
  },
  modalButtonIcon: {
    width: 20,
    height: 20,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
