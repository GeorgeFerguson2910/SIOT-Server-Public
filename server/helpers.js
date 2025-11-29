import { unless } from "express-unless";
import jwt from "jsonwebtoken";

/**
 * Custom error for validation-related failures.
 * Used with `errorResponseHandler` to return consistent client-facing messages.
 */
export class ValidationError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Express middleware to verify JWTs from Authorization headers.
 * Injects token data into `req.tokenData` on success.
 */

export const jwtParser = (req, res, next) => {
  // 1) Allow CORS preflight to pass
  if (req.method === "OPTIONS") return next();

  // 2) API key bypass (case-insensitive header lookup + trimmed compare)
  const apiKey = req.get("x-api-key"); // same as req.header()
  if (
    apiKey &&
    process.env.PI_API_KEY &&
    apiKey.trim() === String(process.env.PI_API_KEY).trim()
  ) {
    // (optional) mark request as API-key auth
    req.tokenData = { authType: "apiKey" };
    return next();
  }

  // 3) Bearer token (robust parse, case-insensitive "Bearer")
  const authHeader = req.get("authorization") || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (match) {
    const token = match[1].trim();
    return jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message:
            "Invalid Token: you are not authorized to view this content.",
        });
      }
      req.tokenData = decoded;
      return next();
    });
  }

  // 4) Nothing matched → unauthorized
  return res.status(401).json({
    success: false,
    message: "You must be logged in to view this content.",
  });
};

jwtParser.unless = unless;

export const errorResponseHandler = (error, res) => {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error: " + error.message,
  });
};

/**
 * Returns standard 200 response with data payload.
 */
export const successResponse = (res, data) =>
  res.status(200).json({ success: true, data });

/**
 * Returns 200 response with a success message (usually after deletion).
 */
export const deletedResponse = (res, message) =>
  res.status(200).json({ success: true, message });

/**
 * Returns 201 response for created or updated entities.
 */
export const successResponseCreated = (res, data) =>
  res.status(201).json({
    success: true,
    message: "Entity Successfully Created/Updated",
    data,
  });

/**
 * Throws a ValidationError if any field in `fields` is undefined.
 */
export const checkMissingField = (fields) => {
  for (let field of fields) {
    if (typeof field === "undefined") {
      throw new ValidationError(400, "Missing fields in request");
    }
  }
};

/**
 * Ensures array has exactly one element.
 */
export const checkUnique = (array) => {
  if (array.length !== 1) {
    throw new ValidationError(
      404,
      "Several or no entities match requested resource"
    );
  }
};


/**
 * Omits specified keys from an object clone.
 * Throws if the key doesn't exist in the original.
 */
export const omit = (obj, toRemove) => {
  let clone = JSON.parse(JSON.stringify(obj));

  for (let prop of toRemove) {
    if (prop in obj) {
      delete clone[prop];
    } else {
      throw new Error("Following property could not be omitted: " + prop);
    }
  }

  return clone;
};