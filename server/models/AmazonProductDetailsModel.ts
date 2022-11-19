import { ObjectId } from 'mongodb';
import mongoose, { Model, Schema } from 'mongoose';

interface IProductDetails {
  _id: ObjectId;
  product_id: string;
  product_detail: string;
  product_detail_name: string;
}

const amazonProductDetailsSchema = new Schema<IProductDetails>(
  {
    product_id: String,
    product_detail: String,
    product_detail_name: String,
  },
  { collection: 'amazonProductDetails' }
);
var amazonProductDetailsModel: Model<IProductDetails> = mongoose.model(
  'amazonProductDetails',
  amazonProductDetailsSchema
);
export default amazonProductDetailsModel;
