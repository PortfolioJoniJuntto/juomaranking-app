import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Product} from '../types/interfaces';

export type FrontScreenProps = NativeStackScreenProps<RootStackParams,
  'FrontScreen'>;
export type SearchScreenProps = NativeStackScreenProps<RootStackParams,
  'SearchScreen'>;
export type CameraScreenProps = NativeStackScreenProps<RootStackParams,
  'CameraScreen'>;
export type ProductDetailsScreenProps = NativeStackScreenProps<RootStackParams,
  'ProductDetailsScreen'>;

export type AddReviewScreenProps = NativeStackScreenProps<RootStackParams,
  'AddReviewScreen'>;
export type NavBarProps = NativeStackScreenProps<RootStackParams, 'NavBar'>;

export type NavigationProps = NativeStackNavigationProp<RootStackParams>;

export type RootStackParams = {
  FrontScreen: undefined;
  SearchScreen: { barcode: string | undefined };
  CameraScreen: undefined;
  NavBar: undefined;
  ProfileScreen: undefined;
  EditProfileScreen: undefined;
  LoginScreen: undefined;
  ProductDetailsScreen: { product: Product };
  AddReviewScreen: { product: Product };
  ProductCategoryScreen: { category: string };
};
