import { unless } from "express-unless";
import jwt from "jsonwebtoken";
import db from "./models/index.js";

// ----------------------------------------
// 🧨 Custom Error Class
// ----------------------------------------

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

// ----------------------------------------
// 🔐 JWT Parser Middleware
// ----------------------------------------

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

// export const jwtParser = (req, res, next) => {
//   console.log("🔎 [jwtParser] Incoming request:", {
//     method: req.method,
//     path: req.originalUrl,
//     headers: req.headers,
//   });

//   // 1) Allow CORS preflight to pass
//   if (req.method === "OPTIONS") {
//     console.log("➡️ OPTIONS preflight detected, skipping auth.");
//     return next();
//   }

//   // 2) API key bypass
//   const apiKey = req.get("x-api-key");
//   console.log("🔑 x-api-key header value:", apiKey);
//   console.log("🔑 process.env.PI_API_KEY value:", process.env.PI_API_KEY);

//   if (
//     apiKey &&
//     process.env.PI_API_KEY &&
//     apiKey.trim() === String(process.env.PI_API_KEY).trim()
//   ) {
//     console.log("✅ API key matched. Bypassing JWT check.");
//     req.tokenData = { authType: "apiKey" };
//     return next();
//   } else {
//     if (!apiKey) console.log("❌ No x-api-key header provided.");
//     else if (!process.env.PI_API_KEY)
//       console.log("❌ process.env.PI_API_KEY not set.");
//     else
//       console.log(
//         "❌ API key mismatch:",
//         `"${apiKey.trim()}" !== "${String(process.env.PI_API_KEY).trim()}"`
//       );
//   }

//   // 3) Bearer token
//   const authHeader = req.get("authorization") || "";
//   console.log("🪪 Authorization header:", authHeader);

//   const match = authHeader.match(/^Bearer\s+(.+)$/i);
//   if (match) {
//     const token = match[1].trim();
//     console.log("🪙 Extracted Bearer token:", token);

//     return jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
//       if (err) {
//         console.log("❌ JWT verification failed:", err.message);
//         return res.status(403).json({
//           success: false,
//           message:
//             "Invalid Token: you are not authorized to view this content.",
//         });
//       }
//       console.log("✅ JWT verified. Token data:", decoded);
//       req.tokenData = decoded;
//       return next();
//     });
//   }

//   console.log("❌ No valid auth provided (API key or JWT). Returning 401.");
//   return res.status(401).json({
//     success: false,
//     message: "No valid authentication provided.",
//   });
// };

// Enable `unless()` usage on middleware
jwtParser.unless = unless;

// ----------------------------------------
// 📦 Response Utilities
// ----------------------------------------

/**
 * Standard error response formatter, supports `ValidationError` or generic fallback.
 */
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

// Restore this later if partial success logic is reintroduced , e.g found some but not all entities
// export const partialSuccessResponse = (res, data, errorsPryv, errorsRequest) =>
//   res.status(207).json({
//     success: true,
//     message: "Some errors occurred...",
//     successfulFacts: data,
//     errors,
//     errorsRequest,
//   });

// ----------------------------------------
// 🧪 Field & Uniqueness Validation Helpers
// ----------------------------------------

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

// ----------------------------------------
// ✂️ Object Utilities
// ----------------------------------------

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

/**
 * Apply voucher logic to an order.
 * 
 * @param {Object} options 
 * @param {String} options.voucherCode - Code entered by farmer
 * @param {String} options.userId - Farmer ID (for once_per_user check)
 * @param {Number} options.orderTotal - Order total BEFORE discount
 * @returns {Object} - discount amount, freeItems, or error
 */
export const applyVoucher = async ({ voucherCode, userId, orderTotal }) => {
  try {
    const voucher = await db.Voucher.findOne({
      code: voucherCode,
      is_deleted: false
    });

    if (!voucher) {
      return { error: "Invalid voucher code." };
    }

    // Check usage limits
    if (voucher.usage_limit === "once_global" && voucher.total_used > 0) {
      return { error: "This voucher has already been used." };
    }

    if (voucher.usage_limit === "once_per_user") {
      const used = await db.Order.findOne({
        _user: userId,
        voucher_code: voucher.code
      });
      if (used) {
        return { error: "You have already used this voucher." };
      }
    }

    // Calculate discount
    let discount = 0;

    if (voucher.discount_type === "percentage") {
      discount = (voucher.discount_value / 100) * orderTotal;
    } else if (voucher.discount_type === "fixed") {
      discount = voucher.discount_value;
    }

    // Apply max cap if relevant
    if (voucher.max_discount_amount && discount > voucher.max_discount_amount) {
      discount = voucher.max_discount_amount;
    }

    // Prevent over-discounting (can't be higher than total)
    discount = Math.min(discount, orderTotal);
    discount = Math.round(discount * 100) / 100; // Round to 2 decimal places

    return {
      discount,
      description: voucher.description || "",
      freeItems: voucher.free_items || 0,
      error: null
    };

  } catch (err) {
    console.error("Error applying voucher:", err);
    return { error: "Failed to apply voucher." };
  }
};