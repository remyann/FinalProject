const mongoose = require("mongoose");
const DATABASE = process.env.DATABASE;

mongoose.connect("mongodb://127.0.0.1:27017/" + DATABASE);

module.exports = mongoose;
