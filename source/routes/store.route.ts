import { Express,Router,Request } from "express";
import { CreateStoreProduct,DeleteAllStoreProduct,DeleteStoreProduct,GetAllStoreProduct, GetStoreProduct, UpdateStoreProduct } from "../controllers/store.controller";
import isAdmin from "../middlewares/isAdmin.middleware";
import multer from "multer";
import path from "path";

// muter disk storage
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,path.join(__dirname,"../public/uploads"))
    },
    filename:  function (req, file, callback) {
        callback(null,Date.now() + "-" + file.originalname);
    }
});

// filter the mimetype of image uploaded (allowed format are jpeg,jpg,png,webp)
const filterImages = (req: Request,file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    if (file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" || 
        file.mimetype === "image/png" || 
        file.mimetype === "image/webp"
    ) {
        callback(null,true);
    } else {
        callback(null,false);
    }
}

// multer upload file middleware
const upload = multer({storage: storage,fileFilter: filterImages});


// __________________ STORE ROUTES _______________
const router = Router();

// routes
router.get("/",GetAllStoreProduct);
router.get("/:id",GetStoreProduct)
router.post("/",isAdmin,upload.single("image"),CreateStoreProduct);
router.patch("/:id",isAdmin,UpdateStoreProduct);
router.delete("/",isAdmin,DeleteAllStoreProduct);
router.delete("/:id",isAdmin,DeleteStoreProduct);


export = router;