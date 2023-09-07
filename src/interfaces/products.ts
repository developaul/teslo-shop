export interface IProduct {
  _id: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: ISizes[];
  slug: string;
  tags: string[];
  title: string;
  type: Iypes;
  gender: 'men' | 'women' | 'kid' | 'unisex'
}


export type ISizes = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
export type Iypes = 'shirts' | 'pants' | 'hoodies' | 'hats';


