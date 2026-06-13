import { isEmpty } from 'lodash';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import ButtonComp from '../../Components/ButtonComp';
import SliderFlatlist from '../../Components/SliderFlatlist';
import Spacer from '../../Components/Spacer';
import imagePath from '../../constants/imagePath';
import { useTranslate } from '../../constants/lang';
import navigationStrings from '../../constants/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import styles from './styles';
import KeyboardAwareScroll from '../../Components/KeyboardAwareScroll';
import { SafeAreaView } from 'react-native-safe-area-context';

const IntroScreen = (props: any) => {
  const { navigation, route } = props;
  const swiperRef = useRef<FlatList>(null);

  const [getData, setData] = useState<Array<any>>([
    {
      id: 0,
      title: useTranslate('INSTANTLY_SCAN_BUSINESS_CARD'),
      desc: useTranslate('INTRO_DESC1'),
      image: imagePath.static_5,
    },
    {
      id: 1,
      title: useTranslate('SMART_CONTACT_ORGANIZATION'),
      desc: useTranslate('INTRO_DESC2'),
      image: imagePath.static_4,
    },
    {
      id: 2,
      title: useTranslate('PRECISION_DATA_EXTRACTION'),
      desc: useTranslate('INTRO_DESC3'),
      image: imagePath.static_3,
    },
  ]);
  const [activeImgIndx, setActiveImgIndx] = useState<number>(0);

  const renderItem = ({ item, index }: { item: any; index: any }) => (
    <View
      style={{
        width: width,
      }}
    >
      <Image
        resizeMode="contain"
        source={item.image}
        style={{
          alignSelf: 'center',
          width: width - moderateScale(36),
          // height: width,
          flex: 1,
        }}
      />
      <Text allowFontScaling={false} style={styles.title}>
        {item.title}
      </Text>
      <Text allowFontScaling={false} style={styles.desc} numberOfLines={3}>
        {item.desc}
      </Text>
    </View>
  );

  const handleNext = () => {
    if (activeImgIndx === getData?.length - 1) {
      handleSkip();
    } else {
      let index = activeImgIndx + 1;
      scrollToIndex(index);
    }
  };

  const scrollToIndex = (index: number) => {
    !!swiperRef?.current &&
      swiperRef?.current?.scrollToIndex({
        animated: true,
        index: index,
      });
  };

  const handleSkip = () => {
    setTimeout(() => {
      actions.onSaveIntroScreenStatus(true);
    }, 300);
    navigation.navigate(navigationStrings.LOGIN);
  };

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any }) => {
      if (!isEmpty(viewableItems)) {
        setActiveImgIndx(viewableItems[0].index);
      }
    },
  );

  const renderPagination = (item: any, index: number) => {
    return (
      <View
        key={String(index)}
        style={{
          ...styles.paginationDot,
          backgroundColor:
            activeImgIndx === index ? colors.darkOrange : colors.slateGray,
          marginLeft: index !== 0 ? moderateScale(4) : 0,
          width: activeImgIndx === index ? 30 : moderateScale(6),
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={colors.AppWhite}
        hidden={false}
      />

      {/* <KeyboardAvoidingView style={styles.keyboardContainer}> */}
      <Spacer space={28} />
      <View style={{ flex: 4 }}>
        <SliderFlatlist
          flatlistRef={swiperRef}
          data={getData}
          renderItem={renderItem}
          scrollEnabled={getData?.length > 1}
          onViewableItemsChanged={handleViewableItemsChanged.current}
        />
        {getData?.length > 1 && (
          <View style={styles.paginationContainer}>
            {getData?.map(renderPagination)}
          </View>
        )}
      </View>
      <Spacer space={moderateScaleVertical(10)} />
      <View style={{ flex: 1 }}>
        <ButtonComp
          title={useTranslate(
            activeImgIndx === getData?.length - 1 ? 'GET_STARTED' : 'NEXT',
          )}
          onPress={() => handleNext()}
          btnStyle={{
            marginHorizontal: moderateScale(18),
          }}
        />
        <Spacer space={moderateScaleVertical(10)} />
        {activeImgIndx !== getData?.length - 1 ? (
          <ButtonComp
            title={useTranslate('SKIP')}
            onPress={() => handleSkip()}
            gradientColors={[colors.transparent, colors.transparent]}
            btnTxtStyle={styles.skipText}
          />
        ) : (
          <Spacer space={moderateScaleVertical(50)} />
        )}
      </View>
      <Spacer space={moderateScaleVertical(20)} />
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default IntroScreen;
