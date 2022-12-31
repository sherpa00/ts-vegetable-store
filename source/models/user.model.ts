
import mongoose from "mongoose";

// _______________ USER MODEL _________________

// user interface
interface User {
    username: string;
    email: string,
    salt: string,
    hash: string,
    isAdmin: boolean,
};

// user schema 
const UserSchema = new mongoose.Schema<User>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
});

// User Model
const UserModel = mongoose.model<User>("user",UserSchema);

export default UserModel;