import React, { FC, memo, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Image,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import ImageButton from './ImageButton'; // Import ImageButton (adjust path as needed)
import imagePath from '../constants/imagePath'; // Import imagePath for checkbox icons
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import moment from 'moment';

interface Props {
  id: string;
  name: string; // Heading
  content: string; // Notification content
  timeAgo: string; // Timestamp
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  isCheckbox?: boolean; // Optional prop to enable checkbox
  selected?: string[]; // Array of selected IDs
  checkedPress?: () => void; // Callback for checkbox press
  onDeletePress?: () => void;
  enableSwipeRight?: boolean; // New prop to control right swipe
  message?: string;
}

const NotificationComp: FC<Props> = ({
  id,
  name,
  content,
  created_at,
  onPress,
  containerStyle = {},
  isCheckbox = false,
  selected = [],
  checkedPress,
  onDeletePress,
  enableSwipeRight = true,
  message,
}) => {
  const swipeableRef = useRef<Swipeable>(null);
  const timeAgo = moment(created_at).fromNow(); // "2 days ago"

  /** Render Delete Button on Swipe */
  const renderRightActions = () =>
    enableSwipeRight ? (
      <TouchableOpacity onPress={onDeletePress} style={styles.deleteWrapper}>
        <Image source={imagePath.delete_icon2} style={styles.deleteIcon} />
      </TouchableOpacity>
    ) : null;

  return (
    <View style={[styles.cardWrapper, containerStyle]}>
      {/* <Swipeable
        ref={swipeableRef}
        containerStyle={
          enableSwipeRight ? styles.containerStyle2 : styles.containerStyle
        }
        renderRightActions={renderRightActions}> */}
      <TouchableOpacity
        onPress={onPress}
        style={styles.container}
        activeOpacity={0.7}
      >
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text allowFontScaling={false} style={styles.name}>
              {name}
            </Text>
            {!isCheckbox && (
              <Text allowFontScaling={false} style={styles.timeAgo}>
                {timeAgo}
              </Text>
            )}
          </View>
          <Text allowFontScaling={false} style={styles.content}>
            {message}
          </Text>
        </View>
        {isCheckbox && (
          <ImageButton
            onPress={checkedPress}
            imgSrc={
              selected.includes(id) ? imagePath.checked : imagePath.uncheck
            }
            imgStyle={styles.checkboxIcon}
            btnStyle={styles.checkboxButton}
          />
        )}
      </TouchableOpacity>
      {/* </Swipeable> */}
    </View>
  );
};

export default memo(NotificationComp);

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    flexDirection: 'row',
  },
  containerStyle: {
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    ...commonStyles.mediumFont16,
    color: colors.black,
  },
  content: {
    ...commonStyles.font14,
    color: colors.grey11,
    marginBottom: moderateScaleVertical(4),
  },
  timeAgo: {
    ...commonStyles.font12,
    color: colors.grey11,
  },
  checkboxIcon: {
    height: moderateScale(22),
    width: moderateScale(22),
  },
  checkboxButton: {
    margin: moderateScale(3),
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
  containerStyle2: {
    backgroundColor: colors.red,
  },
});
