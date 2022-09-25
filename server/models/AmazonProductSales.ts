import { ObjectId } from 'mongodb';
import mongoose, { Model, Schema } from 'mongoose';

interface IProductSales {
  product_id: string;
  product_sales: number;
  product_sales_date: string;
}

const amazonProductSalesSchema = new Schema<IProductSales>(
  {
    product_id: String,
    product_sales: Number,
    product_sales_date: String,
  },
  { collection: 'amazonProductSales', versionKey: false }
);
var amazonProductSales: Model<IProductSales> = mongoose.model(
  'amazonProductSales',
  amazonProductSalesSchema
);
export default amazonProductSales;
