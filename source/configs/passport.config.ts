
import { Request } from "express";
import { Strategy,ExtractJwt } from "passport-jwt";
import passport from "passport";
import fs from "fs";
import path from "path";
import UserModel from "../models/user.model";

// PUBLIC KEY
const publicKey = fs.readFileSync(path.join(__dirname,"./keys/public.key")).toString();


// cookie extractor function
const cookieExtractor = (req: Request) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
}


// _____________ PASSPORT CONFIG ____________
passport.use(
    new Strategy({
        jwtFromRequest: cookieExtractor,
        secretOrKey: publicKey,
        passReqToCallback: true, // when true we can user req.user among authorized routes
        algorithms: ["RS256"]
    },
    (req: Request,jwt_payload: any,done: any) => {
        // find the user from jwt_payload.sub ==> userid
        UserModel.findById(jwt_payload.sub,(err: any,user: any) => {
            // if error then return error
            if (err) {
                done(null,false,{message: "Some error occured while authenticating the user."});
            }

            // if user is found
            if (user) {
                // assign the req.user = user
                req.user = user;
                done(null,user,{message: "Successfully authorized."})
            } else {
                // if user is not found
                done(null,false,{message: "User is not found."})
            }
        })
    })
)

export default passport;