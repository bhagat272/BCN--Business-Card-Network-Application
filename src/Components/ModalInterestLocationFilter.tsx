import React, { FC, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import colors from '../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
} from '../styles/responsiveSize';

import { useTranslation } from 'react-i18next';
import ReactNativeModal from 'react-native-modal';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import { useTranslate } from '../constants/lang';
import commonStyles from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import { errorMethod, isIos, showError } from '../utils/helperFunctions';
import ButtonComp from './ButtonComp';
import ButtonWithImage from './ButtonWithImage';
import HorizontalLine from './HorizontalLine';
import ImageButton from './ImageButton';
import { useDebounce } from '../utils/useDebounce';
import actions from '../redux/actions';
import ContainerWithTopCross from './ContainerWithTopCross';
import NativeLoader from './NativeLoader';
import { isEmpty } from 'lodash';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../utils/toastConfig';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Spacer from './Spacer';
import FilterModal from './FilterModal';
import HeaderFilterSearch from './HeaderFilterSearch';

export interface FilterData {
  city: string[];
  interests: string[];
  sortBy?: string;
}

export type LoadingType = 'apply' | 'clear' | null;
interface Props {
  isVisible?: boolean;
  onBackdropPress?: () => void;

  onApplyFilter?: (data: FilterData, filterType: LoadingType) => void;
  loadingType?: LoadingType;
  onCancel?: () => void;
  tags: any[];
  selectedTag: any[];
  sortBy: any[];
  selectSortBy: string;
  order: any[];
  selectedOrder: string;
}

