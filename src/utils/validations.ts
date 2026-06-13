import {i18n} from '../constants/lang';
const t = i18n.t;

export let regx = {
  // email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/,
  // email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,10}$/,
  // email: /^(?!.*\.\.)[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,10}$/,
  // email:
  //   /^(?!.*\.\.)([a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*)\.[a-zA-Z]{2,10}$/, // Previous
  email:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*\.){1,3}[A-Za-z]{2,10}$/,
  // name: /^(?! )[a-zA-Z]+(?: [a-zA-Z]+)* ?$/, // Previous
  name: /^(?! )[^\s].*$/,
  // title: /^(?! )[a-zA-Z]+(?: [a-zA-Z]+)* ?$/,
  title: /^(?! )[^\s].*$/,
  value: /^(?! )[a-zA-Z]+(?: [a-zA-Z]+)* ?$/,
  modalDescription: /^(?! )[a-zA-Z]+(?: [a-zA-Z]+)* ?$/,
  service: /^(?! )[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/,
  designation: /^(?! )[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/,
  companyName: /^(?! )[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/,
  // description: /^(?! )[a-zA-Z]+(?: [a-zA-Z]+)* ?$/,
  description: /^(?! )[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/,
  // password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=])[^\s]+$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?]).{8,15}$/,
  phoneNumber: /^[0-9]{8,15}$/,
  hasSpace: /\s/,
  spaceValidation: /^[^\s](?!\s)[\s\S]*[^\s](?<!\s\s)$/,
  message: '',
  withoutEmoji:
    /^[a-zA-Z0-9#_+\=\[\]\{\}\/`~<>;,.?*"”'’,?*()!@#$%^&:£€•:"-|\|]+( [a-zA-Z0-9#_+\=\[\]\{\}\/`~<>;,.?*"'’,?*()!@#$%^&:£€•:"-|\|]+)*$/,
  numericRegex: /^[0-9]+$/,
  numericWithDotRegex: /^[0-9.]+$/,
};

export function updateRegxConfig(newRegxConfig: any) {
  regx = {...regx, ...newRegxConfig};
}

export default function (data?: any) {
  const {
    name,
    service,
    designation,
    title,
    email,
    value,
    modalDescription,
    companyName,
    password,
    phoneNumber,
    confirmPassword,
    newPassword,
    confirmNewPassword,
    isAcceptTerms,
    otp,
    oldPassword,
    catchLogImg,
    description,
    selectedDate,
    locationText,
    fishSpecies,
    flyUsed,
    waterBody,
    selectedParish,
  } = data;
  if (name !== undefined && name.length == 0) {
    return t('NAME_EMPTY');
  }
  if (name !== undefined && (name.length < 3 || name.length > 30)) {
    return t('NAME_LENGTH');
  }
  if (name !== undefined && !regx.name.test(name)) {
    return t('FULL_NAME_VALID');
  }

  if (modalDescription !== undefined && modalDescription.length == 0) {
    return t('MODAL_DESC_EMPTY');
  }
  // if (modalDescription !== undefined && (modalDescription.length < 3 || modalDescription.length > 100)) {
  //   return t('MODAL_DESC_LENGTH');
  // }
  // if (modalDescription !== undefined && !regx.modalDescription.test(modalDescription)) {
  //   return t('FULL_MODAL_DESC_VALID');
  // }

  //service

  if (service !== undefined && service.length == 0) {
    return t('SERVICE_EMPTY');
  }
  // if (service !== undefined && (service.length < 2 || service.length > 30)) {
  //   return t('SERVICE_LENGTH');
  // }
  // if (service !== undefined && !regx.service.test(service)) {
  //   return t('FULL_SERVICE_VALID');
  // }

  //designation
  if (designation !== undefined && designation.length == 0) {
    return t('DESIGNATION_EMPTY');
  }
  // if (designation !== undefined && (designation.length < 2 || designation.length > 30)) {
  //   return t('DESIGNATION_LENGTH');
  // }
  // if (designation !== undefined && !regx.designation.test(designation)) {
  //   return t('FULL_DESIGNATION_VALID');
  // }
  //title
  if (title !== undefined && title.length == 0) {
    return t('TITLE_EMPTY');
  }
  // if (title !== undefined && (title.length < 3 || title.length > 20)) {
  //   return t('TITLE_LENGTH');
  // }
  // if (title !== undefined && !regx.title.test(title)) {
  //   return t('FULL_TITLE_VALID');
  // }
  //value
  if (value !== undefined && value.length == 0) {
    return t('VALUE_EMPTY');
  }
  // if (value !== undefined && (value.length < 3 || value.length > 100)) {
  //   return t('VALUE_LENGTH');
  // }
  // if (value !== undefined && !regx.value.test(value)) {
  //   return t('FULL_VALUE_VALID');
  // }

  //Company name

  if (companyName !== undefined && companyName.length == 0) {
    return t('COMPANY_NAME_EMPTY');
  }
  // if (companyName !== undefined && (companyName.length < 2 || companyName.length > 30)) {
  //   return t('COMPANY_NAME_LENGTH');
  // }
  // if (companyName !== undefined && !regx.companyName.test(companyName)) {
  //   return t('FULL_COMPANY_NAME_VALID');
  // }

  if (otp !== undefined && otp.length == 0) {
    return t('OTP_EMPTY');
  }
  if (otp !== undefined && otp.length < 4) {
    return t('OTP_INVALID');
  }

  if (email !== undefined && email.length == 0) {
    return t('EMAIL_EMPTY');
  }

  if (email !== undefined && !regx.email.test(email)) {
    return t('EMAIL_INVALID');
  }

  if (password !== undefined && password.length == 0) {
    return t('PASSWORD_EMPTY');
  }

  if (password !== undefined && (password.length < 8 || password.length > 15)) {
    return t('PASSWORD_LENGTH');
  }
  if (password !== undefined && !regx.password.test(password)) {
    return t('PASSWORD_INVALID');
  }

  if (confirmPassword !== undefined && confirmPassword.length == 0) {
    return t('CONFIRM_PASSWORD_EMPTY');
  }
  if (confirmPassword !== undefined && !regx.password.test(confirmPassword)) {
    return t('CONFIRM_PASSWORD_INVALID');
  }
  if (
    confirmPassword !== undefined &&
    password !== undefined &&
    password !== confirmPassword
  ) {
    return t('CONFIRM_PASSWORD_COMPARE');
  }
  if (phoneNumber !== undefined && phoneNumber.length == 0) {
    return t('PHONE_EMPTY');
  }
  if (phoneNumber !== undefined && !regx.phoneNumber.test(phoneNumber)) {
    return t('PHONE_INVALID');
  }

  if (
    confirmPassword !== undefined &&
    (confirmPassword.length < 8 || confirmPassword.length > 15)
  ) {
    return t('CONFIRM_PASSWORD_LENGTH');
  }

  if (
    confirmPassword !== undefined &&
    password !== undefined &&
    password != confirmPassword
  ) {
    return t('CONFIRM_PASSWORD_COMPARE');
  }

  if (oldPassword !== undefined && oldPassword.length == 0) {
    return t('OLD_PASSWORD_EMPTY');
  }

  if (oldPassword !== undefined && !regx.password.test(oldPassword)) {
    return t('OLD_PASSWORD_INVALID');
  }
  if (
    oldPassword !== undefined &&
    (oldPassword.length < 8 || oldPassword.length > 15)
  ) {
    return t('OLD_PASSWORD_LENGTH');
  }

  if (newPassword !== undefined && newPassword.length == 0) {
    return t('NEW_PASSWORD_EMPTY');
  }

  if (newPassword !== undefined && !regx.password.test(newPassword)) {
    return t('NEW_PASSWORD_INVALID');
  }

  if (newPassword !== undefined && newPassword.length < 6) {
    return t('NEW_PASSWORD_LENGTH');
  }
  if (confirmNewPassword !== undefined && confirmNewPassword.length == 0) {
    return t('CONFIRM_NEW_PASSWORD_EMPTY');
  }
  if (
    confirmNewPassword !== undefined &&
    !regx.password.test(confirmNewPassword)
  ) {
    return t('CONFIRM_NEW_PASSWORD_INVALID');
  }
  if (confirmNewPassword !== undefined && confirmNewPassword.length < 6) {
    return t('CONFIRM_NEW_PASSWORD_LENGTH');
  }
  if (
    confirmNewPassword !== undefined &&
    newPassword !== undefined &&
    newPassword != confirmNewPassword
  ) {
    return t('NEW_CONFIRM_PASSWORD_COMPARE');
  }
  if (isAcceptTerms !== undefined && isAcceptTerms == false) {
    return t('ACCEPT_TERMS_CONDITION');
  }

  if (catchLogImg !== undefined && catchLogImg.length <= 0) {
    return t('CATCH_LOG_IMG_VALID');
  }

  if (fishSpecies !== undefined && fishSpecies.length < 1) {
    return t('FISH_SPECIES_VALID');
  }
  if (flyUsed !== undefined && flyUsed.length < 1) {
    return t('FLY_USED_VALID');
  }

  if (locationText !== undefined && locationText === '') {
    return t('LOCATION_VALID');
  }

  if (selectedDate !== undefined && selectedDate == '') {
    return t('SELECT_DATE_VALID');
  }

  if (waterBody !== undefined && waterBody.length < 1) {
    return t('WATER_BODY_VALID');
  }

  if (description !== undefined && description.length < 1) {
    return t('DESC_NAME_VALID');
  }
  if (
    description !== undefined &&
    (description.length < 30 || description.length > 500)
  ) {
    return t('DESCRIPTION_LENGTH');
  }

  if (selectedParish !== undefined && selectedParish.length == 0) {
    return t('INTEREST_EMPTY'); // Assuming 'INTEREST_EMPTY' is used for a selection prompt
  }
}
