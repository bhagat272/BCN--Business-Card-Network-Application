import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import navigationStrings from '../constants/navigationStrings';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';

const HIT_SLOP_PROP = {
  top: 30,
  right: 30,
  left: 30,
  bottom: 30,
};

const BottomTabCustom = (props: any) => {
  const { state, descriptors, navigation } = props;

  return (
    <View style={styles.container}>
      <View style={styles.bottomTabContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const tabIcon = options?.tabBarIcon;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
          return (
            <View key={String(index)} style={{ height: '100%' }}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                // hitSlop={HIT_SLOP_PROP}
                onLongPress={onLongPress}
                style={[styles.touchContainer]}
              >
                {tabIcon && tabIcon(isFocused)}

                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  style={{
                    ...commonStyles.mediumFont8,
                    color: isFocused ? colors.white : colors.unSelectColor,
                    marginTop: moderateScaleVertical(4),
                  }}
                >
                  {label}
                </Text>
              </TouchableOpacity>
              {isFocused && route.name !== navigationStrings.SCAN_DOCS && (
                <View style={styles.topSelectionView} />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default BottomTabCustom;

const styles = StyleSheet.create({
  topSelectionView: {
    height: moderateScaleVertical(4),
    width: moderateScale(21),
    backgroundColor: colors.darkOrange,
    position: 'absolute',
    alignSelf: 'center',
    borderBottomLeftRadius: moderateScale(10),
    borderBottomRightRadius: moderateScale(10),
  },
  bottomTabContainer: {
    ...commonStyles.elevationShadow,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: moderateScaleVertical(72),
    backgroundColor: colors.deepBlue,
    alignItems: 'center',
  },
  container: {
    position: 'absolute',
    bottom: moderateScaleVertical(0),
    width: '100%',
  },
  touchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: moderateScale(94),
    width: moderateScale(60),
    paddingBottom: moderateScale(20),
  },
  whiteCircle: {
    borderRadius: moderateScale(45),
    backgroundColor: colors.white,
  },
});
