import mongoose, { Model, Schema } from 'mongoose';

const amazonProudctDataSchema: Schema = new Schema({
    _id: String,
    product_name: String,
    product_sale_price: String,
    product_image: String,

},{collection: 'amazonProductData'});
var amazonProductData: Model<String, {}, {}, {}>  =  mongoose.model('amazonProductData', amazonProudctDataSchema);
export default amazonProductData;