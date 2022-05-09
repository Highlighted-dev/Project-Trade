import mongoose, { Model, Schema } from 'mongoose';

const amazonProductDetailsSchema: Schema = new Schema(
  {
    product_id: String,
    product_detail: String,
    product_detail_name: String,
  },
  { collection: 'amazonProductDetails' }
);
var amazonProductDetails: Model<String, {}, {}, {}> = mongoose.model(
  'amazonProductDetails',
  amazonProductDetailsSchema
);
export default amazonProductDetails;
