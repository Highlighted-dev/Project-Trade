import mongoose, { Model, Schema } from 'mongoose';

interface IUserModel {
  username: string;
  email: string;
  password: string;
  //group?: string;
}

const userModelSchema = new Schema<IUserModel>(
  {
    username: String,
    email: { type: String, unique: true },
    password: String,
    //group: String,
  },
  { collection: 'userData' }
);
var userModel: Model<IUserModel> = mongoose.model('userModel', userModelSchema);
export default userModel;
