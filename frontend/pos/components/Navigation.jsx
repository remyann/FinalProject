import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Product from "../pages/Product";
import ProductType from "../pages/ProductType";
import Invoice from "../pages/Invoice";
import Sale from "../pages/Sale";

function Navigation() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/product" element={<Product />} />
      <Route path="/producttype" element={<ProductType />} />
      <Route path="/invoice" element={<Invoice />} />
      <Route path="/sale" element={<Sale />} />
    </Routes>
  );
}

export default Navigation;
