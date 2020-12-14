require("@babel/register")({});
require("regenerator-runtime/runtime");
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();

const index = require("./index.js");

module.exports = index;

const app = express();

app.use(bodyParser.json());
app.all("*", index.handler);

app.listen(5000);