import React from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import imagePath from '../../constants/imagePath';
import { i18n } from '../../constants/lang';
import styles, { AMBASSADOR_SCREEN_BG } from './styles';

const AmbassadorCelebration: React.FC<any> = ({ navigation }) => {
  const onStartExploring = () => {
    navigation?.goBack?.();
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={AMBASSADOR_SCREEN_BG}
      />
      <ImageBackground
        source={imagePath.reward_bg}
        style={styles.bgFill}
        resizeMode="cover"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={styles.heroWrap}>
                <Image source={imagePath.reward_ic} />
                <View style={styles.ambassadorBadgeWrap}>
                  <Text
                    allowFontScaling={false}
                    style={styles.ambassadorBadgeText}
                  >
                    {i18n.t('AMBASSADOR_CELEBRATION_BADGE')}
                  </Text>
                </View>
              </View>

              <Text allowFontScaling={false} style={styles.title}>
                {i18n.t('AMBASSADOR_CELEBRATION_TITLE')}
              </Text>
              <Text allowFontScaling={false} style={styles.congrats}>
                {i18n.t('AMBASSADOR_CELEBRATION_CONGRATS')}
              </Text>
              <Text allowFontScaling={false} style={styles.description}>
                {i18n.t('AMBASSADOR_CELEBRATION_DESC')}
              </Text>

              <View style={styles.benefitCard}>
                <View style={styles.benefitIconCircle}>
                  <Image
                    source={imagePath.reward_premium_ic}
                    style={styles.benefitIcon}
                  />
                </View>
                <View style={styles.benefitTextCol}>
                  <Text allowFontScaling={false} style={styles.benefitTitle}>
                    {i18n.t('AMBASSADOR_BENEFIT_PREMIUM_TITLE')}
                  </Text>
                  <Text allowFontScaling={false} style={styles.benefitDesc}>
                    {i18n.t('AMBASSADOR_BENEFIT_PREMIUM_DESC')}
                  </Text>
                </View>
              </View>

              <View style={styles.benefitCard}>
                <View style={styles.benefitIconCircle}>
                  <Image
                    source={imagePath.reward_scan_ic}
                    style={styles.benefitIcon}
                  />
                </View>
                <View style={styles.benefitTextCol}>
                  <Text allowFontScaling={false} style={styles.benefitTitle}>
                    {i18n.t('AMBASSADOR_BENEFIT_SCANS_TITLE')}
                  </Text>
                  <Text allowFontScaling={false} style={styles.benefitDesc}>
                    {i18n.t('AMBASSADOR_BENEFIT_SCANS_DESC')}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.cta}
              onPress={onStartExploring}
            >
              <Text allowFontScaling={false} style={styles.ctaText}>
                {i18n.t('START_EXPLORING')}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default AmbassadorCelebration;
