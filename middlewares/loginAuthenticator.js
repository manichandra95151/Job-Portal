import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const auth = (req, res, next) => {
  const token = req.session.token; // Extract token from cookies
  

  if (!token) {
      return res.redirect("/register");
  }

  try {
      const decoded = jwt.verify(token, "jwtSec");
      req.user = decoded; // Attach decoded user info to the request
      next();
  } catch (err) {
      console.error(err);
      return res.redirect("/register");
  }
};
;
