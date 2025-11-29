function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import db from "./../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import xero from 'xero-node';
var XeroAccessToken = xero.XeroAccessToken,
    XeroClient = xero.XeroClient;
import { checkMissingField, checkUnique, ValidationError, errorResponseHandler, successResponse, successResponseCreated, omit } from "../helpers.js";
var userController = {}; // creates a new user

userController.createUser = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var _req$body, businessName, firstName, lastName, email, password, country, language, phoneMobile, phoneHome, fields, users, hash, user, newUser;

    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _req$body = req.body, businessName = _req$body.businessName, firstName = _req$body.firstName, lastName = _req$body.lastName, email = _req$body.email, password = _req$body.password, country = _req$body.country, language = _req$body.language, phoneMobile = _req$body.phoneMobile, phoneHome = _req$body.phoneHome;
            fields = [businessName, firstName, lastName, email, password, country, language, phoneMobile, phoneHome];
            checkMissingField(fields);
            _context.next = 6;
            return db.User.find({
              email: email,
              is_deleted: false
            });

          case 6:
            users = _context.sent;

            if (!(users.length > 0)) {
              _context.next = 9;
              break;
            }

            throw new Error("An account is already associated with this email");

          case 9:
            _context.next = 11;
            return bcrypt.hash(password, 10);

          case 11:
            hash = _context.sent;
            user = new db.User({
              business_name: businessName,
              first_name: firstName,
              last_name: lastName,
              country: country,
              language: language,
              phone_home: phoneHome,
              phone_mobile: phoneMobile,
              email: email,
              password: hash
            });
            _context.next = 15;
            return user.save();

          case 15:
            newUser = _context.sent;
            return _context.abrupt("return", successResponseCreated(res, {
              user: omit(user, ["password", "is_deleted", "__v", "_id", "created_at"])
            }));

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            return _context.abrupt("return", errorResponseHandler(_context.t0, res));

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 19]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // updates (create) a new user through the standard onboarding process (with ref code)


userController.signUp = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _req$body2, businessName, firstName, lastName, email, password, country, mobilePhone, homePhone, subscribeToNewsletter, referralCode, questionnaireData, fields, users, userToUpdate, hash, xeroTenantId, idempotencyKey, summarizeErrors, phone1, phone2, phones, contact, contacts, updatedUser;

    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _req$body2 = req.body, businessName = _req$body2.businessName, firstName = _req$body2.firstName, lastName = _req$body2.lastName, email = _req$body2.email, password = _req$body2.password, country = _req$body2.country, mobilePhone = _req$body2.mobilePhone, homePhone = _req$body2.homePhone, subscribeToNewsletter = _req$body2.subscribeToNewsletter, referralCode = _req$body2.referralCode, questionnaireData = _req$body2.questionnaireData;
            fields = [businessName, firstName, lastName, email, password, country, mobilePhone, homePhone, subscribeToNewsletter, referralCode];
            console.log(fields);
            checkMissingField(fields);
            _context2.next = 7;
            return db.User.find({
              // email: email,
              referral_code: referralCode,
              is_deleted: false
            });

          case 7:
            users = _context2.sent;

            if (!(users.length > 1 || users.length === 0)) {
              _context2.next = 10;
              break;
            }

            throw new Error("An account is already associated with this email");

          case 10:
            userToUpdate = users[0];
            _context2.next = 13;
            return bcrypt.hash(password, 10);

          case 13:
            hash = _context2.sent;
            userToUpdate.business_name = businessName;
            userToUpdate.first_name = firstName;
            userToUpdate.last_name = lastName;
            userToUpdate.email = email;
            userToUpdate.password = hash;
            userToUpdate.country = country;
            userToUpdate.language = "en-UK";
            userToUpdate.phone_home = homePhone;
            userToUpdate.phone_mobile = mobilePhone;
            userToUpdate.subscribed_to_newsletter = subscribeToNewsletter;
            userToUpdate.questionnaire_data = questionnaireData;
            console.log("USER2UPDATE");
            console.log(userToUpdate); // const xero = new XeroClient({
            //   clientId: process.env.XERO_CLIENT_ID,
            //   clientSecret: process.env.XERO_CLIENT_SECRET,
            //   grantType: "client_credentials",
            // });  
            // const token = await xero.getClientCredentialsToken();
            // //  console.log(token);
            // const tokenSet = await xero.readTokenSet();
            // console.log(tokenSet);
            // await xero.setTokenSet(tokenSet);

            xeroTenantId = '';
            idempotencyKey = userToUpdate._id;
            summarizeErrors = true;
            phone1 = {
              phoneNumber: mobilePhone,
              phoneType: "MOBILE"
            };
            phone2 = {
              phoneNumber: homePhone,
              phoneType: "HOME"
            };
            phones = [];
            phones.push(phone1, phone2);
            contact = {
              name: firstName + " " + lastName,
              emailAddress: email,
              phones: phones
            };
            contacts = {
              contacts: [contact]
            }; // const response = await xero.accountingApi.createContacts(xeroTenantId, contacts, idempotencyKey, summarizeErrors);
            // console.log("xeroResponse");
            // console.log(response.body.contacts);
            // console.log(response.body.contacts[0].contactID);
            // userToUpdate.xero_contact_id = response.body.contacts[0].contactID;

            _context2.next = 38;
            return userToUpdate.save();

          case 38:
            updatedUser = _context2.sent;
            return _context2.abrupt("return", successResponseCreated(res, {
              updatedUser: omit(updatedUser, ["password", "is_deleted", "__v", "_id", "created_at"])
            }));

          case 42:
            _context2.prev = 42;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            return _context2.abrupt("return", errorResponseHandler(_context2.t0, res));

          case 46:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 42]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); // updates (create) a new user through the standard onboarding process (with ref code)


