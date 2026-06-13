import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  FlatList,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import imagePath from '../constants/imagePath';
import { useTranslate } from '../constants/lang';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import ImageButton from './ImageButton';
import InterestComp from './InterestComp';
import ModalInterestLocationFilter, {
  FilterData,
  LoadingType,
} from './ModalInterestLocationFilter';
import NativeLoader from './NativeLoader';
import Spacer from './Spacer';
// import SwitchableTabs, {TabsData} from './SwitchableTabs';

interface Props {
  // tabsData?: TabsData[];
  // selectedTab?: TabsData;
  // onChangeTab?: (event: TabsData, index: number) => void;
  // availableInterests?: any[];
  // selectedInterests?: any[];
  // availableSort?: any[];
  // selectedSort?: string | '';
  // isSwitchableTabs?: boolean;
  tags: any[];
  selectedTag: any[];
  sortBy: any[];
  selectSortBy: string;
  order: any[];
  selectedOrder: string;
  onApplyFilter?: (data: FilterData, filterType: LoadingType) => void;
  loadingType?: LoadingType;
  onPressSearch?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  showFilterIcon?: boolean; // Add this line
}

// Use forwardRef with Props and ref types defined
const HeaderFilterSearch = forwardRef<unknown, Props>((props, ref) => {
  const {
    tags = [],
    selectedTag = [],
    sortBy = [],
    selectSortBy = '',
    order = [],
    selectedOrder = '',
    // onChangeTab = () => {},
    // availableInterests = [],
    // selectedInterests = [],
    // availableSort = [],
    // selectedSort = '',
    // isSwitchableTabs = true,
    onApplyFilter = () => {},
    loadingType = null,
    onPressSearch = () => {},
    containerStyle = {},
    showFilterIcon = false, // Destructure here with default value
  } = props;

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const closeModal = () => {
    setIsFilterModalVisible(false);
  };

  useImperativeHandle(ref, () => ({
    closeModal,
  }));

  // const onPressInterest = (itm: any, type: LoadingType) => {
  //   let previousSelectedInterests = [...selectedInterests];
  //   if (previousSelectedInterests?.includes(itm?.id) && type == 'clear') {
  //     const newData = previousSelectedInterests.filter(
  //       (value: any) => value !== itm.value,
  //     );
  //     onApplyFilter({city: [], interests: [...newData], sortBy: ''}, 'apply');
  //   } else if (type == 'apply') {
  //     onApplyFilter(
  //       {city: [], interests: [...selectedInterests, itm?.value], sortBy: ''},
  //       'apply',
  //     );
  //   }
  // };

  return (
    <View style={{ ...styles.container, ...(containerStyle as object) }}>
      <View style={{ marginHorizontal: moderateScale(18) }}>
        {/* {isSwitchableTabs && (
          <SwitchableTabs
            tabsData={tabsData}
            selectedTab={selectedTab || {id: 1}}
            onChangeTab={onChangeTab}
            container={{
              marginBottom: moderateScaleVertical(16),
            }}
          />
        )} */}
        <View style={commonStyles.flexRowSpaceBtwn}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressSearch}
            style={styles.searchContainer}
          >
            <Image style={styles.searchIcon} source={imagePath.search} />
            <Text allowFontScaling={false} style={styles.search}>
              {useTranslate('SEARCH')}
            </Text>
          </TouchableOpacity>
          {showFilterIcon && (
            <ImageButton
              onPress={() => setIsFilterModalVisible(true)}
              imgStyle={styles.filterIcon}
              imgSrc={imagePath.filter}
            />
          )}
        </View>

        <Spacer space={10} />
      </View>
      {/* <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={availableInterests}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={() => (
            <View style={{width: moderateScale(18)}} />
          )}
          renderItem={({item, index}: {item: any; index: number}) => (
            <InterestComp
              item={item}
              index={index}
              // loadingType={loadingType}
              // onClick={() => onPressInterest(item, 'apply')}
              // onCrossClick={() => onPressInterest(item, 'clear')}
              selectedInterest={selectedInterests}
            />
          )}
        />
      </View> */}
      {loadingType != null && <NativeLoader indicator={styles.loader} />}
      <Spacer space={20} />
      <ModalInterestLocationFilter
        loadingType={loadingType}
        onBackdropPress={() => setIsFilterModalVisible(false)}
        isVisible={isFilterModalVisible}
        onApplyFilter={(data, filterType) => {
          onApplyFilter(data, filterType);
          setIsFilterModalVisible(false);
        }}
        onCancel={() => setIsFilterModalVisible(false)}
        tags={tags}
        selectedTag={selectedTag}
        sortBy={sortBy}
        selectSortBy={selectSortBy}
        order={order}
        selectedOrder={selectedOrder}
      />
    </View>
  );
});

export default React.memo(HeaderFilterSearch);

const styles = StyleSheet.create({
  container: {
    marginTop: moderateScaleVertical(4),
  },
  logoContainer: {},
  imgStyle: {
    height: moderateScale(36),
    width: moderateScale(36),
  },
  imgStyle1: {
    height: moderateScale(36),
    width: moderateScale(36),
    marginRight: moderateScale(8),
  },

  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    height: moderateScaleVertical(40),
    alignItems: 'center',
    borderColor: colors.grey12,
    borderWidth: 1,
    borderRadius: moderateScale(30),
    paddingRight: moderateScale(10),
    marginRight: moderateScale(6),
    backgroundColor: colors.white,
  },
  searchIcon: {
    height: moderateScale(15),
    width: moderateScale(15),
    marginStart: moderateScale(10),
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    marginStart: moderateScale(5),
    ...commonStyles.font13,
    color: colors.blackOpacity40,
  },
  filterIcon: {
    height: moderateScale(35),
    width: moderateScale(35),
  },
  loader: {
    bottom: 0,
    position: 'absolute',
    alignSelf: 'center',
  },
});
