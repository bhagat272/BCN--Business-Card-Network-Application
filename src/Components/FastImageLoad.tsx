import React, { FC, useState } from 'react';
import {
  Image,
  ImageRequireSource,
  ImageStyle,
  StyleSheet,
  View,
} from 'react-native';
import FastImage, { FastImageProps } from '@d11/react-native-fast-image';
import commonStyles from '../styles/commonStyles';
import NativeLoader from './NativeLoader';

interface FastImageLoadProps extends FastImageProps {
  parentStyle?: ImageStyle;
  loadingImgStyle?: ImageStyle;
  defaultImage?: ImageRequireSource;
  loaderSize?: number;
}

export type LoadingStatus = 'loading' | 'failed' | 'success';

const FastImageLoad: FC<FastImageLoadProps> = props => {
  const {
    parentStyle = {},
    loadingImgStyle = {},
    defaultImage = undefined,
    loaderSize = 20,
  } = props;
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>('loading');

  return (
    <View style={parentStyle}>
      <FastImage
        {...props}
        source={props.source}
        onLoadStart={() => {
          // setLoadingStatus('loading');
        }}
        onLoad={() => {
          setLoadingStatus('success');
        }}
        onError={() => {
          setLoadingStatus('failed');
        }}
      />
      {loadingStatus == 'failed' ? (
        <View style={styles.centerView}>
          <Image source={defaultImage} />
        </View>
      ) : (
        loadingStatus == 'loading' && (
          <View style={styles.centerView}>
            <NativeLoader size={loaderSize} />
          </View>
        )
      )}
    </View>
  );
};

export default React.memo(FastImageLoad);

const styles = StyleSheet.create({
  // Add your styles if needed
  centerView: {
    ...commonStyles.absolute,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
