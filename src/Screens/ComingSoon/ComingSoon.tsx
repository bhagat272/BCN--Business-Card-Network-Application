import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import WrapperContainer from '../../Components/WrapperContainer';
import Header from '../../Components/Header';
import commonStyles from '../../styles/commonStyles';
import imagePath from '../../constants/imagePath';

export default function ComingSoon() {
  return (
    <WrapperContainer>
      <Header
        leftImg={imagePath.appIcon}
        isRightIcon={false}
        isRightIcon2={false}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text allowFontScaling={false} style={commonStyles.font16}>
          Coming Soon
        </Text>
      </View>
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({});
