import React from 'react';
import {ImageBackground, Pressable, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {ProductItemProps} from '../types/interfaces';
import {formatNumber, getThumbnailUrl} from '../helpers';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../navigation/types';
import ListPriceData from './ListPriceData';

const ProductCardItem = React.memo(({product}: ProductItemProps) => {
  const navigation = useNavigation<NavigationProps>();
  return (
    <Pressable
      className="rounded-xl w-2/4"
      onPress={() => {
        navigation.navigate('ProductDetailsScreen', {product});
      }}>
      <View className={'bg-s-gray m-1 rounded-xl'}>
        <View className={'w-max bg-white rounded-t-xl'}>
          <ImageBackground
            resizeMode="contain"
            style={{
              backgroundColor: 'transparent',
            }}
            source={{uri: getThumbnailUrl(product.ean)}}
            className={'h-36 w-full'}>
            <View className="w-full h-full bg-black opacity-20" />
          </ImageBackground>
          {product?.amount_of_ratings > 0 && (
            <View
              className={
                'flex-row justify-center items-center absolute top-0 right-0 rounded-bl-xl rounded-tr-xl bg-white/0 bg-p-gray p-1 w-8'
              }>
              <Text className={'text-white m-0 p-0'}>
                {formatNumber(product?.average_rating, 2)}
              </Text>
              <Icon name={'star'} color="white" />
            </View>
          )}
        </View>
        <View className={'flew-row m-2 h-20'}>
          <Text className={'text-white text-xs'} numberOfLines={3}>
            {product?.name}
          </Text>
          <ListPriceData product={product} />
        </View>
      </View>
    </Pressable>
  );
});
export default ProductCardItem;
