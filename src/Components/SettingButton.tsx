import React from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function SettingsButton({
  onPress,
  icon,
  text,
}: any): JSX.Element {
  const {t} = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      className="mt-6 flex-row justify-center items-center">
      <View className="rounded-full bg-s-gray w-16 h-16 flex justify-center items-center">
        <Icon name={icon} size={24} color="white" />
      </View>
      <Text className="text-white text-xl font-p-regular ml-4">{t(text)}</Text>
      <View className="w-12 h-12 bg-s-gray flex justify-center items-center ml-auto rounded-xl">
        <Icon name="chevron-right" color={'white'} size={24} />
      </View>
    </Pressable>
  );
}
