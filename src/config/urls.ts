import {
  API_URL_DEV,
  API_IMAGE_URL_DEV,
  API_URL_STAGE,
  API_IMAGE_URL_STAGE,
  API_IMAGE_URL_LIVE,
  API_URL_LIVE,
} from '@env';
import { APP_LOG } from '../utils/helperFunctions';

export let urlConfig = {
  //DEV
  // BASE_URL: API_URL_DEV,
  // API_IMAGE_URL_DEV: API_IMAGE_URL_DEV,

  //STAGE
  // BASE_URL: API_URL_STAGE,
  // API_IMAGE_URL_DEV: API_IMAGE_URL_STAGE,

  //CLIENT STAGE
  BASE_URL: API_URL_LIVE,
  API_IMAGE_URL_DEV: API_IMAGE_URL_LIVE,

  PRIVACY_POLICY: 'app/cms/privacy-policy',
  TERMS_CONDITIONS: 'app/cms/terms-and-condition',
  ABOUT_US: 'app/cms/about-us',
  // GOOGLE_PLACES_API_KEY: GOOGLE_PLACES_API_KEY,

  //api end points here
  LOG_IN: 'signin',
  CHECK_USER: 'check-user',
  VERIFY_OTP: 'verify-otp',
  SIGN_UP: 'signup',
  LOGOUT: 'logout',
  FORGOT_PASSWORD: 'forgot-password',
  RESEND_OTP: 'send-otp',
  SUBSCRIPTION_PLAN_DETAILS: 'plan-detail',
  RESET_PASSWORD: 'reset-password',
  CHANGE_PASSWORD: 'change-password',
  DELETE_ACCOUNT: 'delete-account',
  GET_PROFILE: 'get-profile',
  OTHER_USER_PROFILE: 'user-profile',
  UPDATE_PROFILE: 'create-edit-profile',
  GET_PARISH: 'parish',
  SEND_OTP_EMAIL: 'send-email-otp',
  LIST_CONTACT_CARD: 'list-contact-card',
  VIEW_CONTACT_CARD: 'view-contact-card',
  CREATE_CONTACT_CARD: 'create-contact-card',
  DELETE_CONTACT_CARD: 'delete-contact-card',
  UPDATE_CONTACT_CARD: 'update-contact-card',
  SUGGESTED_TAG: 'suggested-tag',
  CONTACT_US: 'contact-us',
  SERVICE_SEARCH: 'service-search',
  SEND_CONNECTION_REQUEST: 'connection-request',
  RESPOND_CONNECTION_REQUEST: 'connection-response',
  GET_CONNECTION_REQUEST: 'get-requests',
  GET_CONNECTION_LIST: 'my-connection',
  GET_ALL_USERS: 'user-list',
  GET_USER_DETAILS: 'user-detail',
  GET_FAQS: 'get-faq',
  INTERNAL_SHARE_CARD: 'internal-share-card',
  SHARED_CONTACT_LIST: 'shared-contact',
  DISCONNECT: 'disconnect',
  RESTORE_PURCHASE: 'restore-plan',
  PLAN_PURCHASE: 'purchase-plan',
  NOTIFICATION_LIST: 'notification-list',
  NOTIFICATION_SETTING: 'notification-setting',
  PRIVACY_SETTING: 'update-privacy',
  UPDATE_FCM_TOKEN: 'update-device-token',
  READ_NOTIFICATION: 'notification-read',

  EXTRACT_BUSINESS_CARD: 'upload-image',
};

export function updateUrlConfigData(newUrlConfig: Partial<typeof urlConfig>) {
  APP_LOG('Updating URL Config Data:', newUrlConfig);
  urlConfig = { ...urlConfig, ...newUrlConfig };
}

export const getCompleteUrl = (endpoint: string) =>
  urlConfig.BASE_URL + 'api/' + endpoint;

export const getCompleteImageUrl = (endpoint: string) => {
  return urlConfig.API_IMAGE_URL_DEV + endpoint;
};
export const getCmsUrl = (cmsEndPoint: string) => {
  return urlConfig.BASE_URL + cmsEndPoint;
};
