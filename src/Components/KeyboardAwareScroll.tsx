import React, {ReactNode} from 'react';
import {StyleSheet} from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-controller';

interface KeyboardAwareScrollProps extends KeyboardAwareScrollViewProps {
  children?: ReactNode;
  scrollRef?: any;
}

const KeyboardAwareScroll: React.FC<KeyboardAwareScrollProps> = ({
  children,
  scrollRef = null,
  ...props
}) => {
  return (
    <KeyboardAwareScrollView
      ref={scrollRef}
      keyboardShouldPersistTaps="handled"
      bounces={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      {...props}>
      {children}
    </KeyboardAwareScrollView>
  );
};

export default KeyboardAwareScroll;

const styles = StyleSheet.create({});
