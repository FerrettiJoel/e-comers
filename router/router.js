"use strict";

require("dotenv").config();
var blanca_rossi = require("../models/blanca-rossi.js"),
  express = require("express"),
  bcrypt = require("bcrypt"),
  router = express.Router(),
  formValidation = require("../middlewweares/validaction.js"),
  jwt = require("jsonwebtoken"),
  middleware = require("../middlewweares/isLogin.js");
const { error } = require("console");
const { promisify } = require("util");

function error404(req, res) {
  let error = new Error(),
    locals = {
      title: "Error 404",
      description: "REcurso no encontrado",
      error: error,
    };
  error.status = 404;

  res.render("error", locals);
}
router
  .use(blanca_rossi)
  .get("/", (req, res) => {
    req.getConnection((err, blanca_rossi) => {
      blanca_rossi.query("SELECT * FROM products", (err, rows) => {
        console.log(err, "---", rows);
        let locals = {
          title: "Blanca Rossi",
          data: rows,
        };
        res.render("inicio", locals);
      });
    });
  })

  .get("/iniciarsesion", (req, res) => {
    res.render("init", { title: "iniciar sesion" });
  })
  .post("/entrar", (req, res, next) => {
    const user = req.body.user_email;
    const pass = req.body.user_password;

    req.getConnection((err, blanca_rossi) => {
      blanca_rossi.query(
        "SELECT * FROM usuarios WHERE user_email = ?",
        user,
        async (err, rows) => {
          const usuario = rows[0];

          if (
            rows < 1 ||
            !(await bcrypt.compare(pass, usuario.user_password))
          ) {
            res.render("inicio", { title: "login" });
            console.log("contrsenha invalida");
          } else {
            const token = generateToken(usuario.usuario_id);
            const cookieOptions = {
              expires: new Date(
                Date.now() +
                  process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
              ),
              httpOnly: true,
            };
            res.cookie("login", `${token}`, cookieOptions);

            const tokeen = req.cookies.login;
            if (tokeen) {
              const decoded = await promisify(jwt.verify)(
                req.cookies.login,
                process.env.JWT_SECRET
              );
              const tokenParseado = JSON.parse(JSON.stringify(decoded));
              console.log("....", tokenParseado);
            }
          }
        }
      );
    });
  });
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

router
  .get("/logout", (req, res) => {
    res.cookie("login", "", { maxAge: 1 });
    res.redirect("/");
  })

  .get("/registrar", (req, res) => {
    res.render("login", { title: "Create a Count" });
  })
  .post("/", formValidation.validation, async (req, res) => {
    const { usuario_name, user_email, user_password } = req.body;
    try {
      let passworEncripted = await bcrypt.hash(user_password, 10);

      let usuario = {
        usuario_name: usuario_name,
        user_email: user_email,
        user_password: passworEncripted,
      };
      req.getConnection((err, blanca_rossi) => {
        console.log(usuario);
        blanca_rossi.query(
          "INSERT INTO usuarios SET ?",
          usuario,
          (err, rows) => {
            return err ? res.redirect("/registrar") : res.redirect("/");
          }
        );
      });
    } catch (err) {
      throw err;
    }
  });

