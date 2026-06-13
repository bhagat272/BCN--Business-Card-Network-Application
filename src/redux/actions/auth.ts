import {urlConfig} from '../../config/urls';
import {APP_LOG, DEVICE_INFO} from '../../utils/helperFunctions';
import {apiPost, setItem, setToken} from '../../utils/utils';
import {
  saveIntroScreenStatus,
  saveRememberedData,
  saveSplashStatus,
  saveUserData,
} from '../reducers/auth';
import store from '../store';

const {dispatch} = store;

export function changeIntroScreenStatus(data: boolean) {
  dispatch(saveIntroScreenStatus(data));
}

export function userDataSave(data: object | string | null) {
  dispatch(saveUserData(data));
}

export function onSaveRememberedData(data: object | string | null) {
  dispatch(saveRememberedData(data));
}

export function onSaveSplashStatus(data: boolean) {
  dispatch(saveSplashStatus(data));
}

export function onSaveIntroScreenStatus(data: boolean) {
  setItem('isIntroFinished', data)
    .then(() => {
      changeIntroScreenStatus(data);
    })
    .catch(() => APP_LOG('AsyncStorage error'));
}

export function onSaveUserDataInKeyChain(data: object | string) {
  setItem('userData', data)
    .then(() => {
      userDataSave(data);
    })
    .catch(() => APP_LOG('AsyncStorage error'));
}

export function onSaveRememberedDataInKeyChain(data: object | string) {
  setItem('rememberedData', data)
    .then(() => {
      onSaveRememberedData(data);
    })
    .catch(() => APP_LOG('AsyncStorage error'));
}

export const removeUserSession = async () => {
  try {
    await setItem('userData', null);
    await setToken('');
    userDataSave(null);
  } catch (error) {
    APP_LOG(error);
  }
};

export const removeToken = async () => {
  userDataSave(null);
  await setItem('userData', null);
};

export const removeRememberedData = async () => {
  await setItem('rememberedData', null);
  onSaveRememberedData(null);
};

//LOGIN USER
export function userLogin(data: object, headers?: object) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.LOG_IN, data, headers)
      .then(async (res: any) => {
        resolve(res);
        await setToken(res?.token);
        onSaveUserDataInKeyChain(res?.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//SIGN UP USER
export function userSignUp(data: object, headers?: object) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.SIGN_UP, data, headers)
      .then(async (res: any) => {
        resolve(res);

        await setToken(res?.token);
        onSaveUserDataInKeyChain(res?.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function userVerifyOtp(data: object, headers?: object) {
  return apiPost(urlConfig.VERIFY_OTP, data, headers);
}

export function userCheck(data: object, headers?: object) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.CHECK_USER, data, headers)
      .then(async (res: any) => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
export function onLogout(data: object, headers?: object) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.LOGOUT, data, headers)
      .then(async (res: any) => {
        resolve(res);
        removeUserSession();
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function forgotPassword(data: object, headers?: object) {
  return apiPost(urlConfig.FORGOT_PASSWORD, data, headers);
}

export function resetPassword(data: object, headers?: object) {
  return apiPost(urlConfig.RESET_PASSWORD, data, headers);
}

export function deleteAccount(data: object, headers?: object) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.DELETE_ACCOUNT, data, headers)
      .then(async (res: any) => {
        APP_LOG(res);
        resolve(res);
        if (res?.status) {
          removeUserSession();
        } else {
          reject(res);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function resendOtp(data: object, headers?: object) {
  return apiPost(urlConfig.RESEND_OTP, data, headers);
}

export function changePassword(data: object, headers?: object) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.CHANGE_PASSWORD, data, headers)
      .then(async (res: any) => {
        resolve(res);
        // removeUserSession();
      })
      .catch(error => {
        reject(error);
      });
  });
}
//UPDATE PROFILE API
export function updateProfile(data: object, headers?: object) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.UPDATE_PROFILE, data, headers)
      .then(async (res: any) => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// Retry logic for docImage with max retry limit
export async function retryAdditionalImage(
  data: object,
  headers?: object,
  maxRetries = 5,
) {
  let attempt = 0;

  const attemptRequest = async () => {
    try {
      const response = await updateProfile(data, headers);
      return response; // Success, exit loop
    } catch (error: any) {
      if (error?.status === false || error?.status == 'false') {
        throw new Error(
          error?.message !== '' ? error?.message : 'Invalid image',
        );
      }

      if (attempt >= maxRetries) {
        throw new Error(error);
      }
      attempt++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
      return attemptRequest(); // Retry immediately
    }
  };

  return attemptRequest();
}

//GET USER DATA
export function getUserData(
  data: object,
  headers?: object,
  prevUserData?: object,
) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.GET_PROFILE, data, headers)
      .then(async (res: any) => {
        if (!!res?.data) {
          onSaveUserDataInKeyChain({...prevUserData, ...res?.data});
        }
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
export function getOtherUserData(
  data: {id: string | number},
  headers?: object,
  prevUserData?: object,
) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.OTHER_USER_PROFILE, data, headers)
      .then(async (res: any) => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function sendOtpToEmail(data: object, headers?: object) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.SEND_OTP_EMAIL, data, headers)
      .then(async (res: any) => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function updateDeviceFcmToken(
  data: typeof DEVICE_INFO,
  headers?: object,
) {
  return new Promise((resolve, reject) => {
    apiPost(urlConfig.UPDATE_FCM_TOKEN, data, headers)
      .then(async (res: any) => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
