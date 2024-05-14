"use strict";

var blanca_rossi = require("../models/blanca-rossi.js"),
  express = require("express"),
  bcrypt = require("bcryptjs"),
  router = express.Router(),
  formValidation = require('../middlewweares/validaction.js');

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
    res.render("inicio", {title: "Login"});
  })
  .post("/iniciarsecion", (req,res)=>{
    const {user_email, user_password} = req.body;

    
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
        blanca_rossi.query("INSERT INTO usuarios SET ?",usuario ,(err, rows) => {
          return (err) ? res.redirect("/registrar")  : res.redirect("/")
        });
      });
    } catch (err) {
      throw err;
    }
  })

  // .post("/", (req, res) => {
  //   req.getConnection((err, blanca_rossi) => {
  //     let user = {
  //       usuario_name: req.body.usuario_name,
  //       user_email: req.body.user_email,
  //       user_password: req.body.user_password,
  //     };
  //     console.log(user);
  //     blanca_rossi.query("INSERT INTO usuarios SET ?", user, (err, rows) => {
  //       return err ? res.redirect("/registrar") : res.redirect("/");
  //     });
  //   });
  // });

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
      blanca_rossi.query("UPDATE usuarios SET ? WHERE usuario_id = ?", [user, user.usuario_id], (err, rows) => {
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
  });

router
  .get("/crud", (req, res) => {
    req.getConnection((err, blanca_rossi) => {
      blanca_rossi.query("SELECT * FROM products", (err, rows) => {
        console.log(err, "---", rows);
        let locals = {
          title: "LISTA DE PRODUCTOS",
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
