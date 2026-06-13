import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import imagePath from '../constants/imagePath';
import { useTranslate } from '../constants/lang';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import commonStyles, { hitSlopProp } from '../styles/commonStyles';
import ImageButton from './ImageButton';

const Checkbox = ({
  text = '',
  getChecked = false,
  setChecked,
  isPrivacy = false,
  privacyAction,
  termsAction,
}: {
  text: string;
  getChecked: boolean;
  setChecked: () => void;
  isPrivacy: boolean;
  privacyAction?: () => void;
  termsAction?: () => void;
}) => {
  return (
    <View style={styles.container}>
      <ImageButton
        btnStyle={styles.box}
        resizeMode="contain"
        onPress={setChecked}
        hitSlop={hitSlopProp}
        imgSrc={getChecked === true ? imagePath.checked : imagePath.uncheck}
      />

      {!!isPrivacy && isPrivacy === true ? (
        <Text allowFontScaling={false} style={styles.text}>
          {useTranslate('I_AGREE_WITH')}
          <Text
            allowFontScaling={false}
            style={styles.policy}
            onPress={privacyAction}
          >
            {useTranslate('PRIVACY_POLICY')}
          </Text>
          {useTranslate('&')}
          <Text
            allowFontScaling={false}
            style={styles.policy}
            onPress={termsAction}
          >
            {useTranslate('TERMS_&_CONDITIONS')}
          </Text>
        </Text>
      ) : (
        <Text allowFontScaling={false} style={styles.text}>
          {text}
        </Text>
      )}
    </View>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // alignItems: 'center',
    flex: 1,

    marginHorizontal: moderateScale(12),
  },
  box: {
    width: moderateScale(20),
    height: moderateScale(20),
  },
  text: {
    ...commonStyles.mediumFont14,
    marginStart: moderateScale(5),
    color: colors.bottomBarColor,
    flex: 1,
  },
  policy: {
    ...commonStyles.font14,
    color: colors.darkblue,
    textDecorationLine: 'underline',
  },
});
