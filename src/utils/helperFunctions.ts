import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import { Alert, Platform, ToastAndroid } from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import { Image } from 'react-native-compressor';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';

import Share from 'react-native-share';
import { i18n } from '../constants/lang';

export let fileSystem = RNFetchBlob.fs;
export let cameraMediaPath = fileSystem.dirs.CacheDir;

const t = i18n.t;

interface AlertOptions {
  title?: string;
  message?: string;
  yesText?: string;
  noText?: string;
  onYes?: () => void;
  onNo?: () => void;
  buttons?: ButtonConfig[];
  isNoButton?: boolean;
}
export interface LocationObject {
  latitude: number;
  longitude: number;
}

interface ButtonConfig {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

const isIos = Platform.OS === 'ios' ? true : false;
const isTablet = DeviceInfo.isTablet();
const mediaGlobalPath = isIos ? `` : 'file://';

const showAlert = ({
  title = '',
  message = '',
  yesText = t('YES'),
  noText = t('NO'),
  onYes = () => {},
  onNo = () => {},
  buttons = [],
  isNoButton = true,
}: AlertOptions): void => {
  const defaultButtons: ButtonConfig[] = [{ text: yesText, onPress: onYes }];

  if (isNoButton) {
    defaultButtons.unshift({ text: noText, onPress: onNo, style: 'cancel' });
  }

  const alertButtons = [...defaultButtons, ...buttons].map(button => ({
    text: button.text,
    onPress: button.onPress,
    style: button.style || 'default',
  }));

  Alert.alert(title, message, alertButtons, { cancelable: false });
};

const notifyMessage = (msg: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert(msg);
  }
};

const showError = (message: string) => {
  Toast.show({
    type: 'error',
    text1: message,
    autoHide: true,
    swipeable: false,
    visibilityTime: 3000,
  });
};

const showSuccess = (message: string) => {
  Toast.show({
    type: 'success',
    text1: message,
    autoHide: true,
    swipeable: false,
    visibilityTime: 3000,
  });
};
const showInfo = (message: string) => {
  Toast.show({
    type: 'info',
    text1: message,
    autoHide: true,
    swipeable: false,
    visibilityTime: 3000,
  });
};

const checkIsNetConnected = async () => {
  try {
    const info = await NetInfo.fetch();
    return info.isConnected;
  } catch (error) {
    APP_LOG('Error checking network status:', error);
    return false;
  }
};
const errorMethod = async (error: any) => {
  APP_LOG('error== in method', error);

  if (!!error) {
    try {
      showError(error?.message || error?.error || error);
    } catch (errr) {
      showError(error?.message || error?.error || error);
    }
  }
};

const APP_LOG = (message?: any, ...optionalParams: any[]) => {
  if (__DEV__) {
    console.log(message, ...optionalParams);
  }
};

export let DEVICE_INFO = {
  device_id: DeviceInfo.getDeviceId(),
  device_type: String(Platform.OS).toUpperCase(),
  device_uniqueid: DeviceInfo.getUniqueIdSync(),
  version_name: DeviceInfo.getVersion(),
  device_token: 'bcn_access_token',
};

export const methodExtension = (url: string = '') => {
  return '.' + url?.split('.').pop();
};

export const getMediaNameFromUrl = (url: string) => {
  let urlNew: any = String(url)?.replace(/ /g, '');

  return urlNew?.split('/').pop().split('.', 1).pop();
};

const configureRNFetchBlob = (url: string = '', method: any = 'GET') => {
  let extension = methodExtension(url);
  let path = getMediaNameFromUrl(url);

  let options = {
    fileCache: true,
    path: `${fileSystem.dirs.DocumentDir}/snaphatch/${path}${
      extension || '.jpg'
    }`,
    appendExt: extension || 'jpg',
  };

  return new Promise(async (resolve, reject) => {
    await RNFetchBlob.config(options)
      .fetch(method, url)
      .then(resolve)
      .catch(reject);
  });
};

