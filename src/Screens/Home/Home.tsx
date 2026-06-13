import { getMessaging } from '@react-native-firebase/messaging';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  DeviceEventEmitter,
  FlatList,
  Image,
  Linking,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { jsonToCSV } from 'react-native-csv';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';
import { generatePDF } from 'react-native-html-to-pdf';
import {
  getAvailablePurchases,
  initConnection,
  useIAP,
} from 'react-native-iap';
import Share from 'react-native-share';
import { useDispatch, useSelector } from 'react-redux';
import ButtonComp from '../../Components/ButtonComp';
import ButtonWithImage from '../../Components/ButtonWithImage';
import DynamicModal from '../../Components/DynamicModal';
import FileComp from '../../Components/FileComp';
import FilterModal from '../../Components/FilterModal';
import Header from '../../Components/Header';
import Logout from '../../Components/Logout';
import { HomeLoader } from '../../Components/ShimmerComp';
import Spacer from '../../Components/Spacer';
import TextInputWithLabel from '../../Components/TextInputWithLabel';
import { appConstants, URL_TYPE } from '../../constants/appConstants';
import imagePath from '../../constants/imagePath';
import { useTranslate } from '../../constants/lang';
import navigationStrings from '../../constants/navigationStrings';
import actions from '../../redux/actions';
import { setCardDataStart } from '../../redux/reducers/home';
import colors from '../../styles/colors';
import commonStyles, { hitSlopProp } from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {
  APP_LOG,
  DEVICE_INFO,
  errorMethod,
  isIos,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import PushNotificationConfig from '../../utils/PushNotificationConfig';
import { useDebounce } from '../../utils/useDebounce';
import { getItem, setItem, useHardwareBackPressWith } from '../../utils/utils';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAPNSToken } from '../../utils/notification';

interface Filter {
  sort_order: string;
  sort_by: string;
  tags: string[];
}

// Updated interface based on the sample data
interface SelectedData {
  id?: number;
  user_id?: number;
  uuid?: string;
  name: string;
  designation: string;
  company_name: string;
  service: string;
  email: string;
  phone_number: string;
  country_code: string;
  country_code_name: string;
  status: number;
  card_tag: Array<{
    id?: number;
    user_id?: number;
    card_id?: number;
    tag_id?: string;
    tag?: {
      id?: number;
      uuid?: string;
      user_id?: number;
      tag?: string;
    };
  }>;
  card_extra_filed: {
    title: string;
    description: string;
  }[];
}

