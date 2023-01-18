import { model, Schema, Types } from "mongoose"


// _________________________ ORDERS MODEL ________________________
interface Order {
    userId: Types.ObjectId,
    orderdAt: string,
    orderdDeadline: string,
    status: string,
    delivery_details : {
        country: string,
        firstname: string,
        lastname: string,
        address: string,
        postcode: number,
        city: string,
        street: string,
        phone_number: number,
        delivery_note: string
    },
    bill: {
        subtotal: number,
        shipping_fee: number,
        total: number
    }
}

// 3 days plus date
let futureDate : Date = new Date();
futureDate.setDate(futureDate.getDate() + 3);

const OrderSchema = new Schema<Order>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    orderdAt: {
        type: String,
        default: new Date().toLocaleDateString()
    },
    orderdDeadline: {
        type: String,
        default: futureDate.toLocaleDateString()
    },
    status: {
        type: String,
        required: true,
        default: "Pending"
    },
    delivery_details: {
        country: {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        postcode: {
            type: Number,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        phone_number: {
            type: Number,
            required: true
        },
        delivery_note: {
            type: String,
            required: true
        }
    },
    bill: {
        subtotal: {
            type: Number,
            required: true
        },
        shipping_fee: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    }
});

const OrderModel = model<Order>('order',OrderSchema);

export default OrderModel;