// Check end date is smaller than to the current date
const endDateSmallerThanCurrentDate = (targetDate: any) => {
  const endDate = moment(targetDate);
  const currentDate = moment();
  const result = endDate.isBefore(currentDate);
  return result;
};

const getMediaNameFromPath = (path: string = '') => {
  let mediaNameWithExtension: string | undefined = !!path
    ? path.split('/').pop()
    : '';
  let mediaName = !!mediaNameWithExtension
    ? mediaNameWithExtension.split('.').slice(0, -1).join('.')
    : '';
  return mediaName;
};

const formatMediaDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.round(duration % 60);
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedMinutes}.${formattedSeconds}`;
};

const compressMedia = async (
  path: string,
  type: 'Image' | 'Video' = 'Image',
): Promise<string> => {
  try {
    const compressedPath = await Image.compress(path, {
      quality: 1,
    });
    return compressedPath;
  } catch (error) {
    APP_LOG(`${type} Compression failed:`, error);
    return path;
  }
};

const calculateWeight = (weight: number) => {
  // const pounds = Math.floor(weight);

  // // Extract ounces by converting the fractional part
  // const ounces = Math.round((weight - pounds) * 16);

  // return `${pounds} lb ${ounces} oz`;
  // const pounds = Math.floor(weight);

  // Extract ounces by converting the fractional part
  // const ounces = Math.round((weight - pounds) * 16);

  return `${weight} ${t('LBS')}`;
};

const getSelectedInterests = (userData: any, availableInterests: any) => {
  let selectedIdOfInterests: number[] = [];
  userData?.userinterest?.forEach((itm: any, indx: number) => {
    if (
      availableInterests.some(
        (element: any) => element?.id === itm?.interest_id,
      )
    ) {
      selectedIdOfInterests.push(itm?.interest_id);
    }
  });
  return selectedIdOfInterests;
};

const convertImageToBase64 = async (imagePath: string) => {
  try {
    const base64String = await RNFS.readFile(imagePath, 'base64');
    return base64String;
  } catch (error) {}
};

// const callVisionApi = async (
//   imagePath: string,
// ): Promise<{labels?: any[]; showingData: string[]} | {error: string}> => {
//   return new Promise(async (res, rej) => {
//     try {
//       // Read the image as base64 (example with react-native-fs)
//       const base64String = await convertImageToBase64(imagePath); // You need to define this function

//       // Prepare the request body for the API
//       const requestBody = {
//         requests: [
//           {
//             image: {
//               content: base64String,
//             },
//             features: [
//               // {
//               //   type: 'LABEL_DETECTION',
//               //   maxResults: 10,
//               // },
//               {
//                 type: 'DOCUMENT_TEXT_DETECTION',
//                 maxResults: 1,
//               },
//             ],
//           },
//         ],
//       };

//       // Google Vision API URL
//       const url = 'https://vision.googleapis.com/v1/images:annotate';
//       const apiKey = VISION_API_KEY; // Set your API key here

//       // Make the POST request using fetch
//       const response = await fetch(`${url}?key=${apiKey}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody), // Convert request body to JSON
//       });

//       // Parse the response
//       const data = await response.json();

//       APP_LOG('callVisionApi===response', data);

//       // APP_LOG('callVisionApi===data', data);

//       if (response.ok) {
//         // Successfully got response from the Vision API
//         // let labels: any[] = [];
//         // if (data.responses && data.responses[0].labelAnnotations) {
//         //   labels = data.responses[0].labelAnnotations;
//         // }

//         const text = data.responses[0].fullTextAnnotation
//           ? data.responses[0].fullTextAnnotation.text
//           : '';

//         // You can call the function to parse the business card text here
//         const structuredData = parseBusinessCardText(text);

//         // return res({labels, showingData: text.match(/[^\r\n]+/g) ?? []}); // Return or process labels as needed
//         return res({showingData: text.match(/[^\r\n]+/g) ?? []}); // Return or process labels as needed
//       } else {
//         // Handle errors from the Vision API response
//         // console.error('Google Vision API Error:', data);
//         return rej({error: `Error: ${data.error.message}`});
//       }
//     } catch (error) {
//       return rej({
//         error: error instanceof Error ? error.message : 'Unknown error',
//       });
//       // return { error: `Error calling Google Vision API: ${error.message}` };
//     }
//   });
// };

