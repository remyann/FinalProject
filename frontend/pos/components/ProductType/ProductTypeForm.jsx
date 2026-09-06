import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function ProductTypeForm({ defaultData, handleView, isEdit }) {
  const [formData, setFormData] = useState({
    ProductType: defaultData.ProductType || "",
    Description: defaultData.Description || "",
  });
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (isEdit) {
        console.log(defaultData);
        //   put: update item
        const id = defaultData._id;
        const url = "http://localhost:8000/producttype/" + id;
        const result = await axios.put(url, formData);
        toast.success("Item has been updated", {
          duration: 4000,
          position: "top-right",
        });
        handleView();
      } else {
        //   post: add new item
        const url = "http://localhost:8000/producttype";
        const result = await axios.post(url, formData);
        toast.success("Item has been added", {
          duration: 4000,
          position: "top-right",
        });
      }

      //   toast.success(result.data.message, {
      //     duration: 4000,
      //     position: "top-right",
      //   });
      setFormData({
        ProductType: "",
        Description: "",
      });
    } catch (error) {
      console.log(error);
      //   const error_message = error.response.data.message;
      //   toast.success(error_message, {
      //     duration: 4000,
      //     position: "top-right",
      //   });
    }
  };

  return (
    <div>
      <Toaster />
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-white border-base-300 rounded-box w-md border p-4">
          <label className="label">ឈ្មោះ​</label>
          <input
            type="text"
            className="input w-full"
            placeholder="សរសេរឈ្មោះ"
            value={formData.ProductType}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                ProductType: e.target.value,
              }));
            }}
          />

          <label className="label">ពិព៍ណនា</label>
          <textarea
            className="textarea w-full"
            placeholder="សរសេរពិព៍ណនា"
            value={formData.Description}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                Description: e.target.value,
              }));
            }}
          />

          <div className="flex justify-end items-center gap-2">
            <button
              type="button"
              className="btn bg-base-200 mt-4 text-black"
              onClick={handleView}
            >
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

export default ProductTypeForm;
