import React from 'react';
import {
  Image,
  ImageStyle,
  ImageURISource,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import Spacer from './Spacer';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import commonStyles from '../styles/commonStyles';

const AuthHeader = ({
  icon,
  title,
  desc,
  titleStyle,
  imageStyle,
}: {
  icon: ImageURISource;
  title?: string;
  desc?: string;
  titleStyle?: TextStyle;
  imageStyle?: ImageStyle;
}) => {
  return (
    <View style={{ marginTop: moderateScale(40) }}>
      <Image
        style={[styles.logoStyle, imageStyle]}
        resizeMode="contain"
        source={icon}
      />
      {!!title && (
        <Text allowFontScaling={false} style={[styles.loginTitle, titleStyle]}>
          {title}
        </Text>
      )}
      {!!desc && (
        <Text
          allowFontScaling={false}
          style={[
            styles.loginDesc,
            !title && { marginTop: moderateScaleVertical(10) }, // Adjust margin if title is empty
          ]}
        >
          {desc}
        </Text>
      )}
      <Spacer space={30} />
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  logoStyle: {
    flexDirection: 'row',
    width: moderateScale(224.41),
    alignSelf: 'center',
    marginTop: moderateScale(5),
  },
  loginTitle: {
    ...commonStyles.boldFont24,
    flexDirection: 'row',
    textAlign: 'center',
    color: colors.black,
    marginTop: moderateScaleVertical(11),
  },
  loginDesc: {
    ...commonStyles.font14,
    flexDirection: 'row',
    textAlign: 'center',
    marginTop: moderateScaleVertical(9),
    color: colors.darkGrey,
  },
});
