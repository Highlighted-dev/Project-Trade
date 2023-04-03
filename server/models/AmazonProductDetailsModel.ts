import { model, Schema } from 'mongoose';

interface IProductDetails {
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
  { versionKey: false },
);

const amazonProductDetailsModel = model<IProductDetails>(
  'Amazon Product Details',
  amazonProductDetailsSchema,
  'amazonProductDetails',
);

export default amazonProductDetailsModel;
