import './src/i18n';
import 'intl';
import 'intl/locale-data/jsonp/fi-FI';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {customFetch} from '@Helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import EditProfile from '@Screens/EditProfile';
import LoginScreen from '@Screens/LoginScreen';
import ProfileScreen from '@Screens/ProfileScreen';
import React, {useEffect} from 'react';
import {useState} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';

import {ContextProvider, useStateValue} from './context';
import {RootStackParams} from './src/navigation/types';
import {initProducts} from './src/realm';
import CameraScreen from './src/Screens/CameraScreen';
import FrontScreen from './src/Screens/FrontScreen';
import ProductDetailsScreen from './src/Screens/ProductDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParams>();

const App = () => {
  const [{auth, profile}, dispatch]: any = useStateValue();
  const [loading, setLoading] = useState(true);
  const MyTheme = {
    dark: true,
    colors: {
      primary: '#000000',
      background: 'transparent',
      card: 'transparent',
      text: 'white',

      border: 'rgb(199, 199, 204)',
      notification: 'rgb(255, 69, 58)',
    },
  };

  useEffect(() => {
    (async () => {
      try {
        await initProducts();
        const token = await AsyncStorage.getItem('access_token');

        if (token && !profile) {
          const data = await customFetch('users/me', {
            method: 'GET',
          });

          dispatch({
            type: 'SET_USER_DETAILS',
            payload: data,
          });

          dispatch({
            type: 'SET_AUTH',
            payload: true,
          });
        }
      } catch {}

      setLoading(false);
    })();
  }, [auth]);

  const GlobalLoader = ({children}: any) => {
    if (loading)
      return (
        <View className="bg-p-gray w-full h-full flex justify-center items-center">
          <ActivityIndicator size={'large'} color="white" />
          <Text className="text-white font-p-regular mt-2">Loading...</Text>
        </View>
      );

    return children;
  };

  return (
    <GlobalLoader>
      <SafeAreaView style={{flex: 1}}>
        <GestureHandlerRootView style={{flex: 1}}>
          <NavigationContainer theme={MyTheme}>
            <BottomSheetModalProvider>
              <View className="bg-p-gray w-full h-full absolute" />
              <Stack.Navigator initialRouteName="FrontScreen">
                <Tab.Screen
                  name="FrontScreen"
                  component={FrontScreen}
                  options={{
                    headerShown: false,
                    tabBarIcon: ({focused}) => (
                      <Icon
                        name="home"
                        size={26}
                        color={focused ? 'white' : 'gray'}
                      />
                    ),
                  }}
                />
                <Tab.Screen
                  name="CameraScreen"
                  component={CameraScreen}
                  options={{
                    headerShown: false,
                    tabBarIcon: ({focused}) => (
                      <Icon
                        name="camera"
                        size={26}
                        color={focused ? 'white' : 'gray'}
                      />
                    ),
                  }}
                />
                <Stack.Screen
                  name="ProductDetailsScreen"
                  component={ProductDetailsScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="ProfileScreen"
                  component={ProfileScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="EditProfileScreen"
                  component={EditProfile}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="LoginScreen"
                  component={LoginScreen}
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack.Navigator>
              <Toast />
            </BottomSheetModalProvider>
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaView>
    </GlobalLoader>
  );
};

function Main() {
  return (
    <ContextProvider>
      <App />
    </ContextProvider>
  );
}

export default Main;
