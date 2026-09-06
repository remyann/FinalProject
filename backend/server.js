require("dotenv").config();
const db = require("./config/db");

const express = require("express");
const app = express();
app.use(express.json());
const cookie_parse = require("cookie-parser");
app.use(cookie_parse());

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("hello");
});

const registerCrud = require("./routes/crud.routes");
const producttypemodel = require("./models/producttype.model");
const usermodel = require("./models/user.model");
const productmodel = require("./models/product.model");
const invocemodel = require("./models/invoice.model");
app.use("/producttype", registerCrud(producttypemodel));
app.use("/user", registerCrud(usermodel));
// app.use("/product", registerCrud(productmodel));
app.use("/invoice", registerCrud(invocemodel));

// authentication login, register
const authRoute = require("./routes/auth.routes");
app.use("/", authRoute);

const dashboardRoute = require("./routes/dashboard.routes");
app.use("/", dashboardRoute);

// Product Route
const uploadRoute = require("./routes/upload.routes");
app.use("/", uploadRoute);

// Sale Route
const saleRoute = require("./routes/sale.routes");
app.use("/", saleRoute);

// show image
app.use("/upload", express.static("./uploads"));

const startServer = async () => {
  await db;
  app.listen(8000, () => {
    console.log("server is running on port 8000 http://localhost:8000");
  });
};

startServer();
