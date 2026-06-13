import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import colors from '../styles/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
interface Props {
  headerStyle?: object;
  statusBarColor?: string;
  barStyle?: string | any;
  children?: object | any;
  isLoading?: boolean;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto' | undefined;
}

const WrapperContainer: FC<Props> = props => {
  const {
    statusBarColor = colors.appWhite,
    barStyle = 'light-content',
    children,
    isLoading = false,
    pointerEvents = 'auto',
  } = props;
  return (
    <SafeAreaView
      style={{...styles.container, backgroundColor: statusBarColor}}
      pointerEvents={isLoading ? 'none' : 'auto'}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.appWhite,
    flex: 1,
  },
});

export default React.memo(WrapperContainer);
