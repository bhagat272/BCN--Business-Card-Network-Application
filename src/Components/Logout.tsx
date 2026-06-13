import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import ButtonComp from './ButtonComp';
import Spacer from './Spacer';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import { moderateScale } from '../styles/responsiveSize';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

const Logout = ({
  isVisible = false,
  message = '',
  ok = '',
  cancel = '',
  onClose = () => {},
  isLoadingLogout = false,
}: {
  isVisible: boolean;
  message: string;
  ok: string;
  cancel: string;
  onClose: (event: boolean) => void;
  isLoadingLogout: boolean;
}) => {
  return (
    <ReactNativeModal
      animationIn={'fadeIn'}
      isVisible={isVisible}
      backdropColor={colors.transparent}
      coverScreen={true}
      style={{
        margin: 0,
      }}
      onBackButtonPress={() => onClose(false)}
      onBackdropPress={() => onClose(false)}
    >
      <View style={styles.container}>
        <BlurView
          style={styles.blurBackground}
          blurType="dark"
          blurAmount={8}
        />
        <View style={styles.dialog}>
          <Spacer space={moderateScale(20)} />
          <Text allowFontScaling={false} style={styles.dialogTitle}>
            {message}
          </Text>
          <Spacer space={moderateScale(30)} />
          <View style={{ flexDirection: 'row' }}>
            <ButtonComp
              btnStyle={styles.dialogCancelButtonView}
              title={cancel}
              onPress={() => onClose(false)}
              gradientColors={[colors.darkGrey, colors.darkGrey]}
            />
            <LinearGradient
              colors={[colors.themeColor, colors.deepTeal]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.dialogOkButtonView}
            >
              <ButtonComp
                isLoading={isLoadingLogout}
                title={ok}
                onPress={() => onClose(true)}
                btnStyle={{ backgroundColor: colors.transparent }}
              />
            </LinearGradient>
          </View>
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default Logout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.transparent,
    justifyContent: 'center',
  },
  dialog: {
    padding: moderateScale(16),
    backgroundColor: colors.white,
    borderRadius: moderateScale(10),
    marginHorizontal: moderateScale(10),
  },
  dialogTitle: {
    ...commonStyles.mediumFont16,
    flexDirection: 'row',
    textAlign: 'center',
    color: colors.black,
    alignSelf: 'center',
  },
  dialogOkButtonView: {
    flex: 1,
    borderRadius: moderateScale(12),
  },
  dialogCancelButtonView: {
    flex: 1,
    borderRadius: moderateScale(12),
  },
  dialogOkButton: {
    ...commonStyles.mediumFont14,
    textAlign: 'center',
    color: colors.white,
  },
  dialogCancelButton: {
    ...commonStyles.mediumFont14,
    textAlign: 'center',
    color: colors.white,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
});
