import { Schema, model } from 'mongoose';

interface IProductThumbImages {
  product_id: string;
  product_thumb_image: string;
}

const amazonProductThumbImagesSchema = new Schema<IProductThumbImages>(
  {
    product_id: { type: String, required: true },
    product_thumb_image: { type: String, required: true },
  },
  { versionKey: false },
);

const amazonProductThumbImagesModel = model<IProductThumbImages>(
  'ProductThumbImages',
  amazonProductThumbImagesSchema,
  'amazonProductThumbImages',
);

export default amazonProductThumbImagesModel;
