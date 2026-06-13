import {t} from 'i18next';
import {urlConfig} from '../../config/urls';
import {apiPost} from '../../utils/utils';
import {setRefreshHome} from '../reducers/home';
import store from '../store';
const {dispatch} = store;

export function homeRefresh(data: boolean) {
  dispatch(setRefreshHome(data));
}

export function getContactCardList(data: object, headers?: object) {
  return apiPost(urlConfig.LIST_CONTACT_CARD, data, headers);
}

export function getContactCard(data: object, headers?: object) {
  return apiPost(urlConfig.VIEW_CONTACT_CARD, data, headers);
}

export function saveCardData(data: object, headers?: object) {
  return apiPost(urlConfig.CREATE_CONTACT_CARD, data, headers);
}

export function deleteCard(data: object, headers?: object) {
  return apiPost(urlConfig.DELETE_CONTACT_CARD, data, headers);
}

export function updateCard(data: object, headers?: object) {
  return apiPost(urlConfig.UPDATE_CONTACT_CARD, data, headers);
}

export function tagSuggestions(data: object, headers?: object) {
  return apiPost(urlConfig.SUGGESTED_TAG, data, headers);
}

export function internalShare(data: object, headers?: object) {
  return apiPost(urlConfig.INTERNAL_SHARE_CARD, data, headers);
}
export function getIndustryDetails(
  data: {company_name: string},
  headers?: object,
) {
  // return fetchIndustryDetails(company_name);

  return apiPost(urlConfig.SERVICE_SEARCH, data, headers);
}

export function contactUs(data: object, headers?: object) {
  return apiPost(urlConfig.CONTACT_US, data, headers);
}
// export function extractBusinessCard(data: object, headers?: object) {
//   return apiPost(urlConfig.EXTRACT_BUSINESS_CARD, data, headers);
// }
export async function extractBusinessCard(
  data: object,
  headers?: object,
  retries = 2,
) {
  try {
    return await apiPost(urlConfig.EXTRACT_BUSINESS_CARD, data, headers);
  } catch (err: any) {
    if (retries > 0 && err?.message === t('NETWORK_ERROR')) {
      return extractBusinessCard(data, headers, retries - 1);
    }

    throw err;
  }
}

export function getNotifications(data: object, headers?: object) {
  return apiPost(urlConfig.NOTIFICATION_LIST, data, headers);
}
export function readNotifications(
  data: {id?: string | number; type?: 'all'},
  headers?: object,
) {
  return apiPost(urlConfig.READ_NOTIFICATION, data, headers);
}
export function toggleNotificationSetting(
  data: {notification_status: number},
  headers?: object,
) {
  return apiPost(urlConfig.NOTIFICATION_SETTING, data, headers);
}
export function togglePrivacySetting(
  data: {privacy_settings: number},
  headers?: object,
) {
  return apiPost(urlConfig.PRIVACY_SETTING, data, headers);
}
