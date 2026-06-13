import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import ButtonComp from '../../Components/ButtonComp';
import DynamicModal from '../../Components/DynamicModal';
import Header from '../../Components/Header';
import { ConnectionLoader } from '../../Components/ShimmerComp';
import { getCompleteImageUrl } from '../../config/urls';
import imagePath from '../../constants/imagePath';
import { useTranslate } from '../../constants/lang';
import navigationStrings from '../../constants/navigationStrings';
import actions from '../../redux/actions';
import commonStyles from '../../styles/commonStyles';
import {
  APP_LOG,
  errorMethod,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import RenderConnection from './RenderConnection';
import styles from './styles';
import { useSelector } from 'react-redux';
import Spacer from '../../Components/Spacer';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ConnectionData {
  id: string;
  name: string;
  companyName: string;
  image: string;
  email: string;
  mobile: string;
  country_code: string;
  uuid: string;
}

const InternalSharing = ({ navigation, route }: any) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [myConnectionData, setMyConnectionData] = useState<ConnectionData[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShareLoading, setShareLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [isApiCall, setIsApiCall] = useState<boolean>(false);
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
  const [isShareModalVisible, setShareModalVisible] = useState<boolean>(false);
  const [accessType, setAccessType] = useState<string>('');
  const cardUuid = route?.params?.card_uuid;
  const access = route?.params?.access;
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [exportTypeError, setExportTypeError] = useState<string>('');
  const [exportButtonPress, setExportButtonPress] = useState<boolean>(false); // New state variable
  const { userData } = useSelector((state: any) => state?.auth || {});

  useEffect(() => {
    fetchConnections({ pageNo: page });
  }, []);

  APP_LOG(userData);

  const fetchConnections = ({ pageNo = 1 }: { pageNo: number }) => {
    setIsLoadMore(pageNo > 1);

    const payload = { page: pageNo };

    actions
      .getConnectionList(payload)
      .then((res: any) => {
        if (res?.status === 'true' && res?.data?.data.length > 0) {
          const connections = res.data.data.map((connection: any) => {
            let userDataToUse =
              userData.id === connection.other_user_id
                ? connection.user
                : connection.other_user;
            return {
              id: connection.id.toString(),
              name: userDataToUse.user_name || 'Unknown',
              companyName: userDataToUse.company_name || '',
              profile_picture: userDataToUse.profile_picture || '',
              email: userDataToUse.email || '',
              uuid: userDataToUse.uuid,
              mobile: userDataToUse.mobile || '',
              country_code: userDataToUse.country_code || '',
            };
          });

          setMyConnectionData(prevState =>
            pageNo === 1 ? connections : [...prevState, ...connections],
          );
          setLastPage(res?.data?.last_page);
        } else {
          setMyConnectionData([]);
        }
      })
      .catch(errorMethod)
      .finally(() => {
        setIsRefreshing(false);
        setIsLoadMore(false);
        setIsLoading(false);
      });
  };
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchConnections({ pageNo: 1 });
  };

  const handleEndReached = () => {
    if (page < lastPage) {
      const nextPage = page + 1;
      setPage(nextPage);

      fetchConnections({ pageNo: nextPage });
    }
  };

  const checkedPress = useCallback((uuid: string) => {
    setSelected(prevSelected =>
      prevSelected.includes(uuid)
        ? prevSelected.filter(item => item !== uuid)
        : [...prevSelected, uuid],
    );
  }, []);

  const shareContactAccess = () => {
    if (selected.length > 0) {
      setAccessType('');
      setShareModalVisible(true);
    } else {
      showError('Select at least one contact');
    }
  };

  const handleShare = () => {
    setExportTypeError('');
    setExportButtonPress(true);
    if (!accessType) {
      setExportTypeError(useTranslate('ACCESS_TYPE'));
      return;
    }
    if (selected.length === 0) {
      showError('Please select at least one connection');
      return;
    }

    setShareLoading(true);
    const shareData = {
      user_share_id: selected,
      contact_card_uuid: cardUuid,
      access_status: accessType,
    };

    actions
      .internalShare(shareData)
      .then((res: any) => {
        if (res?.status === 'true') {
          showSuccess(res?.message);
          setSelected([]);
          setShareModalVisible(false);
          setAccessType('');
          navigation.navigate(navigationStrings.BOTTOM_TABS);
        }
      })
      .catch(errorMethod)
      .finally(() => setShareLoading(false));
  };

  const renderFooter = () => (
    <View style={styles.footerLoader}>
      {isLoadMore && <ActivityIndicator size="small" color="#E17665" />}
      <View style={{ ...commonStyles.footerComp2 }} />
    </View>
  );

  const renderEmptyComponent = () =>
    !isLoading && (
      <View style={styles.emptyContainer}>
        <Text allowFontScaling={false} style={styles.emptyText}>
          {useTranslate('NO_DATA_FOUND')}
        </Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        centerTitle={useTranslate('YOUR_CONNECTIONS')}
        onPressLeftImg={() => navigation.goBack()}
      />

      {isLoading ? (
        <ConnectionLoader />
      ) : (
        // eslint-disable-next-line react-native/no-inline-styles
        <View style={{ flex: 1 }}>
          <FlatList
            data={myConnectionData}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <RenderConnection
                selected={selected}
                checkedPress={checkedPress}
                item={item}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmptyComponent}
            onEndReached={handleEndReached}
            ItemSeparatorComponent={() => <Spacer />}
            onEndReachedThreshold={0.5}
          />
        </View>
      )}

      {!isLoading && myConnectionData.length > 0 && (
        <ButtonComp
          title={useTranslate('SHARE')}
          btnStyle={styles.footerButton}
          onPress={shareContactAccess}
        />
      )}

      <DynamicModal
        isVisible={isShareModalVisible}
        title="Share as"
        options={[
          {
            radioButton: true,
            icon: imagePath.read_only_icon,
            label: 'Read-only',
            onPress: () => {
              setExportTypeError('');
              setAccessType('read_only');
            },
          },
          // Conditionally include the "Full-access" option if `access` is true
          ...(access
            ? [
                {
                  radioButton: true,
                  icon: imagePath.full_access_icon,
                  label: 'Full-access',
                  onPress: () => {
                    setExportTypeError('');
                    setAccessType('full_access');
                  },
                },
              ]
            : []),
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
            label: 'Share Contact',
            onPress: handleShare,
            isLoading: isShareLoading,
          },
        ]}
        onClose={() => {
          setAccessType('');
          setShareModalVisible(false);
          setExportButtonPress(false);
        }}
      />
    </SafeAreaView>
  );
};

export default InternalSharing;
