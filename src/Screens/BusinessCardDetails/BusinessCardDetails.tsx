import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardType,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import BoxComp from '../../Components/BoxComp';
import ButtonComp from '../../Components/ButtonComp';
import CountryCodePicker from '../../Components/CountryCodePicker';
import DynamicModal from '../../Components/DynamicModal';
import ExtractedDataModal from '../../Components/ExtractedDataModal';
import Header from '../../Components/Header';
import KeyboardAwareScroll from '../../Components/KeyboardAwareScroll';
import PhoneInputField from '../../Components/PhoneInputField';
import Spacer from '../../Components/Spacer';
import TextInputWithLabel from '../../Components/TextInputWithLabel';
import { appConfig } from '../../constants/appConfig';
import imagePath from '../../constants/imagePath';
import { useTranslate } from '../../constants/lang';
import navigationStrings from '../../constants/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStyles, { hitSlopProp } from '../../styles/commonStyles';
import { moderateScale } from '../../styles/responsiveSize';
import { Countries, COUNTRIES_CODE_FLAG } from '../../utils/commonData';
import {
  APP_LOG,
  errorMethod,
  extractContactInfo,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import { useDebounce } from '../../utils/useDebounce';
import { useHardwareBackPressWith } from '../../utils/utils';
import validations from '../../utils/validations';
import styles from './styles';
import { debounce, isArray, isEmpty } from 'lodash';
import { SafeAreaView } from 'react-native-safe-area-context';

const TagSuggestionListEmpty = ({
  isFetchingSuggestions,
}: {
  isFetchingSuggestions: boolean;
}) => (isFetchingSuggestions ? <Text>Loading...</Text> : null);

const BusinessCardDetails = (props: any) => {
  const { navigation, route } = props;
  const { uuid, type, data, onBack } = route.params || {}; // Get uuid from navigation params
  // States for form data
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isCountryCodePicker, setIsCountryCodePicker] =
    useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isViewCard, setIsViewCard] = useState(false);
  // Error states
  const [descriptionError, setDescriptionError] = useState<string>('');
  const [titleError, setTitleError] = useState<string>('');
  const [tagsError, setTagsError] = useState<string>('');
  const [scannedData, setScannedData] = useState<string[] | any>(data);
  const scrollViewRef = useRef<ScrollView>(null); // Ref for the ScrollView

  // Dynamic modal visibility state
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isExtractModalVisible, setExtractModalVisible] =
    useState<boolean>(false);

  const [isAddMoreModalVisible, setAddMoreModalVisible] =
    useState<boolean>(false); // Second modal

  const [tags, setTags] = useState<{ name: string; id: string | null }[]>([]); // Array of objects
  const [tagSuggestions, setTagSuggestions] = useState<
    { tag: string; uuid: string }[]
  >([]); // Array of objects with name and id
  const [newTag, setNewTag] = useState<string>('');
  const [selectedTagFromSuggestion, setSelectedTagFromSuggestion] =
    useState<any>(null); // State to track selected tag from suggestion
  const [isExtractingCard, setIsExtractingCard] = useState<boolean>(false); // New state

  const [newDynamicField, setNewDynamicField] = useState({
    title: '',
    description: '',
  }); // State for modal input
  const [countryDialCodeData, setCountryDialCodeData] = useState<Countries>(
    appConfig.DEFAULT_COUNTRY_CODE_DATA,
  ); // Initialize with default

  const [isFetchingSuggestions, setIsFetchingSuggestions] =
    useState<boolean>(false);

  const [dynamicFields, setDynamicFields] = useState<
    {
      title: string;
      description: string;
      error: string;
      maxLength?: number;
      placeHolder?: string;
      contentType?: string;
      keyboardType: KeyboardType;
      secureTextEntry?: boolean;
      isStatic?: boolean;
    }[]
  >([
    {
      title: useTranslate('NAME'),
      description: '',
      error: '',
      contentType: 'name',
      keyboardType: 'default',
      maxLength: appConfig.NAME_TEXT_INPUT_LENGTH,
      placeHolder: useTranslate('ENTER_NAME'),
      secureTextEntry: false,
      isStatic: true,
    },
    {
      title: useTranslate('DESIGNATION'),
      description: '',
      error: '',
      contentType: 'name',
      keyboardType: 'default',
      maxLength: undefined,
      placeHolder: useTranslate('ENTER_DESIGNATION'),
      secureTextEntry: false,
      isStatic: true,
    },
    {
      title: useTranslate('COMPANY_NAME'),
      description: '',
      error: '',
      contentType: 'name',
      keyboardType: 'default',
      maxLength: undefined,
      placeHolder: useTranslate('ENTER_COMPANY_NAME'),
      secureTextEntry: false,
      isStatic: true,
    },
    {
      title: useTranslate('SERVICE'),
      description: '',
      error: '',
      contentType: 'name',
      keyboardType: 'default',
      maxLength: undefined,
      placeHolder: useTranslate('ENTER_SERVICE'),
      secureTextEntry: false,
      isStatic: true,
    },
    {
      title: useTranslate('PHONE_NUMBER'),
      description: '',
      error: '',
      keyboardType: 'numeric',
      maxLength: 15,
      placeHolder: useTranslate('ENTER_MOBILE_NUMBER'),
      secureTextEntry: false,
      isStatic: true,
    },
    {
      title: useTranslate('EMAIL'),
      description: '',
      error: '',
      contentType: 'email',
      keyboardType: 'email-address',
      maxLength: undefined,
      placeHolder: useTranslate('ENTER_EMAIL'),
      secureTextEntry: false,
      isStatic: true,
    },
  ]);

  const dynamicFieldRefs = useRef<{ [key: string]: TextInput | null }>({});
  const [extractedModalVisible, setExtractedModalVisible] = useState(false);
  const [selectedInputIndex, setSelectedInputIndex] = useState<number | null>(
    null,
  );

  //get contact card Data
  useEffect(() => {
    if (uuid) {
      getUserCardDetails(uuid);
    }
  }, [uuid]); // Add uuid to the dependency array

  useEffect(() => {
    handleExtractDetailsFromCard();
  }, []);

  const handleFields = (value: any, key: string, prevDynamicField?: any) => {
    const updatedFields = [...(prevDynamicField || dynamicFields)];
    const index = updatedFields?.findIndex(item => item?.title === key);
    updatedFields[index].description = value;
    updatedFields[index].error = '';

    if (key === useTranslate('SERVICE')) {
      const companyIndex = updatedFields?.findIndex(
        item => item?.title === useTranslate('COMPANY_NAME'),
      );
      if (
        updatedFields?.[companyIndex]?.error ===
        'Insufficient data to identify service'
      ) {
        updatedFields[companyIndex].error = '';
      }
    }

    setDynamicFields(updatedFields);
  };

  const onCountryChange = (data: Countries) => {
    setCountryDialCodeData(data);
  };

  // Handle modal open/close
  const openModal = () => setModalVisible(true);
  const handleModalClose = (confirmed: boolean) => {
    if (confirmed) {
      const trimmedTitle = (newDynamicField.title || '').trim();
      const trimmedDescription = (newDynamicField.description || '').trim();

      const fieldTitleError = validations({ title: trimmedTitle });
      const descError = validations({ modalDescription: trimmedDescription });

      if (fieldTitleError || descError) {
        setTitleError(fieldTitleError || '');
        setDescriptionError(descError || '');
        return;
      }

      if (trimmedTitle) {
        APP_LOG('setDynamicFields-2');
        setDynamicFields((prevFields: any) => [
          ...prevFields,
          {
            title: trimmedTitle,
            description: trimmedDescription,
            error: '',
            maxLength: undefined,
            keyboardType: 'default',
            secureTextEntry: false,
            placeHolder: `${useTranslate('ENTER')} ${trimmedTitle}`,
            isStatic: false,
            contentType: undefined,
          },
        ]);
      }
    }

    // Clear input and errors after confirming or canceling
    setNewDynamicField({ title: '', description: '' });
    setNewDynamicField({ title: '', description: '' });
    setTitleError('');
    setDescriptionError('');
    setModalVisible(false); // Close modal first
  };

  // Handle second modal
  const openAddMoreModal = () => setAddMoreModalVisible(true);
  const handleAddMoreModalClose = (confirmed: boolean) => {
    const trimmedNewTag = newTag.trim();

    if (confirmed) {
      if (!trimmedNewTag) {
        setTagsError(useTranslate('TAG_CANNOT_BE_EMPTY'));
      } else if (tags.find(tag => tag.name === trimmedNewTag)) {
        setTagsError(useTranslate('TAG_ALREADY_EXISTS'));
      } else {
        const matchedTag = tagSuggestions.find(
          suggestion =>
            suggestion.tag.toLowerCase() === trimmedNewTag.toLowerCase(),
        );
        if (matchedTag) {
          setTagsError(useTranslate('PLEASE_SELECT_FROM_SUGGESTIONS'));
          return;
        }

        setTagsError('');

        const newTagObject = selectedTagFromSuggestion
          ? {
              name: selectedTagFromSuggestion.tag,
              id: selectedTagFromSuggestion.uuid,
            }
          : { name: trimmedNewTag, id: null };
        setTags(prevTags => [...prevTags, newTagObject]);
        setNewTag('');
        setAddMoreModalVisible(false);
      }
    } else {
      setNewTag('');
      setTagsError('');
      setAddMoreModalVisible(false);
    }
    setTagSuggestions([]);
  };

  const handleTagInputChange = async (text: string) => {
    setNewTag(text);
    setTagsError('');
    setSelectedTagFromSuggestion(null); // Clear selected tag when input changes

    handleTagSuggestions(text);
  };
  const handleTagSuggestions = useDebounce((text: string) => {
    if (text.trim() === '') {
      setTagSuggestions([]);
      return;
    }

    setIsFetchingSuggestions(true);
    actions
      .tagSuggestions({ search: text })
      .then((res: any) => {
        if (res) {
          setTagSuggestions(res.data);

          const matchedTag = res.data.find(
            (suggestion: any) =>
              suggestion.tag.toLowerCase() === text.toLowerCase(),
          );
          if (matchedTag) {
            setTagsError(useTranslate('PLEASE_SELECT_FROM_SUGGESTIONS'));
          } else {
            setTagsError('');
          }
        }
      })
      .catch(errorMethod)
      .finally(() => setIsFetchingSuggestions(false));
  }, 700);

  const handleRemoveTag = (tagToRemove: {
    name: string;
    id: string | null;
  }) => {
    setTags(prevTags => prevTags.filter(tag => tag.name !== tagToRemove.name)); // Filter by name
  };

  const handleValidation = () => {
    // RESETTING ERROR
    let previousError = [...dynamicFields];
    previousError = previousError?.map(item => ({ ...item, error: '' }));
    // Check dynamic fields for errors
    let check = false;
    let firstErrorIndex: number | null = null;
    if (previousError?.length > 0) {
      previousError?.map((item, index) => {
        const { title, description, isStatic } = item;
        let descriptionValidationError: any;
        if (isStatic) {
          if (title === useTranslate('NAME')) {
            descriptionValidationError = validations({
              name: (description || '').trim(),
            });
          }
          if (title === useTranslate('DESIGNATION')) {
            descriptionValidationError = validations({
              designation: (description || '').trim(),
            });
          }
          if (title === useTranslate('COMPANY_NAME')) {
            descriptionValidationError = validations({
              companyName: (description || '').trim(),
            });
          }
          if (title === useTranslate('SERVICE')) {
            descriptionValidationError = validations({
              service: (description || '').trim(),
            });
          }
          if (title === useTranslate('PHONE_NUMBER')) {
            descriptionValidationError = validations({
              phoneNumber: (description || '').trim(),
            });
          }
          if (title === useTranslate('EMAIL')) {
            descriptionValidationError = validations({
              email: (description || '').trim(),
            });
          }
        } else {
          descriptionValidationError = validations({
            value: description,
          });
        }

        if (descriptionValidationError) {
          check = true;
          previousError[index].error = descriptionValidationError;

          if (firstErrorIndex === null) {
            firstErrorIndex = index;
          }
          return { ...item, error: descriptionValidationError };
        }
        return { ...item, error: '' };
      });
    }

    if (check) {
      setDynamicFields([...previousError]);

      if (firstErrorIndex !== null) {
        const dynamicFieldRef = dynamicFieldRefs?.current[firstErrorIndex];
        if (dynamicFieldRef) {
          dynamicFieldRef?.focus();

          if (scrollViewRef?.current) {
            UIManager?.measure(
              scrollViewRef?.current?.getInnerViewNode(),
              (x, y) => {
                if (scrollViewRef?.current) {
                  scrollViewRef?.current?.scrollTo({
                    y: y - 100, // Adjust the offset as needed
                    animated: true,
                  });
                }
              },
            );
          }
        }
        return true;
      }
      return true;
    }
    return false;
  };

  const extractPhoneNumber = (phone: string) => {
    let number = phone.replace('Phone: ', '').replace(/[^0-9]/g, '');
    // Step 2: Remove leading zeros
    number = number.replace(/^0+/, '');
    return number;
  };

  // Function to extract email
  const extractEmail = (email: String) => {
    // Regular expression to match email addresses
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = email.match(emailRegex);
    if (match) {
      return match[0]; // Return the matched email
    }
    return '';
  };

  const getValue = (key: string) => {
    return dynamicFields?.find(item => item?.title === key)?.description;
  };

  const handleSaveContact = () => {
    const check = handleValidation();

    if (check) {
      return;
    }

    setIsUpdate(true);
    // Logic for saving the contact
    let tagsToSend = tags.map(tag => ({
      name: tag?.id == null ? tag?.name : null,
      id: tag?.id == null ? null : tag?.id,
    }));

    let json = {
      name: getValue(useTranslate('NAME')),
      designation: getValue(useTranslate('DESIGNATION')),
      company_name: getValue(useTranslate('COMPANY_NAME')),
      country_code_name: countryDialCodeData.code,
      country_code: countryDialCodeData.dial_code,
      service: getValue(useTranslate('SERVICE')),
      phone_number: getValue(useTranslate('PHONE_NUMBER')),
      email: getValue(useTranslate('EMAIL')),
      add_more_fields: dynamicFields
        ?.filter(item => !item.isStatic)
        .map(field => ({
          title: field.title,
          description: field.description,
        })),
      uuid: route.params?.uuid,
      tags: tagsToSend,
    };

    (type === 'EDIT' || type == 'EDIT_HOME'
      ? actions.updateCard(json)
      : actions.saveCardData(json)
    )
      .then(response => {
        setIsUpdate(false);
        if (response?.status === 'true') {
          showSuccess(response?.message);
          actions.homeRefresh(true);
          onBack && onBack?.();
          navigation.goBack();
        } else {
          showError(response?.message);
          setIsLoading(false);
        }
      })
      .catch(errorMethod)
      .finally(() => setIsUpdate(false));
  };
  const getIndustryName = (company_name: string, prevFields: any) => {
    if (company_name?.trim() === '') {
      handleFields('', 'Service', prevFields);
      return;
    }
    actions
      .getIndustryDetails({ company_name })
      .then((res: any) => {
        APP_LOG('Industry res', res);
        if (res?.keywords?.keywords && res?.keywords?.keywords.length > 0) {
          handleFields(
            res?.keywords?.keywords?.join(', '),
            'Service',
            prevFields,
          );
        } else {
          throw new Error();
        }
      })
      .catch(err => {
        handleFields('', 'Service', prevFields);
        const updatedFields = [...prevFields];
        const index = updatedFields?.findIndex(
          item => item?.title === useTranslate('COMPANY_NAME'),
        );
        updatedFields[index].error = 'Insufficient data to identify service';

        setDynamicFields(updatedFields);
      })
      .finally(() => {});
  };
  const getUserCardDetails = (user_uuid: string) => {
    setLoadingMore(true);
    setIsLoading(true); // Set loading to true before API call
    actions
      .getContactCard({ uuid: user_uuid })
      .then(res => {
        const userCardData = res?.data || {};

        const countryCodeFromApi = userCardData.country_code_name; // Get the country code from the API

        if (countryCodeFromApi) {
          const matchedCountry = COUNTRIES_CODE_FLAG.find(
            country => country.code === countryCodeFromApi,
          );

          if (matchedCountry) {
            setCountryDialCodeData(matchedCountry);
          }
        }
        let localArr = [...dynamicFields];
        for (let key in userCardData) {
          let index = localArr.findIndex(
            item => item?.title === useTranslate(key?.toUpperCase()),
          );
          if (index != -1) {
            localArr[index] = {
              ...localArr[index],
              description: userCardData?.[key],
            };
          }
        }

        (userCardData?.card_extra_filed || [])?.map((item: any) => {
          localArr = [
            ...localArr,
            {
              title: item?.title,
              description: item?.description,
              error: '',
              maxLength:
                item?.title == useTranslate('NAME')
                  ? appConfig.NAME_TEXT_INPUT_LENGTH
                  : item?.title == useTranslate('PHONE_NUMBER')
                  ? appConfig.PHONE_NUMBER_MAX_LENGTH
                  : undefined,
              keyboardType: 'default',
              secureTextEntry: false,
              placeHolder: `${useTranslate('ENTER')} ${item?.title}`,
              isStatic: false,
              contentType: undefined,
            },
          ];
        });

        setDynamicFields(localArr);
        // Handling card_tag:
        if (userCardData?.card_tag) {
          try {
            let tagArray = [];
            if (Array.isArray(userCardData.card_tag)) {
              tagArray = userCardData.card_tag.map((tagObj: any) => ({
                name: tagObj.tag.tag, // Access the nested 'tag' property
                id: tagObj.tag.uuid, // Access the nested 'uuid' property
              }));
            } else if (
              typeof userCardData.card_tag === 'object' &&
              userCardData.card_tag !== null
            ) {
              tagArray = [
                {
                  name: userCardData.card_tag.tag.tag,
                  id: userCardData.card_tag.tag.uuid,
                },
              ];
            } else if (typeof userCardData.card_tag === 'string') {
              try {
                const parsedTag = JSON.parse(userCardData.card_tag);
                if (Array.isArray(parsedTag)) {
                  tagArray = parsedTag.map(item => ({
                    name: item.tag.tag,
                    id: item.tag.uuid,
                  }));
                } else if (
                  typeof parsedTag === 'object' &&
                  parsedTag !== null
                ) {
                  tagArray = [
                    {
                      name: parsedTag.tag.tag,
                      id: parsedTag.tag.uuid,
                    },
                  ];
                }
              } catch (error) {}
            }
            setTags(tagArray);
          } catch (error) {
            setTags([]);
          }
        } else {
          setTags([]);
        }
      })
      .catch(err => {
        errorMethod(err);
      })
      .finally(() => {
        setLoadingMore(false);
        setIsLoading(false);
      });
  };

  const renderTagSuggestion = (
    { item }: { item: { tag: string; uuid: string } }, // Update item type
  ) => (
    <TouchableOpacity
      onPress={() => {
        setNewTag(item.tag);
        setTagSuggestions([]);
        setSelectedTagFromSuggestion(item); // Set the selected tag from suggestion
      }}
    >
      <Text allowFontScaling={false} style={styles.tagSuggestionItem}>
        {item.tag}
      </Text>
    </TouchableOpacity>
  );

  const handleExtractDetailsFromCard = async () => {
    let extractedInfo: any;
    if (isArray(data)) {
      extractedInfo = extractContactInfo(data);
      setScannedData(data);
    } else {
      if (isEmpty(data)) {
        return;
      }
      setScannedData(Object.values(data));
      const countryCodeData = COUNTRIES_CODE_FLAG?.find(
        item => item?.dial_code === data?.country_code,
      );
      if (!isEmpty(countryCodeData)) {
        setCountryDialCodeData(countryCodeData);
      }
      extractedInfo = {
        COMPANY_NAME: data?.company_name || '',
        NAME: data?.name || '',
        DESIGNATION: data?.designation || '',
        EMAIL: data?.email || '',
        PHONE_NUMBER: data?.phone_number || '',
        website: data?.website || '',
        SERVICE: data?.service || '',
      };
    }

    let localArr = [...dynamicFields];

    for (let key in extractedInfo) {
      let index = localArr.findIndex(
        item => item?.title === useTranslate(key.toUpperCase()),
      );
      if (index !== -1) {
        let value =
          useTranslate(key) === useTranslate('PHONE_NUMBER')
            ? extractPhoneNumber(
                extractedInfo?.[key as keyof typeof extractedInfo],
              )
            : useTranslate(key) === useTranslate('EMAIL')
            ? extractEmail(extractedInfo?.[key as keyof typeof extractedInfo])
            : extractedInfo?.[key as keyof typeof extractedInfo];

        if (
          localArr[index].title === useTranslate('NAME') &&
          value.length > 30
        ) {
          value = value.substring(0, 30);
        } else if (
          localArr[index].title === useTranslate('PHONE_NUMBER') &&
          value.length > 15
        ) {
          value = value.substring(0, 15);
        }

        localArr[index] = {
          ...localArr[index],
          description: value,
        };
      }
    }
    if (!!localArr[2].description && !data?.service) {
      getIndustryName(localArr[2].description, localArr);
    }

    setDynamicFields(localArr);
  };

  const handleSetInputWithCard = (value: string) => {
    let localArr = [...dynamicFields];
    let index;

    for (let key in dynamicFieldRefs?.current) {
      if (dynamicFieldRefs.current?.[key]?.isFocused()) {
        index = Number(key);
      }
    }
    if (index || index == 0) {
      localArr[index] = {
        ...localArr[index],
        description:
          localArr[index]?.title === useTranslate('PHONE_NUMBER')
            ? value?.toString()?.replace(/\s/g, '')
            : value?.toString()?.trim(),
      };
    }

    setDynamicFields(localArr);
  };

  const openDataModal = (index: number) => {
    setSelectedInputIndex(index);
    setExtractModalVisible(true);
  };

  const closeDataModal = () => {
    setExtractModalVisible(false);
    setSelectedInputIndex(null);
  };
  useHardwareBackPressWith(() => {
    onBack && onBack();
    navigation.goBack();
  });

  const handleDataSelection = (selectedData: string) => {
    if (selectedInputIndex === 2) {
      getIndustryName(selectedData, dynamicFields);
    }
    if (selectedInputIndex !== null) {
      let processedData = selectedData;

      // Handle specific fields
      if (dynamicFields[selectedInputIndex].title === useTranslate('EMAIL')) {
        processedData = extractEmail(selectedData);
      } else if (
        dynamicFields[selectedInputIndex].title === useTranslate('PHONE_NUMBER')
      ) {
        processedData = extractPhoneNumber(selectedData);
        if (processedData.length > 15) {
          processedData = processedData.substring(0, 15);
        }
      } else if (
        dynamicFields[selectedInputIndex].title === useTranslate('NAME')
      ) {
        // Truncate the "Name" field to the first 30 characters if it exceeds the limit
        if (selectedData.length > 30) {
          processedData = selectedData.substring(0, 30);
        }
      }
      handleFields(processedData, dynamicFields[selectedInputIndex].title);
      closeDataModal();
    }
  };
  const debouncedGetIndustryName = useDebounce((text: string) => {
    getIndustryName(text, dynamicFields);
  }, 1000);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <Image source={cardImage}  style={{width:width,height:150}} resizeMode='contain' /> */}
      <Header
        centerTitle={
          type === 'EDIT' || type == 'EDIT_HOME'
            ? useTranslate('EDIT_DETAILS')
            : useTranslate('BUSINESS_CONTACT_DETAILS')
        }
        onPressLeftImg={() => {
          onBack && onBack();
          navigation.goBack();
        }}
        centerTitleStyle={{ marginStart: moderateScale(4) }}
      />
      <KeyboardAwareScroll
        keyboardShouldPersistTaps="handled"
        scrollRef={scrollViewRef} // Set the ref to the ScrollView
      >
        {isLoading && !onBack && <ActivityIndicator />}
        <View style={styles.container}>
          {/* Render dynamically added fields */}
          {dynamicFields.map((field, index) => (
            <View key={index} style={{ marginBottom: moderateScale(15) }}>
              {field?.title === useTranslate('PHONE_NUMBER') ? (
                <PhoneInputField
                  reference={(ref: TextInput | null) => {
                    if (ref) {
                      dynamicFieldRefs.current[index] = ref;
                    }
                  }}
                  isRequired={true}
                  title={field?.title}
                  placeholder={useTranslate('ENTER_MOBILE_NUMBER')}
                  keyboardType={field.keyboardType}
                  onGetData={field.description}
                  onSetData={(text: string) => {
                    handleFields(text, field.title);
                  }}
                  getError={field?.error}
                  isTitle={true}
                  // onSubmitEditing={() =>
                  //   !!phoneRef.current && phoneRef.current.focus()
                  // }
                  contentType={undefined}
                  placeHolderTextColor={''}
                  fontColor={''}
                  secureTextEntry={false}
                  dialCode={countryDialCodeData.dial_code}
                  onChangeCountryCode={() => setIsCountryCodePicker(true)}
                  flag={countryDialCodeData.flag}
                  // isCustomRight
                  // eslint-disable-next-line react/no-unstable-nested-components
                  CustomRight={() =>
                    data ? (
                      // eslint-disable-next-line react-native/no-inline-styles
                      <View style={{ flexDirection: 'row' }}>
                        <View
                          // eslint-disable-next-line react-native/no-inline-styles
                          style={{
                            height: moderateScale(20),
                            width: 1,
                            backgroundColor: colors.lightGray,
                            marginEnd: moderateScale(10),
                          }}
                        />
                        <TouchableOpacity
                          style={styles.modalButton}
                          onPress={() => openDataModal(index)}
                        >
                          <Image
                            source={imagePath.down_arrow}
                            style={styles.modalButtonIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <></>
                    )
                  }
                />
              ) : (
                <TextInputWithLabel
                  label={field.title}
                  reference={(ref: TextInput | null) => {
                    if (ref) {
                      dynamicFieldRefs.current[index] = ref;
                    }
                  }}
                  isLabel
                  onGetData={field.description} // Display saved description
                  onSetData={(text: string) => {
                    handleFields(text, field.title);
                    if (index === 2) {
                      debouncedGetIndustryName(text);
                    }
                  }}
                  placeholder={field.placeHolder || field.title}
                  placeHolderTextColor={colors.deepBlue}
                  contentType={field.contentType}
                  keyboardType={field.keyboardType || 'default'}
                  secureTextEntry={false}
                  getError={field?.error} // Use the *individual* descriptionError here!
                  maxLength={field.maxLength}
                  // isCustomRight
                  // eslint-disable-next-line react/no-unstable-nested-components
                  CustomRight={() =>
                    data ? (
                      // eslint-disable-next-line react-native/no-inline-styles
                      <View style={{ flexDirection: 'row' }}>
                        <View
                          // eslint-disable-next-line react-native/no-inline-styles
                          style={{
                            height: moderateScale(20),
                            width: 1,
                            backgroundColor: colors.lightGray,
                            marginEnd: moderateScale(10),
                          }}
                        />
                        <TouchableOpacity
                          style={styles.modalButton}
                          onPress={() => openDataModal(index)}
                        >
                          <Image
                            source={imagePath.down_arrow}
                            style={styles.modalButtonIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <></>
                    )
                  }
                />
              )}
            </View>
          ))}
          <ButtonComp
            title={useTranslate('ADD_MORE_FIELD')}
            gradientColors={[colors.AppWhite, colors.AppWhite]}
            btnStyle={styles.addMoreButton}
            btnTxtStyle={styles.addMoreButtonText}
            onPress={openModal}
          />

          <View style={styles.tagContainer}>
            <Text allowFontScaling={false} style={styles.tagsText}>
              {useTranslate('TAGS')}
            </Text>
            <TouchableOpacity hitSlop={hitSlopProp} onPress={openAddMoreModal}>
              <Text allowFontScaling={false} style={styles.addMoreTagsText}>
                {useTranslate('ADD_MORE')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagsList}>
            {tags?.map((tag, index) => (
              <BoxComp
                key={index}
                isSelected={true}
                boxStyle={styles.tagBox}
                title={tag.name}
                showCross={true}
                onSelect={() => handleRemoveTag(tag)}
              />
            ))}
          </View>
          <ButtonComp
            title={
              type === 'EDIT' || type == 'EDIT_HOME'
                ? useTranslate('UPDATE_CONTACT')
                : useTranslate('SAVE_CONTACT')
            }
            btnStyle={styles.updateButton}
            btnTxtStyle={styles.updateButtonText}
            onPress={handleSaveContact}
            isLoading={isUpdate}
          />
        </View>

        <Spacer space={moderateScale(10)} />
        <View style={commonStyles.alignJustifyCenter}>
          <DynamicModal
            isVisible={isModalVisible}
            onClose={() => handleModalClose(false)} // Pass false for non-confirmation when closing without "ADD"
            title={useTranslate('ADD_NEW_FIELD')}
            inputFields={[
              {
                placeholder: useTranslate('TITLE'),
                value: newDynamicField.title, // Bind to modal input state
                onChangeText: text =>
                  setNewDynamicField({ ...newDynamicField, title: text }),
                Error: titleError, // Display title error
                maxLength: 20,
              },
              {
                placeholder: useTranslate('DESCRIPTION'),
                value: newDynamicField.description, // Bind to modal input state
                onChangeText: text =>
                  setNewDynamicField({ ...newDynamicField, description: text }),
                maxLength: 100,
                Error: descriptionError, // Display description error
              },
            ]}
            buttons={[
              {
                label: useTranslate('CLEAR'),
                onPress: () =>
                  setNewDynamicField({ title: '', description: '' }), // Clear modal input
                backgroundColor: colors.darkGrey,
              },
              {
                label: useTranslate('CONFIRM'),
                onPress: () => handleModalClose(true), // Call close handler with confirmation
              },
            ]}
          />
        </View>
        {/* Second Modal */}
        <View style={commonStyles.alignJustifyCenter}>
          <DynamicModal
            isVisible={isAddMoreModalVisible}
            onClose={() => handleAddMoreModalClose(false)}
            title={useTranslate('TAGS')}
            inputFields={[
              {
                placeholder: useTranslate('ENTER_TAG'),
                value: newTag,
                onChangeText: handleTagInputChange, //setNewTag,
                Error: tagsError,
                maxLength: 30,
              },
            ]}
            customContent={
              <View>
                <FlatList
                  data={tagSuggestions}
                  renderItem={renderTagSuggestion}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.tagSuggestionList}
                  // eslint-disable-next-line react/no-unstable-nested-components
                  ListEmptyComponent={() => (
                    <TagSuggestionListEmpty
                      isFetchingSuggestions={isFetchingSuggestions}
                    />
                  )} // Use the external component
                />
              </View>
            }
            buttons={[
              {
                label: useTranslate('ADD'),
                onPress: () => handleAddMoreModalClose(true),
                disabled: isFetchingSuggestions,
                backgroundColor: isFetchingSuggestions
                  ? colors.grey
                  : undefined,
              },
            ]}
          />
        </View>
        <View>
          <ExtractedDataModal
            isVisible={isExtractModalVisible}
            onClose={closeDataModal}
            data={scannedData}
            onSelect={handleDataSelection}
            loading={isExtractingCard}
          />
        </View>
        {isCountryCodePicker && (
          <CountryCodePicker
            isVisible={isCountryCodePicker}
            onClosePickerModal={() => setIsCountryCodePicker(false)}
            onCountryChange={onCountryChange}
          />
        )}
      </KeyboardAwareScroll>
      {/* )} */}
    </SafeAreaView>
  );
};

export default BusinessCardDetails;
