import { useState, useContext, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import QueryContext from "../../context/QueryContext";
import axios from "axios";

function ProductForm({ endPoint, defaultData }) {

  const { handleView, isEdit } = useContext(QueryContext);
  defaultData = isEdit ? defaultData : {}


  const [formdata, setformdata] = useState({
    ProductName: defaultData.ProductName || '',
    Picture: "",
    Price: defaultData.Price || '',
    Cost: defaultData.Cost || '',
    Note: defaultData.Note || '',
    ProductType: defaultData.ProductType?._id || '',
    NumberInStock: defaultData.NumberInStock || '',
  });

  const [productType, setProductType] = useState([]);

  const fetchProductType = async () => {
    const pro_url = `http://localhost:8000/producttype`;
    const pro_result = await axios.get(pro_url);
    setProductType(pro_result.data.data);

    console.log(pro_result);
  };

  useEffect(() => {
    fetchProductType();
  }, []);


  console.log('IsEdit: ', isEdit)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("ProductName", formdata.ProductName);
    submitData.append("Picture", formdata.Picture);
    submitData.append("Price", formdata.Price);
    submitData.append("Cost", formdata.Cost);
    submitData.append("Note", formdata.Note);
    submitData.append("ProductType", formdata.ProductType);
    submitData.append("NumberInStock", formdata.NumberInStock);



    let url = `http://localhost:8000/${endPoint}`;
    let result = ""

    if (isEdit) {
      const id = defaultData._id;
      url = `http://localhost:8000/${endPoint}/${id}`;
      result = await axios.put(url, submitData);
    } else {
      result = await axios.post(url, submitData);
    }

    console.log(result);
    toast.success(result.data.message, { duration: 4000, position: 'top-right' })

    setformdata({
      ProductName: "",
      Picture: "",
      Price: "",
      Cost: "",
      Note: "",
      ProductType: "",
      NumberInStock: "",
    })


  };

  return (
    <div>
      <Toaster />
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-white border-base-300 rounded-box w-md border p-4">
          <label className="label">ឈ្មោះ​ទំនិញ</label>
          <input
            type="text"
            className="input w-full"
            placeholder="សរសេរឈ្មោះទំនិញ"
            required
            value={formdata.ProductName}
            onChange={(e) => {
              setformdata((prev) => ({
                ...prev,
                ProductName: e.target.value,
              }));
            }}
          />
          <label className="label">ប្រភេទទំនិញ</label>
          <select
            className="select w-full"
            value={formdata.ProductType}
            onChange={(e) => {
              setformdata((prev) => ({
                ...prev,
                ProductType: e.target.value,
              }));
            }}
          >
            <option>None</option>
            {productType &&
              productType.map((item, idex) => (
                <option key={item._id} value={item._id}>
                  {item.ProductType}
                </option>
              ))}
          </select>

          <label className="label">តម្លៃលក់​(ដុល្លារ)</label>
          <input
            type="number"
            className="input w-full"
            placeholder="សរសេរតម្លៃលក់"
            required
            value={formdata.Price}
            onChange={(e) => {
              setformdata((prev) => ({
                ...prev,
                Price: e.target.value,
              }));
            }}
          />

          <label className="label">តម្លៃទិញចូល (ដុល្លារ)</label>
          <input
            type="number"
            className="input w-full"
            placeholder="សរសេរតម្លៃទិញចូល"
            required
            value={formdata.Cost}
            onChange={(e) => {
              setformdata((prev) => ({
                ...prev,
                Cost: e.target.value,
              }));
            }}
          />

          <label className="label">ចំនួនក្នុងស្កុក</label>
          <input
            type="number"
            className="input w-full"
            placeholder="សរសេរចំនួនក្នុងស្កុក"
            required
            value={formdata.NumberInStock}
            onChange={(e) => {
              setformdata((prev) => ({
                ...prev,
                NumberInStock: e.target.value,
              }));
            }}
          />
          <label className="label">រូបភាព</label>
          <input
            type="file"
            className="input"
            placeholder="បញ្ចូលរូប"
            onChange={(e) => {
              setformdata((prev) => ({
                ...prev,
                Picture: e.target.files[0],
              }));
            }}
          />

          <label className="label">ចំណាំ</label>
          <textarea className="textarea w-full" placeholder="សរសេរចំណាំ"
            value={formdata.Note}
            onChange={(e) => {
              setformdata((prev) => ({
                ...prev,
                Note: e.target.value,
              }));
            }}
          />

          <div className="flex justify-end items-center gap-2">
            <button type="button" className="btn bg-base-200 mt-4 text-black" onClick={handleView}>
              បោះបង់
            </button>
            <button type="submit" className="btn btn-success mt-4 text-white" >
              {isEdit ? "កែប្រែ" : "រក្សាទុក"}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default ProductForm;
