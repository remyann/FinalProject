import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";

function App() {
  const [productData, setProductData] = useState([]);
  useEffect(() => {
    async function getUser() {
      try {
        const result = await axios.get("http://localhost:8000/product");
        console.log(result);
        setProductData(result.data.data);
      } catch (error) {
        console.log(error);
        const message_error = error.response.data.message;
        console.log(message_error);
      }
    }

    getUser();
  }, []);

  return (
    <div className="flex gap-4 mt-10">
      {productData.length > 0 &&
        productData.map((item) => (
          <Card
            key={item._id}
            productName={item.ProductName}
            image={item.Picture}
            description={item.Note}
          />
        ))}
    </div>
  );
}

export default App;
