import React from 'react';
import { Text, View } from 'react-native';
import { ToastConfig } from 'react-native-toast-message';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import { moderateScale } from '../styles/responsiveSize';

export const toastConfig: ToastConfig | any = {
  error: ({ text1 }: { text1: string }) => (
    <View
      style={{
        paddingHorizontal: moderateScale(16),
      }}
    >
      <View
        style={{
          width: '100%',
          backgroundColor: colors.white,
          borderRadius: moderateScale(12),
          flexDirection: 'row',
          ...commonStyles.elevationShadow,
        }}
      >
        <View
          style={{
            width: moderateScale(12),
            overflow: 'hidden',
            borderTopLeftRadius: moderateScale(12),
            borderBottomLeftRadius: moderateScale(12),
          }}
        >
          <View
            style={{
              backgroundColor: colors.red,
              width: moderateScale(16),
              flex: 1,
            }}
          ></View>
        </View>
        <Text
          allowFontScaling={false}
          style={{
            ...commonStyles.mediumFont12,
            margin: moderateScale(12),
            flex: 1,
          }}
        >
          {text1}
        </Text>
      </View>
    </View>
  ),
  success: ({ text1 }: { text1: string }) => (
    <View
      style={{
        paddingHorizontal: moderateScale(16),
      }}
    >
      <View
        style={{
          width: '100%',
          backgroundColor: colors.white,
          borderRadius: moderateScale(12),
          flexDirection: 'row',
          ...commonStyles.elevationShadow,
        }}
      >
        <View
          style={{
            width: moderateScale(12),
            overflow: 'hidden',
            borderTopLeftRadius: moderateScale(12),
            borderBottomLeftRadius: moderateScale(12),
          }}
        >
          <View
            style={{
              backgroundColor: 'green',
              width: moderateScale(16),
              flex: 1,
            }}
          ></View>
        </View>

        <Text
          allowFontScaling={false}
          style={{
            ...commonStyles.mediumFont12,
            margin: moderateScale(12),
            flex: 1,
          }}
        >
          {text1}
        </Text>
      </View>
    </View>
  ),
};
