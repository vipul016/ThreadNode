import mongoose,{Schema,Document} from 'mongoose';

export interface IProduct extends Document{
    name : string,
    price : number,
    category : string,
    InStock : boolean
}

const ProductSchema : Schema<IProduct> = new Schema({
    name : {
        type : String,
        required: [true, "product name is required"],   
        trim : true
    },
    price : {
        type : Number,
        min: 1
    },
    category : {
        type : String,
        enum : ['electronics','clothings','food']
    },
    InStock: {
        type : Boolean,
        default : true
    }
})

const Product = mongoose.model<IProduct>('Product',ProductSchema);
export default Product;