function Modal({ cart }) {
  return (
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center">MASTERIT POS</h3>
        <hr />
        <table className="w-full">
          <tbody>
            <tr>
              <td>
                <p>វិក័យប័ត្រ</p>
              </td>
              <td>
                <p>កាលបរិច្ចេទ: Sep 20, 2024 8:46 PM</p>
                <p>លេខ: INV-0007</p>
              </td>
            </tr>
          </tbody>
        </table>
        <table className="w-full">
          <thead>
            <th>ទំនិញ</th>
            <th>ចំនួន</th>
            <th>តម្លៃសរុប</th>
          </thead>
          <tbody>
            <tr>
              <td>
                <p>String-ស្ទីង</p>
              </td>
              <td>
                <p>1</p>
              </td>
              <td>
                <p>0.6$</p>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <p>តម្លៃសរុបទាំងអស់</p>
              </td>
              <td>
                <p>0.6$</p>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="text-center">សូមអរគុណ!</p>
        <p className="text-center">សូមអញ្ញើញមកម្តងទៀត!</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default Modal;
