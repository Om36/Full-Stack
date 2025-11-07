import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState({});
  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(setData);
  }, []);
  return (
    <div className="App">
      <h1>React Frontend</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;
