import { Request } from "express";
import multer from "multer";

// muter disk storage
const storage = multer.memoryStorage();

// filter the mimetype of image uploaded (allowed format are jpeg,jpg,png,webp)
const filterImages = (req: Request,file: Express.Multer.File, callback: any) => {
    if (file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" || 
        file.mimetype === "image/png" || 
        file.mimetype === "image/webp"
    ) {
        callback(null,true);
    } else {
        callback(new Error("Image format restricted"),false);
    }
}

// multer upload file middleware
const upload = multer({storage: storage,fileFilter: filterImages});

export default upload;