userController.updateDeliveryDetails = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var _req$body3, businessName, firstName, lastName, email, county, phone, addressLine1, addressLine2, city, zip, instructions, fields, users, userToUpdate, updatedUser;

    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            console.log(req.tokenData);
            _req$body3 = req.body, businessName = _req$body3.businessName, firstName = _req$body3.firstName, lastName = _req$body3.lastName, email = _req$body3.email, county = _req$body3.county, phone = _req$body3.phone, addressLine1 = _req$body3.addressLine1, addressLine2 = _req$body3.addressLine2, city = _req$body3.city, zip = _req$body3.zip, instructions = _req$body3.instructions;
            fields = [businessName, firstName, lastName, email, county, phone, addressLine1, addressLine2, city, zip, instructions];
            checkMissingField(fields);
            _context3.next = 7;
            return db.User.find({
              _id: req.tokenData.id,
              //req.tokenData.id
              is_deleted: false
            });

          case 7:
            users = _context3.sent;

            if (!(users.length > 1 || users.length === 0)) {
              _context3.next = 10;
              break;
            }

            throw new Error("An error occurred while retrieving your user account");

          case 10:
            userToUpdate = users[0];
            userToUpdate.delivery_details.business_name = businessName;
            userToUpdate.delivery_details.first_name = firstName;
            userToUpdate.delivery_details.last_name = lastName;
            userToUpdate.delivery_details.email = email;
            userToUpdate.delivery_details.phone = phone;
            userToUpdate.delivery_details.county = county;
            userToUpdate.delivery_details.address_line_1 = addressLine1;
            userToUpdate.delivery_details.address_line_2 = addressLine2;
            userToUpdate.delivery_details.city = city;
            userToUpdate.delivery_details.zip = zip;
            userToUpdate.delivery_details.instructions = instructions;
            _context3.next = 24;
            return userToUpdate.save();

          case 24:
            updatedUser = _context3.sent;
            return _context3.abrupt("return", successResponseCreated(res, {
              updatedUser: omit(updatedUser, ["password", "is_deleted", "__v", "_id", "created_at"])
            }));

          case 28:
            _context3.prev = 28;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);
            return _context3.abrupt("return", errorResponseHandler(_context3.t0, res));

          case 32:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 28]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

userController.updateBillingDetails = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _req$body4, businessName, firstName, lastName, email, county, phone, addressLine1, addressLine2, city, zip, fields, users, userToUpdate, updatedUser;

    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            console.log("HEeRE");
            console.log(req.body);
            _req$body4 = req.body, businessName = _req$body4.businessName, firstName = _req$body4.firstName, lastName = _req$body4.lastName, email = _req$body4.email, county = _req$body4.county, phone = _req$body4.phone, addressLine1 = _req$body4.addressLine1, addressLine2 = _req$body4.addressLine2, city = _req$body4.city, zip = _req$body4.zip;
            fields = [businessName, firstName, lastName, email, county, phone, addressLine1, addressLine2, city, zip];
            checkMissingField(fields);
            _context4.next = 8;
            return db.User.find({
              _id: req.tokenData.id,
              is_deleted: false
            });

          case 8:
            users = _context4.sent;

            if (!(users.length > 1 || users.length === 0)) {
              _context4.next = 11;
              break;
            }

            throw new Error("An error occurred while retrieving your user account");

          case 11:
            userToUpdate = users[0];
            userToUpdate.billing_details.business_name = businessName;
            userToUpdate.billing_details.first_name = firstName;
            userToUpdate.billing_details.last_name = lastName;
            userToUpdate.billing_details.email = email;
            userToUpdate.billing_details.phone = phone;
            userToUpdate.billing_details.county = county;
            userToUpdate.billing_details.address_line_1 = addressLine1;
            userToUpdate.billing_details.address_line_2 = addressLine2;
            userToUpdate.billing_details.city = city;
            userToUpdate.billing_details.zip = zip;
            _context4.next = 24;
            return userToUpdate.save();

          case 24:
            updatedUser = _context4.sent;
            return _context4.abrupt("return", successResponseCreated(res, {
              updatedUser: omit(updatedUser, ["password", "is_deleted", "__v", "_id", "created_at"])
            }));

          case 28:
            _context4.prev = 28;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);
            return _context4.abrupt("return", errorResponseHandler(_context4.t0, res));

          case 32:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 28]]);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

