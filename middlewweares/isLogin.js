const jwt = require("jsonwebtoken");
// const util = require("util")
const { promisify } = require("util");
var blanca_rossi = require("../models/blanca-rossi.js"),
    express = require("express");

module.exports.isLoggedIn = async (req, res, next) => {
  const token = req.cookies.login;
  
  if (token) {
    console.log("cookie existe");
    const decoded = await promisify(jwt.verify)(req.cookies.login, process.env.JWT_SECRET)
    const tokenParseado = JSON.parse(JSON.stringify(decoded));
    console.log(tokenParseado);

    // const usuario1 = async (req,res) => {
    //     await req.getConnection((err, blanca_rossi)=>{
    //         blanca_rossi.query('SELECT * FROM usuarios WHERE usuario_id = ?', tokenParseado.id, (err, rows) => {
    //             if(usuario1.length<1){
    //                 return next()
    //             }
    //         })
    //     }
    // )}
    // console.log(usuario1)
    // req.usuario1 = await usuario1[0]
    // next();
  } else {
    next()
  }
};
