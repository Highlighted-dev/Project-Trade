import { ObjectId } from 'mongodb';
import mongoose, { Model, Schema } from 'mongoose';

interface IProductReviews {
  _id: ObjectId;
  product_id: string;
  product_rating: number;
  product_rating_id: string;
  product_rating_date: string;
}

const amazonProductReviewsSchema = new Schema<IProductReviews>(
  {
    _id: ObjectId,
    product_id: String,
    product_rating: Number,
    product_rating_id: String,
    product_rating_date: String,
  },
  { collection: 'amazonProductReviews' }
);
var amazonProductReviewsModel: Model<IProductReviews> = mongoose.model(
  'amazonProductReviews',
  amazonProductReviewsSchema
);
export default amazonProductReviewsModel;
