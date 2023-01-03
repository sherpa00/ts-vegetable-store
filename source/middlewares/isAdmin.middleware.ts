import { Request,Response,NextFunction } from "express";

// _______ middleware to validate a  user is admin or not -> if admin then next() or else to logn route ______
const isAdmin = (req: Request,res: Response,next: NextFunction) => {
    // get the isAdmin boolean value from authenticated req.user
    const {isAdmin} : any = req.user;
    const userIsAdmin = isAdmin;

    // validate user
    if (userIsAdmin) {
        // is admin 
        next();
    } else {
        console.log("You are not admin.");
        res.redirect("/login");
    }
}

export default isAdmin;