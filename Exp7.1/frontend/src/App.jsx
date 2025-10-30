import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container">
      <h1>Product List</h1>
      <div className="card-container">
        {products.map((item) => (
          <div key={item.id} className="card">
            <h3>{item.name}</h3>
            <p>Price: ₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
