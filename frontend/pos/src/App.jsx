import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Card from "../components/Card";

import ProductTypePage from "../pages/ProductType";
import Product from "../pages/Product";

import Navigation from "../components/Navigation";
import toast, { Toaster } from "react-hot-toast";

import QueryContext from "../context/QueryContext";

function App() {
  const [productData, setProductData] = useState([]);
  const [query, setQuery] = useState({
    search: "",
    limit: 10,
    page: 1,
    total_record: 1,
    total_page: 1,
  });

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [endpoint, setEndpoint] = useState("");

  // To show Table or Form
  const [showTable, setShowTable] = useState(true);
  // To set data to Form when Edit
  //   const [data, setData] = useState({});
  // To know when form is edit or add new
  const [isEdit, setIsEdit] = useState(false);
  const [Label, setLabel] = useState("");

  const handleView = () => {
    setShowTable((old_value) => !old_value);
    // set to false for button +បន្ថែមថ្មី
    setIsEdit(false);
  };

  return (
    <div>
      <QueryContext.Provider
        value={{
          query,
          setQuery,
          columns,
          setColumns,
          rows,
          setRows,
          endpoint,
          setEndpoint,
          showTable,
          setShowTable,
          isEdit,
          setIsEdit,
          handleView,
          Label,
          setLabel,
        }}
      >
        <Toaster />
        <Navigation />
      </QueryContext.Provider>
    </div>
  );
}

export default App;
