import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {customFetch} from '@Helpers';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import Toast from 'react-native-toast-message';

import {Product} from '../types/interfaces';

export default function AddReview({
  product,
  onReview,
}: {
  product: Product;
  onReview: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const {t} = useTranslation();

  const addReview = async () => {
    setLoading(true);
    if (!rating) {
      Toast.show({
        type: 'error',
        text1: t('review.rating_required'),
      });
      return false;
    }
    try {
      await customFetch(`ratings/${product.ean}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
          comment: comment,
        }),
      });
      Toast.show({
        type: 'success',
        text1: t('review.rating_added'),
      });
      setComment('');
      setRating(0);
      onReview();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: t('review.rating_failed'),
      });
    }
    setLoading(false);
  };
  return (
    <View className={'flex-1 justify-between bg-p-gray p-4 mb-6'}>
      <View className="self-center">
        <Text className="text-xl text-white font-p-bold mb-3 self-center">
          {t('review.comment')}
        </Text>
        <StarRating
          enableHalfStar={false}
          rating={rating}
          onChange={e => setRating(e)}
        />
      </View>
      <BottomSheetTextInput
        value={comment}
        placeholder={t('review.commentPlaceholder')}
        onChangeText={text => setComment(text)}
        maxLength={180}
        numberOfLines={4}
        multiline={true}
        style={{
          textAlignVertical: 'top',
          backgroundColor: '#fff',
          borderRadius: 10,
          height: 100,
          paddingLeft: 10,
          paddingTop: 10,
        }}
      />

      <Pressable
        onPress={addReview}
        disabled={!rating}
        className={`flex-row justify-center h-14 items-center bg-s-gray ${
          rating ? 'bg-red-400' : 'bg-s-gray/30'
        } rounded-xl`}>
        {loading ? (
          <ActivityIndicator size={'large'} color="white" />
        ) : (
          <Text
            className={`${
              rating ? 'text-white' : 'text-white/30'
            } ml-4 font-p-bold`}>
            {t('review.send')}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
