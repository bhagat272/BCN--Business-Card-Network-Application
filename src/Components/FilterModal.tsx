import React, { FC, useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import colors from '../styles/colors';
import TextInputWithLabel from './TextInputWithLabel'; // Import the TextInputWithLabel component
import imagePath from '../constants/imagePath';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import { useTranslate } from '../constants/lang';
import commonStyles from '../styles/commonStyles';
import BoxComp from './BoxComp'; // Import the BoxComp component
import ButtonComp from './ButtonComp';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
  visible: boolean;
  isClear: boolean;
  isApply: boolean;
  onClose: () => void;
  onClear: (options: {
    sort_order: string;
    sort_by: string;
    tags: string[];
  }) => void;
  onApply: (options: {
    sort_order: string;
    sort_by: string;
    tags: string[];
  }) => void;
  initialOptions: {
    sort_order: string;
    sort_by: string;
    tags: string[];
  };
}

const FilterModal: FC<Props> = props => {
  const {
    visible,
    onClose,
    onApply,
    initialOptions,
    isClear,
    isApply,
    onClear,
  } = props;
  const [searchTag, setSearchTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const [tempSelectedTags, setTempSelectedTags] = useState<string[]>(
    initialOptions.tags,
  );
  const handleAddTag = () => {
    const trimmedTag = searchTag.trim();
    if (trimmedTag !== '' && !tempSelectedTags.includes(trimmedTag)) {
      // Use tempSelectedTags
      setTempSelectedTags([...tempSelectedTags, trimmedTag]); // Update tempSelectedTags
      setSearchTag('');
      Keyboard.dismiss();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTempSelectedTags(tempSelectedTags.filter(tag => tag !== tagToRemove)); // Use tempSelectedTags
  };

  const handleApply = () => {
    setSelectedTags(tempSelectedTags); // Update actual state with temporary values
    setSortBy(sortBy);
    setSortOrder(sortOrder);
    const options = {
      sort_order: sortOrder, // Use the updated tempSortOrder
      sort_by: sortBy, // Use the updated tempSortBy
      tags: tempSelectedTags, // Use the updated tempSelectedTags
    };

    onApply(options);
  };

  const handleClear = () => {
    setSortBy('created_at'); // Update actual state
    setSortOrder('desc'); // Update actual state
    setSelectedTags([]); // Update actual state
    setTempSelectedTags([]);
    setSearchTag('');
    const options = {
      sort_order: 'desc', // Use default
      sort_by: 'created_at', // Use default
      tags: [], // Use default
    };
  };

  const handleModalClose = () => {
    setSortBy(initialOptions.sort_by); // Update actual state
    setSortOrder(initialOptions.sort_order); // Update actual state
    setTempSelectedTags(initialOptions.tags); // Update actual state
    // setTempSelectedTags([])
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={handleModalClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.modalContainer}>
              <View style={styles.handle} />

              {/* Filter by Tags */}
              <View style={styles.header}>
                <Image
                  source={imagePath.filter_popup}
                  style={styles.filterIcon}
                  resizeMode="contain"
                />
                <Text allowFontScaling={false} style={styles.headerText}>
                  {useTranslate('FILTER_BY_TAGS')}
                </Text>
              </View>
              <TextInputWithLabel
                placeholder={useTranslate('SEARCH_TAG')}
                onGetData={searchTag}
                leftIcon={imagePath.search}
                leftIconStyle={{
                  width: moderateScale(13.85),
                  height: moderateScaleVertical(13.85),
                }}
                onSetData={setSearchTag}
                contentType="none"
                keyboardType="default"
                placeHolderTextColor={colors.stoneGray}
                fontColor={colors.black}
                secureTextEntry={false}
                getError=" "
                returnType="done"
                isLabel={false}
                inputStyle={{
                  borderRadius: moderateScale(50),
                  height: moderateScale(40),
                }}
                onSubmitEditing={handleAddTag}
              />
              <ScrollView
                contentContainerStyle={
                  tempSelectedTags.length > 0
                    ? styles.selectedTagsContainer
                    : styles.selectedTagsContainer2
                }
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {/* Selected Tags */}
                {tempSelectedTags.map(item => (
                  <BoxComp
                    key={item}
                    title={item}
                    showCross={true}
                    onSelect={() => handleRemoveTag(item)}
                  />
                ))}
              </ScrollView>
              <View style={styles.separator} />

              {/* Sort By */}
              <View style={styles.header}>
                <Image
                  source={imagePath.sort_by}
                  style={styles.filterIcon}
                  resizeMode="contain"
                />
                <Text allowFontScaling={false} style={styles.headerText}>
                  {useTranslate('SORT_BY')}
                </Text>
              </View>
              <View style={styles.sortOptionsContainer}>
                <TouchableOpacity
                  style={styles.sortOption}
                  onPress={() => setSortBy('created_at')}
                >
                  <View style={commonStyles.flexRowCenter}>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.sortText,
                        sortBy === 'created_at' && styles.selectedOption,
                      ]}
                    >
                      Date
                    </Text>
                    <View style={styles.verticalSeparator} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sortOption}
                  onPress={() => setSortBy('name')}
                >
                  <View style={commonStyles.flexRowCenter}>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.sortText,
                        sortBy === 'name' && styles.selectedOption,
                      ]}
                    >
                      Name
                    </Text>
                    <View style={styles.verticalSeparator} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sortOption}
                  onPress={() => setSortBy('designation')}
                >
                  <View style={commonStyles.flexRowCenter}>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.sortText,
                        sortBy === 'designation' && styles.selectedOption,
                      ]}
                    >
                      Designation
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.separator2} />

              {/* Sort order */}
              <View style={styles.header}>
                <Image
                  source={imagePath.sort_order}
                  style={styles.filterIcon}
                  resizeMode="contain"
                />
                <Text allowFontScaling={false} style={styles.headerText}>
                  {useTranslate('SORT_ORDER')}
                </Text>
              </View>
              <View style={styles.sortOptionsContainer}>
                <TouchableOpacity
                  style={styles.sortOption}
                  onPress={() => setSortOrder('asc')}
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.sortText,
                      sortOrder === 'asc' && styles.selectedOption,
                    ]}
                  >
                    Ascending
                  </Text>
                  <Image
                    source={imagePath.sort_low_to_high}
                    style={[
                      styles.sortOrderImage,
                      sortOrder === 'asc' && styles.selectedImage,
                    ]}
                    resizeMode="contain"
                  />
                  <View style={styles.verticalSeparator} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sortOption}
                  onPress={() => setSortOrder('desc')}
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.sortText,
                      sortOrder === 'desc' && styles.selectedOption,
                    ]}
                  >
                    Descending
                  </Text>
                  <Image
                    source={imagePath.sort_high_to_low}
                    style={[
                      styles.sortOrderImage,
                      sortOrder === 'desc' && styles.selectedImage,
                    ]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <ButtonComp
                  disabled={isClear || isApply}
                  isLoading={isClear}
                  loaderColor={colors.themeColor}
                  btnStyle={styles.clearButton}
                  title={useTranslate('CLEAR')}
                  onPress={handleClear}
                  gradientColors={[colors.AppWhite, colors.AppWhite]}
                  btnTxtStyle={styles.clearText}
                />
                <ButtonComp
                  disabled={isClear || isApply}
                  isLoading={isApply}
                  loaderColor={colors.white}
                  onPress={handleApply}
                  title={useTranslate('APPLY')}
                  btnStyle={styles.applyButton}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  handle: {
    height: moderateScaleVertical(4),
    width: moderateScale(40),
    backgroundColor: colors.tooLightGrey,
    borderRadius: moderateScale(40),
    alignSelf: 'center',
    marginTop: moderateScaleVertical(-12),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: moderateScaleVertical(15),
    marginHorizontal: moderateScale(12),
  },
  filterIcon: {
    width: moderateScale(13),
    height: moderateScale(13),
    marginRight: moderateScale(8),
  },
  headerText: {
    ...commonStyles.boldFont16,
    color: colors.darkblue,
  },
  separator: {
    height: 1,
    backgroundColor: colors.grey12,
    width: '95%',
    marginVertical: moderateScaleVertical(5),
  },
  separator2: {
    height: 1,
    backgroundColor: colors.grey12,
    width: '95%',
    marginVertical: moderateScaleVertical(4),
  },

  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    padding: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  sectionTitle: {
    ...commonStyles.boldFont16,
    color: colors.darkblue,
    alignSelf: 'flex-start',
    marginVertical: moderateScaleVertical(10),
  },
  selectedTagsContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    gap: moderateScale(8),
    paddingVertical: moderateScaleVertical(10),
    paddingHorizontal: moderateScale(6),
    alignItems: 'flex-start', // Align items to the start (left)
    flexWrap: 'wrap', // Allow tags to wrap to the next line
  },
  selectedTagsContainer2: {
    flexGrow: 1,
    flexDirection: 'row',
    gap: moderateScale(8),
    paddingVertical: moderateScaleVertical(6),
    paddingHorizontal: moderateScale(6),
    alignItems: 'flex-start', // Align items to the start (left)
    flexWrap: 'wrap', // Allow tags to wrap to the next line
    marginTop: moderateScaleVertical(-20),
  },
  sortOptionsContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  sortOption: {
    padding: moderateScale(10),
    borderRadius: moderateScale(8),
    marginRight: moderateScale(8),
    flexDirection: 'row',
  },
  sortOrderImage: {
    width: moderateScale(12),
    height: moderateScale(12),
    top: moderateScale(5),
    tintColor: colors.grey11,
  },

  selectedOption: {
    color: colors.green,
    //color:colors.red
  },
  sortText: {
    ...commonStyles.mediumFont14,
    marginEnd: moderateScale(5),
    color: colors.grey11,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScaleVertical(20),
  },
  clearButton: {
    flex: 1,
    borderWidth: moderateScale(1),
    borderColor: colors.deepBlue,
    borderRadius: moderateScale(56),
    alignItems: 'center',
    marginRight: moderateScale(10),
  },
  clearText: {
    ...commonStyles.mediumFont14,
    fontSize: moderateScale(16),
    borderColor: colors.deepBlue,
  },
  applyButton: {
    flex: 1,
    height: moderateScaleVertical(40),
    borderRadius: moderateScale(56),
  },

  verticalSeparator: {
    height: moderateScale(20),
    width: 1,
    backgroundColor: colors.grey,
    marginStart: moderateScale(20),
  },
  selectedImage: {
    tintColor: colors.green,
  },
});