function extractContactInfo(dynamicText: string[]) {
  const lines = dynamicText.map((line: string) => line.trim());
  const result = {
    COMPANY_NAME: '',
    NAME: '',
    DESIGNATION: '',
    EMAIL: '',
    PHONE_NUMBER: '',
    website: '',
  };

  // Regular expressions for matching patterns
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(\+\d{1,3}\s?)?(\d{1,4}[\s-]?){2,4}\d{1,4}/;
  const websiteRegex = /(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/\S*)?/;
  const nameRegex = /^[A-Z][a-z]+\s+[A-Z][a-z]+$/; // Basic two-word name pattern
  const designationRegex =
    /(director|manager|ceo|cto|cfo|president|vp|head|lead)/i;
  const companyRegex = /(company|corp|corporation|inc|llc|ltd|group)$/i; // Common company suffixes

  let prevLine = '';

  lines.forEach((line: string, index: number) => {
    // Skip empty lines
    if (!line) return;

    // Check for email
    if (emailRegex.test(line)) {
      result.EMAIL = line;
      return;
    }

    // Check for phone
    if (phoneRegex.test(line) && !emailRegex.test(line)) {
      if (!websiteRegex.test(line)) {
        result.PHONE_NUMBER = line;
      }
      return;
    }

    // Check for website
    if (websiteRegex.test(line) && !result.website && !emailRegex.test(line)) {
      result.website = line;
      return;
    }

    // Check for name and designation
    if (nameRegex.test(line) && !result.NAME) {
      result.NAME = line;
      if (index + 1 < lines.length && designationRegex.test(lines[index + 1])) {
        result.DESIGNATION = lines[index + 1];
      }
      return;
    }

    // Check for designation if it appears before name
    if (designationRegex.test(line) && !result.DESIGNATION && !result.NAME) {
      result.DESIGNATION = line;
      if (prevLine && nameRegex.test(prevLine)) {
        result.NAME = prevLine;
      }
      return;
    }

    // Check for company name (if not already set and not matching other patterns)
    if (
      !result.COMPANY_NAME &&
      !emailRegex.test(line) &&
      !phoneRegex.test(line) &&
      !websiteRegex.test(line) &&
      !nameRegex.test(line) &&
      !designationRegex.test(line)
    ) {
      // Look for company-like patterns or use as fallback if it seems like a header
      if (
        companyRegex.test(line) ||
        (index === 0 && line.toUpperCase() === line)
      ) {
        result.COMPANY_NAME = line;
      }
    }

    prevLine = line;
  });

  return result;
}

const parseBusinessCardText = (text: any) => {
  const structuredData: { [key: string]: any } = {};
  // Implement logic to parse the text and extract data like name, phone, etc.
  // Example:
  const nameRegex = /([A-Z][a-z]+ [A-Z][a-z]+)/;
  const phoneRegex = /\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{7,15}/;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const addressRegex = /\d+\s[A-Za-z0-9\s]+,\s[A-Za-z\s]+/;

  // Example of extracting name, phone, and other details from text
  const nameMatch = text.match(nameRegex);
  if (nameMatch) {
    structuredData.name = nameMatch[0];
  }

  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    structuredData.phone = phoneMatch[0];
  }

  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    structuredData.email = emailMatch[0];
  }

  const addressMatch = text.match(addressRegex);
  if (addressMatch) {
    structuredData.address = addressMatch[0];
  }

  return structuredData;
};

// const fetchIndustryDetails = async (data: string) => {
//   // const apiKey = 'AIzaSyAAf6-7682tIY_BBtZjdlHrj02A1hLoKj8';
//   const apiKey = GOOGLE_GEMINI_KEY;

