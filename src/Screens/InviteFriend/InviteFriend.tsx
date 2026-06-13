import Clipboard from '@react-native-clipboard/clipboard';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../Components/Header';
import KeyboardAwareScroll from '../../Components/KeyboardAwareScroll';
import RewardEarnedModal from '../../Components/RewardEarnedModal';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { i18n } from '../../constants/lang';
import colors from '../../styles/colors';
import { moderateScale } from '../../styles/responsiveSize';
import { isIos, showError, showSuccess } from '../../utils/helperFunctions';
import styles, { AMBASSADOR_TARGET } from './styles';

const APPLE_APP_ID = 6745817359;

const getStoreLink = () =>
  isIos
    ? `https://apps.apple.com/app/id${APPLE_APP_ID}`
    : 'https://play.google.com/store/apps/details?id=com.bcnapp';

const InviteFriend = (props: { navigation: { goBack: () => void } }) => {
  const { navigation } = props;
  const [referralCode, setReferralCode] = useState('');
  const [invitedCount, setInvitedCount] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [trackWidth, setTrackWidth] = useState(0);

  const [rewardModalVisible, setRewardModalVisible] = useState(false);

  // const thumbSize = moderateScale(14);

  useEffect(() => {
    const t = setTimeout(() => {
      setReferralCode('SCAN-7X2K9');
      setInvitedCount(5);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const inviteMessage = useMemo(() => {
    const appLink = getStoreLink();
    return referralCode
      ? `Hey! Check out this app.\n${appLink}\n\nUse my referral code: ${referralCode}`
      : `Hey! Check out this app.\n${appLink}`;
  }, [referralCode]);

  const inviteUrl = useMemo(() => {
    const base = getStoreLink();
    return referralCode
      ? `${base}${base.includes('?') ? '&' : '?'}ref=${encodeURIComponent(
          referralCode,
        )}`
      : base;
  }, [referralCode]);

  const handleCopyCode = useCallback(() => {
    if (!referralCode) {
      return;
    }
    Clipboard.setString(referralCode);
    showSuccess(i18n.t('REFERRAL_CODE_COPIED'));
  }, [referralCode]);

  const handleCopyLink = useCallback(() => {
    Clipboard.setString(inviteUrl);
    showSuccess(i18n.t('INVITE_LINK_COPIED'));
  }, [inviteUrl]);

  const openUrl = useCallback(async (url: string, fallbackUrl?: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        return;
      }
      if (fallbackUrl) {
        const fb = await Linking.canOpenURL(fallbackUrl);
        if (fb) {
          await Linking.openURL(fallbackUrl);
          return;
        }
      }
      showError(i18n.t('COULD_NOT_OPEN_APP'));
    } catch {
      showError(i18n.t('COULD_NOT_OPEN_APP'));
    }
  }, []);

  const handleWhatsApp = useCallback(() => {
    const text = encodeURIComponent(inviteMessage);
    const appUrl = `whatsapp://send?text=${text}`;
    const webUrl = `https://wa.me/?text=${text}`;
    openUrl(appUrl, webUrl);
  }, [inviteMessage, openUrl]);

  const handleEmail = useCallback(() => {
    const subject = encodeURIComponent(i18n.t('INVITE_A_FRIEND'));
    const body = encodeURIComponent(inviteMessage);
    openUrl(`mailto:?subject=${subject}&body=${body}`);
  }, [inviteMessage, openUrl]);

  const handleSms = useCallback(() => {
    const body = encodeURIComponent(inviteMessage);
    const url =
      Platform.OS === 'ios' ? `sms:&body=${body}` : `sms:?body=${body}`;
    openUrl(url);
  }, [inviteMessage, openUrl]);

  const progressPct = Math.min(1, invitedCount / AMBASSADOR_TARGET);
  // const thumbLeft = useMemo(() => {
  //   if (trackWidth <= 0) {
  //     return 0;
  //   }
  //   const raw = trackWidth * progressPct - thumbSize / 2;
  //   return Math.min(Math.max(0, raw), trackWidth - thumbSize);
  // }, [progressPct, trackWidth, thumbSize]);

  const remainingAmbassador = Math.max(0, AMBASSADOR_TARGET - invitedCount);

  const isAmbassadorUnlocked = invitedCount >= AMBASSADOR_TARGET;

  const shareActions = useMemo(
    () => [
      {
        key: 'wa',
        label: i18n.t('SHARE_WHATSAPP'),
        source: imagePath.whatsapp_ic,
        onPress: handleWhatsApp,
        tint: false,
      },
      {
        key: 'email',
        label: i18n.t('SHARE_EMAIL'),
        source: imagePath.email_ic,
        onPress: handleEmail,
        tint: true,
      },
      {
        key: 'sms',
        label: i18n.t('SHARE_SMS'),
        source: imagePath.sms_ic,
        onPress: handleSms,
        tint: true,
      },
      {
        key: 'link',
        label: i18n.t('COPY_LINK'),
        source: imagePath.copy_link_ic,
        onPress: handleCopyLink,
        tint: true,
      },
    ],
    [handleCopyLink, handleEmail, handleSms, handleWhatsApp],
  );

  const headerTitle = i18n.t('INVITE_A_FRIEND');
  const strYourReferralCode = i18n.t('YOUR_REFERRAL_CODE');
  const strCopy = i18n.t('COPY');
  const strShareVia = i18n.t('SHARE_VIA');
  const strRewardsSummary = i18n.t('REWARDS_SUMMARY');
  const strBasicTier = i18n.t('BASIC_TIER');
  const strBasicBenefit = i18n.t('BASIC_TIER_BENEFIT');
  const strAmbassadorTier = i18n.t('AMBASSADOR_TIER');
  const strAmbassadorBenefit1 = i18n.t('AMBASSADOR_TIER_BENEFIT_1');
  const strAmbassadorBenefit2 = i18n.t('AMBASSADOR_TIER_BENEFIT_2');
  const strAmbassadorUnlocked = i18n.t('AMBASSADOR_UNLOCKED');
  const strMoreToUnlock = i18n.t('MORE_TO_UNLOCK_AMBASSADOR', {
    count: remainingAmbassador,
  });

  return (
    <WrapperContainer>
      <Header
        centerTitle={headerTitle}
        onPressLeftImg={() => navigation.goBack()}
      />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.themeColor} />
        </View>
      )}
      <KeyboardAwareScroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {!isLoading &&
          (isAmbassadorUnlocked ? (
            <LinearGradient
              colors={['#00B4B4', colors.teal]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.achievementGradient}
            >
              <View style={{ padding: moderateScale(17) }}>
                <View style={styles.ambassadorBadge}>
                  <Image source={imagePath.ambassador_star} />
                  <Text
                    allowFontScaling={false}
                    style={styles.ambassadorBadgeLabel}
                  >
                    {i18n.t('AMBASSADOR_BADGE_LABEL')}
                  </Text>
                </View>
                <Text
                  allowFontScaling={false}
                  style={styles.achievementTitleAmbassador}
                >
                  {i18n.t('REWARD_ACHIEVEMENT_TITLE')}{' '}
                  <Text
                    allowFontScaling={false}
                    style={styles.achievementSubtitleAmbassador}
                  >
                    {i18n.t('REWARD_ACHIEVEMENT_SUBTITLE')}
                  </Text>
                </Text>
              </View>
            </LinearGradient>
          ) : (
            <View style={styles.achievementCardBasic}>
              <View style={styles.basicTierBadge}>
                <Text
                  allowFontScaling={false}
                  style={styles.basicTierBadgeText}
                >
                  {strBasicTier}
                </Text>
              </View>
              <Text
                allowFontScaling={false}
                style={styles.achievementTitleBasic}
              >
                {i18n.t('REWARD_ACHIEVEMENT_TITLE')}
                <Text
                  allowFontScaling={false}
                  style={styles.achievementSubtitleBasic}
                >
                  {' '}
                  {i18n.t('REWARD_ACHIEVEMENT_SUBTITLE')}
                </Text>
              </Text>
            </View>
          ))}

        <Text
          allowFontScaling={false}
          style={[styles.sectionLabel, styles.sectionLabelFirst]}
        >
          {strYourReferralCode}
        </Text>
        {!!referralCode && (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.codeRow}
            onPress={handleCopyCode}
          >
            <Text allowFontScaling={false} style={styles.codeText}>
              {referralCode}
            </Text>
            <View style={styles.copyRight}>
              <Text allowFontScaling={false} style={styles.copyLabel}>
                {strCopy}
              </Text>
              <Image
                source={imagePath.copy_icon}
                style={styles.copyIconSmall}
              />
            </View>
          </TouchableOpacity>
        )}

        <Text allowFontScaling={false} style={styles.sectionLabel}>
          {strShareVia}
        </Text>
        <View style={styles.shareRow}>
          {shareActions.map(item => (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.8}
              style={styles.shareItem}
              onPress={item.onPress}
              disabled={isLoading}
            >
              <Image source={item.source} />
              <Text allowFontScaling={false} style={styles.shareLabel}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.progressBox}>
          <View style={styles.progressBg}>
            <Text allowFontScaling={false} style={styles.progressTitle}>
              {i18n.t('INVITED_PROGRESS', {
                current: invitedCount,
                max: AMBASSADOR_TARGET,
              })}
            </Text>
            {isAmbassadorUnlocked && (
              <Text allowFontScaling={false} style={styles.completeLabel}>
                {i18n.t('COMPLETED')}
              </Text>
            )}
          </View>
          <View style={styles.trackWrap}>
            <View
              style={styles.track}
              // onLayout={e => setTrackWidth(e.nativeEvent.layout.width)}
            >
              <LinearGradient
                colors={[colors.inviteTrackStart, colors.inviteTrackEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.trackFill, { width: `${progressPct * 100}%` }]}
              />
              <View
                style={[
                  styles.thumb,
                  invitedCount === 0 && { marginLeft: moderateScale(0) },
                ]}
              />
            </View>
          </View>
          <View style={styles.scaleRow}>
            {Array.from({ length: AMBASSADOR_TARGET + 1 }, (_, i) => (
              <Text
                allowFontScaling={false}
                key={String(i)}
                style={styles.scaleNum}
              >
                {i}
              </Text>
            ))}
          </View>
          <Text allowFontScaling={false} style={styles.unlockHint}>
            {remainingAmbassador === 0
              ? strAmbassadorUnlocked
              : strMoreToUnlock}
          </Text>
        </View>

        <Text allowFontScaling={false} style={styles.sectionLabel}>
          {strRewardsSummary}
        </Text>

        <View style={styles.rewardCard}>
          <Text allowFontScaling={false} style={styles.rewardCardTitle}>
            {strBasicTier}
          </Text>
          <View style={styles.benefitRow}>
            <Image source={imagePath.confirm_ic} style={styles.benefitIcon} />
            <Text allowFontScaling={false} style={styles.benefitText}>
              {strBasicBenefit}
            </Text>
          </View>
        </View>
        <View style={[styles.rewardCard, styles.rewardCardHighlight]}>
          <Text allowFontScaling={false} style={styles.rewardCardTitle}>
            {strAmbassadorTier}
          </Text>
          <View style={styles.benefitRow}>
            <Image source={imagePath.confirm_ic} style={styles.benefitIcon} />
            <Text allowFontScaling={false} style={styles.benefitText}>
              {strAmbassadorBenefit1}
            </Text>
          </View>
          <View style={styles.benefitRow}>
            <Image source={imagePath.confirm_ic} style={styles.benefitIcon} />
            <Text allowFontScaling={false} style={styles.benefitText}>
              {strAmbassadorBenefit2}
            </Text>
          </View>
        </View>
      </KeyboardAwareScroll>
      <RewardEarnedModal
        visible={rewardModalVisible}
        // visible={true}
        onClose={() => setRewardModalVisible(false)}
        onInviteMore={() => setRewardModalVisible(false)}
        scansEarned={3}
        invitedCount={invitedCount}
        invitesTarget={AMBASSADOR_TARGET}
      />
    </WrapperContainer>
  );
};

export default InviteFriend;
