import { model, Schema } from 'mongoose';

interface IProductAbout {
  product_id: string;
  product_about: string;
}

const amazonProductAboutSchema = new Schema<IProductAbout>(
  {
    product_id: String,
    product_about: String,
  },
  { versionKey: false },
);

const amazonProductAboutModel = model<IProductAbout>(
  'Amazon Product About',
  amazonProductAboutSchema,
  'amazonProductAbout',
);

export default amazonProductAboutModel;
