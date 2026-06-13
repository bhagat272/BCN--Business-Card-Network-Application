import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import FastImageLoad from '../../Components/FastImageLoad';
import Header from '../../Components/Header';
import { ConnectionLoader } from '../../Components/ShimmerComp';
import { getCompleteImageUrl } from '../../config/urls';
import imagePath from '../../constants/imagePath';
import { useTranslate } from '../../constants/lang';
import navigationStrings from '../../constants/navigationStrings';
import actions from '../../redux/actions';
import commonStyles from '../../styles/commonStyles';
import { APP_LOG, errorMethod, showSuccess } from '../../utils/helperFunctions';
import styles from './styles';
import { useSelector } from 'react-redux';
import { saveConnectionRefresh } from '../../redux/reducers/settings';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const dummyData = [
  {
    id: 161,
    uuid: '2d14f70b-4a86-4fc8-a25f-ef623a5215fd',
    name: 'Pooja',
    profile_picture: null,
    company_name: '',
  },
  {
    id: 160,
    uuid: 'ee9289a5-bd0b-48bb-ae34-3940bc935d03',
    name: 'Shiny',
    profile_picture: null,
    company_name: '',
  },
  {
    id: 159,
    uuid: '04608cfe-16de-43d6-be31-a327a62cc251',
    name: 'Ajay',
    profile_picture: null,
    company_name: '',
  },
  {
    id: 158,
    uuid: '22451061-f571-4697-81b9-ec25103bedcc',
    name: 'Tanya',
    profile_picture: null,
    company_name: '',
  },
  {
    id: 157,
    uuid: 'b705e1d0-6627-47d1-9377-0ac9a2d17673',
    name: 'Kajal',
    profile_picture: null,
    company_name: '',
  },
  {
    id: 156,
    uuid: 'ca413adb-f691-40d1-89d7-6217f047d348',
    name: 'Testt',
    profile_picture: null,
    company_name: '',
  },
  {
    id: 155,
    uuid: 'a0ee5054-0a07-467b-8c9a-9d8ecd67e1b1',
    name: 'Rahul',
    profile_picture: null,
    company_name: '',
  },
  {
    id: 154,
    uuid: 'd8e7dbbc-311f-40c7-a198-cd373a58b78d',
    name: 'Muskan',
    profile_picture: null,
    company_name: '',
  },
  {
    id: 153,
    uuid: '8e98528a-9d00-4760-b24d-495f33f0f13d',
    name: 'saurabh',
    profile_picture: null,
    company_name: '',
  },
  {
    id: 152,
    uuid: '06a50fee-d7b6-4f61-9d22-c422004a2087',
    name: 'Hette',
    profile_picture: null,
    company_name: '',
  },
];

