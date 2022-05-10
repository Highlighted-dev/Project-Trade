import mongoose, { Model, Schema } from 'mongoose';

interface IProductData {
  _id: string;
  product_name: string;
  product_sale_price: string;
  product_image: string;
}

const amazonProductDataSchema = new Schema<IProductData>(
  {
    _id: String,
    product_name: String,
    product_sale_price: String,
    product_image: String,
  },
  { collection: 'amazonProductData' }
);
var amazonProductData: Model<IProductData> = mongoose.model(
  'amazonProductData',
  amazonProductDataSchema
);
export default amazonProductData;
