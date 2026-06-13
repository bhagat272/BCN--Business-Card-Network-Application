import React from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';

import { ScrollView, StyleSheet, View } from 'react-native';
import colors from '../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../styles/responsiveSize';
import Spacer from './Spacer';

export const EditScreenSimmer: React.FC = () => {
  return (
    <View style={styles.editScreenContainer}>
      {/* Profile Image Loader */}
      <View style={styles.loaderContainer}>
        <ContentLoader
          speed={1}
          width={moderateScale(105)}
          height={moderateScale(105)}
          backgroundColor="#f0f0f0"
          foregroundColor="#e0e0e0"
        >
          <Circle cx="52.5" cy="52.5" r="52.5" />
        </ContentLoader>
      </View>

      {/* Name and Role Text Loader */}
      <View style={styles.loaderContainer}>
        <ContentLoader
          speed={1}
          width={moderateScale(150)}
          height={moderateScale(20)}
          backgroundColor="#f0f0f0"
          foregroundColor="#e0e0e0"
        >
          <Rect x="0" y="0" rx="10" ry="10" width="100%" height="20" />
        </ContentLoader>
      </View>
      <View style={styles.loaderContainer}>
        <ContentLoader
          speed={1}
          width={moderateScale(120)}
          height={moderateScale(15)}
          backgroundColor="#f0f0f0"
          foregroundColor="#e0e0e0"
        >
          <Rect x="0" y="0" rx="10" ry="10" width="100%" height="15" />
        </ContentLoader>
      </View>

      {/* Tags Section Loader */}
      <View style={styles.loaderContainer}>
        <ContentLoader
          speed={1}
          width={width}
          height={moderateScale(32)}
          viewBox={`0 0 ${width} ${moderateScale(32)}`}
          backgroundColor="#f0f0f0"
          foregroundColor="#e0e0e0"
        >
          <Rect
            x={width * 0.15}
            y="0"
            rx="16"
            ry="16"
            width={width * 0.2}
            height={moderateScale(32)}
          />
          <Rect
            x={width * 0.4}
            y="0"
            rx="16"
            ry="16"
            width={width * 0.2}
            height={moderateScale(32)}
          />
          <Rect
            x={width * 0.65}
            y="0"
            rx="16"
            ry="16"
            width={width * 0.2}
            height={moderateScale(32)}
          />
        </ContentLoader>
      </View>

      {/* Contact Icons Section Loader */}
      <View style={styles.loaderContainer}>
        <ContentLoader
          speed={1}
          width={width - 20}
          height={moderateScale(108)}
          backgroundColor="#f0f0f0"
          foregroundColor="#e0e0e0"
        >
          <Rect x="0" y="0" rx="10" ry="10" width="100%" height="104" />
        </ContentLoader>
      </View>

      {/* Details Section Loader */}
      <View style={styles.detailsContainer}>
        {[1, 2, 3].map((_, index) => (
          <ContentLoader
            key={index}
            speed={1}
            width={width - 32}
            height={moderateScale(60)}
            backgroundColor="#f0f0f0"
            foregroundColor="#e0e0e0"
            borderRadius={moderateScale(16)}
            marginVertical={moderateScaleVertical(5)}
          >
            <Rect x="10" y="15" rx="10" ry="10" width="80%" height="20" />
            <Rect x="10" y="40" rx="10" ry="10" width="30%" height="20" />
          </ContentLoader>
        ))}
      </View>

      {/* Buttons Loader */}
      <View style={styles.loaderContainer2}>
        <ContentLoader
          speed={1}
          width={width - 20}
          height={moderateScale(56)}
          backgroundColor="#f0f0f0"
          foregroundColor="#e0e0e0"
        >
          <Rect x="0" y="0" rx="10" ry="10" width="100%" height="56" />
        </ContentLoader>
      </View>
    </View>
  );
};

