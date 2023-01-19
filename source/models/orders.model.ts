import { model, Schema, Types } from "mongoose";

// _________________________ ORDERS MODEL ________________________
interface Order {
    userId: Types.ObjectId;
    email: string;
    orderdAt: string;
    orderdDeadline: string;
    status: string;
    delivery_details: {
        country: string;
        firstname: string;
        lastname: string;
        address: string;
        postcode: number;
        city: string;
        street: string;
        phone_number: number;
        delivery_note: string;
    };
    products: Types.Array<{
        title: string,
        quantity: number,
        price: number,
        totalsum: number,
        imgSrc: string,
    }>;
    bill: {
        subtotal: number;
        shipping_fee: number;
        total: number;
    };
}

// 3 days plus date
let futureDate: Date = new Date();
futureDate.setDate(futureDate.getDate() + 3);

const OrderSchema = new Schema<Order>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
    email: {
        type: String,
        required: true,
    },
    orderdAt: {
        type: String,
        default: new Date().toLocaleDateString(),
    },
    orderdDeadline: {
        type: String,
        default: futureDate.toLocaleDateString(),
    },
    status: {
        type: String,
        required: true,
        default: "Pending",
    },
    delivery_details: {
        country: {
            type: String,
            required: true,
        },
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        postcode: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        street: {
            type: String,
            required: true,
        },
        phone_number: {
            type: Number,
            required: true,
        },
        delivery_note: {
            type: String,
            required: true,
        },
    },
    products: [
        {
            title: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            imgSrc: {
                type: String,
                required: true
            },
            totalsum: {
                type: Number,
                required: true
            },
        }
    ]

    ,
    bill: {
        subtotal: {
            type: Number,
            required: true,
        },
        shipping_fee: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
    },
});

const OrderModel = model<Order>("order", OrderSchema);

export default OrderModel;

/* 
[
        {
            product: {
                title: string;
                description: string;
                price: number;
                Type: string;
                category: Types.Array<string>;
                image: {
                    path: string;
                    filename: string;
                    format: string;
                    width: string;
                    height: string;
                    channels: string;
                    premultiplied: string;
                    size: number;
                };
                max_quantity: number;
            };
            product_quantity: number;
            total_sum: number;
            checked: boolean;
            _id?: string,
            __v?: string
        }];
*/

/*

[
        {
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            Type: {
                type: String,
                required: true,
            },
            category: {
                type: [String],
            },
            image: {
                path: {
                    type: String,
                    required: true,
                },
                filename: {
                    type: String,
                    required: true,
                },
                format: {
                    type: String,
                    required: true,
                },
                width: {
                    type: Number,
                    required: true,
                },
                height: {
                    type: Number,
                    required: true,
                },
                channels: {
                    type: Number,
                    required: true,
                },
                premultiplied: {
                    type: Boolean,
                    required: true,
                },
                size: {
                    type: Number,
                    required: true,
                },
            },
            max_quantity: {
                type: Number,
                required: true,
            },
            product_quantity: {
                type: Number,
                required: true,
            },
            total_sum: {
                type: Number,
                required: true,
            },
            checked: {
                type: Boolean,
                required: true,
            },
            _id: {
                type: String,
                required: false
            },
            __v: {
                type: String,
                required: false,
            }
        },
    ]

*/