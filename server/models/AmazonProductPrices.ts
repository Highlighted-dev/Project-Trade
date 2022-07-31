import { ObjectId } from 'mongodb';
import mongoose, { Model, Schema } from 'mongoose';

interface IProductPrices {
  _id: ObjectId;
  product_id: string;
  product_price: string;
  product_price_date: string;
}

const amazonProductPricesSchema = new Schema<IProductPrices>(
  {
    product_id: String,
    product_price: String,
    product_price_date: String,
  },
  { collection: 'amazonProductPrices' }
);
var amazonProductPrices: Model<IProductPrices> = mongoose.model(
  'amazonProductPrices',
  amazonProductPricesSchema
);
export default amazonProductPrices;
