const { default: mongoose } = require("mongoose");
const productModel = require("../models/product.model");
const invoiceModel = require("../models/invoice.model");

const sale = async (req, res) => {
  try {
    const request_body = req.body;

    console.log("request_body", request_body);

    if (request_body.length === 0) {
      return res.status(400).json({
        message: "No products to sale",
      });
    }

    // Update product quantity
    await Promise.all(
      request_body?.cart.map(async (item) => {
        const product = await productModel.findById(item.prod_id);
        if (product) {
          console.log("product", product);
          product.NumberInStock -= item.qty;
          await product.save();
        }
      }),
    );

    return res.status(200).json({
      message: "sale",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred while processing sale",
      status: "error",
    });
  }
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