export const HomeLoader: React.FC = () => (
  <ScrollView showsVerticalScrollIndicator={false}>
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, key) => (
      <View
        key={key}
        style={{
          marginHorizontal: moderateScale(18),
          marginBottom: moderateScale(-7),
        }}
      >
        <ContentLoader
          speed={1}
          width={moderateScale(339)}
          height={moderateScaleVertical(125)}
          backgroundColor="#f0f0f0"
          foregroundColor="#e0e0e0"
        >
          {/* Circular shimmer for the left image */}
          <Circle cx="40" cy="50" r="28" />

          {/* Rectangular shimmer for the card content */}
          <Rect x="80" y="20" rx="10" ry="10" width="70%" height="15" />
          <Rect x="80" y="50" rx="8" ry="8" width="50%" height="13" />
          <Rect x="80" y="75" rx="8" ry="8" width="60%" height="12" />
          {/* Row of three small boxes aligned just below the third row */}
          <Rect x="80" y="100" rx="10" ry="10" width="10%" height="18" />
          <Rect x="120" y="100" rx="10" ry="10" width="10%" height="18" />
          <Rect x="160" y="100" rx="10" ry="10" width="10%" height="18" />
        </ContentLoader>
      </View>
    ))}
    <Spacer space={100} />
  </ScrollView>
);

export const ConnectionLoader: React.FC = () =>
  [1, 2, 3, 4, 5, 6, 7].map((item, key) => {
    return (
      <View
        key={key}
        style={{
          marginHorizontal: moderateScale(18),
          // marginBottom: moderateScale(-40),
        }}
      >
        <ContentLoader
          speed={1}
          width={moderateScale(339)}
          height={moderateScaleVertical(80)} // Adjusted height to fit all elements
          backgroundColor="#f0f0f0"
          foregroundColor="#e0e0e0"
        >
          {/* Circular shimmer for the left image */}
          <Circle cx="40" cy="50" r="28" />

          {/* Rectangular shimmer for the card content */}
          <Rect x="80" y="20" rx="10" ry="10" width="70%" height="15" />
          <Rect x="80" y="50" rx="8" ry="8" width="50%" height="13" />
          {/* <Rect x="80" y="75" rx="8" ry="8" width="60%" height="12" /> */}
          {/* Row of three small boxes aligned just below the third row */}
        </ContentLoader>
      </View>
    );
  });

export const FaqShimmer: React.FC = () => {
  return (
    <View style={{ marginHorizontal: moderateScale(-7) }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((_, index) => {
        return (
          <ContentLoader
            key={index}
            speed={1.5}
            width={width}
            height={moderateScale(60)}
            viewBox={`0 0 ${width} ${moderateScale(60)}`}
            backgroundColor="#f0f0f0"
            foregroundColor="#e0e0e0"
          >
            <Rect
              x={moderateScale(10)}
              y={moderateScale(5)}
              rx="16"
              ry="16"
              width={width * 0.9}
              height={moderateScaleVertical(50)}
            />
          </ContentLoader>
        );
      })}
    </View>
  );
};

export const ConnectionDetailSimmer: React.FC = () => {
  return (
    <View style={styles.editScreenContainer}>
      {/* Profile Image Loader */}
      <View style={styles.loaderContainer}>
        <ContentLoader
          speed={1}
          width={moderateScale(105)}
          height={moderateScale(105)}
          backgroundColor="#f0f0f0"
          foregroundColor="#e0e0e0"
        >
          <Circle cx="52.5" cy="52.5" r="52.5" />
        </ContentLoader>
      </View>

      {/* Name and Role Text Loader */}
      <View style={styles.loaderContainer}>
        <ContentLoader
          speed={1}
          width={moderateScale(150)}
          height={moderateScale(20)}
          backgroundColor="#f0f0f0"
          foregroundColor="#e0e0e0"
        >
          <Rect x="0" y="0" rx="10" ry="10" width="100%" height="20" />
        </ContentLoader>
      </View>

      {/* Details Section Loader */}
      <View style={styles.connectionLoaderContainer}>
        {[1, 2, 3].map((_, index) => (
          <ContentLoader
            speed={1}
            key={index}
            width={width - 20}
            height={moderateScaleVertical(101)}
            backgroundColor="#f0f0f0"
            foregroundColor="#e0e0e0"
          >
            <Rect x="1" y="15" rx="10" ry="10" width="50%" height="18" />
            <Rect x="0" y="50" rx="10" ry="10" width="100%" height="56" />
          </ContentLoader>
        ))}
      </View>

      {/* Buttons Loader */}
      <View style={styles.loaderContainer2}>
        <ContentLoader
          speed={1}
          width={width - 20}
          height={moderateScale(56)}
          backgroundColor="#f0f0f0"
          foregroundColor="#e0e0e0"
        >
          <Rect x="0" y="0" rx="10" ry="10" width="100%" height="56" />
        </ContentLoader>
      </View>
    </View>
  );
};

