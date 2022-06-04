import { ObjectId } from 'mongodb';
import mongoose, { Model, Schema } from 'mongoose';

interface IProductThumbImages {
  _id: ObjectId;
  product_id: string;
  product_thumb_image: string;
}

const amazonProductThumbImagesSchema = new Schema<IProductThumbImages>(
  {
    product_id: String,
    product_thumb_image: String,
  },
  { collection: 'amazonProductThumbImages' }
);
var amazonProductThumbImages: Model<IProductThumbImages> = mongoose.model(
  'amazonProductThumbImages',
  amazonProductThumbImagesSchema
);
export default amazonProductThumbImages;
