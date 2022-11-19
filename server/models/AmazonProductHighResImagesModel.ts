import { ObjectId } from 'mongodb';
import mongoose, { Model, Schema } from 'mongoose';

interface IProductHighResImages {
  _id: ObjectId;
  product_id: string;
  product_highres_image: string;
}

const amazonProductHighResImagesSchema = new Schema<IProductHighResImages>(
  {
    product_id: String,
    product_highres_image: String,
  },
  { collection: 'amazonProductHighResImages' }
);
var amazonProductHighResImagesModel: Model<IProductHighResImages> =
  mongoose.model(
    'amazonProductHighResImages',
    amazonProductHighResImagesSchema
  );
export default amazonProductHighResImagesModel;
