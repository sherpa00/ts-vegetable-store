import mongoose from "mongoose";

// ______________________ STORE MODEL _______________________

// store interface
interface Store {
    title: string;
    description: string;
    price: number;
    category: mongoose.Types.Array<string>;
    image: string;
    max_quantity: number;
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
        type: String,
        required: true
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