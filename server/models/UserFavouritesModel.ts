import mongoose, { Model, Schema } from 'mongoose';

interface IUserFavouritesModel {
  user_id: string;
  product_id: string;
}

const userFavouritesModelSchema = new Schema<IUserFavouritesModel>(
  {
    user_id: String,
    product_id: String,
  },
  { collection: 'userFavourites' }
);
var userFavouritesModel: Model<IUserFavouritesModel> = mongoose.model(
  'userFavouritesModel',
  userFavouritesModelSchema
);
export default userFavouritesModel;
