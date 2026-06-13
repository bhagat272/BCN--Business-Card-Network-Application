import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { moderateScale } from '../styles/responsiveSize';
import colors from '../styles/colors';
import Header from './Header';
import { useTranslate } from '../constants/lang';
import commonStyles from '../styles/commonStyles';
import NativeLoader from './NativeLoader';
import WrapperContainer from './WrapperContainer';

interface ExtractedDataModalProps {
  isVisible: boolean;
  onClose: () => void;
  loading?: boolean;
  data: string[];
  onSelect: (item: string) => void;
}

const ExtractedDataModal: React.FC<ExtractedDataModalProps> = ({
  isVisible,
  onClose,
  data,
  onSelect,
  loading,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <WrapperContainer>
        <View style={styles.modalOverlay}>
          <Header
            centerTitle={useTranslate('EXTRACTED_DETAILS')}
            onPressLeftImg={onClose}
            centerTitleStyle={{ marginStart: moderateScale(4) }}
          />
          {loading ? (
            <NativeLoader size={'large'} color={colors.darkblue} />
          ) : (
            <View style={styles.modalContent}>
              {data?.length > 0 ? (
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                  {data.map((item, index) => (
                    <TouchableOpacity
                      key={index.toString()}
                      onPress={() => onSelect(item)}
                      style={styles.extractedDataTxtContainer}
                    >
                      <Text
                        allowFontScaling={false}
                        style={styles.extractedDataTxt}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View style={{ ...commonStyles.flex1AlignJustifyCenter }}>
                  <Text
                    allowFontScaling={false}
                    style={{ ...commonStyles.font13 }}
                  >
                    {useTranslate('NO_DATA_FOUND')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </WrapperContainer>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.AppWhite,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalCloseButton: {
    marginTop: moderateScale(10),
    alignSelf: 'center',
  },
  modalCloseButtonText: {
    color: 'blue',
    fontSize: moderateScale(16),
  },
  extractedDataTxtContainer: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  extractedDataTxt: {
    ...commonStyles.font14,
  },
});

export default ExtractedDataModal;
