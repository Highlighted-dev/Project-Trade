import { model, Schema } from 'mongoose';

interface IProductHighResImages {
  product_id: string;
  product_highres_image: string;
}

const amazonProductHighResImagesSchema = new Schema<IProductHighResImages>(
  {
    product_id: String,
    product_highres_image: String,
  },
  { versionKey: false },
);

const amazonProductHighResImagesModel = model<IProductHighResImages>(
  'Amazon Product High Resolution Images',
  amazonProductHighResImagesSchema,
  'amazonProductHighResImages',
);

export default amazonProductHighResImagesModel;
