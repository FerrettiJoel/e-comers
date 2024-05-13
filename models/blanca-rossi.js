"use strict";

var mysql = require("mysql"),
  myconnection = require("express-myconnection"),
  dbOptions = {
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "blanca_rossi",
  },
  Brossi = myconnection(mysql, dbOptions, "request");

module.exports = Brossi;
