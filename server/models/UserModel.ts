import { model, Schema } from 'mongoose';

interface IUserModel {
  username: string;
  email: string;
  password: string;
  birthdate: string;
  sex: string;
  role: string;
}

const userSchema = new Schema<IUserModel>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthdate: { type: String, required: true },
    sex: { type: String, required: true },
    role: { type: String, required: true },
  },
  { versionKey: false },
);
const userModel = model<IUserModel>('Users', userSchema, 'userData');
export default userModel;
