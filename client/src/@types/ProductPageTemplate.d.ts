import { ObjectId } from 'mongodb';

export interface IProduct {
  _id: ObjectId;
  product_id: string;
  product_name: string;
  product_sale_price: string;
  product_image: string;
}
interface IProductImages {
  _id: ObjectId;
  product_id: string;
  product_thumb_image: string;
}
export interface IProductDetails {
  _id: ObjectId;
  product_id: string;
  product_detail: string;
  product_detail_name: string;
}
export interface IProductTechnicalDetails {
  _id: ObjectId;
  product_id: string;
  product_technical_detail_name: string;
  product_technical_detail: string;
}
export interface IProductAbouts {
  _id: ObjectId;
  product_id: string;
  product_about: string;
}
export interface IProductHighResImages {
  _id: ObjectId;
  product_id: string;
  product_highres_image: string;
}
export interface IProductPrice {
  _id: ObjectId;
  product_id: string;
  product_price: string;
  product_price_date: string;
}
export interface IPriceHolder {
  [key: string]: IProductPrice[];
}