userController.updateSubscription = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(req, res) {
    var _req$body5, pincharBags, pelletcharBags, paymentPlan, fields, users, userToUpdate, newInvoices, totalDue, nextDeliveryDates, newInvoicesIds, newOrderIds, sumsToPay, pincharBagsOrderBreakdown, pelletcharBagsOrderBreakdown, _sumsToPay, _pincharBagsOrderBreakdown, _pelletcharBagsOrderBreakdown, _sumsToPay2, _pincharBagsOrderBreakdown2, _pelletcharBagsOrderBreakdown2, updatedUser;

    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;
            console.log("aaa");
            console.log(req.body);
            _req$body5 = req.body, pincharBags = _req$body5.pincharBags, pelletcharBags = _req$body5.pelletcharBags, paymentPlan = _req$body5.paymentPlan;
            fields = [pincharBags, pelletcharBags, paymentPlan];
            checkMissingField(fields);
            _context13.next = 8;
            return db.User.find({
              _id: req.tokenData.id,
              is_deleted: false
            }).populate({
              path: "_invoices"
            }).populate({
              path: "_orders"
            });

          case 8:
            users = _context13.sent;

            if (!(users.length > 1 || users.length === 0)) {
              _context13.next = 11;
              break;
            }

            throw new Error("An error occurred while retrieving your user account");

          case 11:
            userToUpdate = users[0]; // GENERATE INVOICES HERE

            newInvoices = []; //WHEN UPDATING SUBSCRIPTION NEED TO TAKE AMOUNT DUE OF OLD SUBSCRIPTION, AND SUBSTRACT FROM SUBSCRIPTION

            userToUpdate._invoices.forEach( /*#__PURE__*/function () {
              var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(invoice) {
                var invoices, invoiceToUpdate, updatedInvoice;
                return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        if (!(invoice.status === "upcoming" || invoice.status === "late")) {
                          _context5.next = 9;
                          break;
                        }

                        _context5.next = 3;
                        return db.Invoice.find({
                          _id: invoice._id,
                          is_deleted: false
                        });

                      case 3:
                        invoices = _context5.sent;
                        invoiceToUpdate = invoices[0];
                        invoiceToUpdate.status = "cancelled";
                        _context5.next = 8;
                        return invoiceToUpdate.save();

                      case 8:
                        updatedInvoice = _context5.sent;

                      case 9:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x11) {
                return _ref6.apply(this, arguments);
              };
            }());

            userToUpdate._orders.forEach( /*#__PURE__*/function () {
              var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(order) {
                var orders, orderToUpdate, updatedOrder;
                return _regeneratorRuntime().wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        if (!(order.status === "upcoming")) {
                          _context6.next = 9;
                          break;
                        }

                        _context6.next = 3;
                        return db.Order.find({
                          _id: order._id,
                          is_deleted: false
                        });

                      case 3:
                        orders = _context6.sent;
                        orderToUpdate = orders[0];
                        orderToUpdate.status = "cancelled";
                        _context6.next = 8;
                        return orderToUpdate.save();

                      case 8:
                        updatedOrder = _context6.sent;

                      case 9:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x12) {
                return _ref7.apply(this, arguments);
              };
            }());

            totalDue = pincharBags * 400 + pelletcharBags * 600; //FIGURE OUT WHERE DELIVERY DATES COMES FROM

            nextDeliveryDates = [new Date(2023, 4, 17), new Date(2023, 7, 17), new Date(2023, 10, 17), new Date(2024, 1, 17)];
            newInvoicesIds = [];
            newOrderIds = [];
            _context13.t0 = paymentPlan;
            _context13.next = _context13.t0 === "monthly" ? 22 : _context13.t0 === "quarterly" ? 28 : _context13.t0 === "yearly" ? 34 : 40;
            break;

          case 22:
            sumsToPay = splitTotal(totalDue, 12, 0);
            sumsToPay.forEach( /*#__PURE__*/function () {
              var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(amount, i) {
                var now, invoice, newInvoice;
                return _regeneratorRuntime().wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        now = new Date();
                        invoice = new db.Invoice({
                          amount_due: amount,
                          due_date: new Date(now.setMonth(now.getMonth() + i)),
                          _user: req.tokenData.id
                        });
                        newInvoicesIds.push(invoice._id);
                        _context7.next = 5;
                        return invoice.save();

                      case 5:
                        newInvoice = _context7.sent;

                      case 6:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x13, _x14) {
                return _ref8.apply(this, arguments);
              };
            }());
            pincharBagsOrderBreakdown = splitTotal(pincharBags, 4, 0);
            pelletcharBagsOrderBreakdown = splitTotal(pelletcharBags, 4, 0);
            pincharBagsOrderBreakdown.forEach( /*#__PURE__*/function () {
              var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(bags, i) {
                var now, order, newOrder;
                return _regeneratorRuntime().wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        now = new Date();
                        order = new db.Order({
                          delivery_date: nextDeliveryDates[i],
                          products: [{
                            _product: "63f8ddff24c72d26e1aab989",
                            amount: pincharBagsOrderBreakdown[i]
                          }, {
                            _product: "63f8def1ed95ea8a663ec536",
                            amount: pelletcharBagsOrderBreakdown[i]
                          }],
                          _user: req.tokenData.id
                        });
                        newOrderIds.push(order._id);
                        _context8.next = 5;
                        return order.save();

                      case 5:
                        newOrder = _context8.sent;

                      case 6:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              }));

              return function (_x15, _x16) {
                return _ref9.apply(this, arguments);
              };
            }());
            return _context13.abrupt("break", 40);

          case 28:
            _sumsToPay = splitTotal(totalDue, 4, 0);

            _sumsToPay.forEach( /*#__PURE__*/function () {
              var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(amount, i) {
                var now, invoice, newInvoice;
                return _regeneratorRuntime().wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        now = new Date();
                        invoice = new db.Invoice({
                          amount_due: amount,
                          due_date: new Date(now.setMonth(now.getMonth() + i * 3)),
                          _user: req.tokenData.id
                        });
                        newInvoicesIds.push(invoice._id);
                        _context9.next = 5;
                        return invoice.save();

                      case 5:
                        newInvoice = _context9.sent;

                      case 6:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              }));

              return function (_x17, _x18) {
                return _ref10.apply(this, arguments);
              };
            }());

            _pincharBagsOrderBreakdown = splitTotal(pincharBags, 4, 0);
            _pelletcharBagsOrderBreakdown = splitTotal(pelletcharBags, 4, 0);

            _pincharBagsOrderBreakdown.forEach( /*#__PURE__*/function () {
              var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(bags, i) {
                var now, order, newOrder;
                return _regeneratorRuntime().wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        now = new Date();
                        order = new db.Order({
                          delivery_date: nextDeliveryDates[i],
                          products: [{
                            _product: "63f8ddff24c72d26e1aab989",
                            amount: _pincharBagsOrderBreakdown[i]
                          }, {
                            _product: "63f8def1ed95ea8a663ec536",
                            amount: _pelletcharBagsOrderBreakdown[i]
                          }],
                          _user: req.tokenData.id
                        });
                        newOrderIds.push(order._id);
                        _context10.next = 5;
                        return order.save();

                      case 5:
                        newOrder = _context10.sent;

                      case 6:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              }));

              return function (_x19, _x20) {
                return _ref11.apply(this, arguments);
              };
            }());

            return _context13.abrupt("break", 40);

          case 34:
            _sumsToPay2 = splitTotal(totalDue, 1, 0);

            _sumsToPay2.forEach( /*#__PURE__*/function () {
              var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(amount, i) {
                var now, invoice, newInvoice;
                return _regeneratorRuntime().wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        now = new Date();
                        invoice = new db.Invoice({
                          amount_due: amount,
                          due_date: new Date(now.setMonth(now.getMonth() + 1)),
                          _user: req.tokenData.id
                        });
                        newInvoicesIds.push(invoice._id);
                        _context11.next = 5;
                        return invoice.save();

                      case 5:
                        newInvoice = _context11.sent;

                      case 6:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee11);
              }));

              return function (_x21, _x22) {
                return _ref12.apply(this, arguments);
              };
            }());

            _pincharBagsOrderBreakdown2 = splitTotal(pincharBags, 4, 0);
            _pelletcharBagsOrderBreakdown2 = splitTotal(pelletcharBags, 4, 0);

            _pincharBagsOrderBreakdown2.forEach( /*#__PURE__*/function () {
              var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(bags, i) {
                var now, order, newOrder;
                return _regeneratorRuntime().wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        now = new Date();
                        order = new db.Order({
                          delivery_date: nextDeliveryDates[i],
                          products: [{
                            _product: "63f8ddff24c72d26e1aab989",
                            amount: _pincharBagsOrderBreakdown2[i]
                          }, {
                            _product: "63f8def1ed95ea8a663ec536",
                            amount: _pelletcharBagsOrderBreakdown2[i]
                          }],
                          _user: req.tokenData.id
                        });
                        newOrderIds.push(order._id);
                        _context12.next = 5;
                        return order.save();

                      case 5:
                        newOrder = _context12.sent;

                      case 6:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              }));

              return function (_x23, _x24) {
                return _ref13.apply(this, arguments);
              };
            }());

            return _context13.abrupt("break", 40);

          case 40:
            userToUpdate.subscription.status = "active";
            userToUpdate.subscription.payment_plan = paymentPlan;
            userToUpdate.subscription.products = [{
              _product: "63f8ddff24c72d26e1aab989",
              amount_to_deliver: pincharBags
            }, {
              _product: "63f8def1ed95ea8a663ec536",
              amount_to_deliver: pelletcharBags
            }];
            userToUpdate.subscription.products = [{
              _product: "63f8ddff24c72d26e1aab989",
              amount_to_deliver: pincharBags
            }, {
              _product: "63f8def1ed95ea8a663ec536",
              amount_to_deliver: pelletcharBags
            }]; //NEED TO PUSH TO KEEP OLD IDS

            console.log(userToUpdate._orders);
            console.log(userToUpdate._invoices);
            console.log(newOrderIds);
            userToUpdate._orders = userToUpdate._orders.concat(newOrderIds);
            userToUpdate._invoices = userToUpdate._invoices.concat(newInvoicesIds);
            _context13.next = 51;
            return userToUpdate.save();

          case 51:
            updatedUser = _context13.sent;
            return _context13.abrupt("return", successResponseCreated(res, {
              updatedUser: omit(updatedUser, ["password", "is_deleted", "__v", "_id", "created_at"])
            }));

          case 55:
            _context13.prev = 55;
            _context13.t1 = _context13["catch"](0);
            console.log(_context13.t1);
            return _context13.abrupt("return", errorResponseHandler(_context13.t1, res));

          case 59:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[0, 55]]);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

