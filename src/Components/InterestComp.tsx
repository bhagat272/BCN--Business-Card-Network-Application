import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { moderateScale } from '../styles/responsiveSize';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import { isEmpty } from 'lodash';
// import {LoadingType} from './ModalInterestLocationFilter';

const InterestComp = ({
  item,
  index,
  selectedInterest = [],
  onClick,
  onCrossClick,
}: // loadingType = null,
{
  item: any;
  index: number;
  selectedInterest: any[];
  onClick?: () => void;
  onCrossClick?: () => void;
  // loadingType?: LoadingType;
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          ...styles.touchableContainer,
          backgroundColor:
            !isEmpty(selectedInterest) &&
            selectedInterest?.includes(item?.value)
              ? colors.skyBlue
              : colors.tooLightGrey,
        }}
        // disabled={
        //   (!isEmpty(selectedInterest) &&
        //     selectedInterest?.includes(item?.value)) ||
        //   loadingType !== null
        // }
        onPress={onClick}
      >
        <Text
          allowFontScaling={false}
          key={item.id}
          style={{
            ...commonStyles.mediumFont12,
            color:
              !isEmpty(selectedInterest) &&
              selectedInterest?.includes(item?.value)
                ? colors.white
                : colors.black,
          }}
        >
          {item?.label}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.crossImage}
        activeOpacity={0.5}
        // disabled={
        //   !(
        //     !isEmpty(selectedInterest) &&
        //     selectedInterest?.includes(item?.value)
        //   ) || loadingType !== null
        // }
        onPress={onCrossClick}
      >
        <Image
          resizeMode="contain"
          source={
            !isEmpty(selectedInterest) &&
            selectedInterest?.includes(item?.value)
              ? imagePath.sky_blue_cross
              : imagePath.black_cross
          }
        />
      </TouchableOpacity>
    </View>
  );
};

export default InterestComp;

const styles = StyleSheet.create({
  container: {
    paddingTop: moderateScale(15),
    paddingEnd: moderateScale(15),
  },
  touchableContainer: {
    borderRadius: moderateScale(20),
    paddingTop: moderateScale(12),
    paddingBottom: moderateScale(12),
    paddingStart: moderateScale(25),
    paddingEnd: moderateScale(25),
  },
  crossImage: {
    position: 'absolute',
    top: 0,
    end: 0,
  },
});
