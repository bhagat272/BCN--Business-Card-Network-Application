import React from 'react';
import {
  Image,
  ImageURISource,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../styles/colors';
import { hitSlopProp } from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import { moderateScale } from '../styles/responsiveSize';
import Spacer from './Spacer';

const AuthFooter = ({
  or,
  google,
  googleAction,
  facebook,
  facebookAction,
  apple,
  appleAction,

  message,
  actionText,
  actionOnText,
}: {
  or?: string;
  google?: ImageURISource;
  googleAction?: () => void;
  facebook?: ImageURISource;
  facebookAction?: () => void;
  apple?: ImageURISource;
  appleAction?: () => void;
  message: string;
  actionText: string;
  actionOnText: () => void;
}) => {
  return (
    <View>
      {!!or && (
        <View style={[styles.or]}>
          <View style={styles.orLineView} />
          <Text allowFontScaling={false} style={styles.orText}>
            {or}
          </Text>
          <View style={styles.orLineView} />
          <Spacer space={30} />
        </View>
      )}
      <View style={styles.socialContainer}>
        {!!google && (
          <TouchableOpacity onPress={googleAction}>
            <Image
              style={styles.socialIcon}
              resizeMode="contain"
              source={google}
            />
          </TouchableOpacity>
        )}
        {!!facebook && (
          <TouchableOpacity onPress={facebookAction}>
            <Image
              style={styles.socialIcon}
              resizeMode="contain"
              source={facebook}
            />
          </TouchableOpacity>
        )}
        {!!apple && (
          <TouchableOpacity onPress={appleAction}>
            <Image
              style={styles.socialIcon}
              resizeMode="contain"
              source={apple}
            />
          </TouchableOpacity>
        )}
      </View>
      <Spacer space={30} />
      <View style={styles.socialContainer}>
        <Text allowFontScaling={false} style={styles.donnHave}>
          {message}
        </Text>
        <TouchableOpacity hitSlop={hitSlopProp} onPress={actionOnText}>
          <Text allowFontScaling={false} style={[styles.forgot]}>
            {actionText}
          </Text>
        </TouchableOpacity>
      </View>
      <Spacer space={50} />
    </View>
  );
};

export default AuthFooter;

const styles = StyleSheet.create({
  or: {
    flexDirection: 'row',
    marginTop: moderateScale(30),
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
  },
  orLineView: {
    backgroundColor: colors.lightGrey,
    flex: 1,
    height: 1,
  },
  orText: {
    flexDirection: 'row',
    marginStart: moderateScale(10),
    marginEnd: moderateScale(10),
    color: colors.black,
    fontFamily: fontFamily.montserratRegular,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    marginEnd: moderateScale(10),
    borderRadius: moderateScale(20),
  },
  donnHave: {
    flexDirection: 'row',
    color: colors.darkblue,
    textAlign: 'center',
    marginEnd: 3,
    fontFamily: fontFamily.montserratRegular,
  },
  forgot: {
    flex: 1,
    flexDirection: 'row',
    textAlign: 'right',
    color: colors.darkOrange,
    fontFamily: fontFamily.montserratMedium,
    textDecorationLine: 'underline',
  },
});
