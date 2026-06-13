import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import ImageButton from '../../Components/ImageButton';
import imagePath from '../../constants/imagePath';
import { moderateScale } from '../../styles/responsiveSize';
import styles from './styles';
import FastImageLoad from '../../Components/FastImageLoad';
import { getCompleteImageUrl } from '../../config/urls';

const RenderConnection = ({ item, checkedPress = () => {}, selected }: any) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => checkedPress(item.uuid)}
    >
      <FastImageLoad
        source={{ uri: getCompleteImageUrl(item?.profile_picture) }}
        style={styles.profileImage}
        defaultImage={imagePath.user_icon}
      />
      <View style={styles.cardDetails}>
        <Text allowFontScaling={false} style={styles.name}>
          {item.name}
        </Text>
        <Text allowFontScaling={false} style={styles.email}>
          {item.companyName}
        </Text>
      </View>

      <ImageButton
        onPress={() => checkedPress(item.uuid)}
        imgSrc={
          selected.includes(item.uuid) ? imagePath.checked : imagePath.uncheck
        }
        imgStyle={styles.rightImage}
        btnStyle={{
          margin: moderateScale(3),
        }}
      />
    </TouchableOpacity>
  );
};

export default RenderConnection;
