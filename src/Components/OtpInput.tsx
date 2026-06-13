// import React from 'react';
// import {useState, type RefObject} from 'react';
// import {TextInput, View, StyleSheet} from 'react-native';
// import colors from '../styles/colors';
// import {
//   moderateScale,
//   moderateScaleVertical,
//   textScale,
// } from '../styles/responsiveSize';

// interface OTPInputProps {
//   codes: string[];
//   refs: RefObject<TextInput >[];
//   errorMessages: string[] | undefined;
//   onChangeCode: (text: string, index: number) => void;
//   config?: OTPInputConfig;
// }

// interface OTPInputConfig {
//   backgroundColor: string;
//   textColor: string;
//   borderColor: string;
//   errorColor: string;
//   focusColor: string;
// }

// export function OTPInput({
//   codes,
//   refs,
//   errorMessages,
//   onChangeCode,
//   config, // Receive the configuration object as a prop
// }: OTPInputProps) {
//   const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

//   const styles = StyleSheet.create({
//     container: {
//       flexDirection: 'row',
//       width: '100%',
//       justifyContent: 'space-between',
//     },
//     input: {
//       fontSize: textScale(16),
//       height: moderateScaleVertical(56),
//       width: moderateScale(48),
//       borderRadius: moderateScale(12),
//       textAlign: 'center',
//       backgroundColor: colors.white,
//       color: colors.black,
//       borderColor: colors.tooLightGrey,
//       borderWidth: 1,
//     },
//     errorInput: {
//       borderColor: colors.red,
//       color: colors.red,
//     },
//     focusedInput: {
//       borderColor: colors.themeColor,
//     },
//   });

//   const handleFocus = (index: number) => setFocusedIndex(index);
//   const handleBlur = () => setFocusedIndex(null);

//   return (
//     <View style={styles.container}>
//       {codes.map((code, index) => (
//         <TextInput allowFontScaling={false}
//           key={index}
//           autoComplete="one-time-code"
//           enterKeyHint="next"
//           style={[
//             styles.input,
//             errorMessages && styles.errorInput,
//             focusedIndex === index && styles.focusedInput,
//           ]}
//           selectionColor={colors.themeColor}
//           inputMode="numeric"
//           onChangeText={text => onChangeCode(text, index)}
//           value={code}
//           onFocus={() => handleFocus(index)}
//           onBlur={handleBlur}
//           maxLength={1}
//           ref={refs[index]}
//           onKeyPress={({nativeEvent: {key}}) => {
//             if (key === 'Backspace') {
//               if (code === '') {
//                 if (index > 0) {
//                   refs[index - 1]!.current!.focus();
//                   onChangeCode('', index - 1);
//                 }
//               } else {
//                 onChangeCode('', index);
//               }
//             }
//           }}
//         />
//       ))}
//     </View>
//   );
// }

import React, { useState, type RefObject } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';

interface OTPInputProps {
  codes: string[];
  refs: RefObject<TextInput>[];
  errorMessages?: string[];
  onChangeCode: (text: string, index: number) => void;
  config?: OTPInputConfig;
}

interface OTPInputConfig {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  errorColor: string;
  focusColor: string;
}

export function OTPInput({
  codes,
  refs,
  errorMessages,
  onChangeCode,
  config,
}: OTPInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    input: {
      fontSize: textScale(16),
      height: moderateScaleVertical(56),
      width: moderateScale(48),
      borderRadius: moderateScale(12),
      textAlign: 'center',
      backgroundColor: colors.white,
      color: colors.black,
      borderColor: colors.tooLightGrey,
      borderWidth: 1,
    },
    errorInput: {
      borderColor: colors.red,
      color: colors.red,
    },
    focusedInput: {
      borderColor: colors.themeColor,
    },
  });

  const handleFocus = (index: number) => setFocusedIndex(index);
  const handleBlur = () => setFocusedIndex(null);

  const handleChange = (text: string, index: number) => {
    // 🔍 Check if there are any previous empty boxes before this one
    // const firstEmptyIndex = codes.findIndex(c => c === '');

    // if (firstEmptyIndex !== -1 && firstEmptyIndex < index) {
    //   // 👈 Focus the first empty input before this one
    //   refs[firstEmptyIndex]?.current?.focus();
    //   return; // Stop current change
    // }

    // ✅ Otherwise, handle normally
    onChangeCode(text, index);

    // Auto focus next box when a digit is entered
    if (text && index < refs.length - 1) {
      refs[index + 1]?.current?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {codes.map((code, index) => (
        <TextInput
          allowFontScaling={false}
          key={index}
          autoComplete="one-time-code"
          enterKeyHint="next"
          style={[
            styles.input,
            errorMessages && styles.errorInput,
            focusedIndex === index && styles.focusedInput,
          ]}
          selectionColor={colors.themeColor}
          inputMode="numeric"
          onChangeText={text => handleChange(text, index)}
          value={code}
          onFocus={() => {
            const firstEmptyIndex = codes.findIndex(c => c === '');

            if (firstEmptyIndex !== -1 && firstEmptyIndex < index) {
              // 👈 Focus the first empty input before this one
              refs[firstEmptyIndex]?.current?.focus();
              return; // Stop current change
            }
            handleFocus(firstEmptyIndex);
          }}
          onBlur={handleBlur}
          maxLength={1}
          ref={refs[index]}
          onKeyPress={({ nativeEvent: { key } }) => {
            if (key === 'Backspace') {
              if (code === '') {
                if (index > 0) {
                  refs[index - 1]?.current?.focus();
                  onChangeCode('', index - 1);
                }
              } else {
                onChangeCode('', index);
              }
            }
          }}
        />
      ))}
    </View>
  );
}
