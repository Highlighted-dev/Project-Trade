import { ObjectId } from 'mongodb';
import mongoose, { Model, Schema } from 'mongoose';

interface IProductAbout {
  _id: ObjectId;
  product_id: string;
  product_about: string;
}

const amazonProductAboutSchema = new Schema<IProductAbout>(
  {
    _id: ObjectId,
    product_id: String,
    product_about: String,
  },
  { collection: 'amazonProductAbout' }
);
var amazonProductAbout: Model<IProductAbout> = mongoose.model(
  'amazonProductAbout',
  amazonProductAboutSchema
);
export default amazonProductAbout;