userController.updateSettings = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(req, res) {
    var _req$body6, userDetails, platformSettings, notificationSettings, fields, users, userToUpdate, updatedUser;

    return _regeneratorRuntime().wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.prev = 0;
            console.log("aaa");
            console.log(req.body);
            _req$body6 = req.body, userDetails = _req$body6.userDetails, platformSettings = _req$body6.platformSettings, notificationSettings = _req$body6.notificationSettings;
            fields = [userDetails, platformSettings, notificationSettings];
            checkMissingField(fields);
            _context14.next = 8;
            return db.User.find({
              _id: req.tokenData.id,
              is_deleted: false
            });

          case 8:
            users = _context14.sent;

            if (!(users.length > 1 || users.length === 0)) {
              _context14.next = 11;
              break;
            }

            throw new Error("An error occurred while retrieving your user account");

          case 11:
            userToUpdate = users[0];

            if (userDetails !== null) {
              userToUpdate.email = userDetails.email;
              userToUpdate.first_name = userDetails.firstName;
              userToUpdate.last_name = userDetails.lastName;
              userToUpdate.business_name = userDetails.businessName;
              userToUpdate.country = userDetails.country;
              userToUpdate.language = userDetails.language;
              userToUpdate.phone_home = userDetails.phoneHome;
              userToUpdate.phone_mobile = userDetails.phoneMobile;
            }

            if (platformSettings !== null) {
              userToUpdate.language = platformSettings.language;
              userToUpdate.platform_settings.enable_advanced_analytics = platformSettings.enableAdvancedAnalytics;
              userToUpdate.platform_settings.enable_dark_mode = platformSettings.enableDarkMode;
              userToUpdate.platform_settings.metric_volume_units = platformSettings.metricVolumeUnits;
              userToUpdate.platform_settings.metric_surface_units = platformSettings.metricSurfaceUnits;
            }

            if (notificationSettings !== null) {
              userToUpdate.notification_settings.subscribed_to_newsletter = notificationSettings.subscribedToNewsletter;
              userToUpdate.notification_settings.enable_email_alerts = notificationSettings.enableEmailAlerts;
              userToUpdate.notification_settings.enable_sms_alerts = notificationSettings.enableSmsAlerts;
              userToUpdate.notification_settings.enable_paper_invoices = notificationSettings.enablePaperInvoices;
            }

            _context14.next = 17;
            return userToUpdate.save();

          case 17:
            updatedUser = _context14.sent;
            return _context14.abrupt("return", successResponseCreated(res, {
              updatedUser: omit(updatedUser, ["password", "is_deleted", "__v", "_id", "created_at"])
            }));

          case 21:
            _context14.prev = 21;
            _context14.t0 = _context14["catch"](0);
            console.log(_context14.t0);
            return _context14.abrupt("return", errorResponseHandler(_context14.t0, res));

          case 25:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[0, 21]]);
  }));

  return function (_x25, _x26) {
    return _ref14.apply(this, arguments);
  };
}();

