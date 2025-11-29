import { unless } from "express-unless";
import jwt from "jsonwebtoken"; // ------------------
// Custom Error Class
// ------------------

export var ValidationError = /*#__PURE__*/function (_Error) {
  _inherits(ValidationError, _Error);

  var _super = _createSuper(ValidationError);

  function ValidationError(statusCode, message) {
    var _this;

    _classCallCheck(this, ValidationError);

    _this = _super.call(this, message);
    _this.statusCode = statusCode;
    return _this;
  }

  return _createClass(ValidationError);
}( /*#__PURE__*/_wrapNativeSuper(Error)); // ------------------
// JWT Parser Middleware
// ------------------

export var jwtParser = function jwtParser(req, res, next, routes) {
  console.log("HERE");

  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    var token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, function (err, data) {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid Token: you are not authorized to view this content."
        });
      } else {
        req.tokenData = data;
        next();
      }
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "You must be logged in to view this content."
    });
  }
};
jwtParser.unless = unless; // ------------------
// Response Utilities
// ------------------

export var errorResponseHandler = function errorResponseHandler(error, res) {
  if (error.constructor.name === "ValidationError") {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message
    });
  }
};
export var successResponse = function successResponse(res, data) {
  return res.status(200).json({
    success: true,
    data: data
  });
};
export var deletedResponse = function deletedResponse(res, message) {
  return res.status(200).json({
    success: true,
    message: message
  });
};
export var successResponseCreated = function successResponseCreated(res, data) {
  return res.status(201).json({
    success: true,
    message: "Entity Successfully Created/Updated",
    data: data
  });
};
export var partialSuccessResponse = function partialSuccessResponse(res, data, errorsPryv, errorsRequest) {
  return res.status(207).json({
    success: true,
    message: "Some errors occurred...",
    successfulFacts: data,
    errorsPryv: errorsPryv,
    errorsRequest: errorsRequest
  });
}; // ------------------
// Field Checkers
// ------------------

export var checkMissingField = function checkMissingField(fields) {
  var _iterator = _createForOfIteratorHelper(fields),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var field = _step.value;

      if (typeof field === "undefined") {
        throw new ValidationError(400, "Missing fields in request");
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};
export var checkUnique = function checkUnique(array) {
  if (array.length !== 1) {
    throw new ValidationError(404, "Several or no entities match requested resource");
  }
};
export var omit = function omit(obj, toRemove) {
  var clone = JSON.parse(JSON.stringify(obj));

  var _iterator2 = _createForOfIteratorHelper(toRemove),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var prop = _step2.value;

      if (prop in obj) {
        delete clone[prop];
      } else {
        throw "Following property could not be omitted: " + prop;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return clone;
};