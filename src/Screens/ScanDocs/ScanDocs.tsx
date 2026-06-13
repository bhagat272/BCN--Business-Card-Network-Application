import ImageEditor from '@react-native-community/image-editor';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageCropPicker, { openCamera } from 'react-native-image-crop-picker';
import Svg, { Defs, Mask, Path, Rect } from 'react-native-svg';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import FastImageLoad from '../../Components/FastImageLoad';
import Header from '../../Components/Header';
import NativeLoader from '../../Components/NativeLoader';
import Spacer from '../../Components/Spacer';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import navigationStrings from '../../constants/navigationStrings';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import { height, moderateScale, width } from '../../styles/responsiveSize';
import {
  APP_LOG,
  errorMethod,
  isIos,
  showError,
} from '../../utils/helperFunctions';
import { requestCameraPermission } from '../../utils/permissions';
import styles from './styles';
import { useSelector } from 'react-redux';
import actions from '../../redux/actions';
import RNFetchBlob from 'react-native-blob-util';
import { openMediaCropper } from '../../utils/ImagePicker';

export let fileSystem = RNFetchBlob.fs;
export let cameraMediaPath = `${fileSystem.dirs.DocumentDir}/camera`;

const ScanDocs = (props: any) => {
  const { navigation } = props;
  // const [isPotrait, setPotrait] = useState(true);
  const { userData } = useSelector((state: any) => state?.auth);

  const [hasPermission, setHasPermission] = useState(false);
  const [image, setImage] = useState('');
  const [selectedOption, setSelectedOption] = useState<'single' | 'twoSide'>(
    'single',
  );
  const [flashMode, setFlashMode] = useState<'on' | 'off'>('off');
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null); // Camera ref for taking photos
  const scanningLineAnim = useRef(new Animated.Value(0)).current;
  // const [isLandscape, setIsLandscape] = useState(width > height);
  const isFocused = useIsFocused();

  // Ref to track if the component is mounted
  const isMountedRef = useRef(true);

  // Ref to store the AbortController for cancelling API calls
  const abortControllerRef = useRef<AbortController | null>(null);

  const SCAN_AREA_WIDTH = width * 0.9;
  const SCAN_AREA_HEIGHT = 197;
  const BORDER_RADIUS = 12;

  useEffect(() => {
    // Set isMounted to true when the component mounts
    isMountedRef.current = true;

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      // Cancel any ongoing API calls
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        APP_LOG('API call cancelled on unmount');
      }
    };
  }, []);

  const toggleFlash = () => {
    setFlashMode(prevFlashMode => (prevFlashMode === 'off' ? 'on' : 'off'));
  };

  const requestCameraPermissionCheck = async () => {
    await requestCameraPermission().then((res: any) => {
      setHasPermission(res === 'granted');
      if (res === 'denied') {
        // navigation.goBack();
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      requestCameraPermissionCheck();
    }, []),
  );

  useEffect(() => {
    startAnimation();
    // const handleOrientationChange = () => {
    //   setIsLandscape(width > height);
    // };

    // Dimensions.addEventListener('change', handleOrientationChange);
    // handleOrientationChange();

    return () => {};
  }, [scanningLineAnim]);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanningLineAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanningLineAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsCameraActive(true); // Activate camera on focus
      return () => setIsCameraActive(false); // Deactivate camera on blur
    }, []),
  );

  const handleGalleryPress = async () => {
    try {
      setLoading(true);
      const image = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        width: width,
        includeBase64: false,
      });
      setImage(image?.path);
      const isPremium = Number(userData?.is_premium) === 1;
      const isFreeUser = Number(userData?.is_premium) === 0;
      const canFreeUserScanMore =
        userData?.card_count < userData?.total_card_count;

      if ((isFreeUser && canFreeUserScanMore) || isPremium) {
        setLoading(true);
        handleExtractDetailsFromCard(image);
      } else {
        setLoading(false);
        if (isFreeUser) {
          navigation.navigate(navigationStrings.SUBSCRIPTION_PLANS);
        } else {
          showError('You have reached the limit of card scans.');
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const capturePhoto = async () => {
    const isPremium = Number(userData?.is_premium) === 1;
    const isFreeUser = Number(userData?.is_premium) === 0;
    const canFreeUserScanMore =
      userData?.card_count < userData?.total_card_count;

    if ((isFreeUser && canFreeUserScanMore) || isPremium) {
      if (cameraRef.current) {
        try {
          let photo: any = await cameraRef.current.takePhoto();
          setLoading(true);
          if (isIos) {
            const rotate =
              photo.metadata?.Orientation === 6
                ? 90
                : photo.metadata?.Orientation === 8
                ? -90
                : photo.metadata?.Orientation === 3
                ? 180
                : 0;
            photo = await ImageResizer.createResizedImage(
              `file://${photo.path}`,
              Math.max(photo.width, photo.height) || 1500,
              Math.max(photo.width, photo.height) || 1500,
              'PNG',
              100,
              rotate,
            );
          }
          const sizesOffset = isIos
            ? {
                width: photo.width,
                height: photo.height,
                compressImageMaxWidth: photo.width,
                compressImageMaxHeight: photo.height,
              }
            : {};
          openMediaCropper({
            mediaType: 'photo',
            path: `file://${photo.path}`,
            freeStyleCropEnabled: true,
            compressImageQuality: 0.5,
            ...sizesOffset,
          })
            .then(cropped => {
              APP_LOG('Cropped image', cropped);
              setLoading(true);
              setImage(cropped?.path);

              handleExtractDetailsFromCard({
                ...cropped,
                name: photo.name || photo.filename,
              });
            })
            .catch(err => {
              setLoading(false);
              APP_LOG('Cropper error', err);
            });
        } catch (error) {
          setLoading(false);
          showError('Error capturing photo');
        }
      }
    } else {
      if (isFreeUser) {
        navigation.navigate(navigationStrings.SUBSCRIPTION_PLANS);
      } else {
        showError('You have reached the limit of card scans.');
      }
    }
  };

  // OLD APPROACH
  // const cropToSelectedArea = async (imageUri: string) => {
  //   try {
  //     if (!imageUri) {
  //       showError('Invalid image path');
  //       return;
  //     }

  //     // Ensure proper URI format
  //     const uri = imageUri.startsWith('file://')
  //       ? imageUri
  //       : `file://${imageUri}`;
  //     let cropOffset, cropSize;

  //     // Portrait mode: use original parameters
  //     if (isPotrait) {
  //       cropOffset = { x: width - 10, y: height * 2 }; // original values
  //       cropSize = { width: width * 5, height: height * 1.3 }; // original values
  //     } else {
  //       cropOffset = { x: height * 2, y: width - 10 }; // original values
  //       cropSize = { width: height * 1.3, height: width * 5 }; // original values
  //     }

  //     const result = await ImageEditor.cropImage(uri, {
  //       offset: cropOffset,
  //       size: cropSize,
  //     });

  //     console.log('Cropped image uri:', result);
  //     setImage(result?.path);
  //     setLoading(true);
  //     result && handleExtractDetailsFromCard(result);
  //   } catch (err) {
  //     // console.error('Error cropping image:', err);
  //     // showError('Error capturing image');
  //   }
  // };

  // NEW APPROACH
  // const cropToSelectedArea = async (photo: any) => {
  //   try {
  //     let imageUri = photo?.path || photo?.uri;
  //     if (!imageUri) {
  //       showError('Invalid image path');
  //       return;
  //     }

  //     const rotate =
  //       photo.metadata?.Orientation === 6
  //         ? 90
  //         : photo.metadata?.Orientation === 8
  //         ? -90
  //         : photo.metadata?.Orientation === 3
  //         ? 180
  //         : 0;

  //     APP_LOG('Original image URI:', imageUri, 'Rotation:', rotate);

  //     const imageSize =
  //       photo?.width > photo?.height ? photo?.width : photo?.height;

  //     const normalized = await ImageResizer.createResizedImage(
  //       imageUri,
  //       imageSize || 1500,
  //       imageSize || 1500,
  //       'JPEG',
  //       100,
  //       rotate,
  //       fileSystem.dirs.DocumentDir,
  //       false,
  //       {
  //         mode: 'contain',
  //       },
  //     );

  //     let cropOffset, cropSize;
  //     if (isIos) {
  //       cropOffset = { x: width - 10, y: height * 2 };
  //       cropSize = { width: width * 4.5, height: height * 1.15 };
  //     } else {
  //       cropOffset = { x: width - 10, y: height * 1.5 };
  //       cropSize = { width: width * 4.5, height: height * 1.15 };
  //     }

  //     ImageEditor.cropImage(isIos ? normalized.uri : `file://${imageUri}`, {
  //       offset: cropOffset,
  //       size: cropSize,
  //     })
  //       .then(async result => {
  //         setImage(result.uri);

  //         if (result) {
  //           setLoading(true);
  //           handleExtractDetailsFromCard(result);
  //         }
  //       })
  //       .catch(error => {});
  //   } catch (err) {
  //     // showError('Error capturing image');
  //   }
  // };

  const renderScannerCorners = () => {
    const cornerSize = 20;
    const strokeWidth = 4;
    const left = (width - SCAN_AREA_WIDTH) / 2;
    const top = (height - SCAN_AREA_HEIGHT) / 2;

    return (
      <>
        {/* Top Left */}
        <Path
          d={`M ${left},${top + cornerSize} V ${top} H ${left + cornerSize}`}
          stroke="white"
          strokeWidth={strokeWidth}
          fill={'none'}
        />
        {/* Top Right */}
        <Path
          d={`M ${left + SCAN_AREA_WIDTH - cornerSize},${top} H ${
            left + SCAN_AREA_WIDTH
          } V ${top + cornerSize}`}
          stroke="white"
          strokeWidth={strokeWidth}
          fill={'none'}
        />
        {/* Bottom Left */}
        <Path
          d={`M ${left},${top + SCAN_AREA_HEIGHT - cornerSize} V ${
            top + SCAN_AREA_HEIGHT
          } H ${left + cornerSize}`}
          stroke="white"
          strokeWidth={strokeWidth}
          fill={'none'}
        />
        {/* Bottom Right */}
        <Path
          d={`M ${left + SCAN_AREA_WIDTH - cornerSize},${
            top + SCAN_AREA_HEIGHT
          } H ${left + SCAN_AREA_WIDTH} V ${
            top + SCAN_AREA_HEIGHT - cornerSize
          }`}
          stroke="white"
          strokeWidth={strokeWidth}
          fill={'none'}
        />
      </>
    );
  };

  const handleExtractDetailsFromCard = async (file: any) => {
    APP_LOG('handleExtractDetailsFromCard', file);
    const formData = new FormData();
    formData.append('image', {
      uri: file?.uri || file?.path,
      name: file?.filename || file?.name,
      type: file?.mime || file?.type,
    });
    try {
      abortControllerRef.current = new AbortController();
      // const signal = abortControllerRef.current.signal;
      const result = await actions.extractBusinessCard(formData);

      if (isMountedRef.current && isFocused) {
        if (result?.status === true || result?.status === 'true') {
          navigation.navigate(navigationStrings.BUSINESS_CARD_DETAILS, {
            data: result?.data?.structuredData,
            onBack: () => {
              navigation.goBack();
            },
          });
          setLoading(false);
        } else {
          result?.message && showError(result?.message);
          setImage('');
          startAnimation();
          setLoading(false);
        }
      } else {
        APP_LOG('Navigation skipped: Component unmounted or not focused');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        APP_LOG('API call aborted');
      } else {
        if (isMountedRef.current) {
          setImage('');
          startAnimation();
          errorMethod(error);
        }
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  if (!hasPermission) {
    return (
      <WrapperContainer>
        <Header
          isLeftImg={true}
          mainContainer={styles.overlay}
          onPressLeftImg={() => navigation.goBack()}
        />

        <View style={{ ...commonStyles.flex1AlignJustifyCenter }}>
          <Text>No Camera Permission...</Text>
          <Spacer space={80} />
        </View>
      </WrapperContainer>
    );
  }

  if (!device) {
    return (
      <WrapperContainer>
        <Header
          isLeftImg={true}
          mainContainer={styles.overlay}
          onPressLeftImg={() => navigation.goBack()}
        />
        <View style={{ ...commonStyles.flex1AlignJustifyCenter }}>
          <Text>Loading camera...</Text>
          <Spacer space={80} />
          <NativeLoader size={'large'} color={colors.grayishBlue} />

          <TouchableOpacity
            style={styles.galleryButton}
            onPress={handleGalleryPress}
          >
            <Image source={imagePath.gallery_icon} />
          </TouchableOpacity>
        </View>
      </WrapperContainer>
    );
  }

  if (isLoading) {
    return (
      <View
        style={{ ...styles.container, backgroundColor: colors.blackOpacity40 }}
      >
        <Header
          isLeftImg={true}
          mainContainer={styles.overlay}
          onPressLeftImg={() => {
            // Cancel the API call when going back
            if (abortControllerRef.current) {
              abortControllerRef.current.abort();
              APP_LOG('API call cancelled on go back');
            }
            setLoading(false);
            setImage('');
            navigation.goBack();
          }}
        />
        <View
          style={{
            ...styles.scannerOverlay,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
        >
          <FastImageLoad
            style={{
              width: SCAN_AREA_WIDTH,
              height: SCAN_AREA_HEIGHT,
              borderColor: colors.lightGray,
              borderWidth: 1,
              borderRadius: moderateScale(10),
            }}
            resizeMode="contain"
            source={{ uri: image }}
          />
          <ActivityIndicator
            style={{
              position: 'absolute',
              start: 0,
              end: 0,
              top: 0,
              bottom: 0,
            }}
            color={colors.themeColor}
            size={'large'}
          />
        </View>
      </View>
    );
  }

  const translateY = scanningLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_AREA_HEIGHT], // Adjusted full movement range
  });

  return (
    <View style={styles.container}>
      <Header
        isLeftImg={true}
        leftImg={
          !isLoading ? imagePath.transparent_back_icon : imagePath.back_ic
        }
        mainContainer={styles.overlay}
        onPressLeftImg={() => navigation.goBack()}
      />

      <Camera
        ref={cameraRef}
        style={styles.cameraPreview}
        device={device}
        isActive={isCameraActive}
        photoQualityBalance={'quality'}
        photo={true}
        torch={flashMode} // Control the torch mode
        // onUIRotationChanged={(uiRotatation: number) => {
        //   if (uiRotatation == 90 || uiRotatation == -90) {
        //     setPotrait(false);
        //   } else {
        //     setPotrait(true);
        //   }
        // }}
        outputOrientation="preview"
      />

      {/* <View style={styles.scannerOverlay}>
        <View style={styles.scanningArea}>
          <View style={[styles.cornerStyle, styles.topLeft]} />
          <View style={[styles.cornerStyle, styles.topRight]} />
          <View style={[styles.cornerStyle, styles.bottomLeft]} />
          <View style={[styles.cornerStyle, styles.bottomRight]} />
          <Animated.View
            style={[styles.scanningLine, { transform: [{ translateY }] }]}
          />
        </View>
      </View> */}

      <View style={styles.scannerOverlay}>
        <Svg height="100%" width="100%">
          <Defs>
            <Mask id="mask" x="0" y="0" height="100%" width="100%">
              <Rect width="100%" height="100%" fill="white" />
              <Rect
                x={(width - SCAN_AREA_WIDTH) / 2}
                y={(height - SCAN_AREA_HEIGHT) / 2}
                width={SCAN_AREA_WIDTH}
                height={SCAN_AREA_HEIGHT}
                fill="black"
              />
            </Mask>
          </Defs>

          <Rect
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.8)"
            mask="url(#mask)"
          />

          {renderScannerCorners()}
        </Svg>

        <Animated.View
          style={[
            styles.scanningLine,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              transform: [{ translateY }],
              position: 'absolute', // Ensure it's above the overlay
              top: (height - SCAN_AREA_HEIGHT) / 2, // Position at the top of scan area
              left: (width - SCAN_AREA_WIDTH) / 2, // Align horizontally
              width: SCAN_AREA_WIDTH,
            },
          ]}
        />
      </View>

      <View style={styles.bottomBarContainer}>
        <TouchableOpacity
          disabled={isLoading}
          style={styles.captureButton}
          onPress={capturePhoto}
        >
          <View style={styles.innerCaptureButton} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
        <Image source={imagePath.flash_icon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.galleryButton}
        onPress={handleGalleryPress}
      >
        <Image source={imagePath.gallery_icon} />
      </TouchableOpacity>
    </View>
  );
};

export default ScanDocs;
