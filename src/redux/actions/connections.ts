import {urlConfig} from '../../config/urls';
import {apiPost} from '../../utils/utils';
import {saveConnectionRefresh} from '../reducers/settings';
import store from '../store';

const {dispatch} = store;

export function changeConnectionRefresh(data: boolean) {
  dispatch(saveConnectionRefresh(data));
}

export function respondConnectionRequest(
  data: {
    type: 'accept' | 'reject';
    other_user_uuid: string;
  },
  headers?: object,
) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.RESPOND_CONNECTION_REQUEST, data, headers)
      .then(async (res: any) => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
export function sendConnectionRequest(
  data: {
    other_user_uuid: string;
  },
  headers?: object,
) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.SEND_CONNECTION_REQUEST, data, headers)
      .then(async (res: any) => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
export function getConnectionRequest(data: object = {}, headers?: object) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.GET_CONNECTION_REQUEST, data, headers)
      .then(async (res: any) => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
export function getConnectionList(data: object = {}, headers?: object) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.GET_CONNECTION_LIST, data, headers)
      .then(async (res: any) => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
export function getAllUsers(data: object = {}, headers?: object) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.GET_ALL_USERS, data, headers)
      .then(async (res: any) => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function disconnect(data: object = {}, headers?: object) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.DISCONNECT, data, headers)
      .then(async (res: any) => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function getUserDetails(
  data: {
    uuid: string;
  },
  headers?: object,
) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.GET_USER_DETAILS, data, headers)
      .then(async (res: any) => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