const ModalInterestLocationFilter: FC<Props> = props => {
  const { availableInterests, themeColor } = useSelector(
    (state: any) =>
      state?.auth || { availableInterests: [], themeColor: colors.themeColor },
  );
  const {
    isVisible = false,
    onBackdropPress = () => {},

    onApplyFilter = () => {},
    tags = [],
    selectedTag = [],
    sortBy = [],
    selectSortBy = '',
    order = [],
    selectedOrder = '',
    loadingType,
    onCancel = () => {},
  } = props;
  const { t } = useTranslation();
  // const [filterOptions, setFilterOptions] = useState([
  //   {
  //     id: 1,
  //     title: useTranslate('INTERESTS'),
  //   },
  //   {
  //     id: 2,
  //     title: useTranslate('LOCATION'),
  //   },
  // ]);
  const [selectedFilterOption, setSelectedFilterOption] = useState({
    id: 1,
    title: useTranslate('INTERESTS'),
  });

  const filterOption = [
    {
      id: 1,
      title: useTranslate('INTERESTS'),
    },
    {
      id: 2,
      title: useTranslate('LOCATION'),
    },
  ];

  const filterAdventureOption = [
    {
      id: 1,
      title: useTranslate('INTERESTS'),
    },
    {
      id: 2,
      title: useTranslate('LOCATION'),
    },
    {
      id: 3,
      title:
        selectedFilterOption.id == 3
          ? useTranslate('GROUP_BY')
          : useTranslate('SORT_BY'),
    },
  ];

  const [selectedInterests, setSelectedInterests] = useState<any[]>([]);
  const [selectedSorts, setSelectedSorts] = useState<string>('');
  const [locationKeyword, setLocationKeyword] = useState<string>('');
  const [searchedLocationData, setSearchedLocationData] = useState<any[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const [selectedLocations, setSelectedLocations] = useState<any[]>([]);

  const onSelectInterest = (itm: any) => {
    let previousSelectedInterests = [...selectedInterests];
    if (previousSelectedInterests?.includes(itm?.id)) {
      const newData = previousSelectedInterests.filter(
        (value: any) => value !== itm.value,
      );
      setSelectedInterests(newData);
    } else {
      setSelectedInterests([...previousSelectedInterests, itm?.value]);
    }
  };
  const onSelectSortBy = (itm: any) => {
    setSelectedSorts(itm?.id);
  };

  const onSelectLocation = (itm: any) => {
    let previousSelectedLocations = [...selectedLocations];
    if (previousSelectedLocations?.includes(itm)) {
      const newData = previousSelectedLocations.filter(
        (value: any) => value !== itm,
      );
      setSelectedLocations(newData);
    } else {
      setSelectedLocations([...previousSelectedLocations, itm]);
    }
  };

  const onChangeSearchText = (text: string) => {
    text == '' && setSearchedLocationData([]);
    setLocationKeyword(text);
    debounceSearchLocation(text);
  };

  const debounceSearchLocation = useDebounce((keyword: string) => {
    if (keyword.length >= 2) {
      setIsLoadingSearch(true);
      // let apiData = {
      //   search: keyword,
      // };
      // actions
      //   .searchLocation(apiData)
      //   .then(res => {
      //     setSearchedLocationData(res?.data);
      //   })
      //   .catch(errorMethod)
      //   .finally(() => {
      //     setIsLoadingSearch(false);
      //   });
    }
  }, 800);

  const onClear = () => {
    setSelectedLocations([]);
    setSelectedInterests([]);
    setSelectedSorts('');
    onApplyFilter(
      {
        city: [],
        interests: [],
        sortBy: '',
      },
      'clear',
    );
  };

  const onApply = () => {
    if (isEmpty(selectedLocations) && isEmpty(selectedInterests)) {
      showError(useTranslate('PLEASE_SELECT_ATLEAST_ONE_FILTER'));
      return;
    }
    let filterData: FilterData = {
      city: selectedLocations,
      interests: selectedInterests,
      sortBy: selectedSorts,
    };
    onApplyFilter(filterData, 'apply');
  };

  const renderSelectedLocations = (item: string, index: number) => {
    return (
      <ContainerWithTopCross
        key={String(index)}
        title={item}
        onPress={() => onSelectLocation(item)}
        container={{
          height: moderateScaleVertical(26),
        }}
      />
    );
  };

  const ChildComp = () => (
    <View>
      <View style={isIos ? styles.containerIos : styles.containerAndroid}>
        <View style={styles.handle} />
        <View style={styles.titleContainer}>
          {/* <Text allowFontScaling={false} style={styles.filterBy}>{useTranslate('FILTER_BY')}</Text> */}
          {/* <ImageButton onPress={onCancel} imgSrc={imagePath.close_black} /> */}
        </View>
        {/* <HorizontalLine marginBottom={0} /> */}
        <View style={styles.filterContainer}>
          {/* filter modal comp  */}
          <FilterModal />
        </View>
        {/* <HorizontalLine marginBottom={0} marginTop={0} /> */}
        <View style={styles.bottomBtns}>
          <ButtonComp
            isLoading={loadingType === 'clear'}
            disabled={!!loadingType}
            onPress={onClear}
            title={useTranslate('CLEAR')}
            btnStyle={styles.cancelBtn}
            gradientColors={[colors.AppWhite, colors.AppWhite]}
            btnTxtStyle={styles.btnStl}
          />
          <ButtonComp
            disabled={!!loadingType}
            isLoading={loadingType === 'apply'}
            onPress={onApply}
            title={useTranslate('APPLY')}
            btnStyle={{ ...styles.applyBtn, backgroundColor: themeColor }}
          />
        </View>
        <Spacer space={moderateScale(15)} />
      </View>
      <Toast position="top" topOffset={isIos ? 46 : 20} config={toastConfig} />
    </View>
  );

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      onBackButtonPress={onBackdropPress}
      animationIn={'slideInUp'}
      backdropColor="rgba(0, 0, 0, 0.5)"
      avoidKeyboard
      style={styles.modal}
    >
      <View style={styles.backdrop} />
      {isIos ? (
        <View>{ChildComp()}</View>
      ) : (
        <KeyboardAvoidingView
          style={styles.backdrop}
          behavior="position"
          enabled
        >
          <View>{ChildComp()}</View>
        </KeyboardAvoidingView>
      )}
    </ReactNativeModal>
  );
};