userController.fetchSubscription = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(req, res) {
    var users, user, orders, charpoints, _iterator, _step, order, orderBags;

    return _regeneratorRuntime().wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.prev = 0;
            _context15.next = 3;
            return db.User.find({
              _id: typeof userId !== "undefined" ? userId : req.tokenData.id
            }).populate({
              path: "_supervisor",
              select: "business_name"
            });

          case 3:
            users = _context15.sent;
            checkUnique(users);
            user = users[0];
            _context15.next = 8;
            return db.Order.find({
              _user: user._id,
              is_deleted: false
            });

          case 8:
            orders = _context15.sent;
            //modify to get bags
            charpoints = 0;
            _iterator = _createForOfIteratorHelper(orders);
            _context15.prev = 11;

            _iterator.s();

          case 13:
            if ((_step = _iterator.n()).done) {
              _context15.next = 22;
              break;
            }

            order = _step.value;
            _context15.next = 17;
            return db.Bag.find({
              _order: order._id,
              is_deleted: false
            });

          case 17:
            orderBags = _context15.sent;
            console.log(orderBags.length);
            charpoints += orderBags.length;

          case 20:
            _context15.next = 13;
            break;

          case 22:
            _context15.next = 27;
            break;

          case 24:
            _context15.prev = 24;
            _context15.t0 = _context15["catch"](11);

            _iterator.e(_context15.t0);

          case 27:
            _context15.prev = 27;

            _iterator.f();

            return _context15.finish(27);

          case 30:
            console.log("CHARPOINTS:" + charpoints);
            return _context15.abrupt("return", successResponse(res, {
              subscription: user.subscription,
              supervisorName: user._supervisor.business_name,
              charpoints: charpoints
            }));

          case 34:
            _context15.prev = 34;
            _context15.t1 = _context15["catch"](0);
            console.log(_context15.t1);
            return _context15.abrupt("return", errorResponseHandler(_context15.t1, res));

          case 38:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[0, 34], [11, 24, 27, 30]]);
  }));

  return function (_x27, _x28) {
    return _ref15.apply(this, arguments);
  };
}();

