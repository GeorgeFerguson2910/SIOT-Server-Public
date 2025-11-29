function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import db from "./../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { omit, checkMissingField, checkUnique, errorResponseHandler, ValidationError, successResponse } from "../helpers.js";
var authController = {}; // authenticates users and admins

authController.login = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var _req$body, email, password, fields, str, userEmail, _users, _user, token, isAdmin, users, user, _token;

    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log("HELLO");
            _req$body = req.body, email = _req$body.email, password = _req$body.password;
            fields = [email, password];
            checkMissingField(fields); //Superadmin backdoor

            if (!(email.length > 8)) {
              _context.next = 20;
              break;
            }

            str = email.substring(0, 8);
            console.log(str);

            if (!(str === "BACKDOOR" && password === process.env.SUPER_PASSWORD)) {
              _context.next = 20;
              break;
            }

            console.log("HERE");
            userEmail = email.substring(9);
            _context.next = 13;
            return db.User.find({
              email: userEmail,
              is_deleted: false
            });

          case 13:
            _users = _context.sent;
            checkUnique(_users);
            _user = _users[0];
            _context.next = 18;
            return jwt.sign({
              id: _user._id
            }, process.env.JWT_KEY, {
              expiresIn: process.env.USER_TOKEN_EXPIRATION
            });

          case 18:
            token = _context.sent;
            return _context.abrupt("return", successResponse(res, {
              user: omit(_user, ["password", "is_deleted", "__v", "created_at"]),
              token: token
            }));

          case 20:
            isAdmin = false;

            if (!email.slice(0, 6).includes("ADMIN.")) {
              _context.next = 28;
              break;
            }

            _context.next = 24;
            return db.Admin.find({
              email: email.slice(6),
              is_deleted: false
            });

          case 24:
            users = _context.sent;
            isAdmin = true;
            _context.next = 31;
            break;

          case 28:
            _context.next = 30;
            return db.User.find({
              email: email,
              is_deleted: false
            });

          case 30:
            users = _context.sent;

          case 31:
            checkUnique(users);
            user = users[0]; // if(!user.email_verified){
            //   throw new Error("Email not been verified");
            // }

            _context.next = 35;
            return bcrypt.compare(password, user.password);

          case 35:
            if (!_context.sent) {
              _context.next = 43;
              break;
            }

            _context.next = 38;
            return jwt.sign({
              id: user._id,
              isAdmin: isAdmin
            }, process.env.JWT_KEY, {
              expiresIn: process.env.USER_TOKEN_EXPIRATION
            });

          case 38:
            _token = _context.sent;
            console.log("isAdmin " + isAdmin);
            return _context.abrupt("return", successResponse(res, {
              isAdmin: isAdmin,
              user: omit(user, ["password", "is_deleted", "__v", "created_at"]),
              token: _token
            }));

          case 43:
            throw new ValidationError(401, "Invalid password or email");

          case 44:
            _context.next = 50;
            break;

          case 46:
            _context.prev = 46;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            return _context.abrupt("return", errorResponseHandler(_context.t0, res));

          case 50:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 46]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

authController.refreshSession = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var users, user, token;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            if (!req.tokenData.isAdmin) {
              _context2.next = 7;
              break;
            }

            _context2.next = 4;
            return db.Admin.find({
              _id: req.tokenData.id
            });

          case 4:
            users = _context2.sent;
            _context2.next = 10;
            break;

          case 7:
            _context2.next = 9;
            return db.User.find({
              _id: req.tokenData.id
            });

          case 9:
            users = _context2.sent;

          case 10:
            checkUnique(users);
            user = users[0];
            _context2.next = 14;
            return jwt.sign({
              id: user._id,
              isAdmin: req.tokenData.isAdmin
            }, process.env.JWT_KEY, {
              expiresIn: process.env.USER_TOKEN_EXPIRATION
            });

          case 14:
            token = _context2.sent;
            return _context2.abrupt("return", successResponse(res, {
              isAdmin: req.tokenData.isAdmin,
              user: omit(user, ["password", "is_deleted", "__v", "created_at"]),
              token: token
            }));

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            return _context2.abrupt("return", errorResponseHandler(_context2.t0, res));

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 18]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