const Home = (props: any) => {
  const { connected, subscriptions, fetchProducts }: any = useIAP();
  const dispatch = useDispatch(); // Get the dispatch function
  const { cardData, isHomeRefresh } = useSelector((state: any) => state?.home); // Access the state from the slice
  const { userData } = useSelector((state: any) => state?.auth); // Access the state from the slice
  const { isCalledDeepLinking } = useSelector((state: any) => state?.settings);
  const [selectedItems, setSelectedItems] = useState<SelectedData[]>([]);
  const [exportData, setExportData] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<Filter>({
    // Store filter options
    sort_order: 'desc',
    sort_by: 'created_at',
    tags: [],
    // Add other filter criteria here as needed (e.g., tags, search term)
  });
  const [searchText, setSearchText] = useState(''); // State for search text
  const [filteredCardData, setFilteredCardData] = useState<any[]>([]);
  const { navigation } = props;
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [isRefresh, setRefresh] = useState<boolean>(false);
  const [isDelete, setDeleted] = useState<boolean>(false);
  const [isClearLoad, setClearLoad] = useState<boolean>(false);
  const [isApplyLoad, setApplyLoad] = useState<boolean>(false);
  const [isLoadMore, setLoadMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShow, setShow] = useState<boolean>(false);
  const [contactCard, setContactCardData] = useState<any[]>([]);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false); // State for delete confirmation modal
  const [isFilterModalVisible, setFilterModalVisible] = useState(false); // State for delete confirmation modal
  const [exportType, setExportType] = useState<'csv' | 'pdf' | null>(null);
  const [loadingMore, setLoadingMore] = useState<boolean>(true);
  const [uuidNumber, setUuidNumber] = useState<string>('');
  const [searchTag, setSearchTag] = useState('');

  const [exportTypeError, setExportTypeError] = useState<string>('');
  const [exportButtonPress, setExportButtonPress] = useState<boolean>(false); // New state variable

  const [isModalVisible, setModalVisible] = useState(false);

  const fcmTokenListener = useRef<any>(null);

  const methodGetSubscriptionHistory = async () => {
    const skus = ['com.monthly.bcn', 'com.year.bcn'];
    try {
      await fetchProducts({ skus, type: 'subs' });
    } catch (err) {}
  };
  const saveReceiptApiCall = async (purchase: any) => {
    let dicPlainAppPlanFind: any = {
      price: '',
      id: '',
      plan_id: purchase?.productId,
    };
    let inAppPlanFind =
      appConstants.plans && appConstants.plans.length > 0
        ? isIos
          ? appConstants.plans.filter(
              data => data?.plan_id == purchase?.productId,
            )
          : appConstants.plans.filter(
              data => data?.plan_id == purchase?.productId,
            )
        : [];
    if (inAppPlanFind && inAppPlanFind.length > 0) {
      dicPlainAppPlanFind = inAppPlanFind[0];
    } else {
      let arrOldPlan = appConstants.plans.filter(
        data => data?.plan_id == purchase?.productId,
      );
      if (arrOldPlan && arrOldPlan.length > 0) {
        dicPlainAppPlanFind = arrOldPlan[0];
      }
    }
    let data = {
      plan_id: dicPlainAppPlanFind?.id,
      product_id: dicPlainAppPlanFind?.plan_id,
      payment_amount: dicPlainAppPlanFind?.price,
      local_amount: dicPlainAppPlanFind?.inAppStore?.localizedPrice,
      original_transaction_id: isIos
        ? purchase?.originalTransactionIdentifierIOS
          ? purchase?.originalTransactionIdentifierIOS
          : purchase?.transactionId
        : purchase?.transactionId,
      transaction_id: purchase?.transactionId,
      currency: dicPlainAppPlanFind?.inAppStore?.currency,
      receipt: purchase?.transactionReceipt,
      payment_gatway: 'INAPP',
      device_type: Platform.OS.toUpperCase(),
      android_purchase_token: isIos ? '' : purchase?.purchaseToken,
      device_id: dicPlainAppPlanFind?.appAccountToken,
      version_name: DeviceInfo.getVersion(),
    };
    methodReceiptSaveApiCall(data);
  };
  const methodReceiptSaveApiCall = async (request: any) => {
    try {
      actions
        .restorePurchasePlan(request)
        .then(async (response: any) => {
          if (response?.status) {
            let userData = await getItem('userData');
            actions.onSaveUserDataInKeyChain({
              ...userData,
              ...response?.data,
            });
          }
        })
        .catch(error => {})
        .finally(() => {});
    } catch (error) {}
  };

  const methodGetPurchaseHistory = async () => {
    try {
      const history = await getAvailablePurchases({
        alsoPublishToEventListenerIOS: false,
        onlyIncludeActiveItemsIOS: true,
      });
      if (history && history.length > 0) {
        const purchase = history[0];
        const receipt =
          (purchase as any)?.transactionReceipt ?? purchase?.purchaseToken;
        if (receipt) {
          saveReceiptApiCall(purchase);
        }
      }
    } catch (err) {
      APP_LOG('methodGetPurchaseHistory---ERROR', err);
    }
  };
  const getSubscriptionStatus = async () => {
    if (Number(userData?.is_premium) === 0) {
      if (!isIos) {
        initConnection().then(status => {
          methodGetSubscriptionHistory();
          methodGetPurchaseHistory();
        });
      } else {
        methodGetSubscriptionHistory();
        methodGetPurchaseHistory();
      }
    }
  };
  const getUserProfileApi = () => {
    actions.getUserData({});
  };

  const handleBackPress = () => {
    if (exportData) {
      setExportData(false);
    } else {
      BackHandler.exitApp();
    }
  };

  useHardwareBackPressWith(handleBackPress);

  // useFocusEffect(
  //   useCallback(() => {
  //     getUserProfileApi();
  //   }, []),
  // );
  const isFocused = useIsFocused();
  useEffect(() => {
    getUserProfileApi();
  }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      if (isHomeRefresh) {
        setIsLoading(true);
        getCardList({ pageNo: 1, search: searchText, filterOptions });
        actions.homeRefresh(false);
      }
    }, [isHomeRefresh]),
  );

  useEffect(() => {
    updateFcmToken();
    getCardList({ pageNo: 1, search: searchText, filterOptions });
    getSubscriptionStatus();
    // DeviceEventEmitter.addListener(URL_TYPE.openFromQR, handleQRcode);
    APP_LOG('Linking.getInitialURL-=---------');
    Linking.getInitialURL()
      .then(initialUrl => {
        APP_LOG('Linking.getInitialURL', initialUrl);
        handleDeepLink(initialUrl);
      })
      .catch(err => {});

    const deepLinkListener = Linking.addEventListener('url', event => {
      APP_LOG('Linking.addEventListener', event?.url);
      handleDeepLink(event?.url);
    });

    return () => {
      deepLinkListener.remove();
    };
  }, []);

  //UPDATE FCM
  const updateFcmToken = async () => {
    await getAPNSToken();
    const token = await getMessaging().getToken();

    if (DEVICE_INFO.device_id !== token) {
      DEVICE_INFO.device_id = token;
      await setItem('fcmTokenAsync', token);
      actions
        .updateDeviceFcmToken({
          ...DEVICE_INFO,
          device_id: token || DEVICE_INFO.device_id,
        })
        .catch((err: any) => APP_LOG('updateDeviceFcmToken', err));
    }
  };

  const handleDeepLink = (url: string | null) => {
    if (url) {
      const parts = url.split('/');

      let uuid = parts[parts.length - 1];
      let type = parts[parts.length - 2];
      if (URL_TYPE.openFromQR === type) {
        if (!isCalledDeepLinking) {
          actions.setDeepLinkingCalled(true);
          handleQRcode(uuid);
        }
      }
    }
  };

  const handleQRcode = (id: string | number) => {
    actions
      .getOtherUserData({ id })
      .then((response: any) => {
        if (response?.status === 'true' || response?.status) {
          if (response?.data) {
            navigation.navigate(navigationStrings.BUSINESS_CARD_DETAILS, {
              data: response?.data,
            });
          }
        }
      })
      .catch(errorMethod);
    // APP_LOG('handleQRcode', id);
  };

  const filterData = () => {
    if (!cardData || cardData.length === 0) {
      // Handle cases where cardData is null or empty
      setFilteredCardData([]);
      return;
    }
    if (searchText === '') {
      setFilteredCardData(cardData);
    } else {
      const filteredData = cardData.filter((item: any) => {
        const searchableText =
          `${item.name} ${item.designation} ${item.company_name} ${item.card_tag}`.toLowerCase();
        return searchableText.includes(searchText.toLowerCase());
      });
      setFilteredCardData(filteredData);
    }
  };

  const handleApplyFilter = ({
    sort_by,
    sort_order,
    tags,
  }: {
    sort_order: string;
    sort_by: string;
    tags: string[];
  }) => {
    setApplyLoad(true);
    setFilterOptions({
      sort_by,
      sort_order,
      tags,
    });
    // options from FilterModal
    // setFilterOptions(options); // Update filter options state
    // setIsLoading(true);
    getCardList({
      pageNo: 1,
      search: searchText,
      filterOptions: { sort_by, sort_order, tags },
    }); // Refresh the list with new filter options
  };
  const handlerClear = ({
    sort_by,
    sort_order,
    tags,
  }: {
    sort_order: string;
    sort_by: string;
    tags: string[];
  }) => {
    setClearLoad(true);
    setFilterOptions({
      sort_by,
      sort_order,
      tags,
    });
    // options from FilterModal
    // setFilterOptions(options); // Update filter options state
    // setIsLoading(true);
    getCardList({
      pageNo: 1,
      search: searchText,
      filterOptions: { sort_by, sort_order, tags },
    }); // Refresh the list with new filter options
  };
  const getCardList = ({
    pageNo = 1,
    search = '',
    filterOptions,
  }: {
    pageNo: number;
    search?: string;
    filterOptions?: {
      sort_order: string;
      sort_by: string;
      tags: string[];
    };
  }) => {
    dispatch(setCardDataStart()); // Dispatch the start action

    // setIsLoading(pageNo === 1); // Show loader only for the first page load
    setLoadMore(pageNo > 1); // Show load more indicator for subsequent pages
    let dic: any = {
      page: pageNo,
      sort_order: filterOptions?.sort_order ?? 'desc',
      sort_by: filterOptions?.sort_by ?? 'created_at',
      search: search ?? '',
    };

    if (filterOptions?.tags && filterOptions?.tags.length > 0) {
      dic.tags = JSON.stringify(filterOptions?.tags); // If tags exist, we JSON.stringify them
    }

    actions
      .getContactCardList(dic)
      .then((res: any) => {
        const data = res?.data?.data || [];
        // setCardDataSuccess(data);// Dispatch the success action with the data
        setContactCardData(prevState =>
          pageNo === 1 ? data : [...prevState, ...data],
        );
        setLastPage(res?.data?.last_page || 1);
        setPage(pageNo);
      })
      .catch(errorMethod)
      .finally(() => {
        setRefresh(false);
        setLoadMore(false);
        setIsLoading(false);
        setApplyLoad(false);
        setClearLoad(false);
        setFilterModalVisible(false);
        setShow(false);
      });
  };

  const hideDialog = (check: boolean, uuid?: string) => {
    if (check && uuid) {
      setDeleted(true);

      const json = { uuid };

      actions
        .deleteCard(json) // Call the delete API
        .then((response: any) => {
          if (response?.status === 'true') {
            showSuccess(response?.message);
            // Optionally refresh the list after deleting an item
            const prevState = [...contactCard]; // Backup current state for rollback
            setContactCardData(prevState =>
              prevState.filter(item => item.uuid !== uuid),
            ); // Optimistically update the state
            // getCardList(1); // Refresh the first page
          }
        })
        .catch(err => {
          errorMethod(err);
        })
        .finally(() => {
          setDeleteModalVisible(false); // Close the delete modal
          setDeleted(false);
        });
    } else {
      setDeleteModalVisible(false); // Just close the modal if 'check' is false
    }
  };

  const handleRefresh = () => {
    setRefresh(true);
    getCardList({
      pageNo: 1,
      search: searchText,
      filterOptions,
    });
    getUserProfileApi();
  };

  const handleEndReached = () => {
    if (page < lastPage && !isLoadMore) {
      const nextPage = page + 1;
      getCardList({
        pageNo: nextPage,
        search: searchText,
        filterOptions: {
          sort_by: filterOptions.sort_by,
          sort_order: filterOptions.sort_order,
          tags: filterOptions.tags,
        },
      });
    }
  };

  // toggleSelect function
  const toggleSelect = (item: SelectedData) => {
    setSelectedItems(prevState => {
      const isSelected = prevState.some(selected => selected.id === item.id);
      if (isSelected) {
        return prevState.filter(selected => selected.id !== item.id);
      } else {
        return [...prevState, item];
      }
    });
  };

  // Select all items
  const selectAllHandler = () => {
    if (selectedItems.length === contactCard.length) {
      setSelectedItems([]); // Deselect all
    } else {
      setSelectedItems(contactCard.map(item => item)); // Select all
    }
  };

  const renderFooter = () => {
    return (
      <View style={styles.footerLoader}>
        {isLoadMore && <ActivityIndicator size="small" color="#E17665" />}
        <View style={{ ...commonStyles.footerComp2 }} />
      </View>
    );
  };

  // Function to export data as CSV
  const exportToCSV = async () => {
    APP_LOG('exportToCSV called with selectedItems:', selectedItems);
    try {
      if (selectedItems.length === 0) {
        showError('Please select at least one item to export');
        return;
      }

      const transformedData = selectedItems.map(item => {
        // Handle card_extra_filed array
        const extraFields =
          item.card_extra_filed
            ?.map(
              extra => `${extra.title || 'N/A'}: ${extra.description || 'N/A'}`,
            )
            .join(', ') || ''; // Join multiple extra fields with semicolon

        // Base fields
        const data = {
          Name: item.name,
          Designation: item.designation,
          'Company name': item.company_name,
          Service: item.service,
          Email: item.email,
          'Phone number': `\t+${item.country_code} ${item.phone_number}`, // Combined country code and number
          'country code name': item.country_code_name,
          Tags: item.card_tag?.map(tag => tag.tag?.tag || '').join(',') || '',
          'Card extra field': extraFields, // Properly formatted extra fields
        };

        return data;
      });

      const csvData = jsonToCSV(transformedData);

      const timestamp = Date.now();

      const filePath = `${RNFS.DocumentDirectoryPath}/contacts_${timestamp}.csv`;
      await RNFS.writeFile(filePath, csvData, 'utf8');

      await shareFile(filePath, 'text/csv', `contacts_${timestamp}.csv`).then(
        value => {
          setSelectedItems([]);
          setExportData(false);
        },
      );
    } catch (error) {}
  };

  const exportToPDF = async () => {
    try {
      if (selectedItems.length === 0) {
        Alert.alert('Error', 'Please select at least one item to export');
        return;
      }

      const htmlContent = `
<html>
  <head>
    <style>
      @page {
        margin: 40px;
      }

      body {
        font-family: Arial, sans-serif;
        color: #333;
        padding: 0;
        margin: 0;
      }

      h1 {
        color: rgb(0, 0, 0);
        margin-bottom: 10px;
      }

      h3 {
        color: #004080;
        margin-bottom: 15px;
        border-bottom: 1px solid #e1e1e1;
        padding-bottom: 15px;
      }

      p {
        margin: 5px 0;
      }

      .card-section {
        page-break-inside: avoid;
        break-inside: avoid;
        margin-bottom: 20px;
        padding: 15px;
        border: 1px solid #eee;
        border-radius: 5px;
      }

      .tags {
        margin-top: 10px;
      }

      .tag {
        display: inline-block;
        margin-right: 5px;
        padding: 3px 10px;
        background-color: #f1f1f1;
        border: 1px solid #d3d3d3;
        border-radius: 15px;
        font-size: 12px;
      }

      .extra-fields {
        background-color: #f8f8f8;
        padding: 10px;
        border-radius: 5px;
        margin-top: 20px;
      }

      .extra-fields p {
        margin: 5px 0;
      }

      strong {
        color: #004080;
      }
    </style>
  </head>
  <body>
    <h1>Business Detail Cards</h1>
    ${selectedItems
      .map(
        item => `
      <div class="card-section">
        <p><strong>Name:</strong> ${item?.name || 'N/A'}</p>
        <p><strong>Designation:</strong> ${item.designation || 'N/A'}</p>
        <p><strong>Company Name:</strong> ${item.company_name || 'N/A'}</p>
        <p><strong>Service:</strong> ${item.service || 'N/A'}</p>
        <p><strong>Email:</strong> ${item.email || 'N/A'}</p>
        <p><strong>Phone Number:</strong> ${
          item.country_code
            ? '+' + item.country_code + ' ' + item.phone_number
            : 'N/A'
        }</p>
        <p><strong>Country:</strong> ${item.country_code_name || 'N/A'}</p>
        <p><strong>Status:</strong> ${
          item.status === 1 ? 'Active' : 'Inactive'
        }</p>
        <div class="tags">
          <strong>Tags:</strong>
          ${
            item.card_tag?.length > 0
              ? item.card_tag
                  .map(
                    tag => `<span class="tag">${tag.tag?.tag || 'N/A'}</span>`,
                  )
                  .join('')
              : '<span class="tag">None</span>'
          }
        </div>
        ${
          item?.card_extra_filed?.length > 0
            ? `
          <div class="extra-fields">
            <h3>Additional Information</h3>
            ${item?.card_extra_filed
              .map(
                extra => `
              <p><strong>${extra.title || 'N/A'}</strong>: ${
                  extra.description || 'N/A'
                }</p>
            `,
              )
              .join('')}
          </div>
        `
            : ''
        }
      </div>
    `,
      )
      .join('')}
  </body>
</html>
`;

      const timestamp = Date.now();

      const options = {
        html: htmlContent,
        fileName: `contacts_${timestamp}`,
        directory: 'Documents',
      };

      const file = await generatePDF(options);
      await shareFile(
        file.filePath,
        'application/pdf',
        `contacts_${timestamp}.pdf`,
      );
      setSelectedItems([]);
      setExportData(false);
    } catch (error) {}
  };

  // Updated shareFile function with error handling
  const shareFile = async (
    filePath: string,
    fileType: string,
    fileName: string,
  ) => {
    try {
      if (!filePath) throw new Error('File path is undefined');

      // Ensure file exists
      const exists = await RNFS.exists(filePath);
      if (!exists) throw new Error(`File not found: ${filePath}`);

      // Copy file to cache (shareable)
      const cachePath =
        Platform.OS === 'android'
          ? `${RNFS.CachesDirectoryPath}/${fileName}`
          : `${RNFS.TemporaryDirectoryPath}${fileName}`;

      await RNFS.copyFile(filePath, cachePath);

      const shareOptions = {
        title: 'Share Contact Export',
        url: `file://${cachePath}`,
        type: fileType,
        filename: fileName,
      };

      setModalVisible(false);

      setTimeout(async () => {
        try {
          await Share.open(shareOptions);
          setExportData(false);
          showSuccess('Contact exported successfully.');
          setSelectedItems([]); // Deselect all
        } catch (err) {
          APP_LOG('shareFile-err', err);
        } finally {
          // Optional cleanup
          setTimeout(() => RNFS.unlink(cachePath).catch(() => {}), 3000);
        }
      }, 800);
    } catch (error) {
      APP_LOG('shareFile-outer-err', error);
    }
  };

  //function to close modal
  const handleCloseModal = () => {
    setExportType(null);
    setModalVisible(false);
    setExportButtonPress(false);
  };

  const renderEmptyComponent = () => {
    return (
      !isLoading && (
        <View style={styles.emptyContainer}>
          <Text allowFontScaling={false} style={styles.emptyText}>
            No data available.
          </Text>
        </View>
      )
    );
  };
  const onChangeText = (text: string) => {
    setSearchText(text);
    debounceSearchLocation(text);
  };

  const debounceSearchLocation = useDebounce((keyword: string) => {
    setShow(true);
    getCardList({ pageNo: 1, search: keyword, filterOptions });
  }, 800);

  const handleExportData = () => {
    if (selectedItems?.length === 0) {
      showError('Please select at least one card');
    } else {
      setExportType(null);
      setModalVisible(true);
    }
  };

  useEffect(() => {
    // When the application is running, but in the background
    getMessaging().onNotificationOpenedApp(async remoteMessage => {
      APP_LOG('remoteMessage background------>', JSON.stringify(remoteMessage));
      handlePushNotificationNavigation(remoteMessage?.data);
    });

    // notification app kill
    getMessaging()
      .getInitialNotification()
      .then(remoteMessage => {
        APP_LOG('remoteMessage app kill------>', remoteMessage);
        handlePushNotificationNavigation(remoteMessage?.data);
      });

    getMessaging().setBackgroundMessageHandler(async remoteMessage => {
      APP_LOG(
        'Message handled in the background!',
        JSON.stringify(remoteMessage),
      );
      // handlePushNotificationNavigation(remoteMessage?.data);
    });

    fcmTokenListener?.current && fcmTokenListener?.current?.remove();
    fcmTokenListener.current = DeviceEventEmitter.addListener(
      'need_fcm_token_refresh',
      token => {
        APP_LOG('need_fcm_token_refresh', token);
        // updateFcmToken(token);
      },
    );
  }, []);

  const handlePushNotificationNavigation = (data: any) => {
    // switch (data?.type) {
    //   default:
    //     break;
    // }
    if (data) {
      navigation.navigate(navigationStrings.NOTIFICATION);
    }
  };
  const listenEvents = async () => {
    // return () => {
    //   listener.remove();
    // };
  };
  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('scan-qr', data => {
      APP_LOG('scan-qr event received:', data);
      if (data) {
        navigation.navigate(navigationStrings.CONNECTION_DETAILS, {
          uuid: data,
          title: useTranslate('USER_DETAIL'),
        });
      }
    });
    return () => {
      listener.remove();
    };
  }, []);

  // return <OtpVerify />;
  // return <ResetPassword />;
  // return <BusinessCardDetails {...props} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {exportData ? (
          <Header
            onPressLeftImg={() => {
              setExportData(false);
              setSelectedItems([]); // Deselect all
            }}
            centerTitle={useTranslate('EXPORT')}
          />
        ) : (
          <Header
            leftImg={imagePath.header_Icon}
            rightImg={imagePath.notify_icon}
            rightImg2={
              userData?.notification_count > 0
                ? imagePath.notification_Dot
                : imagePath.notification_bell
            }
            // rightImg2={imagePath.notification_bell}
            isRightIcon
            isSpace={true}
            isRightIcon2
            onPressRightImg={() => {
              setExportData(!exportData);
            }}
            onPressRightImg2={() =>
              navigation.navigate(navigationStrings.NOTIFICATION)
            }
          />
        )}
      </View>
      <Spacer />

      <View style={styles.filterSection}>
        <View style={{ flex: 1, zIndex: 0 }}>
          <TextInputWithLabel
            placeholder={useTranslate('SEARCH_DOT')}
            onGetData={searchText}
            leftIcon={imagePath.search}
            leftIconStyle={{
              width: moderateScale(13.85),
              height: moderateScaleVertical(13.85),
            }}
            onSetData={onChangeText}
            contentType="none"
            keyboardType="default"
            placeHolderTextColor={colors.stoneGray}
            fontColor={colors.black}
            secureTextEntry={false}
            getError=" "
            clearSearch={searchText ? true : false}
            onClearPress={() => onChangeText('')}
            returnType="done"
            isLabel={false}
            // onKeyboardClear={() => {
            //   setShow(true)
            //   setSearchText(''); // Clear the search text in the parent
            //   getCardList({ pageNo: 1, search: '' }); // Refresh the data
            // }}
            inputStyle={{
              borderRadius: moderateScale(50),
              height: moderateScale(40),
              marginRight: moderateScale(18),
            }}
          />
        </View>

        <TouchableOpacity
          hitSlop={hitSlopProp}
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Image style={styles.filterIcon} source={imagePath.filter} />
        </TouchableOpacity>
      </View>
      <View>
        <FilterModal
          isApply={isApplyLoad}
          isClear={isClearLoad}
          onClear={handlerClear}
          onApply={handleApplyFilter} // Pass the handler function
          visible={isFilterModalVisible}
          onClose={() => {
            setFilterModalVisible(false);
          }}
          initialOptions={{
            sort_order: filterOptions.sort_order,
            sort_by: filterOptions.sort_by,
            tags: filterOptions.tags,
          }}
        />
      </View>

      {exportData && (
        <View style={styles.headerRow}>
          <ButtonWithImage
            onPress={selectAllHandler}
            isLeftImg
            title={useTranslate('SELECT_ALL')}
            btnTxtStyle={styles.selectAllText}
            btnStyle={styles.selectAllButton}
            leftImgSrc={
              selectedItems.length === contactCard.length
                ? imagePath.checked
                : imagePath.uncheck
            }
            isRightImg={false}
            rightImgSrc={imagePath.down_arrow}
          />

          <ButtonComp
            title="Export"
            gradientColors={[colors.orange, colors.orange]}
            btnStyle={styles.exportButton}
            btnTxtStyle={styles.exportText}
            onPress={() => handleExportData()}
          />
        </View>
      )}

      {isShow && <ActivityIndicator style={styles.activityLoader} />}
      {isLoading ? (
        <HomeLoader />
      ) : (
        <View>
          <FlatList
            data={contactCard}
            // onEndReachedThreshold={5}
            keyExtractor={(item: any) => item.id}
            // refreshing={isRefresh}
            contentContainerStyle={styles.flatListContent}
            // onRefresh={handleRefresh}
            ListEmptyComponent={renderEmptyComponent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={isRefresh}
                onRefresh={handleRefresh}
                tintColor={'#6F08FF'}
              />
            }
            onEndReached={handleEndReached}
            renderItem={({ item, index }: { item: any; index: number }) => (
              <View style={{ flex: 1 }}>
                <FileComp
                  key={String(item?.id) + String(index)}
                  containerStyle={styles.cardWrapper}
                  leftImg={imagePath.cards_image}
                  name={item.name}
                  role={item.designation}
                  company={item.company_name}
                  rightImg={imagePath.more}
                  tags={item.card_tag} // Convert stringified tags to array
                  isEdit={
                    exportData
                      ? false
                      : item?.access_status === 'full_access' ||
                        item?.access_status === null
                  } // Modified condition
                  isCheckbox={exportData}
                  checkedPress={() => toggleSelect(item)}
                  selected={selectedItems.map(si => si.id)}
                  onDeletePress={() => {
                    setDeleteModalVisible(true);
                    setUuidNumber(item.uuid);
                  }}
                  id={item.id}
                  onEditPress={() =>
                    navigation.navigate(
                      navigationStrings.BUSINESS_CARD_DETAILS,
                      {
                        uuid: item.uuid,
                        type: 'EDIT',
                      },
                    )
                  }
                  onPress={() =>
                    navigation.navigate(navigationStrings.EDIT_SCREEN, {
                      uuid: item.uuid,
                      access:
                        item.access_status === 'full_access' ||
                        item.access_status === null
                          ? true
                          : false,
                    })
                  }
                />
              </View>
            )}
          />
        </View>
      )}
      {isDeleteModalVisible && (
        <View style={{ flex: 1 }}>
          <Logout
            isVisible={isDeleteModalVisible}
            message={useTranslate(
              'ARE_YOU_SURE_YOU_WANT_TO_DELETE_BUSINESS_CONTACT',
            )}
            ok={useTranslate('CONFIRM')}
            cancel={useTranslate('CANCEL')}
            onClose={check => hideDialog(check, uuidNumber)} // Pass uuidNumber here
            isLoadingLogout={isDelete}
          />
        </View>
      )}

      <Spacer space={20} />
      {/* Dynamic Modal for Export */}
      <View>
        <DynamicModal
          isVisible={isModalVisible && selectedItems.length > 0} // Modal visibility state
          title="Export as"
          options={[
            {
              radioButton: true,
              icon: imagePath.csv,
              onPress: () => {
                setExportTypeError('');
                setExportType('csv');
              },
            },
            {
              radioButton: true,
              icon: imagePath.pdf,
              onPress: () => {
                setExportTypeError('');
                setExportType('pdf');
              },
            },
          ]}
          customContent={
            exportButtonPress && !!exportTypeError ? (
              <View style={styles.customContentContainer}>
                <Text allowFontScaling={false} style={styles.errorText}>
                  {exportTypeError}
                </Text>
              </View>
            ) : null
          }
          buttons={[
            {
              label: useTranslate('EXPORT'),
              onPress: () => {
                setExportTypeError('');
                setExportButtonPress(true);
                if (!exportType) {
                  setExportTypeError(useTranslate('EXPORT_FORMAT_REQUIRED'));
                  return;
                } // Prevent execution if exportType is not selected
                exportType === 'csv' ? exportToCSV() : exportToPDF();
              },
            },
          ]}
          onClose={handleCloseModal} // Close the modal and export section
        />
      </View>
      {/* {!isIos && ( */}
      <PushNotificationConfig
        onPress={(remoteMessage: any) => {
          handlePushNotificationNavigation(remoteMessage?.data);
        }}
      />
      {/* )} */}
    </SafeAreaView>
  );
};

export default Home;
