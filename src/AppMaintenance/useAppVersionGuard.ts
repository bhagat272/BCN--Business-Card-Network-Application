import {useCallback, useRef, useState} from 'react';
import {Alert, AlertButton, Linking, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import semverCoerce from 'semver/functions/coerce';
import semverLt from 'semver/functions/lt';
import {onLogout} from '../redux/actions/auth';
import {APP_LOG, DEVICE_INFO} from '../utils/helperFunctions';
import {firebaseRemoteFetchData} from '../config/firebaseRemoteConfigData';
import {apiGet, apiPost} from '../utils/utils';
import {urlConfig} from '../config/urls';

let alertVisible = false;

interface ForceUpdateInfo {
  version: string;
  force_update: number;
  logout?: number;
  link: string;
}

interface VersionConfig {
  version: string;
  maintenance: number;
  force_update: number;
  link: string;
  alert_title: string;
  alert_msg: string;
  maintenance_h1: string;
  btn_title?: string;
  maintenance_h2: string;
  logout?: number;
  last_force_update?: ForceUpdateInfo;
}

export const useAppVersionGuard = () => {
  const [showMaintenance, setShowMaintenance] = useState(false);
  const currentVersion = useRef(DeviceInfo.getVersion());

  // Normalize version strings to ensure consistent comparison
  const normalizeVersion = (version?: string): string => {
    if (!version) return '0.0.0';

    const coerced = semverCoerce(version);
    return coerced?.version ?? '0.0.0';
  };

  /* ------------------------------ Alerts ------------------------------ */

  const showAlert = (
    title: string,
    message: string,
    confirmOnly: boolean,
    onConfirm: () => void,
  ) => {
    if (alertVisible) return;
    alertVisible = true;

    const buttons: AlertButton[] = [
      {
        text: 'OK',
        onPress: () => {
          alertVisible = false;
          onConfirm();
        },
      },
    ];

    if (!confirmOnly) {
      buttons.push({
        text: 'Cancel',
        style: 'cancel', // ✅ now correctly typed
        onPress: () => {
          alertVisible = false;
        },
      });
    }

    Alert.alert(title, message, buttons, {cancelable: false});
  };

  /* ------------------------ Version Validation ------------------------ */

  const validateVersion = useCallback((config: VersionConfig) => {
    setShowMaintenance(config.maintenance === 1);

    const appVersion = normalizeVersion(currentVersion.current);

    const lastForce = config.last_force_update;

    const needsLastForceUpdate =
      lastForce &&
      semverLt(appVersion, normalizeVersion(lastForce.version)) &&
      lastForce.force_update === 1;

    const needsUpdate = semverLt(appVersion, normalizeVersion(config.version));

    APP_LOG('Version Check:', {
      appVersion,
      configVersion: config.version,
      needsUpdate,
      needsLastForceUpdate,
      config,
    });

    if (needsLastForceUpdate || (needsUpdate && config.force_update === 1)) {
      showAlert(config.alert_title, config.alert_msg, true, () => {
        if (lastForce?.logout === 1) {
          onLogout({...DEVICE_INFO});
        }
        Linking.openURL(lastForce?.link || config.link).catch(console.error);
      });
      return;
    }

    if (needsUpdate) {
      showAlert(config.alert_title, config.alert_msg, false, () => {
        if (config.logout === 1) {
          onLogout({...DEVICE_INFO});
        }
        Linking.openURL(config.link).catch(console.error);
      });
    }
  }, []);

  /* ------------------------ Firebase Check ---------------------------- */

  const checkFirebaseConfig = useCallback(async () => {
    const config: any = await firebaseRemoteFetchData();
    APP_LOG('Firebase Version Check Config', config);
    if (!config) return;

    const platformConfig =
      Platform.OS === 'ios' ? config?.ios_version : config?.android_version;

    // validateVersion(platformConfig);
    return platformConfig;
  }, [validateVersion]);

  /* ------------------------ API Check -------------------------------- */

  const checkApiConfig = useCallback(async () => {
    const res = await fetch(urlConfig.BASE_URL + 'api/app-setting', {
      method: 'GET',
    });
    const response = await res.json();
    APP_LOG('API Version Check Response', {
      response,
      url: urlConfig.BASE_URL + 'api/app-setting',
    });
    if (!response?.status || !response?.data) return;
    const isAndroid = Platform.OS === 'android';
    const data = response.data;

    const config: VersionConfig = {
      version: isAndroid ? data.android_version : data.ios_version,
      maintenance: isAndroid ? data.android_maintenance : data.ios_maintenance,
      force_update: isAndroid
        ? data.android_force_update
        : data.ios_force_update,
      link: isAndroid ? data.android_app_link : data.ios_app_link,
      alert_title: 'Update',
      alert_msg: isAndroid ? data.android_message : data.ios_message,
      maintenance_h1:
        data?.maintenance_h1 ||
        "We're undergoing a bit of Scheduled Maintenance",
      maintenance_h2:
        data?.maintenance_h2 ||
        "Sorry for the inconvenience. We'll be back and running as fast as possible.",
      logout: 0,
      last_force_update: isAndroid
        ? data.android_last_force_update
        : data.ios_last_force_update,
      // btn_title: isAndroid ? data.android_btn_title : data.ios_btn_title,
    };

    // validateVersion(config);
    return config;
  }, [validateVersion]);

  const mergeConfigs = (
    firebaseConfig?: VersionConfig,
    apiConfig?: VersionConfig,
  ): VersionConfig | null => {
    if (!firebaseConfig && !apiConfig) return null;

    // default empty config
    const base = firebaseConfig || apiConfig!;

    return {
      ...base,

      // 🔥 Priority rules
      maintenance:
        firebaseConfig?.maintenance === 1 || apiConfig?.maintenance === 1
          ? 1
          : 0,

      force_update:
        firebaseConfig?.force_update === 1 || apiConfig?.force_update === 1
          ? 1
          : 0,

      // Prefer higher version (safer)
      version: semverLt(
        normalizeVersion(firebaseConfig?.version),
        normalizeVersion(apiConfig?.version),
      )
        ? apiConfig!.version
        : firebaseConfig?.version ?? apiConfig!.version,

      // Prefer Firebase last_force_update (instant control)
      last_force_update:
        firebaseConfig?.last_force_update || apiConfig?.last_force_update,
    };
  };

  const checkVersion = useCallback(async () => {
    const firebaseConfig = await checkFirebaseConfig();
    const apiConfig = await checkApiConfig();

    const merged = mergeConfigs(firebaseConfig, apiConfig);

    if (merged) {
      validateVersion(merged);
    }
  }, [checkFirebaseConfig, checkApiConfig, validateVersion]);

  return {
    showMaintenance,
    checkVersion,
  };
};
