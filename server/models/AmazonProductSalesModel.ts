import { model, Schema } from 'mongoose';

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
  { versionKey: false },
);

const amazonProductSalesModel = model<IProductSales>(
  'Amazon Product Sales',
  amazonProductSalesSchema,
  'amazonProductSales',
);

export default amazonProductSalesModel;
