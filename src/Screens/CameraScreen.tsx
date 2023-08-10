import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {Barcode, BarcodeFormat, scanBarcodes} from 'vision-camera-code-scanner';
import {CameraScreenProps} from '../navigation/types';
import * as REA from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';
import {ProductRealmModel, useRealm} from '../realm';
import {Product} from '../types/interfaces';
import Toast from 'react-native-toast-message';
import {useTranslation} from 'react-i18next';

const lastBarcode = {
  current: null,
};
export default function CameraScreen({navigation}: CameraScreenProps) {
  const [isActive, setActive] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [flash, setFlash] = useState(false);
  const {t} = useTranslation();
  const realm = useRealm();
  const ref = useRef<any>(null);

  const setBarcodeResults = useCallback(
    (results: Barcode[]) => {
      const barcode = results?.[0]?.rawValue;
      setActive(false);
      if (
        barcode &&
        barcode.length > 0 &&
        (ref?.current?.result === barcode || lastBarcode.current === barcode)
      ) {
        return false;
      }
      ref.current = {
        result: barcode,
      };
      let products = realm
        .objects<ProductRealmModel>('Product')
        .filtered(`ean == "${barcode?.padStart(13, '0')}"`);
      if (products.length > 0) {
        navigation.replace('ProductDetailsScreen', {
          product: products[0] as Product,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('products.product_not_found'),
        });
      }
    },
    [navigation, isActive],
  );

  const {back} = useCameraDevices();

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    try {
      const detectedBarcodes = scanBarcodes(
        frame,
        [BarcodeFormat.EAN_8, BarcodeFormat.EAN_13],
        {checkInverted: true},
      );
      if (detectedBarcodes.length > 0) {
        REA.runOnJS(setBarcodeResults)(detectedBarcodes);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    lastBarcode.current = null;
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-p-gray">
      <View className="flex-row justify-center items-center w-screen">
        <Pressable
          onPress={() => navigation.goBack()}
          className="bg-s-gray ml-4 rounded-xl w-10 h-10 flex justify-center items-center absolute left-0">
          <Icon name="chevron-left" size={24} color="white" />
        </Pressable>
        <View className="flex-row justify-center items-center my-5 ">
          <Text className="text-xl ml-2 text-white ">{t('misc.scanEan')}</Text>
        </View>
      </View>
      {hasPermission && back !== void 0 && (
        <Camera
          torch={flash ? 'on' : 'off'}
          className="w-full h-full"
          device={back}
          isActive={isActive}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
      )}
      <View className="absolute bottom-16 w-screen flex justify-center items-center">
        <Pressable
          onPress={() => setFlash(!flash)}
          className="bg-s-gray rounded-xl w-16 h-16 flex justify-center items-center">
          <Icon name={flash ? 'zap-off' : 'zap'} size={24} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
