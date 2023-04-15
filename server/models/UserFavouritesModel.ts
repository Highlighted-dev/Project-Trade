import { Schema, model } from 'mongoose';

interface IUserFavouritesModel {
  user_id: string;
  product_id: string;
}

const favouritesSchema = new Schema<IUserFavouritesModel>(
  {
    user_id: { type: String, required: true },
    product_id: { type: String, required: true },
  },
  { versionKey: false },
);

const userFavouritesModel = model('Favourites', favouritesSchema, 'userFavourites');

export default userFavouritesModel;
