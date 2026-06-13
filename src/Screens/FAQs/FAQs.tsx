import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import AuthHeader from '../../Components/AuthHeader';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { useTranslate } from '../../constants/lang';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import styles from './styles';
import actions from '../../redux/actions';
import { APP_LOG, errorMethod } from '../../utils/helperFunctions';
import { FaqShimmer } from '../../Components/ShimmerComp';
import Spacer from '../../Components/Spacer';

interface FAQ {
  question: string;
  answer: string;
}

interface CardProps {
  title: string;
  description: string;
  isExpanded: boolean;
  onPress: () => void;
}

const Card = ({ title, description, isExpanded, onPress }: CardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardExpansion}>
        <Text allowFontScaling={false} style={styles.title}>
          {title}{' '}
        </Text>
        <Image
          source={isExpanded ? imagePath.up_arrow_icon : imagePath.down_arrow2}
        />
      </View>
      {isExpanded && (
        <Text allowFontScaling={false} style={styles.description}>
          {description}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const FAQs = (props: any) => {
  const { navigation } = props;

  const [faqData, setFaqData] = useState<FAQ[]>([]);
  const [shimmerLoading, setShimmerLoading] = useState<boolean>(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // Track open index

  useEffect(() => {
    getFaqData();
  }, []);

  const getFaqData = () => {
    actions
      .getFaqs({})
      .then((res: any) => {
        let array: FAQ[] = [];
        if (res?.data) {
          res.data.forEach((element: any) => {
            array.push({
              question: element?.question,
              answer: element?.answer,
            });
          });
        }
        setFaqData(array);
        APP_LOG(res);
      })
      .catch(errorMethod)
      .finally(() => {
        setShimmerLoading(false);
      });
  };

  const handleToggle = (index: number) => {
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index)); // Close if the same, open otherwise
  };

  return (
    <WrapperContainer>
      <Header
        centerTitle={useTranslate('FAQS')}
        onPressLeftImg={() => navigation.goBack()}
      />
      <Spacer space={40} />
      <AuthHeader icon={imagePath.logo} />
      <View style={styles.safeArea}>
        {shimmerLoading ? (
          <FaqShimmer />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={faqData}
            renderItem={({ item, index }) => (
              <Card
                title={item.question}
                description={item.answer}
                isExpanded={expandedIndex === index}
                onPress={() => handleToggle(index)}
              />
            )}
            keyExtractor={item => item.question}
            ListFooterComponent={
              <View style={{ height: moderateScaleVertical(100) }} />
            }
          />
        )}
      </View>
    </WrapperContainer>
  );
};

export default FAQs;
