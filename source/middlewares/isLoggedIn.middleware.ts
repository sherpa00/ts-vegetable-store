import { Request,Response,NextFunction } from "express";

// ___________ middleware to restrict logged in users to access /login and /signup routes ____________

// for normal user
const isLoggedIn = (req: Request,res: Response,next: NextFunction) => {
    // validate user is logged in by req.cookies 
    if (req && req.cookies && req.cookies['token']) {
        // user is logged in so restrict this user from accessing routes
        res.redirect("/store");
    } else {
        // if not logged in then go ahead
        next();
    }
}



export default isLoggedIn;