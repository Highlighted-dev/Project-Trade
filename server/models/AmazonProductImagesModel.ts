import mongoose, { Model, Schema } from 'mongoose';

interface IProductImages {
  product_id: string;
  product_image: string;
}

const amazonProductImagesSchema = new Schema<IProductImages>(
  {
    product_id: String,
    product_image: String,
  },
  { collection: 'amazonProductImages' }
);
var amazonProductImages: Model<IProductImages> = mongoose.model(
  'amazonProductDetails',
  amazonProductImagesSchema
);
export default amazonProductImages;
