// controllers/authController.js
import db from "./../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  omit,
  checkMissingField,
  checkUnique,
  errorResponseHandler,
  ValidationError,
  successResponse,
} from "../helpers.js";

const authController = {};

authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    checkMissingField([email, password]);

    let isAdmin = false;
    let user = null;

    // 1) Try to find an Admin first
    const admin = await db.Admin.findOne({
      email,
      is_deleted: false,
    });

    if (admin) {
      isAdmin = true;
      user = admin;
    } else {
      // 2) Otherwise, look in User collection
      const users = await db.User.find({
        email,
        is_deleted: false,
      });

      checkUnique(users);
      user = users[0];
    }

    // 3) Check password
    let passwordMatch;
    if (isAdmin && typeof user.checkPassword === "function") {
      // use Admin model helper (bcrypt under the hood)
      passwordMatch = await user.checkPassword(password);
    } else {
      // regular User (assuming password is bcrypt-hashed too)
      passwordMatch = await bcrypt.compare(password, user.password);
    }

    if (!passwordMatch) {
      throw new ValidationError(401, "Invalid password or email");
    }

    // 4) Issue JWT
    const token = jwt.sign(
      { id: user._id, isAdmin },
      process.env.JWT_KEY,
      { expiresIn: process.env.USER_TOKEN_EXPIRATION }
    );

    return successResponse(res, {
      isAdmin,
      user: omit(user, ["password", "is_deleted", "__v", "created_at"]),
      token,
    });

  } catch (err) {
    console.error("Login Error:", err);
    return errorResponseHandler(err, res);
  }
};

authController.refreshSession = async (req, res) => {
  try {
    const { id, isAdmin } = req.tokenData;

    const users = await (isAdmin
      ? db.Admin.find({ _id: id })
      : db.User.find({ _id: id }));

    checkUnique(users);
    const user = users[0];

    const token = jwt.sign(
      { id: user._id, isAdmin },
      process.env.JWT_KEY,
      { expiresIn: process.env.USER_TOKEN_EXPIRATION }
    );

    return successResponse(res, {
      isAdmin,
      user: omit(user, ["password", "is_deleted", "__v", "created_at"]),
      token,
    });
  } catch (err) {
    console.error("Session Refresh Error:", err);
    return errorResponseHandler(err, res);
  }
};
 
export default authController
