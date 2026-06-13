import React from 'react';
import {
  BusinessCardDetails,
  ChangePassword,
  ConnectionDetails,
  CustomSupport,
  DeleteAccount,
  EditProfile,
  EditScreen,
  FAQs,
  InternalSharing,
  InviteFriend,
  AmbassadorCelebration,
  Notification,
  OtpVerify,
  QrCode,
  ResetPassword,
  ScanDocs,
  SharedContacts,
  SubscriptionPlans,
  YourConnections,
} from '../Screens';
import navigationStrings from '../constants/navigationStrings';
import BottomTabs from './BottomTabs';
// import ScanStack from './ScanStack';

export default function MainStack(Stack: any) {
  return (
    <React.Fragment>
      <Stack.Screen
        name={navigationStrings.BOTTOM_TABS}
        component={BottomTabs}
      />
      <Stack.Screen
        name={navigationStrings.CHANGE_PASSWORD}
        component={ChangePassword}
      />
      <Stack.Screen
        name={navigationStrings.EDIT_PROFILE}
        component={EditProfile}
      />
      <Stack.Screen
        name={navigationStrings.DELETE_ACCOUNT}
        component={DeleteAccount}
      />
      <Stack.Screen
        name={navigationStrings.CUSTOMER_SUPPORT}
        component={CustomSupport}
      />
      <Stack.Screen name={navigationStrings.FAQS} component={FAQs} />
      <Stack.Screen
        name={navigationStrings.SUBSCRIPTION_PLANS}
        component={SubscriptionPlans}
      />
      <Stack.Screen
        name={navigationStrings.OTP_VERIFY_TOKEN}
        component={OtpVerify}
      />
      <Stack.Screen
        name={navigationStrings.RESET_PASSWORD}
        component={ResetPassword}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name={navigationStrings.NOTIFICATION}
        component={Notification}
      />
      <Stack.Screen name={navigationStrings.SCAN_DOCS} component={ScanDocs} />
      <Stack.Screen
        name={navigationStrings.INVITE_FRIEND}
        component={InviteFriend}
      />
      <Stack.Screen
        name={navigationStrings.AMBASSADOR_CELEBRATION}
        component={AmbassadorCelebration}
      />
      <Stack.Screen
        name={navigationStrings.EDIT_SCREEN}
        component={EditScreen}
      />

      <Stack.Screen
        name={navigationStrings.BUSINESS_CARD_DETAILS}
        options={{gestureEnabled: false}}
        component={BusinessCardDetails}
      />
      <Stack.Screen
        name={navigationStrings.YOUR_CONNECTIONS}
        component={YourConnections}
      />
      <Stack.Screen name={navigationStrings.QR_CODE} component={QrCode} />
      <Stack.Screen
        name={navigationStrings.CONNECTION_DETAILS}
        component={ConnectionDetails}
      />
      <Stack.Screen
        name={navigationStrings.INTERNAL_SHARING}
        component={InternalSharing}
      />
      <Stack.Screen
        name={navigationStrings.SHARED_CONTACTS}
        component={SharedContacts}
      />
    </React.Fragment>
  );
}
