import {
  ColorValue,
  DimensionValue,
  Image,
  ImageURISource,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { FC } from 'react';
import commonStyles from '../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import { height, moderateScaleVertical } from '../styles/responsiveSize';
import imagePath from '../constants/imagePath';

interface Props {
  isLoading?: boolean;
  title?: string;
  src?: ImageURISource;
  marginTop?: DimensionValue;
  tintColor?: ColorValue;
}

const ListEmptyComponent: FC<Props> = props => {
  const { t } = useTranslation();
  const {
    isLoading = false,
    title = t('NO_DATA_FOUND'),
    // src = imagePath.no_data01,
    marginTop = moderateScaleVertical(110),
    tintColor = undefined,
  } = props;

  return (
    <View>
      {!isLoading && (
        <View
          style={{
            ...styles.container,
            marginTop: marginTop,
            alignItems: 'center',
          }}
        >
          {/* <Image source={src} tintColor={tintColor} /> */}
          <Text allowFontScaling={false} style={styles.title}>
            {title}
          </Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(ListEmptyComponent);

const styles = StyleSheet.create({
  title: {
    ...commonStyles.font14,
    textAlign: 'center',
    marginTop: moderateScaleVertical(8),
  },
  container: {},
});
