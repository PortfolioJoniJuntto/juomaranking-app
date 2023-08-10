import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigation/types';

const SearchInput = forwardRef<{clear: () => void}, any>(
  ({setSearch, searchProducts}: any, ref) => {
    const {navigate} = useNavigation<NavigationProps>();

    const {t} = useTranslation();
    const [search, _setSearch] = useState<string>();
    const clear = () => {
      if (search) {
        _setSearch(undefined);
        setSearch(undefined);
      }
    };
    useImperativeHandle(ref, () => ({
      clear,
    }));

    return (
      <View className="bg-s-gray mx-5 mb-2 p-4 rounded-xl flex-row justify-center items-center">
        <TextInput
          onChangeText={text => {
            _setSearch(text);
            setSearch(text);
          }}
          className="w-5/6 text-white placeholder:text-white font-p-regular px-2"
          placeholderTextColor={'gray'}
          placeholder={t('products.search') + '...'}
          onSubmitEditing={searchProducts}
          blurOnSubmit={true}
          value={search}
        />
        <Pressable className="mr-2" onPress={() => navigate('CameraScreen')}>
          <Icon name="camera" size={20} color="gray" />
        </Pressable>
        <Pressable className="mr-2" onPress={searchProducts}>
          <Icon name="search" size={20} color="gray" />
        </Pressable>
      </View>
    );
  },
);
export default SearchInput;
