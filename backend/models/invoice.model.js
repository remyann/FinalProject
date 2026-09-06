const mongoose = require("mongoose");
const invoiceSchema = new mongoose.Schema(
  {
    InvID: {
      type: String,
      required: true,
      unique: true,
    },
    UserName: {
      type: String,
      required: true,
    },
    DateOfSale: {
      type: String,
    },
  },
  { timestamps: true },
);

const invoiceModel = new mongoose.model("Invoice", invoiceSchema);

module.exports = invoiceModel;
