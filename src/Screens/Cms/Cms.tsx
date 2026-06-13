import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  View
} from 'react-native';
import WebView from 'react-native-webview';
import Header from '../../Components/Header';
import KeyboardAwareScroll from '../../Components/KeyboardAwareScroll';
import Spacer from '../../Components/Spacer';
import WrapperContainer from '../../Components/WrapperContainer';
import { getCmsUrl, urlConfig } from '../../config/urls';
import imagePath from '../../constants/imagePath';
import { useTranslate } from '../../constants/lang';
import colors from '../../styles/colors';
import { moderateScale, width } from '../../styles/responsiveSize';
import styles from './styles';

const Cms = ({navigation}: {navigation: any}) => {
  const route = useRoute();
  const {title}: any = route?.params;
  const link = getCmsUrl(
    `${
      title == useTranslate('PRIVACY_POLICY')
        ? urlConfig.PRIVACY_POLICY
        : title == useTranslate('TERMS_&_CONDITIONS')
        ? urlConfig.TERMS_CONDITIONS
        : urlConfig.ABOUT_US
    }`,
  );

  const [load, setLoad] = useState<boolean>(true);
  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };


  return (
    <WrapperContainer statusBarColor={colors.AppWhite}>
      <KeyboardAwareScroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}
        style={styles.keyboard}>
          <View style={styles.header}>
        <Header
          centerTitle={title}
          isCenterTitle
          onPressLeftImg={handleBackPress}
        />
        </View>

        <Spacer space={20} />
        {load == false && (
          <Image
            resizeMode="contain"
            style={{alignSelf: 'center', width: width - moderateScale(60)}}
            source={imagePath.logo}
          />
        )}
        <Spacer />

        <WebView
          style={{
            flex: 1,
          }}
          source={{uri: link}}
          onLoadStart={() => setLoad(true)}
          onLoad={() => setLoad(false)}
          javaScriptEnabled={true}
          originWhitelist={['*']}
          automaticallyAdjustContentInsets={false}
          domStorageEnabled={true}
          scrollEnabled
          scalesPageToFit={true}
          contentMode={'mobile'}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          containerStyle={{padding: 0}}
          startInLoadingState={false}
        /> 

        {load == true ? (
          <View
            style={{
              position: 'absolute',
              top: Dimensions.get('screen').height * 0.4,
              left: Dimensions.get('screen').width * 0.45,
            }}>
            <ActivityIndicator
              size="large"
              color={colors.themeColor}
              animating={load}
            />
          </View>
        ) : null}
      </KeyboardAwareScroll>
    </WrapperContainer>
  );
};

export default Cms;
