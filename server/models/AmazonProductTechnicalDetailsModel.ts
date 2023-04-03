import { Schema, model } from 'mongoose';

interface IProductTechnicalDetails {
  product_id: string;
  product_technical_detail_name: string;
  product_technical_detail: string;
}

const amazonProductTechnicalDetailsSchema = new Schema<IProductTechnicalDetails>(
  {
    product_id: { type: String, required: true },
    product_technical_detail_name: { type: String, required: true },
    product_technical_detail: { type: String, required: true },
  },
  { versionKey: false },
);

const amazonProductTechnicalDetailsModel = model<IProductTechnicalDetails>(
  'Product Technical Details',
  amazonProductTechnicalDetailsSchema,
  'amazonProductTechnicalDetails',
);

export default amazonProductTechnicalDetailsModel;