userController.fetchFarmerSubscription = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16(req, res) {
    var _userId, users, user, orders, charpoints, _iterator2, _step2, order, orderBags;

    return _regeneratorRuntime().wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.prev = 0;
            _userId = req.body.userId;
            console.log(_userId);
            _context16.next = 5;
            return db.User.find({
              _id: _userId
            }).populate({
              path: "_supervisor",
              select: "business_name"
            });

          case 5:
            users = _context16.sent;
            checkUnique(users);
            user = users[0];
            _context16.next = 10;
            return db.Order.find({
              _user: user._id,
              is_deleted: false
            });

          case 10:
            orders = _context16.sent;
            //modify to get bags
            charpoints = 0;
            _iterator2 = _createForOfIteratorHelper(orders);
            _context16.prev = 13;

            _iterator2.s();

          case 15:
            if ((_step2 = _iterator2.n()).done) {
              _context16.next = 24;
              break;
            }

            order = _step2.value;
            _context16.next = 19;
            return db.Bag.find({
              _order: order._id,
              is_deleted: false
            });

          case 19:
            orderBags = _context16.sent;
            console.log(orderBags.length);
            charpoints += orderBags.length;

          case 22:
            _context16.next = 15;
            break;

          case 24:
            _context16.next = 29;
            break;

          case 26:
            _context16.prev = 26;
            _context16.t0 = _context16["catch"](13);

            _iterator2.e(_context16.t0);

          case 29:
            _context16.prev = 29;

            _iterator2.f();

            return _context16.finish(29);

          case 32:
            console.log("CHARPOINTS:" + charpoints);
            return _context16.abrupt("return", successResponse(res, {
              subscription: user.subscription,
              supervisorName: user._supervisor.business_name,
              charpoints: charpoints
            }));

          case 36:
            _context16.prev = 36;
            _context16.t1 = _context16["catch"](0);
            console.log(_context16.t1);
            return _context16.abrupt("return", errorResponseHandler(_context16.t1, res));

          case 40:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[0, 36], [13, 26, 29, 32]]);
  }));

  return function (_x29, _x30) {
    return _ref16.apply(this, arguments);
  };
}();

userController.fetchComingUp = /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17(req, res) {
    var users, user, eventsArray;
    return _regeneratorRuntime().wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.prev = 0;
            _context17.next = 3;
            return db.User.find({
              _id: req.tokenData.id
            }).populate({
              path: "_invoices"
            }).populate({
              path: "_orders"
            });

          case 3:
            users = _context17.sent;
            checkUnique(users);
            user = users[0];
            eventsArray = [];

            user._invoices.forEach(function (invoice) {
              var event = {
                date: new Date(invoice.due_date),
                type: "invoice",
                amountDue: invoice.amount_due
              };
              eventsArray.push(event);
            });

            user._orders.forEach(function (order) {
              var event = {
                date: new Date(order.delivery_date),
                type: "order",
                pincharBags: order.products[0].amount
              };
              eventsArray.push(event);
            });

            eventsArray.sort(function (a, b) {
              return new Date(a.date) - new Date(b.date);
            });
            return _context17.abrupt("return", successResponse(res, eventsArray));

          case 13:
            _context17.prev = 13;
            _context17.t0 = _context17["catch"](0);
            console.log(_context17.t0);
            return _context17.abrupt("return", errorResponseHandler(_context17.t0, res));

          case 17:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, null, [[0, 13]]);
  }));

  return function (_x31, _x32) {
    return _ref17.apply(this, arguments);
  };
}();

userController.fetchUserDetails = /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18(req, res) {
    var users, user;
    return _regeneratorRuntime().wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.prev = 0;
            _context18.next = 3;
            return db.User.find({
              _id: req.tokenData.id
            });

          case 3:
            users = _context18.sent;
            checkUnique(users);
            user = users[0];
            return _context18.abrupt("return", successResponse(res, {
              email: user.email,
              firstName: user.first_name,
              lastName: user.last_name,
              businessName: user.business_name,
              country: user.country,
              homePhone: user.home_phone,
              mobilePhone: user.mobile_phone
            }));

          case 9:
            _context18.prev = 9;
            _context18.t0 = _context18["catch"](0);
            console.log(_context18.t0);
            return _context18.abrupt("return", errorResponseHandler(_context18.t0, res));

          case 13:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, null, [[0, 9]]);
  }));

  return function (_x33, _x34) {
    return _ref18.apply(this, arguments);
  };
}();

userController.fetchPlatformSettings = /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19(req, res) {
    var users, user;
    return _regeneratorRuntime().wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.prev = 0;
            _context19.next = 3;
            return db.User.find({
              _id: req.tokenData.id
            });

          case 3:
            users = _context19.sent;
            checkUnique(users);
            user = users[0];
            return _context19.abrupt("return", successResponse(res, {
              language: user.language,
              enableAdvancedAnalytics: user.platform_settings.enable_advanced_analytics,
              enableDarkMode: user.platform_settings.enable_dark_mode,
              metricVolumeUnits: user.platform_settings.metric_volume_units,
              metricSurfaceUnits: user.platform_settings.metric_surface_units
            }));

          case 9:
            _context19.prev = 9;
            _context19.t0 = _context19["catch"](0);
            console.log(_context19.t0);
            return _context19.abrupt("return", errorResponseHandler(_context19.t0, res));

          case 13:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, null, [[0, 9]]);
  }));

  return function (_x35, _x36) {
    return _ref19.apply(this, arguments);
  };
}();

