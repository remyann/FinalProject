const upload = require("../controllers/upload.controller");
const crud = require("../controllers/crud.upload.controller");
const productmodel = require("../models/product.model");

const express = require("express");
const route = express.Router();

route.get("/product", crud.listAll(productmodel, ["ProductName"]));
route.post(
  "/product",
  upload.single("Picture"),
  crud.create(productmodel, "Picture"),
);
// route.delete("/product/", crud.removeAll(productmodel));
route.get("/product/:id", crud.getOne(productmodel));
route.delete("/product/:id", crud.remove(productmodel, "Picture"));
route.put(
  "/product/:id",
  upload.single("Picture"),
  crud.update(productmodel, "Picture"),
);
// route.get("/product", crud.getAll(productmodel));
// route.get("/product/:id", crud.getById(productmodel));
// route.put("/product/:id", upload.single("Picture"), crud.update(productmodel));
// route.delete("/product/:id", crud.remove(productmodel));

module.exports = route;
