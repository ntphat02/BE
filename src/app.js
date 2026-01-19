const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { countConnections, checkOverload } = require("./helpers/checkConnect");
const app = express();

//init middleware
// app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//init database connection
require("./dbs/init.mongodb");
countConnections();
checkOverload();
//init routes
app.use("/", require("./routes"));
//init error handling

module.exports = app;
