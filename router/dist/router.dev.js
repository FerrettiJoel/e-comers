"use strict";

require("dotenv").config();

var blanca_rossi = require("../models/blanca-rossi.js"),
    express = require("express"),
    bcrypt = require("bcrypt"),
    router = express.Router(),
    formValidation = require("../middlewweares/validaction.js"),
    jwt = require("jsonwebtoken"),
    middleware = require("../middlewweares/isLogin.js");

var _require = require("console"),
    error = _require.error;

var _require2 = require("util"),
    promisify = _require2.promisify;

function error404(req, res) {
  var error = new Error(),
      locals = {
    title: "Error 404",
    description: "REcurso no encontrado",
    error: error
  };
  error.status = 404;
  res.render("error", locals);
}

router.use(blanca_rossi).get("/", function (req, res) {
  req.getConnection(function (err, blanca_rossi) {
    blanca_rossi.query("SELECT * FROM products", function (err, rows) {
      console.log(err, "---", rows);
      var locals = {
        title: "Blanca Rossi",
        data: rows
      };
      res.render("inicio", locals);
    });
  });
}).get("/iniciarsesion", function (req, res) {
  res.render("init", {
    title: "iniciar sesion"
  });
}).post("/entrar", function (req, res, next) {
  var user = req.body.user_email;
  var pass = req.body.user_password;
  req.getConnection(function (err, blanca_rossi) {
    blanca_rossi.query("SELECT * FROM usuarios WHERE user_email = ?", user, function _callee(err, rows) {
      var usuario, token, cookieOptions, tokeen, decoded, tokenParseado;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              usuario = rows[0];
              _context.t0 = rows < 1;

              if (_context.t0) {
                _context.next = 6;
                break;
              }

              _context.next = 5;
              return regeneratorRuntime.awrap(bcrypt.compare(pass, usuario.user_password));

            case 5:
              _context.t0 = !_context.sent;

            case 6:
              if (!_context.t0) {
                _context.next = 11;
                break;
              }

              res.render("inicio", {
                title: "login"
              });
              console.log("contrsenha invalida");
              _context.next = 21;
              break;

            case 11:
              token = generateToken(usuario.usuario_id);
              cookieOptions = {
                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true
              };
              res.cookie("login", "".concat(token), cookieOptions);
              tokeen = req.cookies.login;

              if (!tokeen) {
                _context.next = 21;
                break;
              }

              _context.next = 18;
              return regeneratorRuntime.awrap(promisify(jwt.verify)(req.cookies.login, process.env.JWT_SECRET));

            case 18:
              decoded = _context.sent;
              tokenParseado = JSON.parse(JSON.stringify(decoded));
              console.log("....", tokenParseado);

            case 21:
            case "end":
              return _context.stop();
          }
        }
      });
    });
  });
});

function generateToken(id) {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}

