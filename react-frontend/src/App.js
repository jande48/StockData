import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Container } from "semantic-ui-react"
import { StockData } from './components/StockData';

function App() {

  return (
    <div className="App">
      {/* <Container style={{marginTop: 40}}>
        <StockData />
      </Container> */}
      <StockData />
    </div>
  );
}

export default App;
