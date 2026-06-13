import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Image,
} from 'react-native';
import colors from '../styles/colors';
import { moderateScale } from '../styles/responsiveSize';
import commonStyles, { hitSlopProp } from '../styles/commonStyles';
import Spacer from './Spacer';

interface InfoCardProps {
  title: string;
  data: { label: string; value: string | number | JSX.Element }[];
  icon?: JSX.Element;
  onIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  singleRow?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  data,
  icon,
  onIconPress,
  containerStyle,
  singleRow = false,
}) => {
  return (
    <View style={[styles.cardContainer, containerStyle]}>
      <View style={styles.header}>
        <Text allowFontScaling={false} style={styles.title}>
          {title}
        </Text>
        {icon && (
          <TouchableOpacity onPress={onIconPress} hitSlop={hitSlopProp}>
            {icon}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {data.map((item, index) => {
          const isLastItem = index === data.length - 1;

          return (
            <View
              key={index}
              style={[styles.item, singleRow && styles.singleRowItem]}
            >
              <Text allowFontScaling={false} style={styles.label}>
                {item.label}
              </Text>
              <Spacer space={moderateScale(5)} />
              <Text
                allowFontScaling={false}
                style={styles.value}
                numberOfLines={2}
              >
                {item.value}
              </Text>

              {!singleRow && !isLastItem && <View style={styles.separator} />}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default InfoCard;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    marginBottom: moderateScale(16),
    ...commonStyles.elevationShadow,
    borderWidth: moderateScale(1),
    borderColor: colors.grey10,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(8),
  },
  title: {
    ...commonStyles.semiBoldFont18,
    color: colors.darkblue,
  },
  content: {
    marginTop: moderateScale(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  item: {
    width: '49%',
    marginBottom: moderateScale(12),
  },
  singleRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    ...commonStyles.font13,
    color: colors.OliveGray,
    marginBottom: moderateScale(4),
  },
  value: {
    ...commonStyles.mediumFont15,
    color: colors.darkblue,
    flex: 1, // Allow the value to take available space
  },
  separator: {
    height: 1,
    backgroundColor: colors.grey10,
    marginVertical: moderateScale(8),
    width: '100%',
  },
});
