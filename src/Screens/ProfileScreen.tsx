import SettingsButton from '@Components/SettingButton';
import {useStateValue} from '@Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Pressable, SafeAreaView, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import {NavigationProps} from 'src/navigation/types';
import {customFetch} from '@Helpers';

export default function ProfileScreen(): JSX.Element {
  const [{profile}, dispatch]: any = useStateValue();
  const {navigate, goBack, reset} = useNavigation<NavigationProps>();
  const {t} = useTranslation();

  const logout = async () => {
    Alert.alert(t('profile.logout'), t('profile.areYouSure'), [
      {
        text: t('misc.yes'),
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('id_token');
          await AsyncStorage.removeItem('refresh_token');

          dispatch({
            type: 'SET_AUTH',
            payload: false,
          });

          Toast.show({
            type: 'success',
            text1: t('misc.logoutSuccess'),
          });

          reset({
            index: 1,
            routes: [
              {
                name: 'FrontScreen',
              },
            ],
          });
        },
      },
      {
        text: t('misc.cancel'),
        style: 'cancel',
      },
    ]);
  };

  const deleteAccount = () => {
    Alert.prompt(
      t('profile.deleteAccount'),
      t('profile.areYouSureDeleteAcc'),
      [
        {
          text: t('misc.yes'),
          style: 'destructive',
          onPress: async password => {
            const res = await customFetch('/users/me', {
              method: 'DELETE',
              body: JSON.stringify({
                password,
              }),
            });

            console.log(res);

            if (res.statusCode === 204) {
              Toast.show({
                type: 'success',
                text1: t('profile.accountDeleted'),
              });
              await AsyncStorage.removeItem('access_token');
              await AsyncStorage.removeItem('id_token');
              await AsyncStorage.removeItem('refresh_token');

              dispatch({
                type: 'SET_AUTH',
                payload: false,
              });
            } else {
              Toast.show({
                type: 'error',
                text1: t('login.invalidPassword'),
              });
            }
          },
        },
        {
          text: t('misc.cancel'),
          style: 'cancel',
        },
      ],
      'secure-text',
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-p-gray">
      <View className="ml-6 mt-4">
        <Pressable onPress={() => goBack()}>
          <Icon name={'chevron-left'} size={24} color="white" />
        </Pressable>
      </View>
      <View className="mt-12 mx-6 h-max">
        <Text className="text-white text-4xl font-p-bold">
          {t('settings.settings')}
        </Text>
        <View className="mt-12 ml-2">
          <Text className="text-white text-xl font-p-regular">
            {t('settings.account')}
          </Text>
          <Pressable
            onPress={() => navigate('EditProfileScreen')}
            className="mt-6 flex-row justify-center items-center">
            <View className="rounded-full bg-s-gray w-16 h-16 flex justify-center items-center">
              <Icon name="user" size={24} color="white" />
            </View>
            <View>
              <Text className="text-white font-p-regular ml-4">
                {profile.username}
              </Text>
              <Text className="text-white font-p-light ml-4 mt-2">
                {t('settings.personalInfo')}
              </Text>
            </View>
            <View className="w-12 h-12 bg-s-gray flex justify-center items-center ml-auto rounded-xl">
              <Icon name="chevron-right" color={'white'} size={24} />
            </View>
          </Pressable>
        </View>
        <View className="mt-12 ml-2">
          <Text className="text-white text-xl font-p-regular">
            {t('settings.settings')}
          </Text>
          <SettingsButton
            text="profile.logout"
            icon="log-out"
            onPress={logout}
          />
        </View>
      </View>
      <Pressable className="mt-auto" onPress={deleteAccount}>
        <Text className="text-red-600 text-center">
          {t('profile.deleteAccount')}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
