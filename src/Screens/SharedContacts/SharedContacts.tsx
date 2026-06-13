import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import FileComp from '../../Components/FileComp';
import Header from '../../Components/Header';
import { ConnectionLoader } from '../../Components/ShimmerComp';
import imagePath from '../../constants/imagePath';
import { useTranslate } from '../../constants/lang';
import navigationStrings from '../../constants/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import { moderateScaleVertical } from '../../styles/responsiveSize';
import { APP_LOG, errorMethod } from '../../utils/helperFunctions';
import styles from './styles'; // Assuming styles are shared or adjust accordingly
import { SafeAreaView } from 'react-native-safe-area-context';

interface SharedContactData {
  id: number;
  user_id: number;
  user_share_id: number;
  card_id: number | null;
  uuid: string;
  name: string;
  designation: string;
  company_name: string;
  service: string;
  email: string;
  saved: number;
  country_code: number;
  country_code_name: string;
  phone_number: string;
  tags: string | null;
  status: number;
  access_status: string;
  card_extra_filed: {
    id: number;
    uuid: string;
    contact_card_id: number;
    title: string;
    description: string;
  }[];
  card_tag: string[];
}

const SharedContacts = ({ navigation }: any) => {
  const [sharedContacts, setSharedContacts] = useState<SharedContactData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefresh, setRefresh] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [isLoadMore, setLoadMore] = useState<boolean>(false);

  useEffect(() => {
    fetchSharedContacts({ pageNo: 1 });
  }, []);

  const fetchSharedContacts = ({ pageNo = 1 }: { pageNo: number }) => {
    setIsLoading(pageNo === 1); // Show loader only for the first page
    setLoadMore(pageNo > 1); // Show load more for subsequent pages

    const payload = { page: pageNo };

    actions
      .sharedContactList(payload)
      .then((res: any) => {
        if (res?.status === 'true' && res?.data?.data) {
          const data = res.data.data;
          setSharedContacts(prevState =>
            pageNo === 1 ? data : [...prevState, ...data],
          );
          setLastPage(res.data.last_page || 1);
          setPage(pageNo);
          APP_LOG('Shared Contacts:', data); // Log fetched data
        } else {
          setSharedContacts([]);
        }
      })
      .catch(errorMethod)
      .finally(() => {
        setIsLoading(false);
        setRefresh(false);
        setLoadMore(false);
      });
  };

  const handleRefresh = () => {
    setRefresh(true);
    fetchSharedContacts({ pageNo: 1 });
  };

  const handleEndReached = () => {
    if (page < lastPage && !isLoadMore) {
      const nextPage = page + 1;
      fetchSharedContacts({ pageNo: nextPage });
    }
  };

  const renderFooter = () => (
    <View style={styles.footerLoader}>
      {isLoadMore && <ActivityIndicator size="small" color={colors.darkblue} />}
      <View style={{ height: moderateScaleVertical(20) }} />
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
    <SafeAreaView style={styles.safeArea}>
      <Header
        centerTitle={useTranslate('SHARED_CONTACTS')}
        onPressLeftImg={() => navigation.goBack()}
      />

      {false ? (
        <ConnectionLoader />
      ) : (
        <FlatList
          data={sharedContacts}
          keyExtractor={item => item.uuid}
          renderItem={({ item }) => (
            <FileComp
              containerStyle={styles.cardWrapper}
              leftImg={imagePath.cards_image}
              name={item.name}
              role={item.designation}
              company={item.company_name}
              rightImg={imagePath.more}
              enableSwipeRight={false} // Disables right swipe action
              tags={item.card_tag} // Pass card_tag array directly
              isEdit={false} // No edit option for shared contacts
              isCheckbox={false} // No selection for now
              onPress={() => {
                navigation.navigate(navigationStrings.EDIT_SCREEN, {
                  uuid: item.uuid,
                  access: item.access_status === 'full_access' ? true : false,
                  sharing: true,
                  saved: item.saved === 1 ? true : false,
                });
              }}
              onEditPress={() =>
                navigation.navigate(navigationStrings.BUSINESS_CARD_DETAILS, {
                  uuid: item.uuid,
                  type: 'EDIT',
                })
              }
              selected={[]}
              id={item.uuid}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefresh}
              onRefresh={handleRefresh}
              tintColor={colors.darkblue}
            />
          }
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyComponent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default SharedContacts;
