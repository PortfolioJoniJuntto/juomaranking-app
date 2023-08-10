import SearchInput from '@Components/SearchInput';
import {useNavigation} from '@react-navigation/native';
import {uniqBy} from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {NavigationProps} from 'src/navigation/types';

import {useStateValue} from '../../context';
import ProductCardItem from '../Components/ProductCardItem';
import {useDebounce} from '../helpers';
import {ProductRealmModel, useRealm} from '../realm';
import {Product} from '../types/interfaces';

const pageSize = 25;
export default function FrontScreen() {
  const [{auth}]: any = useStateValue();
  const [data, _setData] = useState<Product[]>([]);
  const [_search, setSearch] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [category, setCategory] = useState<string | null>(null);
  const [page, _setPage] = useState<number>(0);
  const prevSearchRef = useRef<{
    category: string | null;
    search: string | undefined;
  }>();
  const listRef = useRef<FlatList>(null);
  const searchInputRef = useRef<React.ElementRef<typeof SearchInput>>(null);
  const search = useDebounce(_search, 500);

  const navigation = useNavigation<NavigationProps>();

  const realm = useRealm();
  const {t} = useTranslation();

  const tabs = useMemo(() => {
    return [
      {
        id: 0,
        title: t('drinks.all'),
        category: 'null',
      },
      {
        id: 1,
        title: t('drinks.ciders'),
        category: 'cider',
      },
      {
        id: 2,
        title: t('drinks.wines'),
        category: 'wine',
      },
      {
        id: 3,
        title: t('drinks.beers'),
        category: 'beer',
      },
      {
        id: 4,
        title: t('drinks.softdrinks'),
        category: 'softdrink',
      },
      {
        id: 5,
        title: t('drinks.longdrinks'),
        category: 'longdrink',
      },
      {
        id: 6,
        title: t('drinks.mixes'),
        category: 'mix',
      },
      {
        id: 7,
        title: t('drinks.energy'),
        category: 'energy',
      },
      {
        id: 8,
        title: t('drinks.waters'),
        category: 'water',
      },
      {
        id: 9,
        title: t('drinks.seasonal'),
        category: 'season',
      },
      {
        id: 10,
        title: t('drinks.juices'),
        category: 'juice',
      },
    ];
  }, [t]);

  const setPage: (page: number) => void = page => {
    if (page === 0) {
      listRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
      setHasMoreData(true);
    }
    _setPage(page);
  };

  const setData: (
    products: Realm.Results<ProductRealmModel & Realm.Object<unknown>>,
  ) => void = products => {
    const newData = products
      .slice(page * pageSize, page * pageSize + pageSize)
      .map(p => {
        return p as Product;
      });
    if (newData.length < pageSize) {
      setHasMoreData(false);
    }
    if (page === 0) {
      _setData(newData);
    } else {
      _setData(uniqBy([...data, ...newData], 'ean'));
    }
  };

  const searchProducts = async () => {
    if (
      prevSearchRef.current?.category !== category ||
      prevSearchRef.current?.search !== search
    ) {
      setPage(0);
      prevSearchRef.current = {
        category,
        search,
      };
    }
    if (!hasMoreData) return false;
    setLoading(true);
    let products = realm.objects<ProductRealmModel>('Product');

    if (search) {
      products = products.filtered(`name CONTAINS[c] "${search}"`);
    }

    if (category) {
      products = products.filtered(`category = "${category}"`);
    }

    setData(products);
    setLoading(false);
  };

  useEffect(() => {
    searchProducts();
  }, []);

  useEffect(() => {
    searchProducts();
  }, [category, search, page, pageSize, hasMoreData]);

  const renderItem: ListRenderItem<Product> = ({item}) => {
    return <ProductCardItem product={item} />;
  };

  const tabRenderItem: ListRenderItem<any> = ({item, index}) => {
    let backgroundColor = '';
    let textColor =
      backgroundColor === 'bg-red-400' ? 'text-white' : 'text-white';

    if (item.category === category) {
      backgroundColor = 'bg-red-400';
    } else if (!category && index === 0) {
      backgroundColor = 'bg-red-400';
    } else {
      backgroundColor = 'bg-s-gray';
    }

    return (
      <Pressable
        onPress={() => {
          searchInputRef?.current?.clear();
          setCategory(index === 0 ? null : item.category);
        }}
        className={`flex-1 px-4 h-8 rounded-lg ${backgroundColor} mr-2 justify-center`}>
        <Text className={`self-center ${textColor}  flex-wrap`}>
          {item.title}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView>
      <View className="flex-row items-center justify-around">
        <View className="w-6" />
        <Text className="text-white text-3xl p-2 my-2 font-p-bold">RateUp</Text>
        <Pressable
          onPress={() =>
            auth
              ? navigation.navigate('ProfileScreen')
              : navigation.navigate('LoginScreen')
          }>
          <Icon name={auth ? 'user' : 'key'} size={24} color="white" />
        </Pressable>
      </View>
      <SearchInput
        ref={searchInputRef}
        setSearch={setSearch}
        searchProducts={searchProducts}
      />
      <FlatList
        className="h-11 mx-5 grow-0 mb-2"
        data={tabs}
        renderItem={tabRenderItem}
        keyboardDismissMode="on-drag"
        keyExtractor={item => item.category}
        horizontal={true}
      />
      <View className="w-5 bg-red-700" />
      <FlatList
        ref={listRef}
        refreshing={loading}
        data={data}
        renderItem={renderItem}
        numColumns={2}
        keyboardDismissMode="on-drag"
        initialNumToRender={8}
        keyExtractor={item => item?.ean}
        contentContainerStyle={{
          paddingLeft: 15,
          paddingRight: 15,
          paddingBottom: 300,
        }}
        onEndReachedThreshold={1}
        onRefresh={() => {
          listRef?.current?.scrollToOffset({
            offset: 0,
            animated: true,
          });
          setPage(0);
        }}
        onEndReached={() => {
          setPage(page + 1);
        }}
        ListEmptyComponent={
          <View>
            <Text className="text-white text-md p-2 my-2 font-p-bold mr-auto ml-auto">
              {t('products.no_results')}
            </Text>
          </View>
        }
        ListFooterComponent={
          <View>
            {hasMoreData && (
              <ActivityIndicator
                size="large"
                color="#262B35"
                style={{marginTop: 20}}
              />
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}
