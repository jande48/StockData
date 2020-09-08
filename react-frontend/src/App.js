import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { StockData } from './components/StockData';
import { Container } from "semantic-ui-react"
import { StockDataDateForm } from './components/StockDataDateForm';

function App() {
  // const [stockData, setStockData] = useState([]);

  // useEffect(() => {
  //   fetch("/get_stock_data").then(response => 
  //     response.json().then(data => {
  //       //console.log(Object.keys(data));
  //       setStockData(data);
  //     })
  //   )
  // }, [])
  
  return (
    <div className="App">
      <Container style={{marginTop: 40}}>
        <StockDataDateForm />
        
        {/* <StockData stockData={stockData} /> */}
      </Container>
      
    </div>
  );
}

export default App;