//   // const requestBody = {
//   //   contents: [
//   //     {
//   //       parts: [
//   //         {
//   //           // text: `this the company name:-  ${company_name}, give me the industry type of this company name,give me the result in 3 words`,
//   //           text: `this is my data:-  ${data}, give me the industry type and company name from this data ,give me the result in 3 words`,
//   //         },
//   //       ],
//   //     },
//   //   ],
//   // };
//   const requestBody = {
//     contents: [
//       {
//         parts: [
//           {
//             // text: `this the company name:-  ${company_name}, give me the industry type of this company name,give me the result in 3 words`,
//             text: `this is my data:-  ${data}, give me the industry type from this data ,give me the result If you are confident, return them as JSON like this:
//               {
//                 "status": true,
//                 "industry": "<industry type>"
//               }

//               If the information is not sufficient or unclear, return:
//               {
//                 "status": false,
//                 "industry": null
//               }`.trim(),
//           },
//         ],
//       },
//     ],
//   };

//   //   const requestBody = {
//   //     contents: [
//   //       {
//   //         parts: [
//   //           {
//   //             text: `
//   // You are a data extraction assistant.

//   // From the following text, extract:
//   // 1. The company name
//   // 2. The industry type (try to infer if not explicitly stated)

//   // Return only valid JSON in this exact structure:

//   // {
//   //   "status": true,
//   //   "company_name": "<company name>",
//   //   "industry": "<industry type>"
//   // }

//   // If you cannot confidently identify them, return:

//   // {
//   //   "status": false,
//   //   "company_name": null,
//   //   "industry": null
//   // }

//   // Input data:
//   // ${data}
//   //           `.trim(),
//   //           },
//   //         ],
//   //       },
//   //     ],
//   //   };

//   return new Promise(async (res, rej) => {
//     fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       },
//     )
//       .then(async response => {
//         const statusCode = response.status;
//         const success = response.ok;
//         const responseData = await response.json();

//         const rawText =
//           responseData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

//         // const text =
//         //   responseData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

//         const cleaned = rawText
//           .replace(/```json/i, '')
//           .replace(/```/g, '')
//           .trim();

//         // 3️⃣ Try parsing the cleaned text as JSON
//         let parsed;
//         try {
//           parsed = JSON.parse(cleaned);
//         } catch (err) {
//           parsed = {status: false, rawText: cleaned};
//         }

//         APP_LOG('fetchIndustryDetails===text', {
//           responseData,
//           statusCode,
//           success,
//           parsed,
//         });

