
import MasterPage from "../pages/MasterPage";
import QueryContext from "../context/QueryContext";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import axios from "../src/api";
import toast from "react-hot-toast";
import Modal from "../components/Modal";

function Sale() {
  const { setLabel } = useContext(QueryContext);
  const [productType, setProductType] = useState([]);
  const [product, setProduct] = useState([]);
  const [selectType, setSelectType] = useState("ALL");
  // React state is data that this component remembers between renders.
  // cart starts as an empty array: [] means no products have been selected.
  // Each entry holds one product's ID, name, unit price, quantity, and line total.
  // setCart requests a state update; React then renders the component again.
  const [cart, setCart] = useState([]);
  // null means there is no receipt to display yet.
  // A successful backend checkout stores its returned invoice here and opens Modal.
  const [showReceipt, setShowReceipt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

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

  // The line total belongs to ONE product: unit price multiplied by quantity.
  // cartTotal is the sum of ALL line totals in the cart.
  // reduce() visits each item and carries a running sum to the next item.
  // The final argument, 0, is the starting sum (and the result for an empty cart).
  // Example: line totals of $24 and $6 give 0 + 24 + 6 = $30.
  // This calculation runs again when React renders after setCart updates state.
  // We therefore do not need a separate setCartTotal call inside handleQty.
  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  const handleCart = (product) => {
    if (product.NumberInStock < 1) {
      toast.error("ទំនិញនេះអស់ពីស្តុក");
      return;
    }

    setCart((prev) => {
      // check if product is already add to cart
      const existingIndex = prev.findIndex(
        (item) => item.prod_id == product._id,
      );

      // if product already add
      if (existingIndex !== -1) {
        return prev.map((item, idx) => {
          if (idx === existingIndex) {
            if (item.qty >= product.NumberInStock) return item;
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
            stock: product.NumberInStock,
            qty: 1,
            total: parseFloat(product.Price),
          },
        ];
      }
    });
  };

  const handleClearCart = () => setCart([]);
  const getProductType = useCallback(async () => {
    try {
      const resultProductType = await axios.get("/producttype");
      setProductType(resultProductType.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);
  const getProduct = useCallback(async () => {
    try {
      const resultProduct = await axios.get("/sale?type=" + selectType);
      setProduct(resultProduct.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [selectType]);

  // when page loaded, for set label
  useEffect(() => {
    setLabel("ការលក់");
    getProductType();
  }, [getProductType, setLabel]);

  // when change product type
  useEffect(() => {
    getProduct();
  }, [getProduct]);

  const submitSale = async () => {
    try {
      // check if cart is empty
      if (cart.length === 0) {
        toast.error("សូមជ្រើសរើសទំនិញមុនពេលធ្វើការទិញ");
        return;
      }
      // sub cart to backend
      const result = await axios.post(import.meta.env.VITE_API_URL + "/sale", {
        cart,
      });

      const status = result.data.status;
      if (status === "success") {
        // setReceipt(result.data);
        setShowReceipt(true);
        setCart([]);
        getProduct();
        toast.success("ការទិញបានជោគជ័យ");
        document.getElementById("my_modal_1").showModal();
      } else {
        setShowReceipt(false);
        toast.error("មានបញ្ហាក្នុងការទិញ");
      }

      console.log(result);
    } catch (error) {
      setShowReceipt(false);
      toast.error(error?.response?.data?.message);
    }
  };

  /**
   * QUANTITY BUTTONS: how a click becomes a new quantity and price.
   *
   * Parameters (the values passed into this function):
   * - pro_id: identifies the product whose button was clicked.
   * - operation: +1 for the plus button, or -1 for the minus button.
   *
   * Example: Anchor costs $12 and its quantity is 1.
   * Click "+": 1 + 1 = 2 items; the line total becomes 2 * 12 = $24.
   * Click "-": 2 - 1 = 1 item; the line total becomes 1 * 12 = $12.
   * Click "-" again: 1 - 1 = 0; that product is removed from the cart.
   * Other products keep their quantities and prices.
   *
   * FLOW DIAGRAM
   *
   * [User clicks - or +]
   *          |
   *          v
   * [onClick calls handleQty(product ID, -1 or +1)]
   *          |
   *          v
   * [setCart gives its updater the latest pending cart: prev]
   *          |
   *          v
   * [map visits each item: does its ID match pro_id?]
   *          | YES                         | NO
   *          v                             v
   * [Copy item with new qty/total]    [Keep the same item]
   *          |                             |
   *          +--------------+--------------+
   *                         v
   *              [filter removes items with qty 0]
   *                         |
   *                         v
   *              [Return the new array to React]
   *                         |
   *                         v
   *              [React renders with the new cart]
   *                         |
   *                         v
   *              [Quantity, line total, cart total update]
   *
   * This changes the cart in the browser. It does not send an API request
   * or change the product's stock quantity in the database.
   */
  const handleQty = (pro_id, operation) => {
    // Pass a FUNCTION to setCart because our next cart depends on its old value.
    // React supplies that function with prev: the latest pending state.
    // Queued updates can then build on one another, including quick clicks.
    // Do not expect the cart variable to change immediately after setCart.
    setCart(
      (prev) =>
        // This arrow function has an expression body: it returns the result of
        // prev.map(...).filter(...) without needing an explicit return statement.
        prev
          .map((item) => {
            // map() builds a NEW array by running this callback for each product.
            // item is the product currently being visited, not necessarily clicked.
            // !== means "is not equal to" without converting either value's type.
            // An unrelated product is returned as-is; nothing below runs for it.
            if (item.prod_id !== pro_id) return item;

            // Only the matching product reaches this line.
            // Add the operation: +1 increases quantity; -1 decreases quantity.
            // Math.max(0, ...) chooses the larger number, preventing negatives.
            const qty = Math.min(
              Number.isFinite(item.stock)
                ? item.stock
                : Number.MAX_SAFE_INTEGER,
              Math.max(0, item.qty + operation),
            );

            // Return a NEW object instead of changing the existing item directly.
            // ...item copies its fields (ID, name, price, and so on).
            // The properties written AFTER ...item replace


            // qty is shorthand for qty: qty, using the variable calculated above.
            // Number() converts a price such as "12" into the number 12.
            // Updating both qty and total keeps the displayed row price consistent.
            return { ...item, qty, total: qty * Number(item.price) };
          })
          .filter((item) => item.qty > 0),
      // filter() keeps items for which the condition is true.
      // A quantity of 0 fails qty > 0, so that product disappears from the cart.
      // The resulting array becomes the next cart state; prev was not mutated.
    );
  };

  return (
    <MasterPage>
      {/*
        Props pass data and functions from Sale (the parent) to Modal (the child).
        receipt contains the captured cart. onClose is a callback: Modal calls
        it when its dialog closes, and Sale resets receipt to null.
      */}
      <Modal />
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
                  className={`border border-gray-300 flex flex-col justify-center items-center rounded-md ${item.NumberInStock > 0
                      ? "hover:bg-gray-200 hover:cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                    }`}
                  onClick={() => handleCart(item)}
                >
                  <img
                    className="w-28"
                    src={`${import.meta.env.VITE_API_URL}/upload/${item.Picture}`}
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
                      {/*
                        The arrow function waits for a click before calling handleQty.
                        item.prod_id identifies THIS
[9/12/2026 11:09 AM] Houy Narun: row; -1 means subtract one.
                        Writing onClick={handleQty(...)} would call it during render.
                        type="button" prevents form submission if used inside a form.
                      */}
                      <button
                        className="btn btn-sm"
                        type="button"
                        onClick={() => handleQty(item.prod_id, -1)}
                      >
                        -
                      </button>
                      {/*
                        value={item.qty} displays the quantity stored in React state.
                        readOnly makes this a display: use the - and + buttons to edit.
                        When setCart changes qty, React refreshes this value for us.
                        aria-label gives this input a product-specific accessible name.
                      */}
                      <input
                        className="text-center w-[30%]"
                        type="number"
                        value={item.qty}
                        readOnly
                        aria-label={`Quantity for ${item.prod_name}`}
                      />
                      {/* Same handler and product ID; +1 means add one item. */}
                      <button
                        className="btn btn-sm"
                        type="button"
                        onClick={() => handleQty(item.prod_id, 1)}
                      >
                        +
                      </button>
                    </td>
                    <td className="p-1 w-[20%]">
                      {/* handleQty recalculates this row's total: quantity * unit price. */}
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
                  {/* cart.reduce(...) adds the updated totals of every remaining row. */}
                  <p className="text-right font-bold">{cartTotal}$</p>
                </td>
              </tr>
            </tbody>
          </table>
          {/*
            Pass the function itself to onClick: React calls it when clicked.
            Do not write onClick={submitSale()}, which calls it during rendering.
            type="button" prevents this click from submitting a surrounding form.
          */}
          <button
            type="button"
            className="btn btn-success w-full mt-4"
            onClick={submitSale}
            disabled={isSubmitting || cart.length === 0}
          >
            {isSubmitting ? "កំពុងដំណើរការ..." : "ធ្វើការទិញ"}
          </button>
        </div>
      </div>
    </MasterPage>
  );
}

export default Sale;
