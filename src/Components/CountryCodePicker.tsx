import React, { FC, useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import imagePath from '../constants/imagePath';
import { useTranslate } from '../constants/lang';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
} from '../styles/responsiveSize';
import ListEmptyComponent from './ListEmptyComponent';
import { Countries, COUNTRIES_CODE_FLAG } from '../utils/commonData';

export interface Props {
  onClosePickerModal?: () => void;
  isVisible: boolean;
  onCountryChange?: (data: Countries) => void;
}

const CountryCodePicker: FC<Props> = props => {
  const {
    onClosePickerModal = () => {},
    isVisible = false,
    onCountryChange = () => {},
  } = props;

  const [searchKey, setSearchKey] = useState('');
  const [allCountriesData, setAllCountriesData] = useState(COUNTRIES_CODE_FLAG);
  const [filteredCountriesData, setFilteredCountriesData] =
    useState(COUNTRIES_CODE_FLAG);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onCountryChange(item);

          closeModal();
        }}
        style={styles.country}
      >
        <Text>{item.flag} </Text>
        <Text allowFontScaling={false} style={styles.countryText}>
          {item.name} ({item.dial_code})
        </Text>
      </TouchableOpacity>
    );
  };

  const filterCountries = (value: string) => {
    setSearchKey(value);
    const textData = value.toLowerCase();
    const previousData = [...allCountriesData];
    const exactMatches = previousData.filter(
      item =>
        item.name.toLowerCase() === textData ||
        item.flag === textData ||
        item.code.toLowerCase() === textData ||
        item.dial_code.replace('+', '') === textData, // Remove "+" for dial_code comparison
    );

    // Partial matches (excluding exact matches)
    const partialMatches = previousData.filter(
      item =>
        (item.name.toLowerCase().includes(textData) ||
          item.flag.includes(textData) ||
          item.code.toLowerCase().includes(textData) ||
          item.dial_code.replace('+', '').includes(textData)) && // Remove "+" for dial_code comparison
        !exactMatches.includes(item), // Avoid duplicate entries
    );
    let dataToSet = [...exactMatches, ...partialMatches];
    setFilteredCountriesData(dataToSet);
  };

  const closeModal = () => {
    Keyboard.dismiss();
    onClosePickerModal();
    setTimeout(() => {
      setFilteredCountriesData(COUNTRIES_CODE_FLAG);
      setSearchKey('');
    }, 300);
  };

  return (
    isVisible && (
      <View>
        <ReactNativeModal
          animationIn="slideInUp"
          isVisible={isVisible}
          style={styles.modalStyle}
          onBackButtonPress={closeModal}
          onBackdropPress={closeModal}
        >
          <View style={styles.modalCenter}>
            <View style={styles.searchView}>
              <Text
                allowFontScaling={false}
                Input
                value={searchKey}
                placeholder={useTranslate('SEARCH')}
                placeholderTextColor={colors.lightGrey}
                onChangeText={value => filterCountries(value)}
                style={styles.searchInput}
              />
              {searchKey !== '' && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchKey('');
                    setFilteredCountriesData(COUNTRIES_CODE_FLAG);
                  }}
                >
                  <Image source={imagePath.close_black} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.listContainer}>
              <FlatList
                data={filteredCountriesData}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                keyboardShouldPersistTaps={'handled'}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => (
                  <View style={commonStyles.itemSeparator} />
                )}
                ListEmptyComponent={ListEmptyComponent}
                ListFooterComponent={() => (
                  <View style={commonStyles.footerComp} />
                )}
              />
            </View>
          </View>
        </ReactNativeModal>
      </View>
    )
  );
};

export default React.memo(CountryCodePicker);

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalCenter: {
    flex: 0.7,
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  modalViewStyle: {
    maxHeight: height,
    backgroundColor: '#fff',
    borderRadius: 5,
  },

  country: {
    flexDirection: 'row',
  },
  countryText: {
    ...commonStyles.boldFont14,
    marginLeft: moderateScale(4),
  },
  searchView: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.grey1,
    paddingHorizontal: moderateScale(10),
    height: moderateScaleVertical(44),
  },
  searchInput: {
    ...commonStyles.font16,
    paddingRight: moderateScale(6),
    flex: 1,
  },
  listContainer: {
    flex: 1,
    margin: moderateScale(12),
  },
});
