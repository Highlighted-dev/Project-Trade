import { model, Schema } from 'mongoose';

interface IProductData {
  _id: string;
  product_id: string;
  product_name: string;
  product_sale_price: string;
  product_image: string;
}

const productDataSchema = new Schema<IProductData>(
  {
    _id: String,
    product_id: String,
    product_name: String,
    product_sale_price: String,
    product_image: String,
  },
  { versionKey: false },
);

const amazonProductDataModel = model<IProductData>(
  'Amazon Product Data',
  productDataSchema,
  'amazonProductData',
);

export default amazonProductDataModel;
