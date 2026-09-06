import { useContext, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import QueryContext from "../../context/QueryContext";

function InvoiceForm() {
  const [formData, setFormData] = useState({
    InvID: "",
    UserName: "",
    DateOfSale: "",
  });
  const { endpoint } = useContext(QueryContext);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const url = `http://localhost:8000/${endpoint}`;
      const result = axios.post(url, formData);
      toast.success(result.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Toaster />
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-white border-base-300 rounded-box w-md border p-4">
          <label className="label">លេខវិក័យប័ត្រ</label>
          <input
            type="text"
            className="input w-full"
            placeholder=""
            value={formData.InvID}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                InvID: e.target.value,
              }));
            }}
          />

          <label className="label">អ្នកលក់</label>
          <input
            type="text"
            className="input w-full"
            value={formData.UserName}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                UserName: e.target.value,
              }));
            }}
            placeholder=""
          />

          <label className="label">កាលបរិចេ្ឆទ</label>
          <input
            type="date"
            className="input w-full"
            placeholder=""
            value={formData.DateOfSale}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                DateOfSale: e.target.value,
              }));
            }}
          />

          <div className="flex justify-end items-center gap-2">
            <button type="button" className="btn bg-base-200 mt-4 text-black">
              បោះបង់
            </button>
            <button type="submit" className="btn btn-success mt-4 text-white">
              រក្សាទុក
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default InvoiceForm;
