import mongoose, { Model, Schema } from 'mongoose';

interface IProductTechnicalDetails {
  product_id: string;
  product_technical_detail_name: string;
  product_technical_detail: string;
}

const amazonProductTechnicalDetailsSchema =
  new Schema<IProductTechnicalDetails>(
    {
      product_id: String,
      product_technical_detail_name: String,
      product_technical_detail: String,
    },
    { collection: 'amazonProductTechnicalDetails' }
  );
var amazonProductTechnicalDetails: Model<IProductTechnicalDetails> =
  mongoose.model(
    'amazonProductTechnicalDetails',
    amazonProductTechnicalDetailsSchema
  );
export default amazonProductTechnicalDetails;