router.get("/logout", function (req, res) {
  res.cookie("login", "", {
    maxAge: 1
  });
  res.redirect("/");
}).get("/registrar", function (req, res) {
  res.render("login", {
    title: "Create a Count"
  });
}).post("/", formValidation.validation, function _callee2(req, res) {
  var _req$body, usuario_name, user_email, user_password, passworEncripted, usuario;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, usuario_name = _req$body.usuario_name, user_email = _req$body.user_email, user_password = _req$body.user_password;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(bcrypt.hash(user_password, 10));

        case 4:
          passworEncripted = _context2.sent;
          usuario = {
            usuario_name: usuario_name,
            user_email: user_email,
            user_password: passworEncripted
          };
          req.getConnection(function (err, blanca_rossi) {
            console.log(usuario);
            blanca_rossi.query("INSERT INTO usuarios SET ?", usuario, function (err, rows) {
              return err ? res.redirect("/registrar") : res.redirect("/");
            });
          });
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](1);
          throw _context2.t0;

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 9]]);
});
router.get("/edit/:usuario_id", function (req, res) {
  var usuario_id = req.params.usuario_id;
  console.log(usuario_id, "****");
  req.getConnection(function (err, blanca_rossi) {
    blanca_rossi.query("SELECT * FROM `usuarios` WHERE usuario_id = ?", usuario_id, function (err, rows) {
      console.log(err, "__", rows);

      if (err) {
        throw err;
      } else {
        var locals = {
          title: "Editar usuario",
          datos: rows
        };
        console.log(locals);
        res.render("edit-user", locals);
      }
    });
  });
}).post("/releace/:usuario_id", function (req, res) {
  req.getConnection(function (err, blanca_rossi) {
    var user = {
      usuario_id: req.body.usuario_id,
      usuario_name: req.body.usuario_name,
      user_email: req.body.user_email,
      user_password: req.body.user_password
    };
    console.log(user);
    blanca_rossi.query("UPDATE usuarios SET ? WHERE usuario_id = ?", [user, user.usuario_id], function (err, rows) {
      return err ? res.redirect("/edit/:usuario_id") : res.redirect("/");
    });
  });
}).post("/delete/:usuario_id", function (req, res) {
  var usuario_id = req.params.usuario_id;
  console.log(usuario_id);
  req.getConnection(function (err, blanca_rossi, next) {
    blanca_rossi.query("DELETE FROM usuarios WHERE usuario_id = ?", usuario_id, function (err, rows) {
      console.log(err, "__", rows);
      return err ? next(new Error("registro no encontrado")) : res.redirect("/");
    });
  });
}).get("/contacto", function (req, res) {
  res.render("form", {
    title: "Blanca Rossi"
  });
}).get("/products", function (req, res) {
  req.getConnection(function (err, blanca_rossi) {
    blanca_rossi.query("SELECT * FROM `products` WHERE product_name = 'pantalon'", function (err, rows) {
      console.log(err, ".....", rows);
      var locals = {
        title: "Lista de productos",
        data: rows
      };
      res.render("productos", locals);
    });
  });
}).get("/crud", function (req, res) {
  req.getConnection(function (err, blanca_rossi) {
    blanca_rossi.query("SELECT * FROM products", function (err, rows) {
      var locals = {
        title: "NUESTROS PRODUCTOS",
        data: rows
      };
      res.render("index", locals);
    });
  });
}).get("/agregar", function (req, res) {
  res.render("add-products", {
    title: "Agregar Producto"
  });
}).post("/crud", function (req, res) {
  req.getConnection(function (err, blanca_rossi) {
    var products = {
      product_id: req.body.product_id,
      product_name: req.body.product_name,
      product_model: req.body.product_model,
      product_description: req.body.product_description,
      price: req.body.price,
      img: req.body.img
    };
    console.log(products);
    blanca_rossi.query("INSERT INTO `products` SET ?", products, function (err, rows) {
      return err ? res.redirect("/agregar") : res.redirect("/crud");
    });
  });
}).get("/editar/:product_id", function (req, res) {
  var product_id = req.params.product_id;
  console.log(product_id, "****");
  req.getConnection(function (err, blanca_rossi) {
    blanca_rossi.query("SELECT * FROM `products` WHERE product_id = ?", product_id, function (err, rows) {
      console.log(err, "__", rows);

      if (err) {
        throw err;
      } else {
        var locals = {
          title: "Editar producto",
          data: rows
        };
        res.render("edit-products", locals);
      }
    });
  });
}).post("/actualizar/:product_id", function (req, res) {
  req.getConnection(function (err, blanca_rossi) {
    var products = {
      product_id: req.body.product_id,
      product_name: req.body.product_name,
      product_model: req.body.product_model,
      product_description: req.body.product_description,
      price: req.body.price,
      img: req.body.img
    };
    console.log(products);
    blanca_rossi.query("UPDATE products SET ? WHERE product_id = ?", [products, products.product_id], function (err, rows) {
      return err ? res.redirect("/editar/:product_id") : res.redirect("/crud");
    });
  });
}).post("/eliminar/:product_id", function (req, res) {
  var product_id = req.params.product_id;
  console.log(product_id);
  req.getConnection(function (err, blanca_rossi, next) {
    blanca_rossi.query("DELETE FROM products WHERE product_id = ?", product_id, function (err, rows) {
      console.log(err, "__", rows);
      return err ? next(new Error("registro no encontrado")) : res.redirect("/crud");
    });
  });
}).use(error404);
module.exports = router;