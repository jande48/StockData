import React from 'react'
import { Provider } from 'react-redux'
import './App.css'
import store from './redux/store'
import SelectTickerContainer from './components/SelectTickerContainer'
import SelectDatesFromMenuContainer from './components/SelectDatesFromMenuContainer'
import SelectCustomDatesContainer from './components/SelectCustomDatesContainer'
import SelectLineOrCandleContainer from './components/SelectLineOrCandleContainer'
import LineCandleGraphContainer from './components/LineCandleGraphContainer'
import VolumeGraphContainer from './components/VolumeGraphContainer'
import { Grid} from "semantic-ui-react"
import MomentumMenuContainer from './components/MomentumMenuContainer'
import MomentumGraphContainer2 from './components/MomentumGraphContainer2'


function App () {
  return (
    <Provider store={store}>
      <div className='App'>
        <Grid celled>
          <Grid.Column width = {4}>
            <Grid.Row stretched>
              <SelectTickerContainer /><br/>
              <SelectDatesFromMenuContainer /><br/>
              <SelectCustomDatesContainer /><br/>
              <SelectLineOrCandleContainer /><br/>
              <MomentumMenuContainer />
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width = {12}>
            <LineCandleGraphContainer /><br/>
            <VolumeGraphContainer/><br/>
            <MomentumGraphContainer2/>
          </Grid.Column>
        </Grid>
        
        
        {/* <ItemContainer cake />
        <ItemContainer />
        <NewCakeContainer />
        <UsersContainer />
        <HooksCakeContainer />
        <IceCreamContainer /> */}
      </div>
    </Provider>
  )
}

export default App
// import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
// import './App.css';
// import { Container } from "semantic-ui-react"
// import { StockData } from './components/StockData';
// import { exampleRedux } from './components/exampleRedux'
// import { Provider } from 'react-redux'
// import store from './components/redux/store'
// function App() {

//   return (
//     <Provider store={store}>
//       <div className="App">
//       {/* <Container style={{marginTop: 40}}>
//         <StockData />
//       </Container> 
//       <StockData />*/}
//         <exampleRedux />
//       </div>
//     </Provider>
    
//   );
// }

// export default App;
