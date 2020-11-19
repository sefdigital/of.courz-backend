require("@babel/register")({})
require("regenerator-runtime/runtime");
const dotenv = require("dotenv");

dotenv.config()

module.exports = require('./index.js')