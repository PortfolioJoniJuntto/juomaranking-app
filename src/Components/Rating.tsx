import React, {useMemo} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import {formatHumanizedDateDiff, formatNumber} from '../helpers';
import Icon from 'react-native-vector-icons/Feather';

export default function Rating({item}: any) {
  const {width} = Dimensions.get('window');
  const maxWidth = useMemo(() => {
    return width - 42;
  }, [width]);

  return (
    <View
      className="flex-1 w-96 m-2 py-6 px-4 rounded-md bg-s-gray shadow-xl drop-shadow-2xl"
      style={{maxWidth: maxWidth}}>
      <View className="flex-row flex">
        <View className="w-10 h-12 rounded-3xl flex justify-center items-center">
          <Icon name="user" color={'white'} size={30} />
        </View>
        <View className="mx-2  max-w-xs">
          <Text className="text-white flex-wrap w-40">{item.username}</Text>
          <View className={'flex-row'}>
            <StarRatingDisplay rating={item.rating} starSize={18} />
            <Text className="text-white ml-1">{formatNumber(item.rating)}</Text>
          </View>
        </View>

        <Text
          className="text-white ml-auto flex-wrap text-xs"
          style={{maxWidth: 120}}>
          {formatHumanizedDateDiff(item.created_at)}
        </Text>
      </View>
      <View className="my-4">
        <Text className="text-white text-bl">{item.comment}</Text>
      </View>
    </View>
  );
}
