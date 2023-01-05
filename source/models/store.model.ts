import mongoose from "mongoose";

// ______________________ STORE MODEL _______________________

// store interface
interface Store {
    title: string;
    description: string;
    price: number;
    category: mongoose.Types.Array<string>;
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
    id: number
};

// store schema
const StoreSchema = new mongoose.Schema<Store>({
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
    category: {
        type: [String]
    },
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
    },
    id: {
        type: Number,
        required: true
    }
});

// store model
const StoreModel = mongoose.model<Store>("store",StoreSchema);

export default StoreModel;