import db from "./../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  omit,
  checkMissingField,
  errorResponseHandler,
  ValidationError,
  successResponse,
} from "../helpers.js";

const authController = {};

authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    checkMissingField([email, password]);

    const admin = await db.Admin.findOne({
      email,
      is_deleted: false,
    });

    if (!admin) {
      throw new ValidationError(401, "Invalid password or email");
    }

    let passwordMatch;
    if (typeof admin.checkPassword === "function") {
      // admin helper in case bcrypt fails
      passwordMatch = await admin.checkPassword(password);
    } else {
      // fallback compare directly using bcrypt
      passwordMatch = await bcrypt.compare(password, admin.password);
    }

    if (!passwordMatch) {
      throw new ValidationError(401, "Invalid password or email");
    }

    const isAdmin = true;
    const token = jwt.sign(
      { id: admin._id, isAdmin },
      process.env.JWT_KEY,
      { expiresIn: process.env.USER_TOKEN_EXPIRATION }
    );

    return successResponse(res, {
      isAdmin,
      user: omit(admin, ["password", "is_deleted", "__v", "created_at"]),
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return errorResponseHandler(err, res);
  }
};

authController.refreshSession = async (req, res) => {
  try {
    const { id } = req.tokenData;

    const admin = await db.Admin.findOne({
      _id: id,
      is_deleted: false,
    });

    if (!admin) {
      throw new ValidationError(401, "Session invalid or user not found");
    }

    const isAdmin = true;
    const token = jwt.sign(
      { id: admin._id, isAdmin },
      process.env.JWT_KEY,
      { expiresIn: process.env.USER_TOKEN_EXPIRATION }
    );

    return successResponse(res, {
      isAdmin,
      user: omit(admin, ["password", "is_deleted", "__v", "created_at"]),
      token,
    });
  } catch (err) {
    console.error("Session Refresh Error:", err);
    return errorResponseHandler(err, res);
  }
};

export default authController;
