/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useEffect, useState } from 'react';
import {
  SectionList,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import Header from '../../Components/Header';
import ListEmptyComponent from '../../Components/ListEmptyComponent';
import Logout from '../../Components/Logout';
import NotificationComp from '../../Components/NotificationComp';
import { NotificationSimmer } from '../../Components/ShimmerComp';
import Spacer from '../../Components/Spacer';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { useTranslate } from '../../constants/lang';
import styles from './styles';
import { APP_LOG, errorMethod, showSuccess } from '../../utils/helperFunctions';
import actions from '../../redux/actions';
import moment from 'moment';
import NativeLoader from '../../Components/NativeLoader';
import { isEmpty } from 'lodash';
import navigationStrings from '../../constants/navigationStrings';

interface NotificationItem {
  id: string;
  heading: string;
  timeAgo: string;
  content: string;
  uuid?: string;
  created_at: string; // Use ISO date string for consistency
  title: string; // Assuming title is the same as heading
  message?: string; // Optional message field
}

interface NotificationSection {
  title: string;
  data: NotificationItem[];
}
type SectionData = {
  title: string; // "Today", "Yesterday", "2025-07-19", etc.
  data: [];
};
const PAGE_SIZE = 6;
const groupNotificationsByDate = (notifications: any[]): SectionData[] => {
  const grouped: Record<string, any[]> = {};

  notifications.forEach(item => {
    const date = moment(item.created_at);
    const now = moment();

    let sectionTitle = date.isSame(now, 'day')
      ? 'Today'
      : date.isSame(now.clone().subtract(1, 'day'), 'day')
      ? 'Yesterday'
      : date.format('YYYY-MM-DD');

    if (!grouped[sectionTitle]) {
      grouped[sectionTitle] = [];
    }

    grouped[sectionTitle].push(item);
  });

  APP_LOG('groupNotificationsByDate', {
    notifications,
    grouped,
    returnData: Object.keys(grouped).map(title => ({
      title,
      data: grouped[title],
    })),
  });

  // Convert to array of section objects
  return Object.keys(grouped).map(title => ({
    title,
    data: grouped[title],
  }));
};
const Notification = ({ navigation }: any) => {
  const [notifications, setNotifications] = useState<NotificationSection[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isDelete, setDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShimmer, setShimmer] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLogoutModal, setIsLogoutModal] = useState(false);
  const [isLoadingLogout, setLoadingLogout] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchNotifications = useCallback(
    async (pageNumber = 1, isRefresh = false) => {
      if (!isRefresh && (isLoading || !hasMore)) return;

      isRefresh ? setRefreshing(true) : setIsLoading(true);

      try {
        const response = await actions.getNotifications({ page: pageNumber });

        // Assume response structure matches NotificationSection[]
        let allData: NotificationSection[] = [];
        if (pageNumber > 1) {
          allData = [
            ...notifications?.map(section => section?.data),
            ...response.data.data,
          ]?.flat();
        } else {
          allData = response?.data?.data || [];
        }

        const sectionedData: SectionData[] = groupNotificationsByDate(allData);
        APP_LOG('fetchNotifications', {
          allData,
          sectionedData,
          notifications,
        });

        setNotifications(sectionedData);
        setPage(response?.data?.current_page);
        setHasMore(response?.data?.last_page > response?.data?.current_page);
      } catch (error) {
        APP_LOG('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
        setShimmer(false);
      }
    },
    [isLoading, hasMore],
  );

  useEffect(() => {
    fetchNotifications(1, true);
  }, []);

  const handleRefresh = () => {
    fetchNotifications(1, true);
  };

  const handleLoadMore = () => {
    APP_LOG('handleLoadMore', { isLoading, hasMore });
    if (!isLoading && hasMore) {
      fetchNotifications(page + 1);
    }
  };

  const toggleSelection = useCallback((id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  }, []);

  const renderSectionHeader = ({
    section,
  }: {
    section: NotificationSection;
  }) => (
    <View style={styles.sectionHeaderContainer}>
      <Text allowFontScaling={false} style={styles.sectionTitle}>
        {section.title}
      </Text>
    </View>
  );

  const renderItem = useCallback(
    ({ item }: { item: NotificationItem }) => (
      <NotificationComp
        id={item.id}
        name={item.title}
        content={item.content}
        created_at={item.created_at}
        onPress={() => handleReadNotifications({ item })}
        isCheckbox={isDelete}
        selected={selected}
        checkedPress={() => toggleSelection(item.uuid || item.id)}
        message={item.message}
      />
    ),
    [isDelete, selected, toggleSelection],
  );

  const selectAll = (title: string) => {
    const section = notifications.find(s => s.title === title);
    if (section) {
      const ids = section.data.map(item => item.uuid || item.id);
      setSelected(prev => [...new Set([...prev, ...ids])]);
    }
  };

  const handleDelete = () => {
    setLoadingLogout(true);
    actions
      .deleteCard({})
      .then(response => {
        const updated = notifications
          .map(section => ({
            ...section,
            data: section.data.filter(
              item => !selected.includes(item.uuid || item.id),
            ),
          }))
          .filter(section => section.data.length > 0);

        setNotifications(updated);
        setSelected([]);
        setDelete(false);
        showSuccess('Success\nNotifications deleted successfully');
      })
      .catch(errorMethod)
      .finally(() => {
        setLoadingLogout(false);
        setIsLogoutModal(false);
      });
  };

  const handleReadNotifications = (params: { type?: 'all'; item?: any }) => {
    APP_LOG(params);
    setIsLoading(true);
    actions
      .readNotifications(params?.type ? params : { id: params?.item?.id })
      .then((response: any) => {
        if (response?.status === 'true' || response?.status) {
          if (params?.type === 'all') {
            showSuccess(response?.message);
          }
          if (!isEmpty(params?.item)) {
            const type:
              | 'get-connection-request'
              | 'connection-request'
              | 'shared-card'
              | 'Subcription' = params?.item?.type?.toString();

            // APP_LOG('type', type);
            let screenName: string = '';
            let tab: string = '';
            if (type === 'get-connection-request') {
              screenName = navigationStrings?.YOUR_CONNECTIONS;
              tab = 'Pending Requests';
            } else if (type === 'connection-request') {
              screenName = navigationStrings?.YOUR_CONNECTIONS;
              tab = 'My Connections';
            } else if (type === 'shared-card') {
              screenName = navigationStrings?.SHARED_CONTACTS;
            } else if (type === 'Subcription') {
              screenName = navigationStrings?.SUBSCRIPTION_PLANS;
            }

            if (screenName != '') {
              navigation.navigate(screenName, !!tab ? { tab } : undefined);
            }
          }
        }
      })
      .catch(errorMethod)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const hideDialog = (confirm: boolean) => {
    confirm ? handleDelete() : setIsLogoutModal(false);
  };

  const handleBack = () => {
    setSelected([]);
    navigation.goBack();
  };

  const renderFooter = () => <Spacer />;

  return (
    <WrapperContainer>
      <View>
        <Header
          centerTitle={useTranslate('NOTIFICATION')}
          // rightImg={imagePath.delete_icon1}
          // isRightIcon={!isDelete && notifications.some(s => s.data.length > 0)}
          onPressLeftImg={handleBack}
          // onPressRightImg={() => {
          //   setDelete(true);
          //   setSelected([]);
          // }}
          // isRightText={isDelete && notifications.some(s => s.data.length > 0)}
          // onPressRightText={() => {
          //   setDelete(false);
          //   setSelected([]);
          // }}
        />
        <Spacer />
      </View>

      {isLoading && <NativeLoader size="large" />}

      {isShimmer ? (
        <NotificationSimmer />
      ) : (
        <>
          {!isDelete && (
            <TouchableOpacity
              style={styles.markAllReadButton}
              onPress={() => handleReadNotifications({ type: 'all' })}
            >
              <Text allowFontScaling={false} style={styles.markAllReadText}>
                {useTranslate('MARK_ALL_AS_READ')}
              </Text>
            </TouchableOpacity>
          )}
          <SectionList
            sections={notifications}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={item => item.uuid || item.id}
            stickySectionHeadersEnabled
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
            // contentContainerStyle={{flexGrow: 1}}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            ListEmptyComponent={
              <ListEmptyComponent title="No notifications found" />
            }
            ListFooterComponent={renderFooter}
          />
        </>
      )}

      {isDelete && notifications.some(s => s.data.length > 0) && (
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => selectAll('Today')}>
            <Text allowFontScaling={false} style={styles.selectAll}>
              {useTranslate('SELECT_ALL')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => selected.length > 0 && setIsLogoutModal(true)}
          >
            <Text allowFontScaling={false} style={styles.delete}>
              {selected.length > 1
                ? useTranslate('DELETE_ALL')
                : useTranslate('DELETE')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {isLogoutModal && (
        <View
          style={{
            position: 'absolute',
            zIndex: 5,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Logout
            isVisible={isLogoutModal}
            message={useTranslate(
              selected.length === 1
                ? 'Are you sure you want to delete this notification?'
                : 'Are you sure you want to delete these notifications?',
            )}
            ok={useTranslate('YES')}
            cancel={useTranslate('NO')}
            onClose={hideDialog}
            isLoadingLogout={isLoadingLogout}
          />
        </View>
      )}
    </WrapperContainer>
  );
};

export default Notification;