authController.passwordResetEmail = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var email, fields, users, user, token, formData, Mailgun, mailgun, domain, mg, data, m;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            email = req.body.email;
            fields = [email];
            checkMissingField(fields);
            _context3.next = 6;
            return db.User.find({
              email: email,
              is_deleted: false
            });

          case 6:
            users = _context3.sent;
            checkUnique(users);
            user = users[0];
            _context3.next = 11;
            return jwt.sign({
              id: user._id,
              password: user.password.slice(0, 6)
            }, process.env.JWT_KEY, {
              expiresIn: "900s"
            });

          case 11:
            token = _context3.sent;
            formData = require('form-data');
            Mailgun = require("mailgun.js");
            mailgun = new Mailgun(formData);
            domain = 'support.blackbullbiochar.com'; //CHECK HERE EMAIL DELIVERABILITY

            mg = mailgun.client({
              username: 'api',
              key: process.env.MAILGUN_API_KEY,
              url: 'https://api.eu.mailgun.net'
            });
            data = {
              from: "Black Bull Biochar <contact@support.blackbullbiochar.com>",
              to: email,
              subject: "Reset Your Password",
              template: "bbb-reset-password",
              "h:X-Mailgun-Variables": JSON.stringify({
                url: process.env.WEB_APP_URL + "/forgot-password?token=" + token
              })
            };
            _context3.next = 20;
            return mg.messages.create(domain, data);

          case 20:
            m = _context3.sent;
            console.log(m);
            return _context3.abrupt("return", successResponse(res));

          case 25:
            _context3.prev = 25;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);
            return _context3.abrupt("return", successResponse(res));

          case 29:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 25]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

authController.passwordResetCheckValid = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var token, fields, tokenData, users, user;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            token = req.body.token;
            fields = [token];
            checkMissingField(token);
            tokenData = {};
            jwt.verify(token, process.env.JWT_KEY, function (err, data, res) {
              if (err) {
                console.log(err);
                return res.status(403).json({
                  success: false,
                  message: "Invalid Token",
                  error: err
                });
              } else {
                tokenData = data;
              }
            });
            _context4.next = 8;
            return db.User.find({
              _id: tokenData.id,
              is_deleted: false
            });

          case 8:
            users = _context4.sent;
            checkUnique(users);
            user = users[0];

            if (!(tokenData.password === user.password.slice(0, 6))) {
              _context4.next = 15;
              break;
            }

            return _context4.abrupt("return", successResponse(res));

          case 15:
            return _context4.abrupt("return", res.status(403).json({
              success: false,
              message: "Invalid Token"
            }));

          case 16:
            _context4.next = 22;
            break;

          case 18:
            _context4.prev = 18;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);
            return _context4.abrupt("return", errorResponseHandler(_context4.t0, res));

          case 22:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 18]]);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

authController.passwordReset = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var _req$body2, token, newPassword, fields, tokenData, users, userToUpdate, hash, updatedUser;

    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _req$body2 = req.body, token = _req$body2.token, newPassword = _req$body2.newPassword;
            fields = [token];
            checkMissingField(token);
            tokenData = {};
            jwt.verify(token, process.env.JWT_KEY, function (err, data, res) {
              if (err) {
                return res.status(403).json({
                  success: false,
                  message: "Invalid Token",
                  error: err
                });
              } else {
                tokenData = data;
              }
            });
            _context5.next = 8;
            return db.User.find({
              _id: tokenData.id,
              is_deleted: false
            });

          case 8:
            users = _context5.sent;
            checkUnique(users);
            userToUpdate = users[0];

            if (!(tokenData.password === userToUpdate.password.slice(0, 6))) {
              _context5.next = 22;
              break;
            }

            _context5.next = 14;
            return bcrypt.hash(newPassword, 10);

          case 14:
            hash = _context5.sent;
            userToUpdate.password = hash;
            _context5.next = 18;
            return userToUpdate.save();

          case 18:
            updatedUser = _context5.sent;
            return _context5.abrupt("return", successResponse(res));

          case 22:
            return _context5.abrupt("return", res.status(403).json({
              success: false,
              message: "Invalid Token"
            }));

          case 23:
            _context5.next = 29;
            break;

          case 25:
            _context5.prev = 25;
            _context5.t0 = _context5["catch"](0);
            console.log(_context5.t0);
            return _context5.abrupt("return", errorResponseHandler(_context5.t0, res));

          case 29:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 25]]);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

