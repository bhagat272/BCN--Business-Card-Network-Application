import React, { useState } from 'react';
import {
  ColorValue,
  Image,
  ImageURISource,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import commonStyles from '../styles/commonStyles';
import imagePath from '../constants/imagePath';
import ButtonComp from './ButtonComp';
import ReactNativeModal from 'react-native-modal';
import { useTranslate } from '../constants/lang';
import ImageButton from './ImageButton';
import ButtonWithImage from './ButtonWithImage';
import Spacer from './Spacer';
import ListEmptyComponent from './ListEmptyComponent';
import NativeLoader from './NativeLoader';

const DropDown = ({
  leftIcon = undefined,
  rightIcon = undefined,
  dropDownItems = [],
  selectedItems = [],
  setData,
  placeholder = '',
  title = '',
  getError = '',
  multiple = false,
  isLoadingDropDownItems = false,
  isLabel = false,
  label = '',
  isRequired = true,
  backgroundColor = colors.white,
  header = undefined,
  showLineView = true, // New prop to control the display of lineView
}: {
  leftIcon?: ImageURISource;
  rightIcon?: ImageURISource;
  dropDownItems: any[];
  selectedItems: any;
  setData: any;
  placeholder?: any;
  placeHolderTextColor: ColorValue;
  title?: string;
  getError: string;
  multiple?: boolean;
  isLoadingDropDownItems?: boolean;
  label?: string;
  isLabel: boolean;
  isRequired?: boolean;
  backgroundColor?: string;
  header?: React.ReactNode;
  showLineView?: boolean; // New prop for controlling line view visibility
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isDropDownModalVisible, setDropDownModalVisible] = useState(false);

  const renderItem = (item: any, index: number) => {
    return (
      <ButtonWithImage
        key={String(item?.value) + String(index)}
        onPress={() => {
          if (multiple && selectedItems?.includes(item?.value)) {
            const newData = selectedItems.filter(
              (value: any) => value !== item.value,
            );
            setData(multiple ? newData : item.value);
          } else {
            setData(multiple ? [...selectedItems, item?.value] : item?.value);
          }
          !multiple && closeModal();
        }}
        title={item.label}
        isLeftImg={false}
        btnTxtStyle={styles.btnTextList}
        btnStyle={{
          ...styles.btnStyleList,
          borderBottomWidth: 1,
        }}
        rightImgSrc={imagePath.checked}
        isRightImg={
          multiple
            ? selectedItems?.includes(item?.value)
            : selectedItems == item?.value
        }
        mainViewStyle={{
          justifyContent: 'space-between',
        }}
      />
    );
  };

  const closeModal = () => {
    setDropDownModalVisible(false);
  };

  return (
    <View style={{ marginTop: moderateScaleVertical(10) }}>
      {isLabel && (
        <Text allowFontScaling={false} style={styles.label}>
          {label}
          {isRequired && (
            <Text allowFontScaling={false} style={styles.asterisk}>
              *
            </Text>
          )}
        </Text>
      )}
      <View style={styles.container}>
        <View
          style={[
            styles.emailContainer,
            { backgroundColor },
            {
              borderColor: isFocused ? colors.teal : colors.grey11,
            },
          ]}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={styles.emailIcon}
              resizeMode="contain"
              source={leftIcon}
            />
            {/* Conditionally render the lineView based on the showLineView prop */}
            {showLineView && (
              <View
                style={[
                  styles.lineView,
                  {
                    backgroundColor: isFocused
                      ? colors.skyBlue
                      : colors.lightGrey,
                  },
                ]}
              />
            )}
          </View>

          <ButtonComp
            onPress={() => {
              Keyboard.dismiss();
              setDropDownModalVisible(true);
            }}
            title={title || placeholder}
            // eslint-disable-next-line react-native/no-inline-styles
            btnStyle={{
              flex: 1,
              backgroundColor: backgroundColor || colors.white, // Use the passed background color or fallback to default
              alignItems: 'flex-start',
              marginStart: showLineView
                ? moderateScale(10)
                : moderateScale(-15), // Adjust margin based on showLineView
            }}
            btnTxtStyle={{
              color: !!title ? colors.black : colors.lightGrey,
            }}
          />

          {isLoadingDropDownItems ? (
            <NativeLoader
              size={20}
              indicator={{
                marginRight: moderateScale(10),
              }}
            />
          ) : (
            <Image
              style={[styles.emailIcon, { position: 'absolute', end: 10 }]}
              resizeMode="contain"
              source={rightIcon}
            />
          )}
        </View>
      </View>
      {!!getError && (
        <Text allowFontScaling={false} style={styles.error}>
          {getError}
        </Text>
      )}
      {isDropDownModalVisible && (
        <ReactNativeModal
          isVisible={isDropDownModalVisible}
          statusBarTranslucent={false}
          style={{ margin: 0 }}
          onBackdropPress={closeModal}
          onBackButtonPress={closeModal}
          backdropColor={colors.blackOpacity40}
        >
          <View style={[styles.dropDownContainer, { backgroundColor }]}>
            {header && <View style={styles.headerContainer}>{header}</View>}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: moderateScaleVertical(30),
              }}
            >
              {dropDownItems?.length > 0 ? (
                dropDownItems.map(renderItem)
              ) : (
                <ListEmptyComponent marginTop={10} />
              )}
            </ScrollView>
          </View>
        </ReactNativeModal>
      )}
    </View>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  emailContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.white,
    elevation: 1,
    alignSelf: 'center',
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
    borderColor: colors.grey9,
    shadowColor: colors.grey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    marginHorizontal: moderateScale(10),
    flex: 1,
  },
  emailIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    alignSelf: 'center',
    marginStart: moderateScale(10),
  },
  lineView: {
    width: moderateScale(1),
    height: moderateScale(20),
    backgroundColor: colors.orange,
    marginHorizontal: moderateScale(6),
    alignSelf: 'center',
  },
  emailFelid: {
    flex: 1,
    padding: moderateScale(15),
    marginStart: moderateScale(5),
    fontFamily: fontFamily.montserratRegular,
    color: colors.black,
  },
  emailTitle: {
    position: 'absolute',
    top: 0,
    start: moderateScale(55),
    fontFamily: fontFamily.montserratMedium,
    color: colors.darkGrey,
  },
  error: {
    color: colors.red,
    fontFamily: fontFamily.montserratRegular,
    marginHorizontal: moderateScale(10),
    marginTop: moderateScaleVertical(2),
  },
  rightIconContainer: {
    marginEnd: 10,
    resizeMode: 'contain',
    width: moderateScale(24),
    height: moderateScale(24),
  },
  placeholderStyle: {
    fontSize: 14,
    marginStart: moderateScale(10),
    fontFamily: fontFamily.montserratRegular,
    color: colors.grey,
  },
  selectedTextStyle: {
    fontSize: 16,
    marginStart: moderateScale(10),
    fontFamily: fontFamily.montserratRegular,
    color: colors.black,
  },
  dropdown: {
    flex: 1,
    backgroundColor: colors.white,
  },
  icon: {
    marginRight: 5,
  },

  iconStyle: {
    width: moderateScale(20),
    height: moderateScale(20),
  },

  childItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    padding: moderateScale(16),
    width: '100%',
    flexDirection: 'row',
    ...commonStyles.font15,
    color: colors.black,
  },
  blackView: {
    width: '100%',
    height: 1,
    backgroundColor: colors.lightGrey,
  },
  container: {
    height: moderateScale(60),
  },
  dropDownContainer: {
    marginHorizontal: moderateScale(20),
    backgroundColor: colors.white,
    borderRadius: moderateScale(10),
    padding: moderateScale(5),
    maxHeight: moderateScaleVertical(400),
  },
  btnTextList: {
    fontSize: moderateScale(14),
    color: colors.black,
    fontFamily: fontFamily.montserratRegular,
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(15),
  },
  btnStyleList: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    borderWidth: 0,
    paddingRight: 10,
  },
  label: {
    ...commonStyles.boldFont16,
    marginStart: moderateScale(12),
    marginBottom: moderateScale(10),
    marginTop: moderateScale(5),
    alignSelf: 'flex-start',
  },
  asterisk: {
    color: colors.red,
  },
  headerContainer: {
    backgroundColor: colors.orange,
    padding: moderateScale(12),
    marginBottom: moderateScale(8),
  },
});
