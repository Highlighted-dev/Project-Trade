import { model, Schema } from 'mongoose';

interface IProductReviews {
  product_id: string;
  product_rating: number;
  product_rating_id: string;
  product_rating_date: string;
}

const amazonProductReviewsSchema = new Schema<IProductReviews>(
  {
    product_id: String,
    product_rating: Number,
    product_rating_id: String,
    product_rating_date: String,
  },
  { versionKey: false },
);

const amazonProductReviewsModel = model<IProductReviews>(
  'Amazon Product Reviews',
  amazonProductReviewsSchema,
  'amazonProductReviews',
);

export default amazonProductReviewsModel;
