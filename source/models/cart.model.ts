import { Schema,model, Types } from "mongoose";

// __________________________  CART MODEL _______________________

// Cart Interface
interface Cart {
    userId: Types.ObjectId,
    product: {
        _id: Types.ObjectId,
        title: string,
        description: string,
        price: number,
        category: Types.Array<string>,
        image: {
            path: string,
            filename: string,
            format: string,
            width: string,
            height: string,
            channels: string,
            premultiplied: string,
            size: number
        },
        max_quantity: number,
    },
    product_quantity: number,
    total_sum: number,
    checked: boolean
};

// Cart Schema
const CartSchema = new Schema<Cart>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    product: {
        _id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "stores"
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        category: [String],
        image: {
            path: {
                type: String,
                required: true
            },
            filename: {
                type: String,
                required: true
            },
            format: {
                type: String,
                required: true
            },
            width: {
                type: Number,
                required: true
            },
            height: {
                type: Number,
                required: true
            },
            channels: {
                type: Number,
                required: true
            },
            premultiplied: {
                type: Boolean,
                required: true
            },
            size: {
                type: Number,
                required: true
            }
        },
        max_quantity: {
            type: Number,
            required: true
        }
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    total_sum: {
        type: Number,
        required: true
    },
    checked: {
        type: Boolean,
        required: true,
        default: false
    }
});

// cart model 
const CartModel = model<Cart>("cart",CartSchema);

export default CartModel;