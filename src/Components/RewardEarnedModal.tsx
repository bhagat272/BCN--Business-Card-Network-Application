import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeModal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { i18n } from '../constants/lang';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import ButtonComp from './ButtonComp';

export type RewardEarnedModalProps = {
  visible: boolean;
  onClose: () => void;
  onInviteMore: () => void;
  /** Scans credited for this reward (shown bold in the primary line). */
  scansEarned?: number;
  /** Current successful invites toward Ambassador. */
  invitedCount?: number;
  invitesTarget?: number;
};

const DEFAULT_SCANS = 3;
const DEFAULT_INVITED = 3;
const DEFAULT_TARGET = 5;

const RewardEarnedModal: React.FC<RewardEarnedModalProps> = ({
  visible,
  onClose,
  onInviteMore,
  scansEarned = DEFAULT_SCANS,
  invitedCount = DEFAULT_INVITED,
  invitesTarget = DEFAULT_TARGET,
}) => {
  const insets = useSafeAreaInsets();
  const [trackWidth, setTrackWidth] = useState(0);
  // const thumbSize = moderateScale(12);

  const progressPct = Math.min(
    1,
    Math.max(0, invitedCount / Math.max(1, invitesTarget)),
  );

  // const thumbLeft = useMemo(() => {
  //   if (trackWidth <= 0) {
  //     return 0;
  //   }
  //   const raw = trackWidth * progressPct - thumbSize / 2;
  //   return Math.min(Math.max(0, raw), trackWidth - thumbSize);
  // }, [progressPct, trackWidth, thumbSize]);

  /** Pixel width avoids % layout bugs on LinearGradient inside modals (fill was hidden under track). */
  // const fillWidth = useMemo(() => {
  //   if (trackWidth <= 0 || progressPct <= 0) {
  //     return 0;
  //   }
  //   return Math.max(2, Math.round(trackWidth * progressPct));
  // }, [progressPct, trackWidth]);

  // const fillEndRadius = progressPct >= 1 ? moderateScale(4) : 0;

  const title = i18n.t('REWARD_EARNED_TITLE');
  const prefix = i18n.t('REWARD_EARNED_PREFIX');
  const subtitle = i18n.t('REWARD_EARNED_SUBTITLE');
  const progressLabel = i18n.t('PROGRESS_TO_AMBASSADOR');
  const invitesShort = i18n.t('INVITES_COUNT_SHORT', {
    current: invitedCount,
    max: invitesTarget,
  });
  const closeLabel = i18n.t('REWARD_MODAL_CLOSE');
  const inviteMoreLabel = i18n.t('INVITE_MORE');

  return (
    <ReactNativeModal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modalRoot}
      backdropColor="#000"
      backdropOpacity={0.45}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriver
      hideModalContentWhileAnimating
      avoidKeyboard
    >
      <View
        style={[
          styles.sheet,
          { paddingBottom: Math.max(insets.bottom, moderateScale(16)) },
        ]}
      >
        <View style={styles.handle} />

        <View style={styles.iconHalo}>
          <View style={styles.iconCircle}>
            <Text allowFontScaling={false} style={styles.checkMark}>
              ✓
            </Text>
          </View>
        </View>

        <Text allowFontScaling={false} style={styles.modalTitle}>
          {title}
        </Text>

        <Text allowFontScaling={false} style={styles.primaryLine}>
          {prefix}{' '}
          <Text style={styles.primaryLineBold}>
            {i18n.t('REWARD_SCANS_BOLD', { count: scansEarned })}
          </Text>
        </Text>

        <Text allowFontScaling={false} style={styles.secondaryLine}>
          {subtitle}
        </Text>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text allowFontScaling={false} style={styles.progressHeaderLeft}>
              {progressLabel}
            </Text>
            <Text allowFontScaling={false} style={styles.progressHeaderRight}>
              {invitesShort}
            </Text>
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
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.closeBtn}
            onPress={onClose}
          >
            <Text allowFontScaling={false} style={styles.closeBtnText}>
              {closeLabel}
            </Text>
          </TouchableOpacity>
          <View style={styles.inviteMoreWrap}>
            <ButtonComp
              title={inviteMoreLabel}
              onPress={onInviteMore}
              btnStyle={styles.inviteMoreBtn}
              gradientColors={[colors.themeColor, colors.deepTeal]}
            />
          </View>
        </View>
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScaleVertical(8),
  },
  handle: {
    width: moderateScale(36),
    height: moderateScaleVertical(4),
    borderRadius: moderateScale(2),
    backgroundColor: colors.grey4,
    alignSelf: 'center',
    marginBottom: moderateScaleVertical(20),
  },
  iconHalo: {
    width: moderateScale(88),
    height: moderateScale(88),
    borderRadius: moderateScale(44),
    backgroundColor: colors.greenOff1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScaleVertical(16),
  },
  iconCircle: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: colors.seaGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: colors.white,
    fontSize: moderateScale(32),
    fontWeight: '700',
    marginTop: moderateScaleVertical(-2),
  },
  modalTitle: {
    ...commonStyles.semiBoldFont24,
    textAlign: 'center',
    marginBottom: moderateScaleVertical(8),
  },
  primaryLine: {
    ...commonStyles.mediumFont16,
    textAlign: 'center',
    marginBottom: moderateScaleVertical(8),
  },
  primaryLineBold: {
    ...commonStyles.semiBoldFont16,
  },
  secondaryLine: {
    ...commonStyles.font14,
    color: colors.grey11,
    textAlign: 'center',
    marginBottom: moderateScaleVertical(20),
  },
  progressCard: {
    backgroundColor: colors.lightYellowish,
    borderRadius: moderateScale(12),
    padding: moderateScale(14),
    marginBottom: moderateScaleVertical(20),
    borderColor: '#FF572233',
    borderWidth: 1,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScaleVertical(10),
  },
  progressHeaderLeft: {
    ...commonStyles.mediumFont14,
    color: colors.themeColor,
    flex: 1,
    marginEnd: moderateScale(8),
  },
  progressHeaderRight: {
    fontFamily: fontFamily.poppinsSemiBold,
    fontSize: moderateScale(14),
    color: colors.darkOrange,
  },
  trackWrap: {
    height: moderateScaleVertical(22),
    justifyContent: 'center',
  },
  track: {
    height: moderateScaleVertical(8),
    borderRadius: moderateScale(4),
    backgroundColor: colors.inviteTrackPath,
    overflow: 'visible',
    position: 'relative',
    flexDirection: 'row',
  },
  trackBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.grey9,
    borderRadius: moderateScale(4),
    zIndex: 0,
  },
  trackFill: {
    height: '100%',
    borderRadius: moderateScale(4),
    backgroundColor: colors.darkOrange,
  },
  thumb: {
    // position: 'absolute',
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
    backgroundColor: colors.invitePathPointer,
    top: moderateScaleVertical(-4),
    marginLeft: moderateScale(-15),
    borderWidth: 2,
    borderColor: colors.white,
    zIndex: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: moderateScale(12),
  },
  closeBtn: {
    flex: 1,
    minHeight: moderateScaleVertical(48),
    borderRadius: moderateScale(28),
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.themeColor,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(8),
  },
  closeBtnText: {
    fontFamily: fontFamily.poppinsSemiBold,
    fontSize: moderateScale(15),
    color: colors.themeColor,
  },
  inviteMoreWrap: {
    flex: 1,
  },
  inviteMoreBtn: {
    flex: 1,
    marginHorizontal: 0,
    minHeight: moderateScaleVertical(48),
    borderRadius: moderateScale(28),
  },
});

export default React.memo(RewardEarnedModal);
