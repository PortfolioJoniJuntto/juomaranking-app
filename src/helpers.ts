import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fi';
import {API_BASEURL, PUBLIC_CDN} from './constants';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt from 'jwt-decode';

dayjs.extend(relativeTime);
dayjs.locale('fi');
const formatPrice: (price: number) => string | null = price => {
  if (!isNaN(price)) {
    return String(
      new Intl.NumberFormat('fi-FI', {
        style: 'currency',
        currency: 'EUR',
      }).format(price / 100),
    );
  }
  return null;
};
const formatNumber: (num: number, fractions: number | void) => string | null = (
  num,
  fractions = 1,
) => {
  if (isNaN(num)) return null;

  return String(
    // @ts-ignore
    new Intl.NumberFormat('fi-FI', {maximumFractionDigits: fractions}).format(
      num,
    ),
  );
};

const formatDate: (date: string | undefined) => string | null = date => {
  //format this date 2022-07-24T00:28:13.295199+00:00
  if (date) {
    const dateObj = dayjs(date).toDate();
    return dateObj.toLocaleDateString('fi-FI');
  }
  return null;
};

const formatHumanizedDateDiff: (
  date: number | undefined,
) => string | null = date => {
  if (!date) return null;
  const now = dayjs();
  if (dayjs(dayjs.unix(date)).isAfter(now)) {
    return now.to(dayjs());
  }
  let diff = now.to(dayjs.unix(date));
  return diff;
};

const getImageUrl: (ean: string | undefined) => string | null = ean => {
  if (ean) {
    return `${PUBLIC_CDN}/products/${ean}.webp`;
  }
  return null;
};
const getThumbnailUrl: (ean: string) => string = ean => {
  if (ean) {
    return `${PUBLIC_CDN}/products/${ean}_thumbnail.webp`;
  }
  return '';
};

// Hook
function useDebounce(value: any, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

const refreshAccessToken = async () => {
  try {
    const refresh_token = await AsyncStorage.getItem('refresh_token');

    const req = await fetch(`${API_BASEURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token,
      }),
    });

    const {AccessToken, IdToken} = await req.json();

    await AsyncStorage.setItem('access_token', AccessToken);
    await AsyncStorage.setItem('id_token', IdToken);
    return AccessToken;
  } catch (err) {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('id_token');
    await AsyncStorage.removeItem('refresh_token');
    console.error('failed to refresh token', err);
  }
};

const customFetch = async (path: string, params: any) => {
  let accessToken = (await AsyncStorage.getItem('access_token')) || '';
  const refreshToken = await AsyncStorage.getItem('refresh_token');

  if (refreshToken) {
    let token: any = jwt(accessToken);

    if (Date.now() / 1000 > token.exp) {
      accessToken = await refreshAccessToken();
    }
  }

  const req = await fetch(`${API_BASEURL}/${path}`, {
    ...params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(accessToken && {Authorization: 'Bearer ' + accessToken}),
    },
  });

  try {
    if (req.status === 200) {
      return await req.json();
    }
    return {
      statusCode: req.status,
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: req.status,
    };
  }
};

export {
  formatPrice,
  formatNumber,
  formatDate,
  formatHumanizedDateDiff,
  getImageUrl,
  getThumbnailUrl,
  useDebounce,
  customFetch,
};
