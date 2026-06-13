import React, { FC } from 'react';
import {
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import ReactNativeModal from 'react-native-modal';
import commonStyles from '../styles/commonStyles';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import ImageButton from './ImageButton';
import imagePath from '../constants/imagePath';
import ButtonWithImage from './ButtonWithImage';

interface Props {
  onPress?: (event: GestureResponderEvent) => void;
  isVisible?: boolean;
  onCloseReportUserModal?: () => void;
  onPhotoGallery?: (event: GestureResponderEvent) => void;
  onCamera?: (event: GestureResponderEvent) => void;
  leftImgTintColor?: ColorValue;
  btnTitleStyle?: StyleProp<TextStyle>;
}

const ImagePicker: FC<Props> = props => {
  const {
    onPress = () => {},
    isVisible = false,
    onCloseReportUserModal = () => {},
    onPhotoGallery = () => {},
    onCamera = () => {},
    leftImgTintColor = undefined,
    btnTitleStyle = {},
  } = props;

  const { t } = useTranslation();

  return (
    isVisible && (
      <View>
        <ReactNativeModal
          isVisible={isVisible}
          style={{
            margin: 0,
            justifyContent: 'flex-end',
          }}
          hideModalContentWhileAnimating={true}
          // coverScreen={false}
          onBackdropPress={onCloseReportUserModal}
          onBackButtonPress={onCloseReportUserModal}
        >
          <View style={styles.container}>
            <View style={commonStyles.flexRowJustifySpaceBtwn}>
              <Text allowFontScaling={false} style={commonStyles.boldFont16}>
                {t('SELECT_TYPE')}
              </Text>
              <ImageButton
                imgSrc={imagePath.close_circle}
                onPress={onCloseReportUserModal}
              />
            </View>
            <ButtonWithImage
              onPress={onPhotoGallery}
              leftImgSrc={imagePath.gallery_black_icon}
              title={t('PHOTO_GALLERY')}
              btnStyle={styles.galleryBtn}
              leftImgStyle={styles.leftImg}
              mainViewStyle={styles.mainView}
              btnTxtStyle={{ ...styles.btnText, ...(btnTitleStyle as object) }}
              leftImgTintColor={leftImgTintColor}
            />
            <ButtonWithImage
              onPress={onCamera}
              leftImgSrc={imagePath.camera_black_icon}
              title={t('CAMERA')}
              btnStyle={styles.galleryBtn}
              leftImgStyle={styles.leftImg}
              mainViewStyle={styles.mainView}
              btnTxtStyle={{ ...styles.btnText, ...(btnTitleStyle as object) }}
              leftImgTintColor={leftImgTintColor}
            />
          </View>
        </ReactNativeModal>
      </View>
    )
  );
};

export default React.memo(ImagePicker);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.blackOpacity80,
  },
  container: {
    height: moderateScaleVertical(150),
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
    padding: moderateScale(24),
  },
  galleryBtn: {
    borderWidth: 0,
  },
  btnText: {
    marginLeft: moderateScale(16),
  },

  leftImg: {
    position: 'relative',
    left: 0,
  },
  mainView: {
    justifyContent: 'flex-start',
  },
});
