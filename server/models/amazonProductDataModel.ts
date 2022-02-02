import mongoose, { Schema } from 'mongoose';

const amazonProudctDataSchema = new Schema({
    _id: String,
    product_name: String,
    product_sale_price: String,
    product_image: String,

},{collection: 'amazonProductData'});
var amazonProductData  =  mongoose.model('amazonProductData', amazonProudctDataSchema);
export default amazonProductData;