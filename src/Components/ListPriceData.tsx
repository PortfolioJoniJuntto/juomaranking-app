import React, {useMemo} from 'react';
import {Text} from 'react-native';
import {formatPrice} from '../helpers';
import {PriceData, Product} from '../types/interfaces';

export default function ListPriceData({product}: {product: Product}) {
  const priceData = useMemo<PriceData | null>(() => {
    return product?.price_data?.reduce<PriceData | null>(
      (lowest, price) =>
        !lowest?.price || price.price < lowest?.price ? price : lowest,
      null,
    );
  }, [product]);

  if (priceData) {
    const {price} = priceData;
    return <Text className={'text-white font-p-bold text-lg'}>{formatPrice(price)}</Text>;
  }
  return null;
}