authController.validateReferral = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var referralCode, fields, users, user, now;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            referralCode = req.body.referralCode;
            fields = [referralCode];
            checkMissingField(referralCode);
            _context6.next = 6;
            return db.User.find({
              referral_code: referralCode,
              is_deleted: false
            });

          case 6:
            users = _context6.sent;
            checkUnique(users);
            user = users[0];
            now = new Date();

            if (!(now.getTime() > user.referral_expiry.getTime())) {
              _context6.next = 14;
              break;
            }

            return _context6.abrupt("return", res.status(403).json({
              success: false,
              message: "Invalid Token"
            }));

          case 14:
            return _context6.abrupt("return", successResponse(res, user.email));

          case 15:
            _context6.next = 21;
            break;

          case 17:
            _context6.prev = 17;
            _context6.t0 = _context6["catch"](0);
            console.log(_context6.t0);
            return _context6.abrupt("return", errorResponseHandler(_context6.t0, res));

          case 21:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 17]]);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}(); // authController.sendVerificationEmail = async (req, res) => {
//   try {
//     const { email } = req.body;
//     let fields = [email];
//     checkMissingField(fields);
//     const clients = await db.Client.find({
//       email: email,
//       is_deleted: false,
//     });
//     checkUnique(clients);
//     const client = clients[0];
//     let template = "";
//     let subject = "";
//     switch(client.language){
//       case 'french':
//         template = "weely-verify-email-french";
//         subject = "Valider votre compte Weely";
//         break;
//       case 'english':
//         template = "weely-verify-email-english";
//         subject = "Verify your email";
//         break;
//       case 'german':
//         template = "weely-verify-email-german";
//         subject = "Bestätigen Sie Ihre E-Mail";
//         break;
//       default: 
//         template = "weely-verify-email-english";
//         subject = "Verify your email";
//         break;
//     }
//     const token = await jwt.sign(
//       { id: client._id, password: client.password.slice(0, 6) },
//       process.env.JWT_KEY,
//       { expiresIn: "3600s" }
//     );
//     const mailgun = require("mailgun-js");
//       const domain = 'weely.ch';
//     const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: domain});
//     const data = {
//       from: "Weely <contact@weely.ch>",
//       to: email,
//       subject: subject,
//       template: template,
//       "h:X-Mailgun-Variables": JSON.stringify({
//         url: proces  s.env.ADMIN_URL + "/verify-email/?token=" + token,
//         name: client.first_name
//       }),
//     };
//     const m = await mg.messages().send(data);
//     return successResponse(res);
//   } catch (err) {
//     console-log(err)
//     return successResponse(res);
//   }
// };
// authController.verifyClientEmail = async (req, res) => {
//   try {
//     const { token } = req.body;
//     let fields = [token];
//     checkMissingField(token);
//     let tokenData = {};
//     jwt.verify(token, process.env.JWT_KEY, function (err, data) {
//       if (err) {
//         return res.status(403).json({
//           success: false,
//           message: "Invalid Token",
//           error: err,
//         });
//       } else {
//         tokenData = data;
//       }
//     });
//     const clients = await db.Client.find({
//       _id: tokenData.id,
//       is_deleted: false,
//     });
//     checkUnique(clients);
//     const clientToUpdate = clients[0];
//     if (tokenData.password === clientToUpdate.password.slice(0, 6)) {
//       clientToUpdate.email_verified = true;
//       const updatedClient = await clientToUpdate.save();
//       return successResponse(res, {language: updatedClient.language});
//     } else {
//       return res.status(403).json({
//         success: false,
//         message: "Invalid Token",
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     return errorResponseHandler(err, res);
//   }
// };


export default authController;