import React from 'react';
import {Image, View} from 'react-native';
import AuthHeader from '../../Components/AuthHeader';
import Spacer from '../../Components/Spacer';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import {useTranslate} from '../../constants/lang';
import Header from '../../Components/Header';
import styles from './styles';
import DynamicQR from '../../Components/DynamicQR';
import {useSelector} from 'react-redux';
import {moderateScale, width} from '../../styles/responsiveSize';
import FastImageLoad from '../../Components/FastImageLoad';
import {APP_LOG} from '../../utils/helperFunctions';

const QrCodeScreen = (props: any) => {
  const {navigation} = props;
  const {userData} = useSelector((state: any) => state?.auth); // Access the state from the slice

  APP_LOG('userData?.qr_code', userData);

  return (
    <WrapperContainer>
      <Header
        centerTitle={useTranslate('QR_CODE')}
        onPressLeftImg={() => navigation.goBack()}
      />
      <Spacer space={50} />
      <AuthHeader icon={imagePath.appIcon} />
      <Spacer space={20} />

      <View style={styles.safeArea}>
        {/* <Image style={styles.qrCode} source={imagePath.qrCode_icon2} /> */}
        {/* <DynamicQR user={userData} /> */}
        <FastImageLoad
          source={{uri: userData?.qr_code}}
          style={{
            width: '100%',
            aspectRatio: 1 / 1,
          }}
        />
      </View>
    </WrapperContainer>
  );
};

export default QrCodeScreen;