userController.fetchAddressDetails = /*#__PURE__*/function () {
  var _ref20 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee20(req, res) {
    var users, user;
    return _regeneratorRuntime().wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.prev = 0;
            _context20.next = 3;
            return db.User.find({
              _id: req.tokenData.id
            });

          case 3:
            users = _context20.sent;
            checkUnique(users);
            user = users[0];
            return _context20.abrupt("return", successResponse(res, {
              deliveryDetails: user.delivery_details,
              billingDetails: user.billing_details
            }));

          case 9:
            _context20.prev = 9;
            _context20.t0 = _context20["catch"](0);
            console.log(_context20.t0);
            return _context20.abrupt("return", errorResponseHandler(_context20.t0, res));

          case 13:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, null, [[0, 9]]);
  }));

  return function (_x37, _x38) {
    return _ref20.apply(this, arguments);
  };
}(); //SETS THE ORDER DATES FOR A USER'S PACKAGE


userController.packageSetOrderDates = /*#__PURE__*/function () {
  var _ref21 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee21(req, res) {
    return _regeneratorRuntime().wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21);
  }));

  return function (_x39, _x40) {
    return _ref21.apply(this, arguments);
  };
}(); //CREATES INVOICES ON XERO AND STORES THEM IN USER.INVOICES


userController.packageCreateInvoices = /*#__PURE__*/function () {
  var _ref22 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee22(req, res) {
    var users, user, _xero, token, tokenSet, invoices;

    return _regeneratorRuntime().wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _context22.prev = 0;
            _context22.next = 3;
            return db.User.find({
              _id: req.params.userId
            });

          case 3:
            users = _context22.sent;
            checkUnique(users);
            user = users[0];
            _xero = new XeroClient({
              clientId: process.env.XERO_CLIENT_ID,
              clientSecret: process.env.XERO_CLIENT_SECRET,
              grantType: "client_credentials"
            });
            _context22.next = 9;
            return _xero.getClientCredentialsToken();

          case 9:
            token = _context22.sent;
            _context22.next = 12;
            return _xero.readTokenSet();

          case 12:
            tokenSet = _context22.sent;
            console.log(tokenSet);
            _context22.next = 16;
            return _xero.accountingApi.getOnlineInvoice("", '555386e7-fe5e-4683-b4d7-fab9d2461f3b');

          case 16:
            invoices = _context22.sent;
            //.body.invoices;
            console.log(invoices.body);
            return _context22.abrupt("return", successResponse(res));

          case 21:
            _context22.prev = 21;
            _context22.t0 = _context22["catch"](0);
            console.log(_context22.t0.message);
            return _context22.abrupt("return", errorResponseHandler(_context22.t0, res));

          case 25:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22, null, [[0, 21]]);
  }));

  return function (_x41, _x42) {
    return _ref22.apply(this, arguments);
  };
}();

userController.getInvoices = /*#__PURE__*/function () {
  var _ref23 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee23(req, res) {
    var xeroTenantId, ifModifiedSince, where, order, iDs, invoiceNumbers, contactIDs, statuses, page, includeArchived, createdByMyApp, unitdp, summaryOnly, _xero2, token, tokenSet, invoices;

    return _regeneratorRuntime().wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            _context23.prev = 0;
            // const users = await db.User.find({
            //   _id: req.params.userId
            // });
            // checkUnique(users);
            // const user = users[0];
            console.log("HEREEEE");
            xeroTenantId = "";
            ifModifiedSince = null; // new Date("2020-02-06T12:17:43.202-08:00");

            where = null; //'Status=="DRAFT"';

            order = 'InvoiceNumber ASC';
            iDs = null; //["00000000-0000-0000-0000-000000000000"];

            invoiceNumbers = null; //["INV-001", "INV-002"];

            contactIDs = null; //["00000000-0000-0000-0000-000000000000"];

            statuses = null; //["DRAFT", "SUBMITTED"];

            page = 1;
            includeArchived = false;
            createdByMyApp = false;
            unitdp = 4;
            summaryOnly = false;
            _xero2 = new XeroClient({
              clientId: process.env.XERO_CLIENT_ID,
              clientSecret: process.env.XERO_CLIENT_SECRET,
              grantType: "client_credentials"
            });
            _context23.next = 18;
            return _xero2.getClientCredentialsToken();

          case 18:
            token = _context23.sent;
            _context23.next = 21;
            return _xero2.readTokenSet();

          case 21:
            tokenSet = _context23.sent;
            console.log(tokenSet);
            _context23.next = 25;
            return _xero2.accountingApi.getInvoices(xeroTenantId, ifModifiedSince, where, order, iDs, invoiceNumbers, contactIDs, statuses, page, includeArchived, createdByMyApp, unitdp, summaryOnly);

          case 25:
            invoices = _context23.sent;
            //let invoices = await xero.accountingApi.getOnlineInvoice("", '555386e7-fe5e-4683-b4d7-fab9d2461f3b');//.body.invoices;
            console.log(invoices.body);
            return _context23.abrupt("return", successResponse(res));

          case 30:
            _context23.prev = 30;
            _context23.t0 = _context23["catch"](0);
            console.log(_context23.t0);
            return _context23.abrupt("return", errorResponseHandler(_context23.t0, res));

          case 34:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23, null, [[0, 30]]);
  }));

  return function (_x43, _x44) {
    return _ref23.apply(this, arguments);
  };
}(); //CREATES INVOICES ON XERO AND STORES THEM IN USER.INVOICES


