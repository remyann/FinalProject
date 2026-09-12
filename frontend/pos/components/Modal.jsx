import { useEffect, useRef } from "react";

/**
 * RECEIPT DIALOG: display the invoice returned by the backend after checkout.
 *
 * Props are values supplied by the parent <Sale> component:
 * - receipt: null when closed, or an object containing items, total, and createdAt.
 * - onClose: a function that tells Sale to clear its receipt state.
 *
 * FLOW: receipt state changes -> React renders the receipt -> useEffect runs
 *       -> showModal() opens the browser dialog above the page.
 *
 * A receipt is only supplied after the stock update and invoice transaction succeeds.
 */
function Modal({ receipt, onClose }) {
  // useRef remembers a reference to the actual <dialog> element in the browser.
  // React assigns the element to dialogRef.current after rendering it.
  // This avoids searching the whole page for an element with a particular ID.
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Rendering a <dialog> does not automatically open it as a modal.
    // showModal() places it above the page and makes the background inactive.
    // Check .open first: opening an already-open dialog is unnecessary.
    if (receipt && !dialog.open) dialog.showModal();
    if (!receipt && dialog.open) dialog.close();
  }, [receipt]); // Run after a render when the receipt value changes.

  // toFixed(2) displays money consistently: 12 becomes "12.00".
  // This only formats the display; it does not change the stored cart numbers.
  const money = (amount) => Number(amount).toFixed(2);

  const printInvoice = () => window.print();

  return (
    <dialog
      ref={dialogRef}
      className="modal receipt-dialog"
      aria-labelledby="receipt-title"
      onClose={onClose}>
      <div className="modal-box receipt-content">
        <h3 id="receipt-title" className="font-bold text-lg text-center">
          MASTERIT POS
        </h3>
        <hr />
        {/* Render the contents only when Sale has provided a receipt object. */}
        {receipt && (
          <>
            <div className="flex justify-between gap-4 mt-3">
              <p className="font-bold">វិក្កយបត្រ</p>
              <p className="font-mono text-sm">{receipt.invoiceId}</p>
            </div>
            <p>កាលបរិច្ឆេទ: {new Date(receipt.createdAt).toLocaleString()}</p>
            <p>អ្នកលក់: {receipt.cashier}</p>
            <table className="w-full mt-3">
              <thead>
                <tr>
                  <th className="text-left">ទំនិញ</th>
                  <th>ចំនួន</th>
                  <th className="text-right">តម្លៃ</th>
                  <th className="text-right">តម្លៃសរុប</th>
                </tr>
              </thead>
              <tbody>
                {/*
                  map() creates one table row for every selected product.
                  key identifies each row for React; prod_id is the product ID.
                  These values come from the receipt snapshot, not sample text.
                */}
                {receipt.items.map((item) => (
                  <tr key={item.prod_id}>
                    <td className="py-2">{item.prod_name}</td>
                    <td className="text-center">{item.qty}</td>
                    <td className="text-right">{money(item.price)}$</td>
                    <td className="text-right">{money(item.total)}$</td>
                  </tr>
                ))}
                <tr className="border-t font-bold">
                  <td colSpan={3} className="py-2">
                    តម្លៃសរុបទាំងអស់
                  </td>
                  <td className="text-right">{money(receipt.total)}$</td>
                </tr>
              </tbody>
            </table>
            <p className="text-center mt-4">សូមអរគុណ!</p>
          </>
        )}
        <div className="modal-action receipt-actions">
          {/*
            method="dialog" closes this native browser dialog without an API call.
            Closing it (or pressing Escape) fires onClose above.
            Sale then clears receipt state, keeping React and the dialog in sync.
            The completed cart has already been cleared by Sale.
          */}
          <button
            type="button"
            className="btn btn-success"
            onClick={printInvoice}>
            បោះពុម្ព
          </button>
          <form method="dialog">
            <button type="submit" className="btn">បិទ</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default Modal;
