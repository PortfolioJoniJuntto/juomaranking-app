import Realm from 'realm';
import dayjs from 'dayjs';
import {PUBLIC_CDN} from './constants';
import {Product} from './types/interfaces';

const schemaVersion = 1;

export class ProductRealmModel {
  public static schema: Realm.ObjectSchema = {
    name: 'Product',
    properties: {
      ean: 'string',
      name: {type: 'string?', indexed: true},
      category: {type: 'string?', indexed: true},
      stars: {type: 'object', objectType: 'Stars'},
      photo: 'string?',
      price: 'int?',
      created_at: 'string?',
      updated_at: 'int',
      price_data: {type: 'list', objectType: 'PriceData'},
      store: {type: 'list', objectType: 'string'},
      name_fi: 'string?',
      name_sv: 'string?',
      name_en: 'string?',
      description_fi: 'string?',
      description_sv: 'string?',
      description_en: 'string?',
      ingredients_fi: 'string?',
      ingredients_sv: 'string?',
      ingredients_en: 'string?',
      nutrients: {type: 'list', objectType: 'Nutrients'},
      supplier: 'string?',
    },
    primaryKey: 'ean',
  };
  public ean: string;
  public name: string | null;
  public category: string | null;
  public stars: StarsRealmModel;
  public photo: string | null;
  public price: number | null;
  public created_at: string | null;
  public updated_at: number | null;
  public price_data: PriceDataRealmModel[];
  public store: string[];

  public name_fi: string | null;
  public name_sv: string | null;
  public name_en: string | null;
  public description_fi: string | null;
  public description_sv: string | null;
  public description_en: string | null;
  public ingredients_fi: string | null;
  public ingredients_sv: string | null;
  public ingredients_en: string | null;
  public nutrients: NutrientsRealmModel[] | null;
  public supplier: string | null;

  constructor(
    ean: string,
    name: string | null,
    category: string | null,
    stars: StarsRealmModel,
    photo: string | null,
    price: number | null,
    created_at: string | null,
    updated_at: number | null,
    price_data: PriceDataRealmModel[],
    store: string[],
    name_fi: string | null,
    name_sv: string | null,
    name_en: string | null,
    description_fi: string | null,
    description_sv: string | null,
    description_en: string | null,
    ingredients_fi: string | null,
    ingredients_sv: string | null,
    ingredients_en: string | null,
    nutrients: NutrientsRealmModel[] | null,
    supplier: string | null,
  ) {
    this.ean = ean;
    this.name = name;
    this.category = category;
    this.stars = stars;
    this.photo = photo;
    this.price = price;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.price_data = price_data;
    this.store = store;
    this.name_fi = name_fi;
    this.name_sv = name_sv;
    this.name_en = name_en;
    this.description_fi = description_fi;
    this.description_sv = description_sv;
    this.description_en = description_en;
    this.ingredients_fi = ingredients_fi;
    this.ingredients_sv = ingredients_sv;
    this.ingredients_en = ingredients_en;
    this.nutrients = nutrients;
    this.supplier = supplier;
  }

  public toProduct() {
    const product = {
      ean: this.ean,
      name: this.name,
      category: this.category,
      stars: this.stars,
      photo: this.photo,
      price: this.price,
      created_at: this.created_at,
      updated_at: this.updated_at,
      price_data: this.price_data,
      store: this.store,
      name_fi: this.name_fi,
      name_sv: this.name_sv,
      name_en: this.name_en,
      description_fi: this.description_fi,
      description_sv: this.description_sv,
      description_en: this.description_en,
      ingredients_fi: this.ingredients_fi,
      ingredients_sv: this.ingredients_sv,
      ingredients_en: this.ingredients_en,
      nutrients: this.nutrients,
      supplier: this.supplier,
    } as Product;
    return product;
  }
}

export class StarsRealmModel {
  public static schema: Realm.ObjectSchema = {
    name: 'Stars',
    embedded: true,
    properties: {
      one: 'int',
      two: 'int',
      three: 'int',
      four: 'int',
      five: 'int',
    },
  };
  public one: number;
  public two: number;
  public three: number;
  public four: number;
  public five: number;

  constructor(
    one: number,
    two: number,
    three: number,
    four: number,
    five: number,
  ) {
    this.one = one;
    this.two = two;
    this.three = three;
    this.four = four;
    this.five = five;
  }
}

