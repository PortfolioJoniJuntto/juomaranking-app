export interface ProductItemProps {
  product: Product;
}

export interface PriceData {
  price: number;
  updated_at: number;
  store: string;
}

export interface Nutrients {
  name: string;
  ri: string;
  value: string;
}

export interface Product {
  ean: string;
  name: string;
  name_fi: string;
  name_sv: string;
  name_en: string;
  stars: Stars;
  photo: string;
  price: number;
  category: string;
  created_at: string;
  updated_at: number;
  price_data: PriceData[];
  store: string[];
  description_fi: string;
  description_sv: string;
  description_en: string;
  ingredients_fi: string;
  ingredients_sv: string;
  ingredients_en: string;
  nutrients: Nutrients[];
  supplier: string;
}

export interface Stars {
  one: number;
  two: number;
  three: number;
  four: number;
  five: number;
}

export interface ProductWithRatingsDTO {
  ean: string;
  name: string;
  name_fi: string;
  name_sv: string;
  name_en: string;
  stars: Stars;
  photo: string;
  price: number;
  category: string;
  created_at: string;
  updated_at: number;
  ratings?: ProductRating[];
  rating_amounts?: ProductRatingAmounts[];
  price_data: PriceData[];
  store: string[];

  description_fi: string;
  description_sv: string;
  description_en: string;
  ingredients_fi: string;
  ingredients_sv: string;
  ingredients_en: string;
  nutrients: Nutrients[];
  supplier: string;
}

export interface ProductRatingAmounts {
  // RatingAmountDTO
  amount: number;
  rating: number;
}

export interface ProductRating {
  // SubRatingDTO
  rating: number;
  comment?: string;
  username?: string;
  created_at: string;
  updated_at: number;
}
