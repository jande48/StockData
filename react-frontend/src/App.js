import React, {useState} from 'react'
import { Provider } from 'react-redux'
import './App.css'
import store from './redux/store'
import SelectTickerContainer from './components/SelectTickerContainer'
import SelectDatesFromMenuContainer from './components/SelectDatesFromMenuContainer'
import SelectCustomDatesContainer from './components/SelectCustomDatesContainer'
import SelectLineOrCandleContainer from './components/SelectLineOrCandleContainer'
import LineCandleGraphContainer from './components/LineCandleGraphContainer'
import VolumeGraphContainer from './components/VolumeGraphContainer'
import { Grid, Accordion, Header, Icon} from "semantic-ui-react"
import MomentumMenuContainer from './components/MomentumMenuContainer'
import MomentumGraphContainer from './components/MomentumGraphContainer'
import momentumReducer from './redux/momentum/momentumReducer'


function App () {
  const [activeMomentumAccodian, setMomentumAccordion] = useState(0)
  const [activeTrendAccodian, setTrendAccordion] = useState(-1)
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
              <Header as='h2' textAlign='center'>
                Indicators
              </Header>
              <Accordion>
                <Accordion.Title
                  active={activeMomentumAccodian=== 0}
                  content=''
                  index={0}
                  borderless
                  onClick={(e,index) => {
                      setMomentumAccordion(index.index === activeMomentumAccodian ? -1 : index.index)
                      }}><Header as='h3'><Icon name='dropdown' />Momentum</Header></Accordion.Title>
                <Accordion.Content borderless active={activeMomentumAccodian === 0} content={<MomentumMenuContainer />} />
              </Accordion>
              
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width = {12}>
            <LineCandleGraphContainer /><br/>
            <VolumeGraphContainer/><br/>
            <MomentumGraphContainer/>
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