const YourConnections = (props: any) => {
  const { navigation, route } = props;
  const [activeTab, setActiveTab] = useState<string>('Connections');
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  const [allUserData, setAllUserData] = useState<any[]>([]);
  const { userData } = useSelector((state: any) => state?.auth || {});
  const [myConnectionData, setMyConnectionData] = useState<any[]>([]);

  const [isShimmer, setShimmer] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [connectionLoader, setConnectionLoader] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPagePending, setCurrentPagePending] = useState<number>(1);
  const [totalPagesPending, setTotalPagesPending] = useState<number>(1);
  const [isPendingLoading, setPendingLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);
  const { isRefreshConnection } = useSelector(
    (state: any) => state?.settings || {},
  );
  useEffect(() => {
    if (!route?.params?.tab) {
      setActiveTab('Pending Requests');
      methodToGetData('Pending Requests');
    }
  }, []);
  useEffect(() => {
    if (route?.params?.tab) {
      handleSelectTab(route?.params?.tab);
    }
  }, [route?.params?.tab]);
  useFocusEffect(
    useCallback(() => {
      if (isRefreshConnection) {
        performTask();
      }
    }, [isRefreshConnection]),
  );

  const performTask = async () => {
    setCurrentPage(1);
    methodToGetData('My Connections');
  };

  const hideLoader = () => {
    setShimmer(false);
    setLoading(false);
    setRefreshing(false);
    setConnectionLoader(false);
    setPendingLoading(false);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoading) {
      const nextPage = currentPage + 1;
      if (activeTab === 'All Users') {
        methodToGetData('All Users', nextPage);
      } else if (activeTab === 'My Connections') {
        methodToGetData('My Connections', nextPage);
      } else if (activeTab === 'Pending Requests') {
        methodToGetData('Pending Requests', nextPage);
      }
    }
  };

  const handleLoadMorePending = () => {
    if (currentPagePending < totalPagesPending && !isPendingLoading) {
      const nextPage = currentPagePending + 1;
      methodToGetData('Pending Requests', nextPage);
    }
  };

  const methodToGetData = (
    type: 'My Connections' | 'All Users' | 'Pending Requests',
    page: number = 1, // Add page parameter
  ) => {
    if (!isShimmer) {
      setLoading(type !== 'Pending Requests');
      setPendingLoading(type === 'Pending Requests');
    }
    // API call to get data
    if (type === 'My Connections') {
      actions
        .getConnectionList({ page: page })
        .then((res: any) => {
          setConnectionLoader(page > 1);
          if (page == 1) {
            saveConnectionRefresh(false);
          }
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

            if (page == 1) {
              setMyConnectionData(connections || []);
            } else {
              setMyConnectionData(prevState =>
                page === 1 ? connections : [...prevState, ...connections],
              );
            }
            setTotalPages(res?.data?.last_page);
            setCurrentPage(page);
          } else {
            setMyConnectionData([]);
          }
        })
        .catch(errorMethod)
        .finally(hideLoader);
    }
    if (type === 'All Users') {
      actions
        .getAllUsers({ page: page }) // Pass page here
        .then((res: any) => {
          if (res?.status === 'true') {
            if (res?.data.data) {
              if (page === 1) {
                setAllUserData(res?.data.data);
              } else {
                setAllUserData(prevData => [...prevData, ...res?.data.data]);
              }
            }

            setTotalPages(res?.data?.last_page);
            setCurrentPage(page);
          }
        })
        .catch(errorMethod)
        .finally(hideLoader);
    }
    if (type === 'Pending Requests') {
      actions
        .getConnectionRequest({ page: page })
        .then((res: any) => {
          setPendingLoading(true);
          if (res?.status === 'true') {
            if (res.data?.data) {
              const formattedData = res.data?.data?.map((item: any) => ({
                id: item.id.toString(),
                uuid: item.uuid,
                name: item.user_name || 'Unknown', // Use the correct field from the API response
                profile_picture: item.profile_picture || '',
                created_at: item.created_at,
                type: item.type,
                companyName: item.company_name,
              }));
              if (page === 1) {
                setPendingRequests(formattedData);
              } else {
                setPendingRequests(prevData => [...prevData, ...formattedData]);
              }
            }

            setTotalPagesPending(res.data.last_page);
            setCurrentPagePending(page);
          }
        })
        .catch(errorMethod)
        .finally(hideLoader);
    }
  };
  const renderFooter = () => {
    return (
      <View style={styles.footerLoader}>
        {(isLoading || connectionLoader || isPendingLoading) && (
          <ActivityIndicator size="small" color="#E17665" />
        )}
        <View style={{ ...commonStyles.footerComp2 }} />
      </View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1); // Reset page to 1 on refresh
    setCurrentPagePending(1);
    methodToGetData(
      activeTab as 'My Connections' | 'All Users' | 'Pending Requests',
      1,
    ); // Pass 1 for first page
  };

  const renderList = () => {
    return (
      <FlatList
        data={allUserData}
        keyExtractor={item => item.id}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(navigationStrings.CONNECTION_DETAILS, {
                uuid: item?.uuid,
                title: useTranslate('USER_DETAIL'),
              })
            }
          >
            <FastImageLoad
              source={{ uri: getCompleteImageUrl(item?.profile_picture) }}
              style={styles.profileImage}
              defaultImage={imagePath.user_icon}
            />
            <View style={{ flex: 1 }}>
              <View>
                <Text allowFontScaling={false} style={styles.name}>
                  {item?.user_name}
                </Text>
              </View>
              {item?.company_name && (
                <Text allowFontScaling={false} style={{ ...styles.email }}>
                  {item?.company_name
                    ? String(item?.company_name).length > 8
                      ? String(item?.company_name).substring(0, 8) + '...'
                      : item?.company_name
                    : ''}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={listEmptyView}
        refreshControl={
          // Add RefreshControl
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
      />
    );
  };

  const renderPendingRequests = () => {
    return (
      <FlatList
        data={pendingRequests}
        keyExtractor={item => item.uuid}
        renderItem={({ item }) => (
          <View style={styles.pendingCard}>
            <View style={styles.cardDetails}>
              <FastImageLoad
                source={{ uri: getCompleteImageUrl(item?.profile_picture) }}
                style={styles.profileImage}
                defaultImage={imagePath.user_icon}
              />
              <View style={{ flex: 1 }}>
                <View>
                  <Text allowFontScaling={false} style={styles.name}>
                    {item.name}
                  </Text>
                </View>
                {item?.companyName && (
                  <Text allowFontScaling={false} style={styles.email}>
                    {item?.companyName
                      ? String(item?.companyName).length > 8
                        ? String(item?.companyName).substring(0, 8) + '...'
                        : item?.companyName
                      : ''}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => rejectRequest(item.uuid)}
              >
                <Image source={imagePath.reject_icon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => acceptRequest(item.uuid)}
              >
                <Image source={imagePath.accept_icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={pendingListEmptyView}
        contentContainerStyle={{ flexGrow: 1 }}
        onEndReached={handleLoadMorePending}
        refreshControl={
          // Add RefreshControl
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    );
  };

  const listEmptyView = () =>
    !isLoading && (
      <View style={styles.emptyContainer}>
        <Text allowFontScaling={false} style={styles.emptyText}>
          No data found
        </Text>
      </View>
    );

  const pendingListEmptyView = () => {
    if ((isPendingLoading || refreshing) && pendingRequests.length === 0) {
      return null; // Don't show "No data found" while loading
    }
    return (
      <View style={styles.emptyContainer}>
        <Text allowFontScaling={false} style={styles.emptyText}>
          {useTranslate('NO_DATA_FOUND')}
        </Text>
      </View>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'All Users':
        return renderList();
      case 'Pending Requests':
        return renderPendingRequests();
      case 'My Connections':
        return (
          <FlatList
            data={myConnectionData}
            keyExtractor={item => item?.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate(navigationStrings.CONNECTION_DETAILS, {
                    uuid: item?.uuid,
                  })
                }
              >
                <FastImageLoad
                  source={{ uri: getCompleteImageUrl(item?.profile_picture) }}
                  style={styles.profileImage}
                  defaultImage={imagePath.user_icon}
                />
                <View style={{ flex: 1 }}>
                  <View>
                    <Text allowFontScaling={false} style={styles.name}>
                      {item.name}
                    </Text>
                  </View>
                  {item?.companyName && (
                    <Text allowFontScaling={false} style={styles.email}>
                      {item?.companyName
                        ? String(item?.companyName).length > 8
                          ? String(item?.companyName).substring(0, 8) + '...'
                          : item?.companyName
                        : ''}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            refreshControl={
              // Add RefreshControl
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ flexGrow: 1 }}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={listEmptyView}
            ListFooterComponent={renderFooter}
            onEndReached={handleLoadMore}
          />
        );
      default:
        return null;
    }
  };

  const acceptRequest = (id: string) => {
    setLoading(true);
    actions
      .respondConnectionRequest({ other_user_uuid: id, type: 'accept' })
      .then((res: any) => {
        if (res?.status === 'true') {
          showSuccess(res?.message);
          setPendingRequests(pendingRequests.filter(item => item.uuid !== id));
        }
      })
      .catch(errorMethod)
      .finally(hideLoader);
  };

  const rejectRequest = (id: string) => {
    setLoading(true);
    actions
      .respondConnectionRequest({ other_user_uuid: id, type: 'reject' })
      .then((res: any) => {
        if (res?.status === 'true') {
          showSuccess(res?.message);
          setPendingRequests(pendingRequests.filter(item => item.uuid !== id));
        }
      })
      .catch(errorMethod)
      .finally(hideLoader);
  };

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    methodToGetData(tab as 'My Connections' | 'All Users' | 'Pending Requests');
  };

  if (isShimmer) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header
          centerTitle={useTranslate('YOUR_CONNECTIONS')}
          onPressLeftImg={() => navigation.goBack()}
        />
        <View style={{ flex: 1 }}>
          <ConnectionLoader />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        centerTitle={useTranslate('YOUR_CONNECTIONS')}
        onPressLeftImg={() => navigation.goBack()}
      />
      <View>
        <FlatList
          ref={flatListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={{ flexGrow: 1 }}
          data={['My Connections', 'Pending Requests', 'All Users']}
          renderItem={({ item: tab, index }: any) => {
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => {
                  flatListRef?.current?.scrollToIndex({
                    index,
                    animated: true,
                  });
                  handleSelectTab(tab);
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
                {activeTab === tab && (
                  <View style={styles.activeTabUnderline} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>{renderContent()}</View>
    </SafeAreaView>
  );
};

export default YourConnections;