router
  .get("/edit/:usuario_id", (req, res) => {
    let { usuario_id } = req.params;
    console.log(usuario_id, "****");

    req.getConnection((err, blanca_rossi) => {
      blanca_rossi.query(
        "SELECT * FROM `usuarios` WHERE usuario_id = ?",
        usuario_id,
        (err, rows) => {
          console.log(err, "__", rows);
          if (err) {
            throw err;
          } else {
            let locals = {
              title: "Editar usuario",
              datos: rows,
            };
            console.log(locals);
            res.render("edit-user", locals);
          }
        }
      );
    });
  })
  .post("/releace/:usuario_id", (req, res) => {
    req.getConnection((err, blanca_rossi) => {
      let user = {
        usuario_id: req.body.usuario_id,
        usuario_name: req.body.usuario_name,
        user_email: req.body.user_email,
        user_password: req.body.user_password,
      };
      console.log(user);
      blanca_rossi.query(
        "UPDATE usuarios SET ? WHERE usuario_id = ?",
        [user, user.usuario_id],
        (err, rows) => {
          return err ? res.redirect("/edit/:usuario_id") : res.redirect("/");
        }
      );
    });
  })

  .post("/delete/:usuario_id", (req, res) => {
    let { usuario_id } = req.params;
    console.log(usuario_id);

    req.getConnection((err, blanca_rossi, next) => {
      blanca_rossi.query(
        "DELETE FROM usuarios WHERE usuario_id = ?",
        usuario_id,
        (err, rows) => {
          console.log(err, "__", rows);
          return err
            ? next(new Error("registro no encontrado"))
            : res.redirect("/");
        }
      );
    });
  })
  .get("/contacto", (req, res) => {
    res.render("form", { title: "Blanca Rossi" });
  })
  .get("/products", (req, res) => {
    req.getConnection((err, blanca_rossi) => {
      blanca_rossi.query("SELECT * FROM `products` WHERE product_name = 'pantalon'", (err, rows) => {
        console.log(err, ".....", rows)
        let locals = {
          title: "Lista de productos",
          data: rows,
        };
        res.render("productos", locals);
      });
    });
  })
  .get("/crud", (req, res) => {
    req.getConnection((err, blanca_rossi) => {
      blanca_rossi.query("SELECT * FROM products", (err, rows) => {
        let locals = {
          title: "NUESTROS PRODUCTOS",
          data: rows,
        };
        res.render("index", locals);
      });
    });
  })

  .get("/agregar", (req, res) => {
    res.render("add-products", { title: "Agregar Producto" });
  })
  .post("/crud", (req, res) => {
    req.getConnection((err, blanca_rossi) => {
      let products = {
        product_id: req.body.product_id,
        product_name: req.body.product_name,
        product_model: req.body.product_model,
        product_description: req.body.product_description,
        price: req.body.price,
        img: req.body.img,
      };
      console.log(products);
      blanca_rossi.query(
        "INSERT INTO `products` SET ?",
        products,
        (err, rows) => {
          return err ? res.redirect("/agregar") : res.redirect("/crud");
        }
      );
    });
  })
  .get("/editar/:product_id", (req, res) => {
    let { product_id } = req.params;
    console.log(product_id, "****");

    req.getConnection((err, blanca_rossi) => {
      blanca_rossi.query(
        "SELECT * FROM `products` WHERE product_id = ?",
        product_id,
        (err, rows) => {
          console.log(err, "__", rows);
          if (err) {
            throw err;
          } else {
            let locals = {
              title: "Editar producto",
              data: rows,
            };
            res.render("edit-products", locals);
          }
        }
      );
    });
  })
  .post("/actualizar/:product_id", (req, res) => {
    req.getConnection((err, blanca_rossi) => {
      let products = {
        product_id: req.body.product_id,
        product_name: req.body.product_name,
        product_model: req.body.product_model,
        product_description: req.body.product_description,
        price: req.body.price,
        img: req.body.img,
      };
      console.log(products);
      blanca_rossi.query(
        "UPDATE products SET ? WHERE product_id = ?",
        [products, products.product_id],
        (err, rows) => {
          return err
            ? res.redirect("/editar/:product_id")
            : res.redirect("/crud");
        }
      );
    });
  })
  .post("/eliminar/:product_id", (req, res) => {
    let { product_id } = req.params;
    console.log(product_id);

    req.getConnection((err, blanca_rossi, next) => {
      blanca_rossi.query(
        "DELETE FROM products WHERE product_id = ?",
        product_id,
        (err, rows) => {
          console.log(err, "__", rows);
          return err
            ? next(new Error("registro no encontrado"))
            : res.redirect("/crud");
        }
      );
    });
  })
  .use(error404);

module.exports = router;
