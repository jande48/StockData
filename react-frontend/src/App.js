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
import CompanyFinancialsContainer from './components/CompanyFinancialContainer'
import { Grid, Accordion, Header, Icon} from "semantic-ui-react"
import MomentumMenuContainer from './components/MomentumMenuContainer'
import TrendMenuContainer from './components/TrendMenuContainer'
import MomentumGraphContainer from './components/MomentumGraphContainer'
import EarningContainer from './components/EarningContainer'
import momentumReducer from './redux/momentum/momentumReducer'


function App () {
  const [activeMomentumAccodian, setMomentumAccordion] = useState(0)
  const [activeTrendAccodian, setTrendAccordion] = useState(-1)
  return (
    <Provider store={store}>
        <Grid celled inverted>
          <Grid.Column width = {4} inverted>
            <Grid.Row stretched color='black'>
              <SelectTickerContainer /><br/>
              <SelectDatesFromMenuContainer /><br/>
              <SelectCustomDatesContainer /><br/>
              <SelectLineOrCandleContainer /><br/>
              {/* <Header inverted as='h2' textAlign='center'>
                Indicators
              </Header> */}
              <Grid.Row color='black' inverted stretched>
              <Accordion inverted stretched fitted color='black'>
                <Accordion.Title
                  inverted
                  active={activeMomentumAccodian === 0}
                  index={0}
                  borderless
                  onClick={(e,index) => {
                      setMomentumAccordion(index.index === activeMomentumAccodian ? -1 : index.index)
                      }}>
                    <Header as='h3' textAlign='left' inverted><Icon name='dropdown' />Momentum</Header>
                </Accordion.Title>
                <Accordion.Content borderless active={activeMomentumAccodian === 0} >{<MomentumMenuContainer />}</Accordion.Content>
                <Accordion.Title
                  inverted
                  active={activeTrendAccodian=== 1}
                  index={1}
                  borderless
                  onClick={(e,index) => {
                      setTrendAccordion(index.index === activeTrendAccodian ? -1 : index.index)
                      }}>
                    <Header as='h3' textAlign='left' inverted><Icon name='dropdown' />Trend</Header>
                </Accordion.Title>
                <Accordion.Content borderless active={activeTrendAccodian === 1} >{<TrendMenuContainer />}</Accordion.Content>
              </Accordion>
              </Grid.Row>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width = {12}>
            <LineCandleGraphContainer /><br/>
            <VolumeGraphContainer/><br/>
            <MomentumGraphContainer/><br />
            <CompanyFinancialsContainer/><br />
            <EarningContainer/>
          </Grid.Column>
        </Grid>
        
        
      
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
