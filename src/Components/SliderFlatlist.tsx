import React from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  ViewToken,
} from 'react-native';

const viewConfigRef = {viewAreaCoveragePercentThreshold: 50};

// Add a generic type <T> to the Props interface
interface Props<T> {
  onPress?: (event: any) => void;
  data?: T[];
  flatlistRef?: any;
  onViewableItemsChanged?:
    | ((info: {
        viewableItems: Array<ViewToken>;
        changed: Array<ViewToken>;
      }) => void)
    | null
    | undefined;
  renderItem?: ListRenderItem<T> | null | undefined;
  scrollEnabled?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

// Add a generic type parameter <T> to SliderFlatlist
const SliderFlatlist = <T,>({
  data = [],
  flatlistRef = null,
  onViewableItemsChanged,
  renderItem = () => <></>,
  scrollEnabled = false,
  contentContainerStyle = {},
}: Props<T>) => {
  return (
    <FlatList
      ref={flatlistRef}
      data={data}
      renderItem={renderItem}
      horizontal
      scrollEnabled={scrollEnabled}
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      viewabilityConfig={viewConfigRef}
      onViewableItemsChanged={onViewableItemsChanged}
      snapToAlignment="center"
      decelerationRate="normal"
      contentContainerStyle={contentContainerStyle}
      // ItemSeparatorComponent={()=}
      // ItemSeparatorComponent={() => <View style={{width: 1}} />}
    />
  );
};

export default React.memo(SliderFlatlist);

const styles = StyleSheet.create({});
