import {urlConfig} from '../../config/urls';
import {APP_LOG} from '../../utils/helperFunctions';
import {apiGet, apiPost, setItem} from '../../utils/utils';
import {
  saveOtpAttempts,
  saveParishData,
  updateDeepLinkingCalled,
} from '../reducers/settings';
import store from '../store';

const {dispatch} = store;

export function getParish(data: object, headers?: object) {
  return apiPost(urlConfig.GET_PARISH, data, headers);
}

export const restorePurchasePlan = (data: object, headers?: object) => {
  return apiPost(urlConfig.RESTORE_PURCHASE, data, headers);
};
export const purchasePlan = (data: object, headers?: object) => {
  return apiPost(urlConfig.PLAN_PURCHASE, data, headers);
};
export function subscriptionPlanDetails(data: object = {}, headers?: object) {
  return apiPost(urlConfig.SUBSCRIPTION_PLAN_DETAILS, data, headers);
}
export function saveParishList(data: any[]) {
  dispatch(saveParishData(data));
}
export function setDeepLinkingCalled(data: boolean) {
  dispatch(updateDeepLinkingCalled(data));
}

export function saveOtpAttemptsAsync(data: object) {
  setItem('otpAttemptData', data)
    .then(() => {
      onSaveOtpAttempts(data);
    })
    .catch(() => APP_LOG('AsyncStorage error'));
}

export function onSaveOtpAttempts(data: object) {
  dispatch(saveOtpAttempts(data));
}

export function getFaqs(data: object, headers?: object) {
  return apiPost(urlConfig.GET_FAQS, data, headers);
}

export function sharedContactList(data: object, headers?: object) {
  return apiPost(urlConfig.SHARED_CONTACT_LIST, data, headers);
}