//         // const errorPhrases = [
//         //   'data insufficient',
//         //   'cannot provide',
//         //   'please provide',
//         //   'need the text',
//         //   'i need the text',
//         //   'no data',
//         //   'sorry',
//         //   'error',
//         //   'need more information',
//         //   'need more data',
//         //   'insufficient data',
//         //   'insufficient information',
//         //   'cannot process',
//         //   'cannot identify',
//         //   'cannot determine',
//         //   'cannot extract',
//         //   'cannot find',
//         //   'unable to provide',
//         //   "doesn't provide",
//         //   "doesn't have enough information",
//         //   "doesn't have enough data",
//         //   "doesn't have sufficient information",
//         //   "doesn't have sufficient data",
//         //   'unable to process',
//         //   'not able to process',
//         //   'not able to identify',
//         //   'do not have enough information',
//         //   'do not have enough data',
//         //   'do not have sufficient information',
//         //   'do not have sufficient data',
//         //   'unable to extract',
//         //   'unable to find',
//         //   'cannot extract',
//         //   'cannot find',
//         //   'not able to extract',
//         //   'not able to find',
//         //   'not sure',
//         //   'not certain',
//         //   'not clear',
//         //   'cannot say',
//         //   'cannot tell',
//         //   'unable to say',
//         //   'unable to tell',
//         //   'not able to say',
//         //   'not able to tell',
//         //   'not able to determine',
//         //   'not able to identify',
//         //   'not sure about it',
//         //   'not certain about it',
//         //   'not clear about it',
//         //   'cannot say about it',
//         //   'cannot tell about it',
//         //   'unable to say about it',
//         //   'unable to tell about it',
//         //   'not able to say about it',
//         //   'not able to tell about it',
//         //   'not able to determine about it',
//         //   'not able to identify about it',
//         //   'no information available',
//         //   'no data available',
//         //   'insufficient information',
//         //   'unknown',
//         //   'insufficient data',
//         //   'not enough information',
//         //   'unable to determine',
//         //   'cannot determine',
//         //   "don't have enough information",
//         //   'lack of information',
//         //   'not sufficient information',
//         //   'not enough data',
//         //   'unable to identify',
//         //   'cannot identify',
//         //   "don't have enough data",
//         //   'lack of data',
//         //   'not sufficient data',
//         //   'cannot process the request',
//         //   'unable to process the request',
//         //   'not able to process the request',
//         //   'cannot fulfill the request',
//         //   'unable to fulfill the request',
//         //   'not able to fulfill the request',
//         //   'cannot complete the request',
//         //   'unable to complete the request',
//         //   'not able to complete the request',
//         //   'cannot provide the information',
//         //   'unable to provide the information',
//         //   'not able to provide the information',
//         //   'cannot give the information',
//         //   'unable to give the information',
//         //   'not able to give the information',
//         //   'cannot supply the information',
//         //   'unable to supply the information',
//         //   'not able to supply the information',
//         //   'cannot offer the information',
//         //   'unable to offer the information',
//         //   'not able to offer the information',
//         //   'cannot share the information',
//         //   "don't have info",
//         // ];

//         // const isError =
//         //   !text ||
//         //   errorPhrases.some(phrase => text.toLowerCase().includes(phrase));

//         if (!parsed?.status || !parsed?.industry) {
//           return rej({
//             status: false,
//             message: 'Insufficient data to identify service',
//           });
//         } else {
//           return res({data: parsed?.industry || ''});
//         }
//         // return res({data: responseData?.candidates[0]?.content?.parts});
//       })
//       .catch(error => {
//         APP_LOG(error, '<===error 🚫💩🚫💩🚫💩🚫💩🚫');

//         return rej({error: t('NETWORK_ERROR'), message: t('NETWORK_ERROR')});
//       });
//   });
// };

// const extractBusinessCardDetails = async (imageUri: string) => {
//   try {
//     const base64String = await convertImageToBase64(imageUri);
//     const apiKey = GOOGLE_GEMINI_KEY;

//     const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

//     const prompt = `
//         You are an information extraction engine.

//         Analyze the attached business card image and extract ONLY the following fields in a clean JSON format:

//         {
//           "name": "",
//           "email": "",
//           "phone": "",
//           "country_code": "",
//           "company_name": "",
//           "service_name": "",
//           "designation": "",
//           "address": "",
//           "website": "",

//         }

//         ### Formatting Rules:
//         - Extract only factual data shown on the card.
//         - "phone" must contain **only the local number digits**, even if a country code is shown.
//         - "country_code" must contain only the code (like "+91", "+1") if it appears; otherwise keep it empty.
//         - "email" should be exact and lowercase.
//         - Leave missing fields as empty strings.
//         - Never include explanations or extra text — output only a pure JSON object.

//         Example:
//         If the card shows "+91 9876543210", output:
//         {
//           "phone": "9876543210",
//           "country_code": "+91"
//         }
//         Example (output exactly like this):
//         {
//           "name": "John Doe",
//           "email": "john@acme.com",
//           "phone": "9876543210",
//           "country_code": "+91",
//           "company_name": "Acme Pvt Ltd",
//           "service_name": "Software Development",
//           "designation": "CTO"
//           "address": "123, Business St, Metropolis",
//           "website": "www.acme.com"
//         }
//         Review the image carefully to ensure accuracy.
//         Respond ONLY with valid JSON. Do not include markdown formatting, code blocks, or explanations.
//       `;

