import React from 'react';
import {
  ForgotPassword,
  IntroScreen,
  Login,
  OtpVerify,
  ResetPassword,
  Signup,
} from '../Screens';
import navigationStrings from '../constants/navigationStrings';

export default function AuthStack(Stack: any, isIntroFinished: boolean) {
  return (
    <React.Fragment>
      {!isIntroFinished && (
        <Stack.Screen
          name={navigationStrings.INTRO_SCREEN}
          component={IntroScreen}
        />
      )}

      <Stack.Screen name={navigationStrings.LOGIN} component={Login} />
      <Stack.Screen name={navigationStrings.SIGNUP} component={Signup} />

      <Stack.Screen name={navigationStrings.OTP_VERIFY} component={OtpVerify} />
      <Stack.Screen
        name={navigationStrings.FORGOT_PASSWORD}
        component={ForgotPassword}
      />

      <Stack.Screen
        name={navigationStrings.RESET_PASSWORD}
        component={ResetPassword}
        options={{gestureEnabled: false}}
      />
    </React.Fragment>
  );
}
