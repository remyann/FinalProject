const { default: mongoose } = require("mongoose");
const productModel = require("../models/product.model");
const productTypeModel = require("../models/producttype.model");

const sale = async (req, res) => {
  const data = req.body.data;
  return res.status(200).json(data);
};

const get_sale = async (req, res) => {
  const productType = req.query.type || "";
  const queryObj = {};

  if (productType && productType != "ALL") {
    queryObj["ProductType"] = new mongoose.Types.ObjectId(productType);
  }

  const product = await productModel.find(queryObj);

  return res.status(200).json({
    message: "product to sale",
    data: product,
  });
};

module.exports = { sale, get_sale };