export default React.memo(ModalInterestLocationFilter);

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    flex: 1, // Allow the content to expand dynamically
    paddingBottom: moderateScale(100),
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for the rest of the screen
  },
  containerIos: {
    flex: 1,
    borderRadius: moderateScale(20),
    backgroundColor: colors.white,
    minHeight: moderateScaleVertical(473), // Set a minimum height
  },
  containerAndroid: {
    flex: 1,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    backgroundColor: colors.white,
    minHeight: moderateScaleVertical(473), // Set a minimum height
  },
  handle: {
    height: moderateScaleVertical(4),
    width: moderateScale(30),
    backgroundColor: colors.tooLightGrey,
    borderRadius: moderateScale(40),
    alignSelf: 'center',
    marginTop: moderateScaleVertical(10),
  },
  filterBy: {
    ...commonStyles.font18,
    fontFamily: fontFamily.montserratSemiBold,
  },
  inActiveBtn: {
    borderRadius: 0,
    marginHorizontal: 0,
  },
  btnTxt: {
    color: colors.black,
  },
  filterContainer: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: colors.white,
  },
  rightContainer: {
    flex: 0.6,
    paddingHorizontal: moderateScale(10),
    paddingTop: moderateScale(6),
    paddingBottom: moderateScale(4),
  },
  cancelBtn: {
    flex: 0.48,
    backgroundColor: colors.grey12,
    marginHorizontal: 0,
    minHeight: moderateScaleVertical(44),
    borderRadius: moderateScale(22),
    borderColor: colors.darkblue,
    borderWidth: moderateScale(1),
  },
  btnStl: {
    color: colors.darkblue,
  },
  applyBtn: {
    flex: 0.48,
    marginHorizontal: 0,
    minHeight: moderateScaleVertical(44),
    borderRadius: moderateScale(22),
  },
  bottomBtns: {
    ...commonStyles.flexRowSpaceBtwn,
    paddingVertical: moderateScaleVertical(isIos ? 10 : 15),
    paddingHorizontal: moderateScale(20),
  },
  addressBottomContainer: {
    marginTop: moderateScaleVertical(12),
    zIndex: -1,
  },
  searchHeader: {
    ...commonStyles.flexRowSpaceBtwn,
    marginTop: moderateScaleVertical(16),
  },
  searchContainer: {
    flexDirection: 'row',
    height: moderateScaleVertical(40),
    alignItems: 'center',
    borderColor: colors.grey10,
    borderWidth: 1,
    borderRadius: moderateScale(8),
    paddingRight: moderateScale(10),
    marginRight: moderateScale(6),
    backgroundColor: colors.grey11,
    flex: 0.2,
  },
  searchIcon: {
    height: moderateScale(15),
    width: moderateScale(15),
    marginStart: moderateScale(10),
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: moderateScale(5),
    ...commonStyles.font14,
  },
  interestBtn: {
    borderWidth: 0,
    alignItems: 'flex-start',
    height: moderateScaleVertical(40),
  },
  leftImgStyle: {
    position: 'relative',
    left: 0,
    marginRight: moderateScale(10),
  },
  titleContainer: {
    ...commonStyles.flexRowJustifySpaceBtwn,
    marginHorizontal: moderateScale(16),
  },
  selectedLocView: {
    // ...commonStyles.flexWrap,
    borderTopWidth: 1,
    borderColor: colors.grey10,
    flex: 0.2,
  },
  locSearchedContainer: {
    flex: 0.6,
  },
  noData: {
    ...commonStyles.boldFont12,
    color: colors.blackOpacity40,
    textAlign: 'center',
    marginTop: moderateScaleVertical(20),
  },
});
