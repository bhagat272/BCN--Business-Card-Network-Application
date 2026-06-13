import React, { FC, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import imagePath from '../constants/imagePath';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import colors from '../styles/colors';
import commonStyles, { hitSlopProp } from '../styles/commonStyles';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import ImageButton from './ImageButton';
import LinearGradient from 'react-native-linear-gradient';
import { APP_LOG } from '../utils/helperFunctions';

interface Props {
  selected: any[];
  id: string;
  leftImg: any;
  name?: string;
  role: string;
  company?: string;
  rightImg: any;
  tags: string[];
  isEdit?: boolean;
  isCheckbox?: boolean;
  checkedPress?: () => void;
  onEditPress?: () => void;
  onDeletePress?: () => void;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  enableSwipeRight?: boolean; // New prop to control right swipe
}

const FileComp: FC<Props> = ({
  selected = [],
  id,
  leftImg,
  name,
  role,
  company,
  rightImg,
  tags,
  isEdit = false,
  isCheckbox = false,
  checkedPress,
  onEditPress,
  onDeletePress,
  onPress,
  containerStyle = {},
  enableSwipeRight = true, // Default to true (enabled)
}) => {
  const swipeableRef = useRef<Swipeable>(null);

  /** Render Delete Button on Swipe */
  const renderRightActions = () =>
    enableSwipeRight ? (
      <TouchableOpacity onPress={onDeletePress} style={styles.deleteWrapper}>
        <Image source={imagePath.delete_icon2} style={styles.deleteIcon} />
      </TouchableOpacity>
    ) : null;

  return (
    <View style={[styles.cardWrapper, containerStyle]}>
      <Swipeable
        onSwipeableOpen={e => APP_LOG('swipeable open', e)}
        ref={swipeableRef}
        containerStyle={
          enableSwipeRight ? styles.containerStyle : styles.containerStyle2
        }
        overshootRight={true}
        renderRightActions={renderRightActions}
      >
        <LinearGradient colors={[colors.grey10, colors.grey10]}>
          <TouchableOpacity
            onPress={onPress}
            style={styles.container}
            activeOpacity={1}
          >
            <Image source={leftImg} style={styles.leftImage} />
            <View style={styles.textContainer}>
              <Text allowFontScaling={false} style={styles.name}>
                {name}
              </Text>
              <Text allowFontScaling={false} style={styles.role}>
                {role}
              </Text>
              <Text allowFontScaling={false} style={styles.company}>
                {company}
              </Text>
              <View style={styles.tagContainer}>
                {tags?.map((tag: any, index) => (
                  <View key={index} style={styles.tag}>
                    <Text allowFontScaling={false} style={styles.tagText}>
                      {tag?.tag?.tag.length > 10
                        ? tag?.tag?.tag.substring(0, 10) + '...'
                        : tag?.tag?.tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Right Image */}
            {isEdit && (
              <ImageButton
                hitSlop={hitSlopProp}
                onPress={onEditPress}
                imgSrc={rightImg}
                imgStyle={styles.rightImage}
              />
            )}
            {isCheckbox && (
              <ImageButton
                onPress={checkedPress}
                hitSlop={hitSlopProp}
                imgSrc={
                  selected?.includes(id) ? imagePath.checked : imagePath.uncheck
                }
                imgStyle={styles.rightImage}
                btnStyle={{
                  margin: moderateScale(3),
                }}
              />
            )}
          </TouchableOpacity>
        </LinearGradient>
      </Swipeable>
    </View>
  );
};

export default FileComp;

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    position: 'relative',
    marginVertical: moderateScaleVertical(8),
  },
  container: {
    // backgroundColor: colors.grey10,
    flexDirection: 'row',
    padding: moderateScale(12),
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    borderRadius: moderateScale(16),
    shadowRadius: moderateScale(6),
  },
  containerStyle: {
    backgroundColor: colors.red,
    borderRadius: moderateScale(16),
    shadowColor: colors.black,
    shadowRadius: moderateScale(6),
  },
  containerStyle2: {
    backgroundColor: colors.grey10,
    borderRadius: moderateScale(16),
    shadowColor: colors.black,
    shadowRadius: moderateScale(6),
  },
  leftImage: {
    height: moderateScale(55),
    width: moderateScale(55),
    borderRadius: moderateScale(27.5),
  },
  textContainer: {
    flex: 1,
    marginHorizontal: moderateScale(12),
  },
  name: {
    ...commonStyles.boldFont16,
    color: colors.darkblue,
    marginBottom: moderateScaleVertical(4),
  },
  role: {
    ...commonStyles.font12,
    color: colors.grey11,
    marginBottom: moderateScaleVertical(4),
  },
  company: {
    ...commonStyles.mediumFont12,
    color: colors.darkblue,
    marginBottom: moderateScaleVertical(8),
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(6),
  },
  tag: {
    padding: moderateScale(5),
    backgroundColor: colors.lightGreen,
    borderRadius: moderateScale(9),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    ...commonStyles.font10,
    color: colors.green,
  },
  rightImage: {
    height: moderateScale(22),
    width: moderateScale(22),
  },
  deleteWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: moderateScale(70),
    borderTopRightRadius: moderateScale(16),
    borderBottomRightRadius: moderateScale(16),
  },
  deleteIcon: {
    width: moderateScale(20.74),
    height: moderateScale(23.34),
  },
});