export const NotificationSimmer: React.FC = () => {
  const numSections = 4;
  const itemsPerSection = 2;

  return (
    <View style={styles.container}>
      {/* Simulate Sections and Items */}
      {[...Array(numSections)].map((_, sectionIndex) => (
        <View key={sectionIndex} style={styles.sectionContainer}>
          {/* Section Header */}
          <ContentLoader
            speed={1}
            width={width}
            height={moderateScaleVertical(40)}
            viewBox={`0 0 ${width} ${moderateScaleVertical(40)}`}
            backgroundColor="#f0f0f0"
            foregroundColor="#e0e0e0"
          >
            <Rect x="10" y="10" rx="5" ry="5" width="80" height="20" />
            {sectionIndex === 0 && (
              <Rect
                x={width - 120}
                y="10"
                rx="5"
                ry="5"
                width="100"
                height="20"
              />
            )}
          </ContentLoader>

          {/* Notification Items */}
          {[...Array(itemsPerSection)].map((_, itemIndex) => (
            <ContentLoader
              key={itemIndex}
              speed={1}
              width={width - 20} // Margin on sides
              height={moderateScaleVertical(80)}
              viewBox={`0 0 ${width - 20} ${moderateScaleVertical(80)}`}
              backgroundColor="#f0f0f0"
              foregroundColor="#e0e0e0"
            >
              <Rect x="10" y="10" rx="5" ry="5" width="200" height="15" />
              <Rect
                x="10"
                y="30"
                rx="5"
                ry="5"
                width={width - 100}
                height="40"
              />
              <Rect
                x={width - 80}
                y="10"
                rx="5"
                ry="5"
                width="60"
                height="15"
              />
            </ContentLoader>
          ))}
        </View>
      ))}
    </View>
  );
};

export const SubscriptionShimmer: React.FC = () => {
  return (
    <View style={styles.subscriptionContainer}>
      <ContentLoader
        speed={1}
        width={'100%'}
        height={height}
        backgroundColor="#f0f0f0"
        foregroundColor="#e0e0e0"
      >
        <Rect x="0" y="20" rx="6" ry="6" width={width / 2} height="35" />
        <Rect x="0" y="70" rx="15" ry="15" width="120" height="30" />
        <Rect x="180" y="70" rx="15" ry="15" width="120" height="30" />
        <Rect
          x="0"
          y="120"
          rx="10"
          ry="10"
          width={width / 2.5}
          height={width / 2.5}
        />
        <Rect
          x={width / 2.5 + 20}
          y="120"
          rx="10"
          ry="10"
          width={width / 2.5}
          height={width / 2.5}
        />
        <Circle cx="10" cy={320} r="10" />
        <Rect x="30" y={310} rx="6" ry="6" width={width / 1.3} height="20" />
        <Rect x="30" y={340} rx="6" ry="6" width="280" height="20" />
        <Circle cx="10" cy={390} r="10" />
        <Rect x="30" y={380} rx="6" ry="6" width={width / 1.3} height="20" />
        <Rect x="30" y={410} rx="6" ry="6" width="280" height="20" />
        <Circle cx="10" cy={460} r="10" />
        <Rect x="30" y={450} rx="6" ry="6" width={width / 1.3} height="20" />
        <Rect x="30" y={480} rx="6" ry="6" width="280" height="20" />
        <Circle cx="10" cy={530} r="10" /> {/* Tick */}
        <Rect x="30" y={520} rx="6" ry="6" width={width / 1.3} height="20" />
        <Rect x="30" y={550} rx="6" ry="6" width="280" height="20" />
        <Circle cx="10" cy={590} r="10" /> {/* Tick */}
        <Rect x="30" y={580} rx="6" ry="6" width={width / 1.3} height="20" />
        <Rect x="30" y={610} rx="6" ry="6" width="280" height="20" />
        <Rect
          x="0"
          y={height - 140}
          rx="10"
          ry="10"
          width={width - 45}
          height="60"
        />
      </ContentLoader>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  editScreenContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: moderateScaleVertical(30),
  },
  loaderContainer: {
    marginBottom: moderateScale(16),
    alignItems: 'center',
  },
  connectionLoaderContainer: {
    marginTop: moderateScaleVertical(20),
    alignItems: 'center',
  },
  loaderContainer2: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  socialContainer: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(20),
  },
  detailsContainer: {
    marginTop: moderateScaleVertical(1),
    marginBottom: moderateScale(30),
    paddingVertical: moderateScaleVertical(5),
  },
  sectionContainer: {
    marginTop: moderateScaleVertical(10),
  },
  subscriptionContainer: {
    paddingHorizontal: moderateScale(20),
  },
});