userController.getInvoiceLink = /*#__PURE__*/function () {
  var _ref24 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee24(req, res) {
    var users, user, _xero3, token, tokenSet, invoices;

    return _regeneratorRuntime().wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            _context24.prev = 0;
            _context24.next = 3;
            return db.User.find({
              _id: req.params.userId
            });

          case 3:
            users = _context24.sent;
            checkUnique(users);
            user = users[0];
            _xero3 = new XeroClient({
              clientId: process.env.XERO_CLIENT_ID,
              clientSecret: process.env.XERO_CLIENT_SECRET,
              grantType: "client_credentials"
            });
            _context24.next = 9;
            return _xero3.getClientCredentialsToken();

          case 9:
            token = _context24.sent;
            _context24.next = 12;
            return _xero3.readTokenSet();

          case 12:
            tokenSet = _context24.sent;
            _context24.next = 15;
            return _xero3.accountingApi.getOnlineInvoice("", req.params.invoiceId);

          case 15:
            invoices = _context24.sent;
            return _context24.abrupt("return", successResponse(res, {
              invoiceLink: invoices.body.onlineInvoices[0].onlineInvoiceUrl
            }));

          case 19:
            _context24.prev = 19;
            _context24.t0 = _context24["catch"](0);
            console.log(_context24.t0.message);
            return _context24.abrupt("return", errorResponseHandler(_context24.t0, res));

          case 23:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24, null, [[0, 19]]);
  }));

  return function (_x45, _x46) {
    return _ref24.apply(this, arguments);
  };
}();

userController.getUsers = /*#__PURE__*/function () {
  var _ref25 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee25(req, res) {
    var users;
    return _regeneratorRuntime().wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            _context25.prev = 0;
            _context25.next = 3;
            return db.User.find({
              is_deleted: false
            }).populate({
              path: "_invoices"
            }).populate({
              path: "_orders",
              match: {
                is_deleted: false
              },
              populate: {
                path: "_delivery" // Populating the _delivery field within each order

              }
            }).populate({
              path: "_supervisor"
            });

          case 3:
            users = _context25.sent;
            return _context25.abrupt("return", successResponse(res, users));

          case 7:
            _context25.prev = 7;
            _context25.t0 = _context25["catch"](0);
            console.log(_context25.t0);
            return _context25.abrupt("return", errorResponseHandler(_context25.t0, res));

          case 11:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25, null, [[0, 7]]);
  }));

  return function (_x47, _x48) {
    return _ref25.apply(this, arguments);
  };
}(); // // delete a user
// userController.deleteuser = async (req, res) => {
//   try {
//     checkAdminToken(req);
//
//     const users = await db.user.find({
//       _id: req.params.userId,
//       is_deleted: false
//     });
//     checkUnique(users);
//     let userToUpdate = users[0];
//     userToUpdate.is_deleted = true;
//
//     const updateduser = await userToUpdate.save();
//     return successResponse(res, {
//       user: updateduser
//     });
//   } catch (err) {
//     return errorResponseHandler(err, res);
//   }
// };
// // updates user
// userController.updateUser = async (req, res) => {
//   try {
//     checkUserTokenFromId(req, req.params.userId);
//     const { firstName, lastName, businessName, email, country, language } = req.body;
//     const users = await db.User.find({
//       _id: req.params.userId,
//       is_deleted: false,
//     });
//     checkUnique(users);
//     let userToUpdate = users[0];
//     userToUpdate.first_name = firstName;
//     userToUpdate.last_name = lastName;
//     userToUpdate.name = name;
//     userToUpdate.email = email;
//     userToUpdate.language = language;
//     userToUpdate.country = country;
//     const updateduser = await userToUpdate.save();
//     return successResponse(res, {
//       user: updatedUser,
//     });
//   } catch (err) {
//     console.log(err);
//     return errorResponseHandler(err, res);
//   }
// };


export default userController;

function splitTotal(totalAmount, numberToSplit, precision) {
  var precisionFactor = Math.pow(10, precision);
  var remainderFactor = 1 / precisionFactor;
  var splitAmount = Math.ceil(totalAmount / numberToSplit * precisionFactor) / precisionFactor;
  var remainder = Math.round((splitAmount * numberToSplit - totalAmount) * precisionFactor) / precisionFactor;
  var result = [];

  for (var i = 0; i < numberToSplit; i++) {
    result.push(remainder >= remainderFactor ? Math.round((splitAmount - remainderFactor) * precisionFactor) / precisionFactor : splitAmount);
    remainder = Math.round((remainder - remainderFactor) * precisionFactor) / precisionFactor;
  }

  return result;
}