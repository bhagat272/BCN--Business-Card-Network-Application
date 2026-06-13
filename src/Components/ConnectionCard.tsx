import React, { FC } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import imagePath from '../constants/imagePath';

interface ConnectionCardProps {
  name: string;
  subtext: string; // Updated prop to handle email or company name dynamically
  image: any;
  showRightIcon?: boolean;
  showWrongIcon?: boolean;
  onRightPress?: () => void;
  onWrongPress?: () => void;
  cardStyle?: StyleProp<ViewStyle>;
}

const ConnectionCard: FC<ConnectionCardProps> = ({
  name,
  subtext,
  image,
  showRightIcon = false,
  showWrongIcon = false,
  onRightPress = () => {},
  onWrongPress = () => {},
  cardStyle = {},
}) => {
  return (
    <View style={[styles.card, cardStyle]}>
      <Image source={image} style={styles.profileImage} />
      <View style={styles.infoContainer}>
        <Text allowFontScaling={false} style={styles.name}>
          {name}
        </Text>
        <Text allowFontScaling={false} style={styles.subtext}>
          {subtext}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        {showWrongIcon && (
          <TouchableOpacity onPress={onWrongPress} style={styles.iconWrapper}>
            <Image source={imagePath.wrong} style={styles.icon} />
          </TouchableOpacity>
        )}
        {showRightIcon && (
          <TouchableOpacity onPress={onRightPress} style={styles.iconWrapper}>
            <Image source={imagePath.right} style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
    marginBottom: moderateScaleVertical(8),
    borderRadius: moderateScale(16),
    backgroundColor: colors.white,
    // elevation: 2, // Shadow for Android
    // shadowColor: '#000', // Shadow for iOS
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
  },
  profileImage: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    marginRight: moderateScale(12),
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    ...commonStyles.boldFont18,
    color: colors.darkblue,
  },
  subtext: {
    ...commonStyles.font14,
    color: colors.darkGrey,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginLeft: moderateScale(8),
  },
  icon: {
    width: moderateScale(24),
    height: moderateScale(24),
  },
});

export default React.memo(ConnectionCard);
