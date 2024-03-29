import { users} from '../models/user.js';
import { body } from 'express-validator';


export const Authenticator=(user)=>{
   
}
export const auth = (req, res, next) => {
    if (req.session.email) {
        next();
        console.log(req.session.email);
    } else {
        res.redirect("/login");
    }
};