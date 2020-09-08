import React from 'react';
import { List, Header } from "semantic-ui-react"

export const StockData = ({ stockData }) => {
    return (
        
        <List>
            
            {Object.keys(stockData).map(function(key,index) {
                return(
                    <List.Item key={stockData[key].close}>
                        <Header>Date: {key}</Header>
                        <p>Open: {stockData[key].open}</p>
                        <p>High: {stockData[key].high}</p>
                        <p>Low: {stockData[key].low}</p>
                        <p>Close: {stockData[key].close}</p>
                    </List.Item>
                )
            })}
        </List>
    );
};