"use strict";

var blanca_rossi = require("../models/blanca-rossi.js"),
    validator = require("validator"),
    passwordValidator = require("password-validator");

var schema = new passwordValidator();
schema.is().min(8).is().max(72).has().not().spaces();

module.exports.validation = function _callee(req, res, next) {
  var message;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(formvalidation(req.body));

        case 2:
          message = _context.sent;

          if (message != true) {
            res.render('login');
          } else {
            next();
          }

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

var formvalidation = function formvalidation(data) {
  var usuario_name, user_email, user_password, confirmPassword;
  return regeneratorRuntime.async(function formvalidation$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          usuario_name = data.usuario_name, user_email = data.user_email, user_password = data.user_password, confirmPassword = data.confirmPassword;

          if (!(validator.isEmpty(usuario_name) || validator.isEmpty(user_email) || validator.isEmpty(user_password) || validator.isEmpty(confirmPassword))) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", 'Empty fields not allowed');

        case 3:
          if (validator.isEmail) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", 'Email format is not valid');

        case 5:
          if (schema.validate(user_password)) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", 'Invalid password');

        case 7:
          if (!(user_password !== confirmPassword)) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", "Password are not machine");

        case 9:
          if (!validator.contains(user_password.toLowerCase(), "password")) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", 'invalid password');

        case 11:
          return _context2.abrupt("return", true);

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  });
};