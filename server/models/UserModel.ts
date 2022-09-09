import mongoose, { Model, Schema } from 'mongoose';

interface IUserModel {
  username: string;
  email: string;
  password: string;
  birthdate: string;
  sex: string;
  role: string;
}

const userModelSchema = new Schema<IUserModel>(
  {
    username: String,
    email: { type: String, unique: true },
    password: String,
    birthdate: String,
    sex: String,
    role: String,
  },
  { collection: 'userData' }
);
var userModel: Model<IUserModel> = mongoose.model('userModel', userModelSchema);
export default userModel;
