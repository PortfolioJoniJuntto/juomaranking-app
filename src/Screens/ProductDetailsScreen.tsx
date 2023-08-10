import AddReview from '@Components/AddReview';
import {useStateValue} from '@Context';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import orderBy from 'lodash/orderBy';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Rating from '../Components/Rating';
import {customFetch, formatNumber, formatPrice} from '../helpers';
import {ProductDetailsScreenProps} from '../navigation/types';
import {PriceData, ProductWithRatingsDTO} from '../types/interfaces';

const calculateAverage = (ratings: number[]) => {
  const total = ratings.reduce((prev, current) => {
    return prev + current;
  }, 0);

  let sum = 0;
  let k = 1;
  ratings.forEach(item => {
    sum += item * k;
    k++;
  });
  const r = sum / total;
  return {avg: Number(r.toFixed(1)), total};
};

export default function ProductDetailsScreen({
  route,
  navigation,
}: ProductDetailsScreenProps) {
  const [{auth}] = useStateValue();
  const {product: paramProduct} = route.params;
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(paramProduct as ProductWithRatingsDTO);
  const {t} = useTranslation();

  const modalRef = useRef<BottomSheetModal>(null);

  const getProduct = async () => {
    try {
      setLoading(true);
      const data: ProductWithRatingsDTO = await customFetch(
        `products/${product.ean}`,
        {
          method: 'GET',
        },
      );
      setProduct(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getProduct();
  }, [paramProduct]);

  const handlePresentModalPress = useCallback(() => {
    if (auth) {
      modalRef.current?.present();
    } else {
      navigation.navigate('LoginScreen');
    }
  }, []);

  const priceData = useMemo<PriceData[] | null>(() => {
    if (product.price_data) {
      return orderBy(product.price_data, 'price', 'asc');
    }
    return null;
  }, [product]);

  const PriceComponent = () => {
    if (priceData) {
      return (
        <View className="flex-row justify-center items-center">
          {priceData.length > 1 ? (
            <>
              <Text className={'text-white font-p-bold text-lg'}>
                {formatPrice(priceData[0].price)}
              </Text>
              <Text className="text-white font-p-bold mx-2">-</Text>
              <Text className={'text-white font-p-bold text-lg'}>
                {formatPrice(priceData[1].price)}
              </Text>
            </>
          ) : (
            <Text className={'text-white font-p-bold text-lg'}>
              {formatPrice(priceData[0].price)}
            </Text>
          )}
        </View>
      );
    }

    return null;
  };

  const ratings = useMemo(
    () => calculateAverage(Object.values(product?.stars || {})),
    [product],
  );

  return (
    <View className="bg-p-gray h-full">
      <SafeAreaView className="bg-white/80" />
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View className="pb-10 bg-white/80">
          <ImageBackground
            resizeMode="contain"
            source={{uri: product?.photo}}
            className={'bg-white justify-center items-center h-72'}>
            <View className="w-full h-full bg-black opacity-20" />
          </ImageBackground>
        </View>
        <Pressable
          onPress={() => navigation.goBack()}
          className="absolute top-4 left-4 bg-p-gray p-2 rounded-xl">
          <Icon name="chevron-left" size={24} color="white" />
        </Pressable>
        <View className="rounded-t-xl">
          <View className={'ml-5 px-2 mt-5 space-y-2 flex-1 mr-5'}>
            <Text className={'text-white text-2xl font-p-bold'}>
              {product?.name}
            </Text>
            <View className="flex-row items-center">
              <PriceComponent />
              {ratings.total > 0 && (
                <>
                  <View className="flex-row justify-center items-center mb-1">
                    <Text className="text-white mx-2 mt-1">&#183;</Text>
                    <Icon name="star" color="yellow" size={16} />
                    <Text
                      className={
                        'text-white text-s font-p-regular self-center ml-1 mt-1'
                      }>
                      {formatNumber(ratings.avg)}
                    </Text>
                    <Text className="text-white text-xs font-p-regular ml-1 mt-1">
                      ({ratings.total})
                    </Text>
                  </View>
                </>
              )}
            </View>
            <View className="mr-10">
              <View className="w-16 h-0.5 bg-white mb-4" />
              <Text className="text-white">
                {product.description_fi || t('products.noDescription')}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row justify-between items-center mt-4 mb-2">
          <Text className="text-white text-xl font-p-bold pl-6">
            {t('review.reviews')}
          </Text>
          <Pressable
            onPress={handlePresentModalPress}
            className="self-end mr-7">
            <View className={'flex-row justify-center items-center'}>
              <Text className={'text-white text-s italic underline'}>
                {t('review.addReview')}
              </Text>
            </View>
          </Pressable>
        </View>
        {product.ratings!?.length > 0 ? (
          <FlatList
            data={product.ratings}
            renderItem={({item, index}: any) => (
              <Rating item={item} key={index} />
            )}
            keyExtractor={item => item.created_at}
            horizontal={true}
            className="ml-4 mr-4 mb-10"
          />
        ) : (
          <Text className="text-white self-center mt-5">
            {t('review.noReviews')}
          </Text>
        )}
      </ScrollView>

      <BottomSheetModal
        ref={modalRef}
        index={0}
        handleIndicatorStyle={{
          backgroundColor: 'white',
        }}
        backdropComponent={() => (
          <Pressable
            onPress={() => modalRef?.current?.dismiss()}
            className="bg-black/80 absolute w-full h-full"
          />
        )}
        enablePanDownToClose={true}
        enableHandlePanningGesture={true}
        snapPoints={['50%']}
        backgroundStyle={{
          backgroundColor: '#18191D',
        }}
        handleStyle={{
          backgroundColor: '#18191D',
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
        }}>
        <AddReview
          product={product}
          onReview={() => {
            modalRef?.current?.dismiss();
            getProduct();
          }}
        />
      </BottomSheetModal>
    </View>
  );
}
