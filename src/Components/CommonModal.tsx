import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import commonStyles from '../styles/commonStyles';

interface CommonModalProps {
  isVisible: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const CommonModal: React.FC<CommonModalProps> = ({
  isVisible,
  message,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      transparent
      onRequestClose={onCancel}
      visible={isVisible}
      animationType="slide"
      statusBarTranslucent={true}
    >
      {/* Blur effect for the background */}
      <BlurView style={styles.blurBackground} blurType="dark" blurAmount={8} />

      {/* Modal content */}
      <View style={styles.modalWrapper}>
        <View style={styles.modalContainer}>
          <Text allowFontScaling={false} style={styles.message}>
            {message}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text allowFontScaling={false} style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text allowFontScaling={false} style={styles.confirmText}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    height: moderateScale(183),
    paddingVertical: moderateScaleVertical(35),
    paddingHorizontal: moderateScale(18),
  },
  message: {
    ...commonStyles.mediumFont16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: moderateScale(20),
    marginTop: moderateScaleVertical(15),
  },
  cancelButton: {
    backgroundColor: colors.slateGray,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: colors.themeColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  cancelText: {
    ...commonStyles.mediumFont16,
    color: colors.white,
  },
  confirmText: {
    ...commonStyles.mediumFont16,
    color: colors.white,
  },
});

export default CommonModal;
