import {getRemoteConfig} from '@react-native-firebase/remote-config';
import {appConstants} from '../constants/appConstants';
import {i18n, initReactI18next} from '../constants/lang';
import {updateUrlConfigData} from './urls';
import {updateRegxConfig} from '../utils/validations';
import {updateAppConfigData} from '../constants/appConfig';
import {APP_LOG} from '../utils/helperFunctions';
export type Version = {
  version: string;
  maintenance: number;
  force_update: number;
  logout: number;
  link: string;
  maintenance_h2: string;
  maintenance_h1: string;
  alert_title: string;
  alert_msg: string;
  btn_title: string;
  last_force_update: {
    version: string;
    force_update: number;
    logout: number;
    link: string;
  };
};
export let firebaseRemoteConfigData: {
  android_version: Version;
  ios_version: Version;
} = {
  android_version: {
    version: '1.0.0',
    maintenance: 0,
    force_update: 0,
    logout: 0,
    link: 'https://google.com',
    maintenance_h2:
      "Sorry for the inconvenience. We'll be back and running as fast as possible.",
    maintenance_h1: "We're undergoing a bit of Scheduled Maintenance",
    alert_title: 'Update',
    alert_msg: 'application update available',
    btn_title: 'Update',
    last_force_update: {
      version: '1.0.0',
      force_update: 0,
      logout: 0,
      link: 'https://google.com',
    },
  },
  ios_version: {
    version: '1.0.0',
    maintenance: 0,
    force_update: 0,
    logout: 0,
    link: 'https://google.com',
    maintenance_h2: '',
    maintenance_h1: "We're undergoing a bit of Scheduled Maintenance",
    alert_title: 'Update',
    alert_msg: 'application update available',
    btn_title: 'Update',
    last_force_update: {
      version: '1.0.0',
      force_update: 0,
      logout: 0,
      link: 'https://google.com',
    },
  },
};
export const firebaseRemoteFetchData = () => {
  APP_LOG('Firebase Remote Config Fetching Started', appConstants?.IS_LIVE);
  if (!appConstants?.IS_LIVE) return firebaseRemoteConfigData;
  // live ke liye firebaseRemoteConfigData
  return new Promise(async (resolve, reject) => {
    let configSettingSet = await getRemoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: 30000,
    });
    let configFileFetch = await getRemoteConfig().fetchAndActivate();

    let dataSet = await firebaseRemoteDataSet();
    APP_LOG('Firebase Remote Config Fetching Completed', dataSet);
    resolve(dataSet);
  });
};

export const firebaseRemoteDataSet = () => {
  return new Promise(async (resolve, reject) => {
    const parameters = getRemoteConfig().getAll();
    APP_LOG('Firebase Remote Config Parameters:', parameters);
    if (parameters) {
      let dicData = firebaseRemoteConfigData;

      Object.entries(parameters).forEach($ => {
        const [key, entry] = $;
        APP_LOG('Firebase Remote Config Key:', {key, value: entry.asString()});
        if (!!entry.asString()) {
          // let resources: any = {};
          // if (key.includes('language')) {
          //   if (key == 'language_en') {
          //     resources['en'] = {
          //       translation: {...en, ...JSON.parse(entry.asString())},
          //     };
          //   }

          //   i18n.use(initReactI18next).init({
          //     resources,
          //     fallbackLng: 'en',
          //     compatibilityJSON: 'v3',
          //     interpolation: {
          //       escapeValue: false,
          //     },
          //   });
          //   i18n.reloadResources();
          // } else
          if (key === 'url_config') {
            updateUrlConfigData(JSON.parse(entry.asString()));
          } else if (key === 'regx_config') {
            updateRegxConfig(JSON.parse(entry.asString()));
          } else if (key === 'dbqueries_config') {
            // updateDbQueriesConfigData(JSON.parse(entry.asString()));
          } else if (key === 'subscription_config') {
            // updateSubscriptionConfigData(JSON.parse(entry.asString()));
          } else if (key === 'app_config') {
            updateAppConfigData(JSON.parse(entry.asString()));
          } else if (key === 'ios_version') {
            let data = JSON.parse(entry.asString());
            dicData.ios_version = {
              ...dicData.ios_version,
              ...data,
            };
          } else if (key === 'android_version') {
            let data = JSON.parse(entry.asString());
            dicData.android_version = {
              ...dicData.android_version,
              ...data,
            };
          }
        }
      });

      firebaseRemoteConfigData = {
        ...firebaseRemoteConfigData,
        ...dicData,
      };

      // Helper.FIREBASE_IMAGE_URL = dicData?.url?.media_url
      //   ? dicData?.url?.media_url
      //   : IMAGE_URL;

      resolve(firebaseRemoteConfigData);
    } else {
      resolve(false);
    }
  });
};
