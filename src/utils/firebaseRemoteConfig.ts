import {getRemoteConfig} from '@react-native-firebase/remote-config';
import {updateUrlConfigData} from '../config/urls';
import {i18n, initReactI18next} from '../constants/lang';
import en from '../constants/lang/en.json';
import {updateRegxConfig} from './validations';
// import {updateSubscriptionConfigData} from '../constants/subscriptionConfig';
import {firebaseRemoteConfigData} from '../config/firebaseRemoteConfigData';
import {updateAppConfigData} from '../constants/appConfig';
import {APP_LOG} from './helperFunctions';

export const firebaseRemoteDataSet = async () => {
  await getRemoteConfig().fetch(10);

  await getRemoteConfig().fetchAndActivate();
  const parameters = getRemoteConfig().getAll();
  Object.entries(parameters).forEach($ => {
    const [key, entry] = $;

    if (!!entry.asString()) {
      let resources: any = {};
      if (key.includes('language')) {
        if (key == 'language_en') {
          resources['en'] = {
            translation: {...en, ...JSON.parse(entry.asString())},
          };
        }

        i18n.use(initReactI18next).init({
          resources,
          fallbackLng: 'en',
          compatibilityJSON: 'v3',
          interpolation: {
            escapeValue: false,
          },
        });
        i18n.reloadResources();
      } else if (key === 'url_config') {
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
        firebaseRemoteConfigData.ios_version = {
          ...firebaseRemoteConfigData.ios_version,
          ...data,
        };
      } else if (key === 'android_version') {
        let data = JSON.parse(entry.asString());
        firebaseRemoteConfigData.android_version = {
          ...firebaseRemoteConfigData.android_version,
          ...data,
        };
      }
    }
  });
};
