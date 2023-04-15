import { model, Schema } from 'mongoose';

interface IProductPrices {
  product_id: string;
  product_price: string;
  product_price_date: string;
}

const amazonProductPricesSchema = new Schema<IProductPrices>(
  {
    product_id: String,
    product_price: String,
    product_price_date: String,
  },
  { versionKey: false },
);

const amazonProductPricesModel = model<IProductPrices>(
  'Amazon Product Prices',
  amazonProductPricesSchema,
  'amazonProductPrices',
);

export default amazonProductPricesModel;
