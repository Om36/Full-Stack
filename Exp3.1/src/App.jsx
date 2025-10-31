import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div>
    <h1>Product List</h1>
    <div className="product-list">
      <div className="product">
        <p>Wireless</p>
        <p>Price: $2000</p>
        <p>Stock: In Stock</p>
      </div>
      <div className="product">
        <p>Laptop</p>
        <p>Price: $200</p>
        <p>Stock: Out of Stock</p>
      </div>
      <div className="product">
        <p>Smart Movie</p>
        <p>Price: $500</p>
        <p>Stock: In Stock</p>
      </div>
    </div>
    </div>
  )
}

export default App;
