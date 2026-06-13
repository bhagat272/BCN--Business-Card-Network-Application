import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { jsonToCSV } from 'react-native-csv';
import RNFS from 'react-native-fs';
import { generatePDF } from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import ButtonComp from '../../Components/ButtonComp';
import DynamicModal from '../../Components/DynamicModal'; // Import DynamicModal
import Header from '../../Components/Header';
import KeyboardAwareScroll from '../../Components/KeyboardAwareScroll';
import { EditScreenSimmer } from '../../Components/ShimmerComp';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { useTranslate } from '../../constants/lang';
import navigationStrings from '../../constants/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import {
  APP_LOG,
  errorMethod,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import styles from './styles';
import Logout from '../../Components/Logout';

interface CardData {
  id?: number;
  user_id?: number;
  uuid?: string;
  name: string;
  designation: string;
  company_name: string;
  service: string;
  email: string;
  phone_number: string;
  country_code: string;
  country_code_name: string;
  status: number;
  card_extra_filed: any[]; // Assuming this could be any array structure
  card_tag: Array<{
    id: number;
    user_id: number;
    card_id: number;
    tag_id: string;
    tag: {
      id: number;
      uuid: string;
      user_id: number;
      tag?: string;
    };
  }>;
}

const EditScreen = (props: any) => {
  const { navigation, route } = props;
  const { uuid, access, saved, sharing } = route.params || {}; // Destructure params with fallback defaults
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaved, setSaved] = useState<boolean>(saved);
  const [isSaveCard, setIsSaveCard] = useState<boolean>(false);
  // State management
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false); // State for delete confirmation modal
  const [cardData, setCardData] = useState<CardData>({} as CardData);
  const [isShareModalVisible, setShareModalVisible] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(true);
  const [exportType, setExportType] = useState<'csv' | 'pdf' | null>(null);
  const [exportTypeError, setExportTypeError] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [exportButtonPress, setExportButtonPress] = useState<boolean>(false); // New state variable

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Reset the modal state when the screen comes into focus
  //     setShareModalVisible(false);
  //   }, []),
  // );

  useFocusEffect(
    useCallback(() => {
      if (uuid) {
        getUserCardDetails(uuid); // Pass uuid directly
      }
    }, [uuid]),
  );

  const getUserCardDetails = (user_uuid: string) => {
    actions
      .getContactCard({ uuid: user_uuid })
      .then(res => {
        setSaved(res?.data?.saved == 1);
        const userCardData: CardData = res?.data || ({} as CardData);
        setCardData(userCardData);
      })
      .catch(err => {
        errorMethod(err);
        setCardData({} as CardData); // Clear card data on error
      })
      .finally(() => {
        setLoadingMore(false);
      });
  };

  // Function to delete the user card
  const hideDialog = (check: boolean) => {
    if (check) {
      setDeleteLoading(true);

      const json = { uuid };

      actions
        .deleteCard(json) // Call the delete API
        .then((response: any) => {
          if (response?.status === 'true') {
            showSuccess(response?.message);
            actions.homeRefresh(true);
            setDeleteModalVisible(false); // Close delete modal
            navigation.goBack(); // Navigate back on success
          } else {
            showError(response?.message);
          }
        })
        .catch(err => {
          errorMethod(err);
        })
        .finally(() => {
          setDeleteLoading(false); // Stop loading indicator
        });
    } else {
      setDeleteModalVisible(false); // Just close the modal if 'check' is false
    }
  };

  // Function to export data as CSV

  const exportToCSV = async () => {
    try {
      const transformedData: any = {
        Name: cardData.name,
        Designation: cardData.designation,
        'Company name': cardData.company_name,
        Service: cardData.service,
        Email: cardData.email,
        'Phone Number': `\t+${cardData.country_code} ${cardData.phone_number}`,
        // 'Country code': cardData.country_code,
        'Country code name': cardData.country_code_name,
      };

      // Add Tags only if card_tag exists and has items
      if (cardData.card_tag && cardData.card_tag.length > 0) {
        transformedData.Tags = cardData.card_tag
          .map(tag => tag.tag?.tag)
          .join(',');
      }

      // Add Card extra field only if card_extra_filed exists and has items
      if (cardData.card_extra_filed && cardData.card_extra_filed.length > 0) {
        transformedData['Card extra field'] = cardData.card_extra_filed
          .map(item => `${item.title || 'N/A'}: ${item.description || 'N/A'}`)
          .join(', ');
      }

      const csvData = jsonToCSV([transformedData]);

      APP_LOG(csvData);

      const filePath = `${RNFS.DocumentDirectoryPath}/cardData.csv`;
      await RNFS.writeFile(filePath, csvData, 'utf8');

      shareFile(filePath, 'text/csv', 'cardData.csv');
    } catch (error) {}
  };
  // Function to export data as PDF

  const exportToPDF = async () => {
    try {
      let htmlContent = `
      <html>
        <head>
              <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              padding: 20px;
            }
            h1 {
              color: rgb(0, 0, 0);
              margin-bottom: 10px;
            }
            h3 {
              color: #004080;
              margin-bottom: 15px;
              border-bottom: 1px solid #e1e1e1;
              padding-bottom: 15px;
            }
            p {
              margin: 5px 0;
            }
            .card-section {
              margin-bottom: 20px;
              padding: 15px;
              border: 1px solid #eee;
              border-radius: 5px;
            }
            .tags {
              margin-top: 10px;
            }
            .tag {
              display: inline-block;
              margin-right: 5px;
              padding: 3px 10px;
              background-color: #f1f1f1;
              border: 1px solid #d3d3d3;
              border-radius: 15px;
              font-size: 12px;
            }
            .extra-fields {
              background-color: #f8f8f8;
              padding: 10px;
              border-radius: 5px;
              margin-top: 20px;
            }
            .extra-fields p {
              margin: 5px 0;
            }
            strong {
              color: #004080;
            }
          </style>
        </head>
        <body>
          <h1>Business Detail Card</h1>
          <div class="card-section">
            <p><strong>Name:</strong> ${cardData.name}</p>
            <p><strong>Designation:</strong> ${
              cardData.designation || 'N/A'
            }</p>
            <p><strong>Company Name:</strong> ${
              cardData.company_name || 'N/A'
            }</p>
            <p><strong>Email:</strong> ${cardData.email || 'N/A'}</p>
            <p><strong>Service:</strong> ${cardData.service || 'N/A'}</p>
            <p><strong>Phone Number:</strong> ${
              cardData.country_code
                ? '+' + cardData.country_code + ' ' + cardData.phone_number
                : 'N/A'
            }</p>
            ${
              cardData.card_tag && cardData.card_tag.length > 0
                ? `
                    <div class="tags">
                      <strong>Tags:</strong>
                      ${cardData.card_tag
                        .map(
                          tagItem => `
                            <span class="tag">${
                              tagItem.tag?.tag || 'N/A'
                            }</span>`,
                        )
                        .join('')}
                    </div>
                  `
                : ''
            }
            ${
              cardData.card_extra_filed && cardData.card_extra_filed.length > 0
                ? `
                   
                    <div class="extra-fields">
                     <h3>Additional Information</h3>
                      ${cardData.card_extra_filed
                        .map(
                          item =>
                            `<p><strong>${item.title || 'N/A'}</strong>: ${
                              item.description || 'N/A'
                            }</p>`,
                        )
                        .join('')}
                    </div>
                  `
                : ''
            }
          </div>
        </body>
      </html>
    `;

      const options = {
        html: htmlContent,
        fileName: 'cardData',
        directory: 'Documents',
      };

      const file = await generatePDF(options);
      shareFile(file.filePath, 'application/pdf', 'cardData.pdf');
    } catch (error) {}
  };

  // Function to share the file
  const shareFile = async (
    filePath: string,
    fileType: string,
    fileName: string,
  ) => {
    try {
      if (!filePath) throw new Error('File path is undefined');

      // Ensure file exists
      const exists = await RNFS.exists(filePath);
      if (!exists) throw new Error(`File not found: ${filePath}`);

      // Copy file to cache (shareable)
      const cachePath =
        Platform.OS === 'android'
          ? `${RNFS.CachesDirectoryPath}/${fileName}`
          : `${RNFS.TemporaryDirectoryPath}${fileName}`;

      await RNFS.copyFile(filePath, cachePath);

      const shareOptions = {
        title: 'Share Contact Export',
        url: `file://${cachePath}`,
        type: fileType,
        filename: fileName,
      };

      setModalVisible(false);

      setTimeout(async () => {
        try {
          await Share.open(shareOptions);
          showSuccess('Contact exported successfully.');
        } catch (err) {
          APP_LOG('shareFile-err', err);
        } finally {
          // Optional cleanup
          setTimeout(() => RNFS.unlink(cachePath).catch(() => {}), 3000);
        }
      }, 800);
    } catch (error) {
      APP_LOG('shareFile-outer-err', error);
    }
  };

  if (loadingMore || !cardData) {
    return (
      <WrapperContainer>
        <EditScreenSimmer />
      </WrapperContainer>
    );
  }

  const handleCall = () => {
    if (cardData && cardData.phone_number) {
      Linking.openURL(
        `tel:+${cardData.country_code + cardData.phone_number}`,
      ).catch(err => {
        showError('Could not make call');
      });
    } else {
      showError('Phone number not available.');
    }
  };

  const handleSMS = () => {
    if (cardData && cardData.phone_number) {
      Linking.openURL(
        `sms:+${cardData.country_code + cardData.phone_number}${
          Platform.OS === 'ios' ? '&body=' : '?body='
        }`,
      ).catch(err => {
        showError('Could not send SMS.');
      });
    } else {
      showError('Phone number not available.');
    }
  };

  const handleWhatsApp = () => {
    if (cardData && cardData.phone_number && cardData.country_code) {
      let whatsappUrl = `whatsapp://send?phone=${cardData.country_code}${cardData.phone_number}`;
      Linking.openURL(whatsappUrl).catch(err => {
        showError('WhatsApp not installed or phone number invalid.');
      });
    } else {
      showError('Phone number or country code not available.');
    }
  };

  const handleEmail = () => {
    if (cardData && cardData.email) {
      Linking.openURL(`mailto:${cardData.email}`).catch(err => {
        showError('Could not open email app.');
      });
    } else {
      showError('Email address not available.');
    }
  };

  // Determine if the right icon should be visible

  const getTags = (array: any[]) => {
    let name = '';
    array.forEach((item: any, index: number) => {
      if (array.length - 1 == index) {
        name = name + item?.tag?.tag;
      } else {
        name = name + `${item?.tag?.tag},`;
      }
    });
    return name;
  };

  const handleShare = async () => {
    try {
      const extraData =
        cardData?.card_extra_filed.length > 0
          ? `\nExtra Info: ${cardData?.card_extra_filed
              .map(
                item =>
                  `${item?.title || 'N/A'} - ${item?.description || 'N/A'}`,
              )
              .join(', ')} `
          : '';
      // Format the data into a readable string
      const shareText = `
        Name: ${cardData?.name}\nDesignation: ${
        cardData?.designation
      }\nCompany: ${cardData?.company_name}\nService: ${
        cardData?.service
      }\nPhone Number: +${cardData?.country_code} ${
        cardData?.phone_number
      }\nEmail: ${cardData?.email}\nCountry: ${
        cardData?.country_code_name
      }${extraData}${
        cardData.card_tag?.length > 0
          ? `\nTag: ${getTags(cardData.card_tag)}`
          : ''
      }\nLink: https://demo.dev9server.com/bcn-dev/
      `.trim();

      const shareOptions = {
        title: `${cardData.name}'s Contact Card`,
        message: shareText,
      };

      // APP_LOG('shareOptions', { shareOptions, extraData });

      setTimeout(async () => {
        Share.open(shareOptions)
          .then(result => {
            if (result?.success) {
              showSuccess('Contact exported successfully.');
            }
          })
          .catch(err => {
            // showSuccess('Contact exported successfully.');
          });
      }, 800);
    } catch (error) {}
  };

  const handleShareModal = () => {
    setShareModalVisible(true);
  };

  const handleSaveContact = () => {
    setIsSaveCard(true);

    // Transform cardData into the required format
    const transformedData = {
      name: cardData.name,
      designation: cardData.designation,
      company_name: cardData.company_name,
      uuid: cardData.uuid,
      service: cardData.service,
      phone_number: cardData.phone_number,
      country_code_name: cardData.country_code_name,
      country_code: '+' + cardData.country_code, // Assuming country_code needs a '+' prefix
      email: cardData.email,
      tags: cardData.card_tag.map(tagItem => ({
        name: tagItem?.tag?.tag,
        id: null, // As specified in your example
      })),
      add_more_fields: cardData.card_extra_filed?.map(field => ({
        title: field?.title,
        description: field?.description,
      })),
    };
    actions
      .updateCard(transformedData) // Send the transformed data
      .then(response => {
        setIsSaveCard(true);
        if (response?.status === 'true') {
          showSuccess(response?.message);
          actions.homeRefresh(true);
          navigation.reset({
            index: 0,
            // routes: [{name: navigationStrings.BOTTOM_TABS}],
            routes: [
              {
                name: navigationStrings.BOTTOM_TABS,
                params: {
                  screen: navigationStrings.HOME, // 👈 your Home tab route name
                },
              },
            ],
          });
        } else {
          showError(response?.message);
          setIsSaveCard(false);
        }
      })
      .catch(errorMethod)
      .finally(() => setIsSaveCard(false));
  };

  return (
    <WrapperContainer>
      <View style={styles.header}>
        <Header
          rightImg={imagePath.more}
          isRightIcon={access}
          onPressRightImg={() =>
            navigation.navigate(navigationStrings.BUSINESS_CARD_DETAILS, {
              uuid: uuid,
              type: sharing ? 'EDIT' : 'EDIT_HOME',
            })
          }
          onPressLeftImg={() => navigation.goBack()}
        />
      </View>
      <KeyboardAwareScroll>
        <View style={styles.container}>
          {/* Profile Image Section */}
          <View style={styles.profileContainer}>
            <Image source={imagePath.cards_image} style={styles.profileImage} />
            <Text allowFontScaling={false} style={styles.nameText}>
              {cardData.name || 'No Name Available'}
            </Text>
            <Text allowFontScaling={false} style={styles.roleText}>
              {cardData.designation || 'No Designation'}
            </Text>

            {/* Tags Section */}

            <View style={styles.tagsContainer}>
              {cardData?.card_tag?.map(
                (
                  tagItem: any,
                  index: number, // Rename to tagItem for clarity
                ) => (
                  <View key={index} style={styles.tagBox}>
                    <Text allowFontScaling={false} style={styles.tagText}>
                      {tagItem?.tag?.tag.length > 10
                        ? tagItem?.tag?.tag.substring(0, 10) + '...'
                        : tagItem?.tag?.tag || 'NA'}
                    </Text>
                  </View>
                ),
              )}
            </View>
          </View>

          {/* Contact Icons Section */}
          {!sharing && (
            <View style={styles.contactIconsContainer}>
              <TouchableOpacity
                style={styles.contactIconBox}
                onPress={handleCall}
                disabled={!cardData?.phone_number}
              >
                <Image source={imagePath.call} style={styles.contactIcon} />
                <Text allowFontScaling={false} style={styles.iconLabel}>
                  {useTranslate('CALL')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactIconBox}
                onPress={handleSMS}
                disabled={!cardData?.phone_number}
              >
                <Image source={imagePath.sms} style={styles.contactIcon} />
                <Text allowFontScaling={false} style={styles.iconLabel}>
                  {useTranslate('SMS')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactIconBox}
                onPress={handleWhatsApp}
                disabled={!cardData?.phone_number || !cardData?.country_code}
              >
                <Image source={imagePath.whatsapp} style={styles.contactIcon} />
                <Text allowFontScaling={false} style={styles.iconLabel}>
                  {useTranslate('WHATSAPP')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactIconBox}
                onPress={handleEmail}
                disabled={!cardData?.email}
              >
                <Image source={imagePath.email} style={styles.contactIcon} />
                <Text allowFontScaling={false} style={styles.iconLabel}>
                  {useTranslate('EMAIL')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShareModal}
                style={styles.contactIconBox}
                disabled={!cardData?.name || !cardData?.company_name}
              >
                <Image source={imagePath.share} style={styles.contactIcon} />
                <Text allowFontScaling={false} style={styles.iconLabel}>
                  {useTranslate('SHARE')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Details Section */}
          <View style={styles.detailsContainer}>
            <Text allowFontScaling={false} style={styles.detailLabel}>
              {useTranslate('COMPANY_NAME')}
            </Text>
            <Text allowFontScaling={false} style={styles.detailValue}>
              {cardData.company_name || 'N/A'}
            </Text>

            <Text allowFontScaling={false} style={styles.detailLabel}>
              {useTranslate('SERVICE')}
            </Text>
            <Text allowFontScaling={false} style={styles.detailValue}>
              {cardData.service || 'N/A'}
            </Text>

            <Text allowFontScaling={false} style={styles.detailLabel}>
              {useTranslate('CONTACT_NUMBER')}
            </Text>
            <Text allowFontScaling={false} style={styles.detailValue}>
              +{cardData.country_code + ' ' + cardData.phone_number || 'N/A'}
            </Text>

            <Text allowFontScaling={false} style={styles.detailLabel}>
              {useTranslate('EMAIL')}
            </Text>
            <Text allowFontScaling={false} style={styles.detailValue}>
              {cardData.email || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Extra Fields Section */}
        <View style={styles.additionalInformation}>
          <FlatList
            scrollEnabled={false}
            data={cardData?.card_extra_filed || []}
            keyExtractor={item => item.uuid}
            renderItem={({ item }) => (
              <View>
                <Text allowFontScaling={false} style={styles.detailLabel}>
                  {item?.title}
                </Text>
                <Text allowFontScaling={false} style={styles.detailValue}>
                  {item?.description || 'N/A'}
                </Text>
              </View>
            )}
          />
        </View>

        {/* Export Details Button */}
        <ButtonComp
          title={
            isSaved && sharing
              ? useTranslate('SAVED_ALREADY')
              : sharing
              ? useTranslate('SAVE_CONTACT')
              : useTranslate('EXPORT_DETAILS')
          }
          btnStyle={styles.exportButton}
          btnTxtStyle={
            isSaved && sharing ? styles.savedbutton : styles.buttonText
          }
          disabled={(isSaved && sharing) || isSaveCard}
          isLoading={isSaveCard}
          onPress={() =>
            !isSaved && sharing
              ? handleSaveContact()
              : [
                  setExportType(null),
                  setExportTypeError(''),
                  setModalVisible(true),
                ]
          } // Show the modal
          gradientColors={
            isSaved && sharing
              ? [colors.grey, colors.grey] // Apply gradient based on backgroundColor
              : undefined // Default gradient colors
          }
        />

        {/* Delete Contact Button */}
        {!sharing && (
          <ButtonComp
            title="Delete Contact"
            gradientColors={[colors.AppWhite, colors.AppWhite]}
            btnTxtStyle={styles.buttonText2}
            onPress={() => setDeleteModalVisible(true)} // Show the delete confirmation modal
          />
        )}
      </KeyboardAwareScroll>

      {/* Dynamic Modal for Export */}
      <View>
        <DynamicModal
          isVisible={isModalVisible} // Modal visibility state
          title="Export as"
          options={[
            {
              radioButton: true,
              icon: imagePath.csv,
              onPress: () => {
                setExportTypeError('');
                setExportType('csv');
              },
            },
            {
              radioButton: true,
              icon: imagePath.pdf,
              onPress: () => {
                setExportTypeError('');
                setExportType('pdf');
              },
            },
          ]}
          buttons={[
            {
              label: useTranslate('EXPORT'),
              onPress: () => {
                setExportTypeError('');
                setExportButtonPress(true);
                if (!exportType) {
                  setExportTypeError(useTranslate('EXPORT_FORMAT_REQUIRED'));
                  return;
                } // Prevent execution if exportType is not selected
                exportType === 'csv' ? exportToCSV() : exportToPDF();
              },
            },
          ]}
          customContent={
            exportButtonPress && !!exportTypeError ? (
              <View style={styles.customContentContainer}>
                <Text allowFontScaling={false} style={styles.errorText}>
                  {exportTypeError}
                </Text>
              </View>
            ) : null
          }
          onClose={() => {
            setExportType(null);
            setModalVisible(false);
            setExportButtonPress(false); // Reset when modal closes
          }} // Close the modal
        />
      </View>
      {/* Dynamic Modal for Delete Confirmation */}
      {isDeleteModalVisible && (
        <View style={{ flex: 1 }}>
          <Logout
            isVisible={isDeleteModalVisible}
            message={useTranslate(
              'ARE_YOU_SURE_YOU_WANT_TO_DELETE_BUSINESS_CONTACT',
            )}
            ok={useTranslate('CONFIRM')}
            cancel={useTranslate('CANCEL')}
            onClose={check => hideDialog(check)} // Pass uuidNumber here
            isLoadingLogout={deleteLoading}
          />
        </View>
      )}
      {/*   Modal for internal and external sharing */}
      <View style={commonStyles.alignJustifyCenter}>
        <DynamicModal
          isVisible={isShareModalVisible} // Modal visibility for delete confirmation
          title="Share as"
          options={[
            {
              label: 'Internal',
              icon: imagePath.internal_icon,
              onPress: () => {
                setShareModalVisible(false);
                navigation.navigate(navigationStrings.INTERNAL_SHARING, {
                  card_uuid: cardData?.uuid,
                  access: access,
                });
              },
            },
            {
              label: 'External',
              icon: imagePath.external_icon,
              onPress: () => {
                setShareModalVisible(false);
                handleShare();
              },
            },
          ]}
          onClose={() => setShareModalVisible(false)} // Close the modal
        />
      </View>
    </WrapperContainer>
  );
};

export default EditScreen;
