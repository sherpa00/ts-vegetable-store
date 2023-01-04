import mongoose from "mongoose";

// ______________________ STORE MODEL _______________________

// store interface
interface Store {
    title: string;
    description: string;
    price: number;
    category: mongoose.Types.Array<string>;
    image: {
        fieldname: string,
        originalname: string,
        encoding: string,
        mimetype: string,
        destination: string,
        filename: string,
        path: string,
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
        fieldname: {
            type: String,
            required: true
        },
        originalname: {
            type: String,
            required: true
        },
        encoding: {
            type: String,
            required: true
        },
        mimetype: {
            type: String,
            required: true
        },
        destination: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        },
        path: {
            type: String,
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