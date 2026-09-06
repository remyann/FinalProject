import MasterPage from "../pages/MasterPage";
import QueryContext from "../context/QueryContext";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Modal from "../components/Modal";

function Sale() {
  const { setLabel } = useContext(QueryContext);
  const [productType, setProductType] = useState([]);
  const [product, setProduct] = useState([]);
  const [selectType, setSelectType] = useState("ALL");
  const [cart, setCart] = useState([]);
  const [totalProdPrice, setTotalProdPrice] = useState(0);
  const [showInvoice, setShowInvoice] = useState(true);

  /**
   * Cart:
   * [
   *  {
   *    prod_id:29283,
   *    price: 12,
   *    qty: 10,
   *    total: (12*10)
   *  },
   *  {
   *    prod_id:29284,
   *    price: 12,
   *    qty: 10,
   *    total: (12*10)
   *  }
   * ]
   */

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  const handleCart = (product) => {
    setCart((prev) => {
      // check if product is already add to cart
      const existingIndex = prev.findIndex(
        (item) => item.prod_id == product._id,
      );

      // if product already add
      if (existingIndex !== -1) {
        return prev.map((item, idx) => {
          if (idx === existingIndex) {
            const nextQty = item.qty + 1;
            return {
              ...item,
              prod_name: product.ProductName,
              qty: nextQty,
              total: nextQty * parseFloat(product.Price),
            };
          }
          return item;
        });
      } else {
        // product not yet added to cart
        return [
          ...prev,
          {
            prod_id: product._id,
            prod_name: product.ProductName,
            price: product.Price,
            qty: 1,
            total: parseFloat(product.Price),
          },
        ];
      }
    });
  };

  const handleClearCart = () => setCart([]);
  const getProductType = async () => {
    try {
      const resultProductType = await axios.get(
        "http://localhost:8000/producttype",
      );
      setProductType(resultProductType.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const getProduct = async () => {
    try {
      const resultProduct = await axios.get(
        "http://localhost:8000/sale?type=" + selectType,
      );
      setProduct(resultProduct.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  // when page loaded, for set label
  useEffect(() => {
    setLabel("ការលក់");
    getProductType();
    getProduct();
  }, []);

  // when change product type
  useEffect(() => {
    getProduct();
  }, [selectType]);

  const submitSale = async () => {
    // submit cart to backend
    // show modal
    document.getElementById("my_modal_1").showModal();
  };

  const handleQty = (pro_id, operation) => {
    // find prod_id in cart
    // qty = item.qty + operation (operation = -1)
  };

  return (
    <MasterPage>
      <Modal cart={cart} />
      <div className="flex gap-4">
        {/* Left */}
        <div className="w-[70%]">
          {/* Product Type filter */}
          <div className="bg-white w-full rounded-md p-4">
            <p className="font-bold">ប្រភេទទំនិញ</p>
            <div className="mt-3">
              <button
                className={`btn btn-sm rounded-full mr-2 ${selectType == "ALL" && "btn-primary"}`}
                onClick={() => setSelectType("ALL")}
              >
                ALL
              </button>
              {productType.map((item) => (
                <button
                  className={`btn btn-sm rounded-full mr-2 ${selectType == item._id && "btn-primary"}`}
                  key={item._id}
                  onClick={() => setSelectType(item._id)}
                >
                  {item.ProductType}
                </button>
              ))}
            </div>
          </div>
          {/* Product Listing */}
          <div className="grid grid-cols-4 mt-4 bg-white w-full rounded-md p-4 gap-2.5">
            {product.length ? (
              product.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-300 flex flex-col justify-center items-center rounded-md hover:bg-gray-200 hover:cursor-pointer"
                  onClick={() => handleCart(item)}
                >
                  <img
                    className="w-28"
                    src={`http://localhost:8000/upload/${item.Picture}`}
                  />
                  <p className="text-center">{item.ProductName}</p>
                  <p className="text-gray-600">{item.NumberInStock}</p>
                  <p className="text-error">{item.Price}$</p>
                </div>
              ))
            ) : (
              <h1>No Products</h1>
            )}
          </div>
        </div>
        {/* Right */}
        <div className="bg-white p-3 rounded-md w-[30%]">
          <div className="flex justify-between items-center mb-3">
            <p>ទំនិញកម្មង់</p>
            <button
              className="text-error hover:bg-red-100 hover:cursor-pointer p-2 rounded-lg"
              onClick={handleClearCart}
            >
              ជម្រះ
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-200">
              <th className="p-2">ឈ្មោះទំនិញ</th>
              <th className="p-2">បរិមាណ</th>
              <th className="p-2">តម្លៃសរុប</th>
            </thead>
            <tbody>
              {cart.length ? (
                cart.map((item) => (
                  <tr key={item.prod_id} className="border-b-1">
                    <td className="p-1 w-[30%]">
                      <p>{item.prod_name}</p>
                    </td>
                    <td className="p-1 flex justify-center">
                      <button
                        className="btn btn-sm"
                        onClick={() => handleQty(item.prod_id, -1)}
                      >
                        -
                      </button>
                      <input
                        className="text-center w-[30%]"
                        type="number"
                        value={item.qty}
                        min={0}
                        max={100}
                      />
                      <button
                        className="btn btn-sm"
                        onClick={() => handleQty(item.prod_id, 1)}
                      >
                        +
                      </button>
                    </td>
                    <td className="p-1 w-[20%]">
                      <p className="text-right">{item.total}$</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center">
                    សូមជ្រើសរើសមុខទំនិញ
                  </td>
                </tr>
              )}
              {/* Total */}
              <tr className="bg-gray-200">
                <td className="p-1 w-[30%]"></td>
                <td className="p-1 flex justify-center">
                  <p className="font-bold">សរុប</p>
                </td>
                <td className="p-1 w-[20%]">
                  <p className="text-right font-bold">{cartTotal}$</p>
                </td>
              </tr>
            </tbody>
          </table>
          <button className="btn btn-success w-full mt-4" onClick={submitSale}>
            ធ្វើការទិញ
          </button>
        </div>
      </div>
    </MasterPage>
  );
}

export default Sale;
