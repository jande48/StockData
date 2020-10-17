import React from 'react'
import { Provider } from 'react-redux'
import './App.css'
import store from './redux/store'
import CakeContainer from './components/CakeContainer'
// import HooksCakeContainer from './components/HooksCakeContainer'
// import IceCreamContainer from './components/IceCreamContainer'
// import NewCakeContainer from './components/NewCakeContainer'
// import ItemContainer from './components/ItemContainer'
//import UsersContainer from './components/UsersContainer'

function App () {
  return (
    <Provider store={store}>
      <div className='App'>
        
        <CakeContainer />
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
