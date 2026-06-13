import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
} from 'react-native';
import styles from './styles';
import Header from '../../Components/Header';
import KeyboardAwareScroll from '../../Components/KeyboardAwareScroll';
import WrapperContainer from '../../Components/WrapperContainer';
import { useTranslate } from '../../constants/lang';
import imagePath from '../../constants/imagePath';
import ButtonComp from '../../Components/ButtonComp';
import Spacer from '../../Components/Spacer';
import commonStyles from '../../styles/commonStyles';
import {
  APP_LOG,
  checkIsNetConnected,
  DEVICE_INFO,
  errorMethod,
  getYearlyDiscount,
  isIos,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';

import {
  initConnection,
  getAvailablePurchases,
  useIAP,
  ErrorCode,
} from 'react-native-iap';
import { appConstants } from '../../constants/appConstants';
import { useNavigation } from '@react-navigation/native';
import actions from '../../redux/actions';
import { t } from 'i18next';
import DeviceInfo from 'react-native-device-info';
import { SubscriptionShimmer } from '../../Components/ShimmerComp';
import { useSelector } from 'react-redux';
import HorizontalLine from '../../Components/HorizontalLine';
import { moderateScale } from '../../styles/responsiveSize';
import moment from 'moment';
import { userDataSave } from '../../redux/actions/auth';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../styles/colors';
import TextButton from '../../Components/TextButton';

// Constants
const PRODUCT_IDS = {
  MONTHLY: 'com.monthly.bcn',
  YEARLY: 'com.year.bcn',
} as const;

const PLAN_TYPES = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

const PLAN_NAMES = {
  FREE: 'Free',
  PRO: 'Pro',
} as const;

// Infer currency code from localizedPrice when currency is missing (e.g. "€3.99" -> EUR)
const getDisplayCurrency = (
  inAppStore: { currency?: string; localizedPrice?: string } | null | undefined,
): string => {
  if (inAppStore?.currency) return inAppStore.currency;
  const sym = String(inAppStore?.localizedPrice ?? '').replace(
    /[\d.,\s]/g,
    '',
  )[0];
  return (
    ({ '€': 'EUR', $: 'USD', '£': 'GBP' } as Record<string, string>)[sym] ??
    'EUR'
  );
};

// Module-level flags
let stopPurchaseMethodRecursive = true;
let availablePurchaseCalling = false;

const SubscriptionPlans = () => {
  const navigation = useNavigation();
  const purchasePlanRef = React.useRef<any>(null);
  const methodReceiptSendToServerRef = React.useRef<
    ((purchase: any) => Promise<void>) | null
  >(null);

  const {
    connected,
    subscriptions,
    availablePurchases,
    requestPurchase,
    finishTransaction,
    fetchProducts,
  } = useIAP({
    onPurchaseSuccess: async purchase => {
      setLoading(false);
      if (!stopPurchaseMethodRecursive && purchase) {
        stopPurchaseMethodRecursive = true;
        const receipt =
          (purchase as any)?.transactionReceipt ?? purchase?.purchaseToken;
        if (receipt) {
          try {
            await finishTransaction({ purchase });
            methodReceiptSendToServerRef.current?.(purchase);
          } catch {
            // Handle error silently
          }
        }
      }
    },
    onPurchaseError: error => {
      setLoading(false);
      if (error?.code === ErrorCode.UserCancelled) {
        showError(t('PURCHASE_CANCELLED'));
        return;
      }
      if (error?.message) {
        showError(error.message);
      }
    },
  });
  const { userData } = useSelector((state: any) => state?.auth);

  // State
  const [isLoading, setLoading] = useState<boolean>(false);
  const [yearlyDiscount, setYearlyDiscount] = useState<number>(0);
  const [contentLoading, setContentLoading] = useState<boolean>(true);
  const [purchasePlan, setPurchasePlan] = useState<any>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any>(
    appConstants?.plans || [],
  );
  const [features, setFeatures] = useState<
    Array<{ name: string; value: string }>
  >(appConstants.features[1]);
  const [selectedPaidPlan, setSelectedPaidPlan] = useState<any>(null);
  const [purchasedPlan, setPurchasedPlan] = useState<any>({});
  const [planType, setPlanType] = useState<string>(PLAN_TYPES.MONTHLY);
  const [selectedPlan, setSelectedPlan] = useState<string>(PLAN_NAMES.PRO);

  // Helper functions
  const isPremium = Number(userData?.is_premium) === 1;
  // Use API response product_id as fallback if userData doesn't have it
  const purchasedProductId =
    userData?.purchased_plan?.product_id || purchasedPlan?.product_id;
  const isYearlyPurchased = purchasedProductId === PRODUCT_IDS.YEARLY;
  const isMonthlyPurchased = purchasedProductId === PRODUCT_IDS.MONTHLY;

  // Get plan by product ID
  const getPlanByProductId = useCallback(
    (id: string) => subscriptionPlans.find((p: any) => p.plan_id === id),
    [subscriptionPlans],
  );

  // Initialize IAP connection
  const initIapConnection = async () => {
    await initConnection();
  };

  // Get subscriptions from store (react-native-iap v14: fetchProducts with type 'subs')
  const methodGetSubscriptions = useCallback(async () => {
    try {
      await fetchProducts({
        skus: [PRODUCT_IDS.MONTHLY, PRODUCT_IDS.YEARLY],
        type: 'subs',
      });
      APP_LOG('subscriptions fetched');
    } catch (err) {
      console.warn(err);
    }
  }, [fetchProducts]);

  // Map in-app store data to plan data (live IAP currency/pricing per user country)
  const methodInAppStoreDataSet = useCallback(
    (apiData: any) => {
      // Android uses `id`, iOS may use `productId`; support both
      const matchingProduct = subscriptions.find(
        (data: any) => (data?.productId ?? data?.id) === apiData?.plan_id,
      );

      if (!matchingProduct) {
        return {
          ...apiData,
          localizedPrice: '€' + apiData?.price,
          currency: 'EUR',
        };
      }

      const product = matchingProduct as any;
      const liveCurrency = product?.currency ?? product?.priceCurrencyCode;
      const livePrice =
        product?.displayPrice ??
        product?.localizedPrice ??
        product?.formattedPrice;

      if (isIos) {
        return {
          ...matchingProduct,
          currency: liveCurrency,
          localizedPrice: livePrice ?? '€' + apiData?.price,
        };
      }

      // Android: use subscriptionOfferDetailsAndroid (react-native-iap v14 typed name)
      const offerDetails =
        product?.subscriptionOfferDetailsAndroid ??
        product?.subscriptionOfferDetails;
      if (
        offerDetails?.length > 0 &&
        offerDetails[0]?.pricingPhases?.pricingPhaseList?.length > 0
      ) {
        const pricingPhases = offerDetails[0].pricingPhases.pricingPhaseList;
        const lastPhase = pricingPhases[pricingPhases.length - 1];
        return {
          ...matchingProduct,
          localizedPrice: lastPhase?.formattedPrice ?? livePrice,
          currency: lastPhase?.priceCurrencyCode ?? liveCurrency,
        };
      }

      // Android fallback: product-level currency/displayPrice (e.g. INR, ₹440.00)
      return {
        ...matchingProduct,
        currency: liveCurrency,
        localizedPrice: livePrice ?? '€' + apiData?.price,
      };
    },
    [subscriptions],
  );

  // Process and update plan data with store information
  const methodPlanDataSet = useCallback(
    (planDetails: any) => {
      if (!planDetails?.length) {
        return;
      }

      const updatedPlans = planDetails.map((data: any) => {
        const storeData = methodInAppStoreDataSet(data);
        return { ...data, inAppStore: storeData };
      });

      const percentage = getYearlyDiscount(updatedPlans);
      setYearlyDiscount(percentage);
      setSubscriptionPlans(updatedPlans);

      if (!isPremium) {
        const monthlyPlan = updatedPlans.find(
          (p: any) => p.plan_id === PRODUCT_IDS.MONTHLY,
        );
        if (monthlyPlan) {
          setPurchasePlan(monthlyPlan);
          setSelectedPaidPlan(monthlyPlan);
        }
      }

      setContentLoading(false);
    },
    [isPremium, methodInAppStoreDataSet],
  );

  // Toggle between monthly and yearly plans
  const togglePlanTenure = (type: string) => {
    const productId =
      type === PLAN_TYPES.MONTHLY ? PRODUCT_IDS.MONTHLY : PRODUCT_IDS.YEARLY;
    const plan = getPlanByProductId(productId);
    if (plan) {
      setSelectedPaidPlan(plan);
      setPurchasePlan(plan);
    }
  };

  // Handle plan purchase
  const methodPurchase = async () => {
    setLoading(true);

    if (!purchasePlan) {
      setLoading(false);
      showError(t('SELECT_PLAN'));
      return;
    }

    const isNetworkConnected = await checkIsNetConnected();
    if (!isNetworkConnected) {
      setLoading(false);
      showError(t('PLEASE_CONNECT_INTERNET'));
      return;
    }

    const deviceId = DEVICE_INFO.device_uniqueid;
    stopPurchaseMethodRecursive = false;
    const planWithToken = { ...purchasePlan, appAccountToken: deviceId };
    setPurchasePlan(planWithToken);
    purchasePlanRef.current = planWithToken;

    // Android: extract offer details for subscriptionOffers
    const offerDetails = purchasePlan?.inAppStore?.subscriptionOfferDetails;
    const hasOffers =
      !isIos && Array.isArray(offerDetails) && offerDetails.length > 0;

    await requestPurchase({
      type: 'subs',
      request: isIos
        ? { apple: { sku: purchasePlan?.plan_id, appAccountToken: deviceId } }
        : {
            google: {
              skus: [purchasePlan?.plan_id],
              subscriptionOffers: hasOffers
                ? [
                    {
                      sku: purchasePlan?.plan_id,
                      offerToken: offerDetails[0]?.offerToken || '',
                    },
                  ]
                : undefined,
            },
          },
    });
  };

  // Get transaction ID (handles iOS and Android differences)
  const getTransactionId = (purchase: any) => {
    if (isIos) {
      return (
        purchase?.originalTransactionIdentifierIOS || purchase?.transactionId
      );
    }
    return purchase?.transactionId;
  };

  // Send receipt to server after purchase (uses purchasePlanRef when set by methodPurchase)
  const methodReceiptSendToServer = useCallback(
    async (purchase: any) => {
      const plan = purchasePlanRef.current ?? purchasePlan;

      (purchase as any).transactionReceipt = {
        packageName: purchase?.packageNameAndroid || '',
        productId: purchase?.productId || '',
        purchaseToken: purchase?.purchaseToken || '',
      };

      const data = {
        plan_id: plan?.id,
        product_id: plan?.plan_id,
        payment_amount: plan?.price,
        local_amount: plan?.inAppStore?.localizedPrice,
        transaction_id: getTransactionId(purchase),
        new_transaction_id: purchase?.transactionId,
        currency: plan?.inAppStore?.currency,
        receipt: JSON.stringify((purchase as any)?.transactionReceipt),
        payment_gatway: 'INAPP',
        device_type: Platform.OS.toUpperCase(),
        android_purchase_token: isIos ? '' : purchase?.purchaseToken,
        device_id: plan?.appAccountToken,
        version_name: DeviceInfo.getVersion(),
      };

      purchaseApiCall(data);
    },
    [purchasePlan],
  );

  // API call to process purchase
  const purchaseApiCall = async (request: any) => {
    setLoading(true);
    actions
      .purchasePlan(request)
      .then(async (response: any) => {
        if (response?.status) {
          showSuccess(response?.message);
          setPurchasedPlan(response.data?.purchased_plan);
          userDataSave(response.data);
          actions.getUserData({});
          actions.onSaveUserDataInKeyChain({ ...response?.data });
        } else {
          showError(response?.message);
        }
      })
      .catch(error => {
        errorMethod(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Get available purchases for restore
  const methodGetAvailablePurchase = async () => {
    setLoading(true);
    availablePurchaseCalling = true;
    try {
      await getAvailablePurchases();
    } catch {
      availablePurchaseCalling = false;
    } finally {
      setLoading(false);
    }
  };

  // API call to restore purchase
  const restorePurchasePlanCallApi = useCallback(
    (request: any) => {
      try {
        setLoading(true);
        actions
          .restorePurchasePlan(request)
          .then(async (response: any) => {
            if (response?.status) {
              showSuccess(response?.message);
              actions.onSaveUserDataInKeyChain({
                ...userData,
                ...response?.data,
              });
            } else {
              showError(response?.message);
            }
          })
          .catch(errorMethod)
          .finally(() => {
            setLoading(false);
          });
      } catch {
        setLoading(false);
        showError('Subscription plan not yet purchased.');
      }
    },
    [userData],
  );

  // Restore purchase API call
  const methodRestoreApiCall = useCallback(
    async (purchase: any) => {
      setLoading(true);

      const matchingPlan = subscriptionPlans?.find(
        (data: any) => data?.plan_id === purchase?.productId,
      );

      if (!matchingPlan) {
        setLoading(false);
        showError('Subscription plan not found.');
        return;
      }

      const data = {
        plan_id: matchingPlan?.id,
        product_id: matchingPlan?.plan_id,
        payment_amount: matchingPlan?.price,
        local_amount: matchingPlan?.inAppStore?.localizedPrice,
        original_transaction_id: getTransactionId(purchase),
        transaction_id: purchase?.transactionId,
        currency: matchingPlan?.inAppStore?.currency,
        receipt: purchase?.transactionReceipt,
        payment_gatway: 'INAPP',
        device_type: Platform.OS.toUpperCase(),
        android_purchase_token: isIos ? '' : purchase?.purchaseToken,
        device_id: matchingPlan?.appAccountToken,
        version_name: DeviceInfo.getVersion(),
        screen: 'subscription',
      };

      restorePurchasePlanCallApi(data);
    },
    [subscriptionPlans, restorePurchasePlanCallApi],
  );

  // Open subscription management page
  const manageSubscription = async () => {
    const url =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/account/subscriptions'
        : 'https://play.google.com/store/account/subscriptions?package=com.bcnapp';

    try {
      await Linking.openURL(url);
    } catch {
      // Handle error silently
    }
  };

  // Get amount paid for current plan
  const getAmountPaid = () => {
    // Use API response data if available (more accurate)
    if (purchasedPlan?.payment_amount && purchasedPlan?.currency) {
      return `${purchasedPlan.currency}${purchasedPlan.payment_amount}`;
    }

    // Fallback to subscription plans data
    const plan = subscriptionPlans.find(
      (sub: any) => sub?.plan_id === purchasedProductId,
    );

    if (!plan) {
      return '0';
    }

    return (
      plan?.inAppStore?.localizedPrice || '€' + (plan?.price || '0') || '0'
    );
  };

  // Check if selected plan is already purchased
  const isSelectedPlanPurchased = () => {
    return (
      purchasedProductId &&
      selectedPaidPlan?.plan_id &&
      purchasedProductId === selectedPaidPlan?.plan_id
    );
  };

  // Handle subscribe button press
  const onSubscribe = () => {
    if (selectedPlan?.toLowerCase() === PLAN_NAMES.PRO.toLowerCase()) {
      methodPurchase();
    }
  };

  // Initialize connection on mount
  useEffect(() => {
    if (!connected) {
      initIapConnection();
    }
    actions
      .subscriptionPlanDetails()
      .then((res: any) => {
        APP_LOG('subscription plan details:', res);
        if (res?.status && res?.data) {
          setPurchasedPlan(res.data);
        }
      })
      .catch(err => {
        APP_LOG('subscription plan details error:', err);
      })
      .finally(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get subscriptions when connected
  useEffect(() => {
    if (connected) {
      methodGetSubscriptions();
    }
  }, [connected, methodGetSubscriptions]);

  // Process subscriptions when available
  useEffect(() => {
    if (subscriptions?.length > 0) {
      // Use initial plans from appConstants to avoid circular dependency
      const initialPlans = appConstants?.plans || [];
      if (initialPlans.length > 0) {
        methodPlanDataSet(initialPlans);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptions]);

  // Handle available purchases for restore
  useEffect(() => {
    if (availablePurchaseCalling) {
      availablePurchaseCalling = false;
      if (availablePurchases?.length > 0) {
        methodRestoreApiCall(availablePurchases[0]);
      } else {
        showError(t('SUBSCRIPTION_NOT_PURCHASED'));
      }
    }
  }, [availablePurchases, methodRestoreApiCall]);

  // Keep ref updated so onPurchaseSuccess callback can call the latest methodReceiptSendToServer
  useEffect(() => {
    methodReceiptSendToServerRef.current = methodReceiptSendToServer;
  }, [methodReceiptSendToServer]);

  // Initialize plan type and selection based on user's current subscription
  useEffect(() => {
    if (!subscriptionPlans?.length) {
      return;
    }

    if (isPremium && isYearlyPurchased) {
      setPlanType(PLAN_TYPES.YEARLY);
      const yearlyPlan = getPlanByProductId(PRODUCT_IDS.YEARLY);
      if (yearlyPlan) {
        setSelectedPaidPlan(yearlyPlan);
        setPurchasePlan(yearlyPlan);
      }
      setFeatures(appConstants.features[1]);
    } else {
      setPlanType(PLAN_TYPES.MONTHLY);
      const monthlyPlan = getPlanByProductId(PRODUCT_IDS.MONTHLY);
      if (monthlyPlan) {
        setSelectedPaidPlan(monthlyPlan);
        setPurchasePlan(monthlyPlan);
      }
    }
  }, [
    subscriptionPlans,
    isPremium,
    purchasedProductId,
    isYearlyPurchased,
    getPlanByProductId,
  ]);

  // Render subscription button based on state
  const renderSubscriptionButton = () => {
    // FREE plan selected
    if (selectedPlan === PLAN_NAMES.FREE) {
      return (
        <TouchableOpacity disabled style={styles.subscribedButton}>
          <LinearGradient
            colors={[colors.themeColor, colors.deepTeal]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <View style={styles.subscribeButtonOverlay}>
              <Text
                allowFontScaling={false}
                style={styles.subscribedButtonText}
              >
                {isPremium
                  ? t(
                      isYearlyPurchased
                        ? 'YEARLY_SUBSCRIBED'
                        : 'MONTHLY_SUBSCRIBED',
                    )
                  : t('SUBSCRIBED')}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    // PRO plan selected
    if (selectedPlan === PLAN_NAMES.PRO) {
      if (isPremium && isSelectedPlanPurchased()) {
        return (
          <TouchableOpacity disabled style={styles.subscribedButton}>
            <LinearGradient
              colors={[colors.themeColor, colors.deepTeal]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <View style={styles.subscribeButtonOverlay}>
                <Text
                  allowFontScaling={false}
                  style={styles.subscribedButtonText}
                >
                  {t('SUBSCRIBED')}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        );
      }

      if (isPremium && isYearlyPurchased) {
        return (
          <TouchableOpacity disabled style={styles.subscribedButton}>
            <LinearGradient
              colors={[colors.themeColor, colors.deepTeal]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <View style={styles.subscribeButtonOverlay}>
                <Text
                  allowFontScaling={false}
                  style={styles.subscribedButtonText}
                >
                  {t('YEARLY_SUBSCRIBED')}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        );
      }

      return (
        <ButtonComp
          title={t('CONTINUE_TO_PURCHASE')}
          btnStyle={styles.purchaseButton}
          onPress={onSubscribe}
          isLoading={isLoading}
        />
      );
    }
  };

  APP_LOG('selectedPaidPlan', { selectedPaidPlan, subscriptions });

  return (
    <WrapperContainer>
      <Header
        centerTitle={useTranslate('SUBSCRIPTION_PLANS')}
        onPressLeftImg={() => {
          navigation.goBack();
          setSelectedPlan('');
        }}
      />

      {contentLoading ? (
        <SubscriptionShimmer />
      ) : (
        <React.Fragment>
          <KeyboardAwareScroll
            showsVerticalScrollIndicator={false}
            style={styles.container}
          >
            <View style={styles.section}>
              {isPremium && (
                <View>
                  <View style={commonStyles.flexRowJustifySpaceBtwn}>
                    <Text allowFontScaling={false} style={styles.listItem}>
                      Current Plan
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={[styles.listItem, { flex: 0 }]}
                    >
                      Amount Paid
                    </Text>
                  </View>
                  <View
                    style={{
                      ...commonStyles.flexRowJustifySpaceBtwn,
                      marginTop: moderateScale(5),
                    }}
                  >
                    <Text allowFontScaling={false} style={styles.sectionTitle}>
                      {purchasedPlan?.plan_info?.title ||
                        purchasedPlan?.plan_name ||
                        'Pro Plan'}
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.switchLabel,
                          { textTransform: 'capitalize' },
                        ]}
                      >
                        {' '}
                        (
                        {purchasedPlan?.plan_info?.type === 'YEARLY' ||
                        purchasedPlan?.product_id === PRODUCT_IDS.YEARLY
                          ? 'Yearly'
                          : 'Monthly'}
                        )
                      </Text>
                    </Text>
                    <Text allowFontScaling={false} style={styles.sectionTitle}>
                      {getAmountPaid()}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...commonStyles.flexRowJustifySpaceBtwn,
                      marginTop: moderateScale(10),
                    }}
                  >
                    <Text allowFontScaling={false} style={styles.listItem}>
                      Start Date
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={[styles.listItem, { flex: 0 }]}
                    >
                      End Date
                    </Text>
                  </View>
                  <View
                    style={{
                      ...commonStyles.flexRowJustifySpaceBtwn,
                      marginTop: moderateScale(5),
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...styles.sectionTitle,
                        ...commonStyles.semiBoldFont16,
                      }}
                    >
                      {purchasedPlan?.start_date
                        ? moment(purchasedPlan.start_date).format('D MMM, YYYY')
                        : '-'}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...styles.sectionTitle,
                        ...commonStyles.semiBoldFont16,
                      }}
                    >
                      {purchasedPlan?.end_date
                        ? moment(purchasedPlan.end_date).format('D MMM, YYYY')
                        : '-'}
                    </Text>
                  </View>
                  <HorizontalLine />
                </View>
              )}
              <Text allowFontScaling={false} style={styles.sectionTitle}>
                All Plans (in {getDisplayCurrency(selectedPaidPlan?.inAppStore)}
                )
              </Text>
              <View style={styles.switchContainer}>
                <Text allowFontScaling={false} style={styles.switchLabel}>
                  Monthly
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    const newType =
                      planType === PLAN_TYPES.MONTHLY
                        ? PLAN_TYPES.YEARLY
                        : PLAN_TYPES.MONTHLY;
                    setPlanType(newType);
                    togglePlanTenure(newType);
                  }}
                  style={styles.toggle}
                >
                  <Image
                    source={
                      planType === PLAN_TYPES.MONTHLY
                        ? imagePath.toggle_off
                        : imagePath.toggle_on
                    }
                  />
                </TouchableOpacity>
                <Text allowFontScaling={false} style={styles.switchLabel}>
                  Yearly{' '}
                  <Text allowFontScaling={false} style={styles.saveText}>
                    (Save {yearlyDiscount}%)
                  </Text>
                </Text>
              </View>
            </View>
            <View style={styles.planContainer}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedPlan(PLAN_NAMES.FREE);
                  setFeatures(appConstants.features[0]);
                }}
                style={[
                  styles.planContainerPremium,
                  selectedPlan === PLAN_NAMES.FREE && styles.selectedProPlan,
                ]}
              >
                <View style={commonStyles.flexRowJustifySpaceBtwn}>
                  <View>
                    <Text allowFontScaling={false} style={styles.planTitle}>
                      Free Plan
                    </Text>
                    <Text allowFontScaling={false} style={styles.planPrice}>
                      {selectedPaidPlan?.inAppStore?.localizedPrice
                        ? String(
                            selectedPaidPlan?.inAppStore?.localizedPrice,
                          )[0]
                        : '€'}
                      0
                    </Text>
                    <Text allowFontScaling={false} style={styles.planSubtitle}>
                      Basic Access
                    </Text>
                  </View>
                  {!isPremium && (
                    <Image
                      source={imagePath.category_check_active}
                      style={styles.listIcon}
                    />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setFeatures(appConstants.features[1]);
                  setSelectedPlan(PLAN_NAMES.PRO);
                  const productId =
                    planType === PLAN_TYPES.MONTHLY
                      ? PRODUCT_IDS.MONTHLY
                      : PRODUCT_IDS.YEARLY;
                  const plan = getPlanByProductId(productId);
                  if (plan) {
                    setPurchasePlan(plan);
                    setSelectedPaidPlan(plan);
                  }
                }}
                style={[
                  styles.planContainerPremium,
                  selectedPlan === PLAN_NAMES.PRO && styles.selectedProPlan,
                ]}
              >
                <View style={commonStyles.flexRowJustifySpaceBtwn}>
                  <View>
                    <Text allowFontScaling={false} style={styles.planTitle}>
                      Pro Plan
                    </Text>
                    <Text allowFontScaling={false} style={styles.planPrice}>
                      {selectedPaidPlan?.inAppStore?.localizedPrice ??
                        '€' + selectedPaidPlan?.price}
                    </Text>
                    <Text allowFontScaling={false} style={styles.planSubtitle}>
                      Unlimited Access
                    </Text>
                  </View>
                  {selectedPlan === PLAN_NAMES.PRO &&
                    isPremium &&
                    ((isYearlyPurchased && planType === PLAN_TYPES.YEARLY) ||
                      (isMonthlyPurchased &&
                        planType === PLAN_TYPES.MONTHLY)) && (
                      <Image
                        source={imagePath.category_check_active}
                        style={styles.listIcon}
                      />
                    )}
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.list}>
              {features.map((feature, index: number) => {
                const typedFeature = feature as { name: string; value: string };
                return (
                  <View key={index} style={styles.listItemContainer}>
                    <Image
                      source={imagePath.category_check_active}
                      style={styles.listIcon2}
                    />
                    <View style={{ flex: 1 }}>
                      <Text allowFontScaling={false} style={styles.listItem}>
                        {typedFeature.name}
                      </Text>
                      <Text allowFontScaling={false} style={styles.listValue}>
                        {typedFeature.value}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {isIos ? <Spacer space={20} /> : <Spacer space={50} />}

            {isIos && !isPremium && (
              <View style={styles.restoreButtonContainer}>
                <Text
                  allowFontScaling={false}
                  Button
                  disabled={isLoading}
                  title={t('RESTORE_PURCHASE')}
                  btnTxtStyle={styles.restoreBtn}
                  onPress={methodGetAvailablePurchase}
                />
              </View>
            )}

            <View style={styles.footerContainer}>
              {isPremium && (
                <TouchableOpacity
                  onPress={manageSubscription}
                  style={styles.manageButton}
                >
                  <Text
                    allowFontScaling={false}
                    style={styles.manageButtonText}
                  >
                    Manage Subscription
                  </Text>
                </TouchableOpacity>
              )}
              {renderSubscriptionButton()}
            </View>
          </KeyboardAwareScroll>
        </React.Fragment>
      )}
    </WrapperContainer>
  );
};

export default SubscriptionPlans;
