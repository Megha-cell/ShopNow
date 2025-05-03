import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; //Get token from header
      //console.log("Token received", req.headers.authorization);
      const decoded = jwt.verify(token, process.env.JWT_SECRET); //Verify token
      //console.log(decoded);
      req.user = await User.findById(decoded.userId).select("-password"); //Get user from token

      next();
    } catch (error) {
      res.status(401).json({ message: "Token expied or invalid" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export { protect };