//     const requestBody = {
//       contents: [
//         {
//           parts: [
//             {text: prompt},
//             {
//               inline_data: {
//                 mime_type: 'image/jpeg',
//                 data: base64String,
//               },
//             },
//           ],
//         },
//       ],
//     };

//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify(requestBody),
//     });

//     const data = await response.json();
//     APP_LOG('Gemini API response:', data);

//     let outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
//     outputText = outputText.trim();

//     outputText = outputText
//       .replace(/^```json/i, '') // remove starting ```json
//       .replace(/^```/, '') // remove starting ```
//       .replace(/```$/, '') // remove ending ```
//       .trim();

//     let result: {
//       name?: string;
//       email?: string;
//       phone?: string;
//       country_code?: string;
//       company_name?: string;
//       service_name?: string;
//       designation?: string;
//       address?: string;
//       website?: string;
//       raw_text?: string;
//     } = {};

//     try {
//       result = JSON.parse(outputText);

//       // 🧽 Post-cleaning: sanitize phone and country code
//       if (result?.phone) {
//         // remove spaces, dashes, parentheses
//         result.phone = result.phone.replace(/[\s\-\(\)]/g, '');
//       }

//       if (result?.country_code) {
//         // normalize country code (ensure + at start if numeric)
//         result.country_code = result.country_code.trim();
//         if (/^\d+$/.test(result.country_code)) {
//           result.country_code = '+' + result.country_code;
//         }
//       }
//     } catch (err) {
//       APP_LOG('Gemini output parsing failed:', err, outputText);
//       result = {raw_text: outputText};
//     }

//     APP_LOG('Extracted business card data:', result);
//   } catch (error: any) {
//     APP_LOG('Gemini API error:', error);
//     return {error: error.message || 'Unknown error'};
//   }
// };

const getYearlyDiscount = (plans: any[]) => {
  const monthlyPrice = Number(plans[0].inAppStore?.price || plans[0]?.price);
  const yearlyPrice = Number(plans[1].inAppStore?.price || plans[1]?.price);

  const yearlyEquivalent = monthlyPrice * 12;
  const savings = yearlyEquivalent - yearlyPrice;
  const savingsPercent = Math.round((savings / yearlyEquivalent) * 100); // ≈ 16%

  APP_LOG('Yearly discount calculated:', {
    monthlyPrice,
    yearlyPrice,
    yearlyEquivalent,
    savings,
    savingsPercent,
  });
  return savingsPercent;
};
const methodConvertFileAsBase64 = (uri: string) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = function () {
      reject(new Error('Could not convert file to base64'));
    };
    xhr.open('GET', uri);
    xhr.responseType = 'blob';
    xhr.send();
  });
};
const onShare = async (referralCode: string | null) => {
  try {
    // Use your actual app store links here:
    const AppleAppId = 12334444;
    const appLink = isIos
      ? `https://apps.apple.com/app/id${AppleAppId}`
      : 'https://play.google.com/store/apps/details?id=com.bcnapp';

    const message = referralCode
      ? `Hey! Check out this awesome app.\nDownload here: ${appLink}\n\nUse my referral code: ${referralCode}`
      : `Hey! Check out this awesome app.\nDownload here: ${appLink}`;

    const shareOptions = {
      title: 'Install My App',
      message,
    };

    await Share.open(shareOptions);
  } catch (error) {
    APP_LOG('Share error:', error);
  }
};
export {
  APP_LOG,
  calculateWeight,
  // callVisionApi,
  checkIsNetConnected,
  compressMedia,
  configureRNFetchBlob,
  convertImageToBase64,
  endDateSmallerThanCurrentDate,
  errorMethod,
  // extractBusinessCardDetails,
  extractContactInfo,
  // fetchIndustryDetails,
  formatMediaDuration,
  getMediaNameFromPath,
  getSelectedInterests,
  getYearlyDiscount,
  isIos,
  isTablet,
  mediaGlobalPath,
  methodConvertFileAsBase64,
  notifyMessage,
  onShare,
  showAlert,
  showError,
  showInfo,
  showSuccess,
};
