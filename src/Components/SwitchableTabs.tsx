import React, {FC} from 'react';
import {
  FlatList,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import ButtonComp from './ButtonComp';
import commonStyles from '../styles/commonStyles';
import {useSelector} from 'react-redux';

export interface TabsData {
  id: number;
  title?: string;
}

interface Props {
  tabsData: TabsData[];
  selectedTab: TabsData;
  onChangeTab?: (event: TabsData, index: number) => void;
  mainContainerStyle?: object;
  scrollEnabled?: boolean;
  type?: 'button' | 'bar';
  container?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  titleKey?: 'title'; // Specify the key for the title
  scrollRefe?: any;
  btnStyle?: StyleProp<ViewStyle>;
}

const SwitchableTabs: FC<Props> = props => {
  const {themeColor} = useSelector(
    (state: any) => state.auth || {themeColor: colors.themeColor},
  );
  const {
    tabsData = [],
    onChangeTab = () => {},
    selectedTab,
    scrollEnabled = false,
    type = 'button',
    container = {},
    contentContainerStyle = {},
    titleKey = 'title', // Default to 'title'
    scrollRefe = null,
    btnStyle = {},
  } = props;

  const getTabStyle = (isSelected: boolean): ViewStyle =>
    type === 'button'
      ? {
          ...styles.tabBtn,
          borderColor: themeColor,
          backgroundColor: isSelected ? themeColor : colors.white,
          ...(btnStyle as object),
        }
      : {
          ...styles.tabBarBtn,
          borderBottomWidth: 1,
          backgroundColor: colors.white,
          borderBottomColor: isSelected ? themeColor : colors.white,
          ...(btnStyle as object),
        };

  const getTabTitleStyle = (isSelected: boolean): TextStyle =>
    type === 'button'
      ? {
          ...styles.txtStyle,
          fontFamily: isSelected
            ? fontFamily.montserratMedium
            : fontFamily.montserratRegular,
          color: isSelected ? colors.white : colors.black,
        }
      : {
          ...styles.txtStyle,
          fontFamily: isSelected
            ? fontFamily.montserratSemiBold
            : fontFamily.montserratRegular,
          color: colors.black,
        };

  return (
    <View style={{...styles.container, ...(container as object)}}>
      <FlatList
        ref={scrollRefe}
        keyExtractor={(itm, indx) => String(itm.id) + String(indx)}
        scrollEnabled={scrollEnabled || type === 'button'}
        showsHorizontalScrollIndicator={false}
        data={tabsData}
        horizontal
        renderItem={({item, index}) => (
          <ButtonComp
            numberOfLines={1}
            title={item.title}
            onPress={() => onChangeTab(item, index)}
            btnTxtStyle={getTabTitleStyle(selectedTab?.id === item?.id)}
            btnStyle={getTabStyle(selectedTab?.id === item?.id)}
          />
        )}
      />
    </View>
  );
};

export default React.memo(SwitchableTabs);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    padding: moderateScale(4),
    ...commonStyles.cardElevationShadow,
  },
  txtStyle: {
    fontSize: textScale(14),
  },
  tabBtn: {
    minHeight: moderateScaleVertical(34),
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(12),
    marginHorizontal: 0,
    width: (width - moderateScale(44)) / 2,

    // maxWidth: moderateScale(180),
  },
  tabBarBtn: {
    minHeight: moderateScaleVertical(34),
    borderRadius: moderateScale(20),
    marginHorizontal: 0,
    width: (width - moderateScale(28)) / 2,
  },
});
