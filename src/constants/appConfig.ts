import moment, {DurationInputArg1, DurationInputArg2} from 'moment';

export let appConfig = {
  API_DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  CURRENT_TIMESTAMP: moment().format('DD-MM-YYYY HH:MM:SS'),
  APP_DATE_TIME_FORMAT: 'MM/DD/YYYY - hh:mm A',
  APP_DATE_FORMAT: 'MM/DD/YYYY',
  API_TIME_FORMAT: 'hh:mm A',
  API_START_TIME_FORMAT: 'hh:mm',
  API_END_TIME_FORMAT: 'HH:MM',
  APP_CLOCK_FORMATTER: 'A',
  CACHE_CLEAR_TIME: 15 as DurationInputArg1,
  CACHE_CLEAR_TIME_UNIT: 'days' as DurationInputArg2, //  minutes| days | day | minute,
  NAME_TEXT_INPUT_LENGTH: 30,
  MULTI_LINE_TEXT_INPUT_LENGTH: 150,
  PHONE_NUMBER_MAX_LENGTH: 15,
  PASSWORD_MAX_LENGTH:15,
  MINUTES_OF_SLOT_DIFFERENCE: 15, //minutes
  DEFAULT_COUNTRY_CODE_DATA: {
    // name: 'Jamaica',
    // flag: '🇯🇲',
    // code: 'JM',
    // dial_code: '+1',

    name: 'Qatar', 
    flag: '🇶🇦', 
    code: 'QA', 
    dial_code: '+974'

  },
  OTP_TIMER: 120,
};

export function updateAppConfigData(newAppConfig: any) {
  appConfig = {...appConfig, ...newAppConfig};
}
