import KeyboardAvoidView from '@Components/KeyboardAvoidView';
import {useStateValue} from '@Context';
import {customFetch} from '@Helpers';
import {useNavigation} from '@react-navigation/native';
import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
  Platform,
  SafeAreaView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';
import {NavigationProps} from 'src/navigation/types';

const emailRegex =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export default function EditProfileScreen(): JSX.Element {
  const [{profile}, dispatch]: any = useStateValue();
  const [username, setUsername] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProps>();
  const {t} = useTranslation();

  const isEmailValid = useMemo(() => emailRegex.test(email), [email]);

  const updateProfile = async () => {
    setLoading(true);
    try {
      const res = await customFetch('users/me', {
        method: 'PUT',
        body: JSON.stringify({
          username,
          email,
        }),
      });

      if (res.statusCode === 204) {
        dispatch({
          type: 'UPDATE_PROFILE',
          payload: {
            username,
            email,
          },
        });
        Toast.show({
          type: 'success',
          text1: t('profile.updateSuccess'),
        });
        navigation.navigate('ProfileScreen');
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: t('profile.updateFailed'),
      });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="h-full flex-1 bg-p-gray">
      <KeyboardAvoidView>
        <View className="flex-row items-center justify-around mb-4">
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name={'chevron-left'} size={24} color="white" />
          </Pressable>
          <Text className="text-white text-3xl p-2 my-2 font-p-light">
            Edit Profile
          </Text>
          <View className="w-6" />
        </View>
        <View className="flex justify-center">
          <View className="bg-s-gray mx-5 p-3 mb-4 rounded-xl">
            <Text className="text-xs text-white">{t('profile.username')}</Text>
            <TextInput
              onChangeText={text => setUsername(text)}
              className="w-full text-white font-p-regular p-0"
              placeholderTextColor={'gray'}
              blurOnSubmit={false}
              autoCorrect={false}
              placeholder={t('profile.username')}
              keyboardType={
                Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
              }
              value={username}
            />
          </View>
          <View className="bg-s-gray mx-5 p-3 mb-4 rounded-xl">
            <Text className="text-xs text-white">{t('login.email')}</Text>
            <TextInput
              onChangeText={text => setEmail(text)}
              className="w-full text-white font-p-regular p-0"
              placeholderTextColor={'gray'}
              blurOnSubmit={false}
              autoCorrect={false}
              placeholder={t('login.email')}
              keyboardType={
                Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
              }
              value={email}
            />
          </View>
        </View>
        <View className="w-full px-6 mt-auto mb-5">
          <Pressable
            onPress={updateProfile}
            disabled={!isEmailValid && username.length >= 3}
            className={`flex-row justify-center h-14 items-center bg-s-gray ${
              isEmailValid && username.length >= 3
                ? 'bg-red-400'
                : 'bg-s-gray/30'
            } p-4 rounded-xl mt-4`}>
            {loading ? (
              <ActivityIndicator size={'large'} color="white" />
            ) : (
              <>
                <Icon
                  size={24}
                  name="refresh-cw"
                  color={
                    isEmailValid && username.length >= 3 ? 'white' : 'gray'
                  }
                />
                <Text
                  className={`${
                    isEmailValid && username.length >= 3
                      ? 'text-white'
                      : 'text-white/30'
                  } ml-4 font-p-bold`}>
                  {t('profile.update')}
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidView>
    </SafeAreaView>
  );
}