export class PriceDataRealmModel {
  public static schema: Realm.ObjectSchema = {
    name: 'PriceData',
    embedded: true,
    properties: {
      price: 'int',
      updated_at: 'int',
      store: 'string',
    },
  };
  public price: number;
  public updated_at: number;
  public store: string;

  constructor(price: number, updated_at: number, store: string) {
    this.price = price;
    this.updated_at = updated_at;
    this.store = store;
  }
}

export class NutrientsRealmModel {
  public static schema: Realm.ObjectSchema = {
    name: 'Nutrients',
    embedded: true,
    properties: {
      name: 'string?',
      ri: 'string?',
      value: 'string?',
    },
  };
  public name: string;
  public ri: string;
  public value: string;

  constructor(name: string, ri: string, value: string) {
    this.name = name;
    this.ri = ri;
    this.value = value;
  }
}

export class SettingRealmModel {
  public static schema: Realm.ObjectSchema = {
    name: 'Setting',
    properties: {
      key: 'string',
      value: 'int?',
      created_at: 'int?',
      updated_at: 'int?',
    },
    primaryKey: 'key',
  };

  public key: string;
  public value: number | null;
  public created_at: number | null;
  public updated_at: number | null;

  constructor(
    key: string,
    value: number | null,
    created_at: number | null,
    updated_at: number | null,
  ) {
    this.key = key;
    this.value = value;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export const removeAllData = (realm: Realm) => {
  try {
    realm.beginTransaction();
    realm.deleteAll();
    realm.commitTransaction();
  } catch (e) {
    console.error(e);
  }
};

const _realm = new Realm({
  schema: [
    ProductRealmModel.schema,
    PriceDataRealmModel.schema,
    SettingRealmModel.schema,
    NutrientsRealmModel.schema,
    StarsRealmModel.schema,
  ],
  schemaVersion,
  migration: oldRealm => {
    // Delete all old data
    removeAllData(oldRealm);
  },
});
export const useRealm = () => _realm;

const downloadProducts = async () => {
  try {
    const response = await fetch(PUBLIC_CDN + '/products.json');
    if (response.status === 200) {
      const data: Product[] = await response.json();

      _realm.write(() => {
        _realm.delete(_realm.objects('Product'));
        for (let product of data) {
          _realm.create<ProductRealmModel>(
            'Product',
            product,
            Realm.UpdateMode.All,
          );
        }
      });
      updateProductsJSONDownloadTime();
    }
  } catch (e) {
    console.error('downloadProducts error', e);
  }
};
const getProductsJSONDownloadTime = () => {
  const settings = _realm.objects<SettingRealmModel>('Setting');
  const productJSONDownloadTime:
    | (SettingRealmModel & Realm.Object)
    | undefined = settings.filtered("key == 'productJSONDownloadTime'")?.[0];
  return productJSONDownloadTime;
};
const updateProductsJSONDownloadTime = () => {
  const productJSONDownloadTime = getProductsJSONDownloadTime();
  _realm.write(() => {
    if (productJSONDownloadTime) {
      productJSONDownloadTime.updated_at = dayjs().unix();
      productJSONDownloadTime.value = dayjs().unix();
    } else {
      _realm.create<SettingRealmModel>(
        'Setting',
        {
          key: 'productJSONDownloadTime',
          value: dayjs().unix(),
          created_at: dayjs().unix(),
          updated_at: dayjs().unix(),
        },
        Realm.UpdateMode.All,
      );
    }
  });
  console.log(
    '[updateProductsJSONDownloadTime] Updated productJSONDownloadTime with',
    getProductsJSONDownloadTime(),
  );
};
export const initProducts = async () => {
  try {
    if (_realm.objects('Product').length === 0) {
      await downloadProducts();
      return;
    }
    const productJSONDownloadTime = getProductsJSONDownloadTime()?.value;
    if (productJSONDownloadTime) {
      const date = dayjs.unix(productJSONDownloadTime);
      const now = dayjs();

      if (date.isBefore(now.subtract(7, 'day'))) {
        // Over 7 days old data
        console.log('Over 7 days old data, downloading new');
        await downloadProducts();
      }
    } else {
      await downloadProducts();
    }
  } catch (err) {
    console.error(err);
  }
};
