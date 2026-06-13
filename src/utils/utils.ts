// import {stringMd5} from 'react-native-quick-md5';
import { i18n } from '../constants/lang';
import { removeUserSession } from '../redux/actions/auth';
import { APP_LOG, checkIsNetConnected, showAlert } from './helperFunctions';
import { getCompleteUrl } from '../config/urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

const t = i18n.t;
let alertShown = false;

export async function getHeaders(): Promise<Record<string, string>> {
  const token: any = await getToken();
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
}

export async function getToken(): Promise<string> {
  return AsyncStorage.getItem('token').then((data: any) => JSON.parse(data));
}
export async function getMultiItem(items: any): Promise<any> {
  return AsyncStorage.multiGet(items).then((data: any) => JSON.parse(data));
}

export async function getItem(key: string): Promise<any> {
  return AsyncStorage.getItem(key).then((data: any) => JSON.parse(data));
}

export async function setToken(data: string): Promise<void> {
  return AsyncStorage.setItem('token', JSON.stringify(data));
}

export async function setMultiItem(items: any): Promise<void> {
  return AsyncStorage.multiSet(items);
}

export async function setItem(key: string, data: object | any): Promise<void> {
  return AsyncStorage.setItem(key, JSON.stringify(data));
}

export async function clearAsyncStore(): Promise<void> {
  return AsyncStorage.clear();
}

export const useHardwareBackPressWith = (onBackPress?: any) => {
  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        if (onBackPress) {
          onBackPress();
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );

      return () => {
        backHandler.remove();
      };
    }, [onBackPress]),
  );
};

interface ApiRequestOptions {
  headers?: Record<string, string>;
  [key: string]: any;
}

export async function apiReq(
  endPoint: string,
  data?: object | FormData, // Accept FormData as well
  method?: string,
  headers?: Record<string, string>,
  requestOptions?: ApiRequestOptions,
): Promise<any> {
  return new Promise(async (res, rej) => {
    const isConnected = await checkIsNetConnected();

    if (!isConnected) {
      return rej({ message: t('PLEASE_CONNECT_INTERNET') });
    }

    const getTokenHeader = await getHeaders();

    // const md5Key: string = stringMd5(
    //   `${urlConfig.ACCESS_TOKEN}${appConfig.CURRENT_TIMESTAMP}`,
    // );
    headers = {
      ...getTokenHeader,
      'Content-Type': 'application/json',
      type: Platform.OS,

      //   accessToken: md5Key,
      //   apiKey: appConfig.CURRENT_TIMESTAMP,
      ...headers,
    };
    let body;
    if (method === 'GET' || method === 'DELETE') {
      requestOptions = {
        params: data,
        headers,
        ...requestOptions,
      };
    } else {
      if (data instanceof FormData) {
        body = data;
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(data);
      }
    }

    if (endPoint == 'login' || endPoint == 'user-check') {
      alertShown = false;
    }

    const url = getCompleteUrl(endPoint);

    const fetchOptions: RequestInit = {
      method,
      headers,
      body,
    };
    APP_LOG(url, '<=:url sending');

    APP_LOG(data, '<=:data sending');
    // APP_LOG(headers, '<=:headers sending');

    fetch(url, fetchOptions)
      .then(async response => {
        const responseData = await response.json();
        APP_LOG(`result: ${endPoint} 👉🥷 👉🥷 👉🥷 👉🥷 👉`, responseData);

        if (
          responseData?.status_code === 401 ||
          responseData?.status === 404 ||
          responseData?.status_code === 402 ||
          responseData?.message === 'Unauthorized.' ||
          responseData?.message ===
            'Your account has been deleted. Please contact the administrator for further details.'
        ) {
          removeUserSession();
          if (!alertShown) {
            showAlert({
              // title: t('YOU_HAVE_BEEN_LOGOUT'),
              message: responseData?.message || t('YOU_HAVE_BEEN_LOGOUT'),
              isNoButton: false,
              yesText: t('OK'),
            });
            alertShown = true;
          }
          return rej(false);
        } else if (!responseData?.status || responseData?.status === 'false') {
          return rej(responseData);
        } else {
          return res(responseData);
        }
      })
      .catch(error => {
        APP_LOG(error, '<===error 🚫💩🚫💩🚫💩🚫💩🚫');

        return rej({ error: t('NETWORK_ERROR'), message: t('NETWORK_ERROR') });
      });
  });
}

export function apiPost(
  endPoint: string,
  data: object | FormData,
  headers = {},
): Promise<any> {
  return apiReq(endPoint, data, 'POST', headers);
}

export function apiDelete(
  endPoint: string,
  data: object | FormData,
  headers = {},
): Promise<any> {
  return apiReq(endPoint, data, 'DELETE', headers);
}

export function apiGet(
  endPoint: string,
  data?: object,
  headers = {},
  requestOptions?: ApiRequestOptions,
): Promise<any> {
  return apiReq(endPoint, data, 'GET', headers, requestOptions);
}

export const apiPut = (
  endPoint: string,
  data: object | FormData,
  headers = {},
): Promise<any> => {
  return apiReq(endPoint, data, 'PUT', headers);
};
