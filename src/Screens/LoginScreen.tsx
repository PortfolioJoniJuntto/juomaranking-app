import {useNavigation} from '@react-navigation/native';
import React, {createRef, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  TextInput,
  Pressable,
  Text,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import {NavigationProps} from 'src/navigation/types';
import {customFetch} from '@Helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useStateValue} from '@Context';
import KeyboardAvoidView from '@Components/KeyboardAvoidView';

const emailRegex =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export default function LoginScreen(): JSX.Element {
  const [, dispatch]: any = useStateValue();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('login');
  const [errorMessage, setErrorMessage] = useState('');
  const {t} = useTranslation();

  const isEmailValid = useMemo(() => emailRegex.test(email), [email]);

  const passwordRef: React.RefObject<TextInput> = createRef();

  const navigation = useNavigation<NavigationProps>();

  const authenticate = async () => {
    setLoading(true);
    try {
      const data = await customFetch(`auth/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (data.statusCode === 400) {
        if (type === 'login') {
          setErrorMessage(t('login.invalidLogin'));
          setPassword('');
          setLoading(false);
        } else {
          setErrorMessage(t('login.emailInUse'));
          setPassword('');
          setLoading(false);
        }
        return;
      }

      const {AccessToken, IdToken, RefreshToken} = data;

      if (!AccessToken) {
        throw new Error('No access token');
      }

      await AsyncStorage.setItem('access_token', AccessToken);
      await AsyncStorage.setItem('id_token', IdToken);
      await AsyncStorage.setItem('refresh_token', RefreshToken);

      dispatch({
        type: 'SET_AUTH',
        payload: true,
      });

      navigation.reset({
        index: 1,
        routes: [
          {
            name: 'ProfileScreen',
          },
        ],
      });
    } catch (e) {
      console.error(e);
      setErrorMessage('Unknown error happened');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="h-full bg-p-gray">
      <Pressable onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidView>
          <View className="w-full h-1/3 justify-center items-center">
            <Text className="text-white text-3xl font-p-bold">
              {t(type === 'login' ? 'login.welcomeBack' : 'profile.welcome')}
            </Text>
            <Text className="text-gray-500 text-s font-p-light">
              {t(
                type === 'login' ? 'login.pleaseSignIn' : 'login.pleaseSignUp',
              )}
            </Text>
          </View>
          <View className="mt-5">
            <View className="bg-s-gray mx-5 p-4 mb-4 rounded-xl">
              <Text className="text-xs text-white">{t('login.email')}</Text>
              <TextInput
                onChangeText={text => setEmail(text.toLowerCase())}
                className="w-full text-white font-p-regular"
                placeholderTextColor={'gray'}
                blurOnSubmit={false}
                autoCorrect={false}
                placeholder={'name@example.com'}
                onSubmitEditing={() => passwordRef.current!.focus()}
                keyboardType={
                  Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
                }
                value={email}
              />
            </View>
            <View className="bg-s-gray mx-5 p-4 mb-2 rounded-xl">
              <Text className="text-xs text-white">{t('login.password')}</Text>
              <TextInput
                ref={passwordRef}
                onChangeText={text => setPassword(text)}
                className="w-full text-white font-p-regular p-0"
                placeholderTextColor={'gray'}
                placeholder={'*********'}
                blurOnSubmit={true}
                value={password}
                onSubmitEditing={authenticate}
                secureTextEntry={true}
              />
            </View>
          </View>
          {errorMessage && (
            <Text className="text-red-700 self-center">{errorMessage}</Text>
          )}
          <Pressable
            onPress={authenticate}
            disabled={!isEmailValid && password.length > 8}
            className={`${
              isEmailValid && password.length >= 8
                ? 'bg-red-400'
                : 'bg-s-gray/70'
            } mx-5 p-5 mb-4 mt-4 rounded-xl flex-row justify-center items-center`}>
            <Text
              className={`font-p-bold ${
                isEmailValid && password.length >= 8
                  ? 'text-white'
                  : 'text-white/30'
              }`}>
              {loading ? (
                <ActivityIndicator size={'small'} color="white" />
              ) : (
                t(type === 'login' ? 'login.signIn' : 'login.signUp')
              )}
            </Text>
          </Pressable>
        </KeyboardAvoidView>

        <View className="flex-row justify-center items-center mt-auto mb-5">
          <Text className="text-white font-p-regular">
            {t(type === 'login' ? 'login.noAccount' : 'login.haveAccount')}
          </Text>
          <Pressable
            className="ml-2"
            onPress={() => setType(type === 'login' ? 'register' : 'login')}>
            <Text className="text-red-400 font-p-regular">
              {t(type === 'login' ? 'login.signUp' : 'login.signIn')}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}
