import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import commonStyles, { hitSlopProp } from '../styles/commonStyles';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import ButtonComp from './ButtonComp'; // Import the ButtonComp
import TextInputWithLabel from './TextInputWithLabel';

interface InputField {
  placeholder: string;
  value: string;
  Error: string;
  maxLength?: number;
  onChangeText: (text: string) => void;
}

interface Button {
  label: string;
  disabled?: boolean;
  onPress?: () => void;
  isLoading?: boolean;
  style?: any; // Style for the button
  backgroundColor?: string; // Additional prop for button background color
}

interface ModalOption {
  label?: string;
  icon?: any; // Pass icon source if needed
  radioButton?: boolean;
  onPress?: () => void;
}

interface DynamicModalProps {
  isVisible: boolean;
  title: string;
  inputFields?: InputField[];
  buttons?: Button[];
  options?: ModalOption[];
  onClose: () => void;
  customContent?: React.ReactNode; // Add customContent prop
  // isCustomRight?: boolean; // Prop to determine if CustomRight should be shown
  // CustomRight?: React.FC; // CustomRight component
}

const DynamicModal: React.FC<DynamicModalProps> = ({
  isVisible,
  title,
  inputFields,
  buttons,
  options,
  onClose,
  customContent, // Destructure customContent
  // isCustomRight = false,
  // CustomRight = undefined,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index); // Update the selected option state
    options?.[index]?.onPress?.(); // Call the onPress handler if defined
    !buttons &&
      setTimeout(() => {
        setSelectedOption(null);
      }, 500);
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={() => {
        setSelectedOption(null);
        onClose();
      }}
    >
      <View style={styles.overlay}>
        <Pressable
          style={{
            width: '100%',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => Keyboard.dismiss()}
        >
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text allowFontScaling={false} style={styles.title}>
                {title}
              </Text>

              <TouchableOpacity
                hitSlop={hitSlopProp}
                onPress={() => {
                  setSelectedOption(null);
                  onClose();
                }}
              >
                <Image
                  source={imagePath.cross_black}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Input Fields */}
            {inputFields && (
              <View style={styles.inputContainer}>
                {inputFields.map((field, index) => (
                  <TextInputWithLabel
                    key={index}
                    style={styles.input}
                    placeholder={field.placeholder}
                    onGetData={field.value}
                    onSetData={field.onChangeText}
                    getError={field.Error}
                    maxLength={field.maxLength}
                    // isCustomRight={isCustomRight}
                    // CustomRight={CustomRight}
                  />
                ))}
              </View>
            )}

            {/* Options (e.g., radio buttons for CSV, PDF) */}
            {options && (
              <FlatList
                data={options}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                contentContainerStyle={styles.optionsContainer}
                renderItem={({ item, index }) => {
                  const isSelected = selectedOption === index;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.optionItem,
                        {
                          borderColor: isSelected ? colors.teal : colors.grey,
                          backgroundColor: isSelected
                            ? colors.lightGreen
                            : colors.grey10,
                        },
                      ]}
                      onPress={() => handleOptionSelect(index)}
                    >
                      {item.icon && (
                        <Image source={item.icon} style={styles.optionIcon} />
                      )}
                      {item.label && (
                        <Text allowFontScaling={false} style={styles.label}>
                          {item.label}
                        </Text>
                      )}
                      {item.radioButton === true && (
                        <Image
                          source={
                            isSelected
                              ? imagePath.radio_Icon
                              : imagePath.uncheckRadio_Icon
                          }
                          style={styles.radioIcon}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}

            {/* Custom Content */}
            {customContent && (
              <View style={styles.customContentContainer}>{customContent}</View>
            )}
            {/* Buttons using ButtonComp */}
            {buttons && (
              <View style={styles.buttonContainer}>
                {buttons.map((button: any, index) => (
                  <ButtonComp
                    key={index}
                    title={button?.label}
                    disabled={button?.disabled || button?.isLoading}
                    isLoading={button?.isLoading}
                    onPress={() => {
                      button.onPress();
                      setTimeout(() => {
                        setSelectedOption(null);
                      }, 1000);
                    }}
                    gradientColors={
                      button.backgroundColor
                        ? [button.backgroundColor, button.backgroundColor] // Apply gradient based on backgroundColor
                        : undefined // Default gradient colors
                    }
                    btnStyle={[styles.button, button.style]}
                  />
                ))}
              </View>
            )}
          </View>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },
  title: {
    ...commonStyles.boldFont16,
    color: colors.grayishBlue,
  },
  inputContainer: {
    marginBottom: moderateScale(20),
    marginHorizontal: moderateScale(-10),
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
    marginBottom: moderateScale(10),
    color: colors.black,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: moderateScale(10),
  },
  optionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: moderateScale(5),
    borderWidth: 1,
    borderRadius: moderateScale(14),
    minWidth: moderateScale(130),
    height: moderateScaleVertical(114),
  },
  optionIcon: {
    marginBottom: moderateScale(0),
  },
  radioIcon: {
    width: moderateScale(18),
    height: moderateScale(18),
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: moderateScale(-10),
  },
  button: {
    flex: 1,
    margin: moderateScale(5),
  },
  closeIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
  },
  customContentContainer: {
    marginVertical: moderateScaleVertical(0),
  },
  label: {
    ...commonStyles.mediumFont20,
    color: colors.darkblue,
  },
});

export default DynamicModal;
