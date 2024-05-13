"use strict";


var express = require("express"),
  favicon = require("serve-favicon"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  pug = require('pug'),
  routes = require("./router/router"),
  faviconURL = `${__dirname}/public/img/node-favicon.png`,
  publicDir = express.static(`${__dirname}/public`),
  viewDir = `${__dirname}/pages`,
  port = process.env.PORT || 3000,
  app = express();

  app.locals.pluralize = require('pluralize');

app
  .set("views", viewDir)
  .set("view engine", "pug")
  .set("port", port)
  .use(favicon(faviconURL))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(morgan("dev"))
  .use(publicDir)
  .use(routes);

 
 

module.exports = app;
