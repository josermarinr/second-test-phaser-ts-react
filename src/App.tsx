import React from 'react';
import './App.css';
import {Home} from './pages/Home'

function App() {
  if(window.innerWidth > 700){
    return (
      <div>
        <h1 className={"titleWarning"}>Use Mobile for more performace, we work in desktop & Tablet version, 😊</h1>
        <Home/>
        <p className={"titleWarning"}>* problems with mouse and select object</p>
      </div>
     )
   
  }

  return (
    <div className="App">
        <Home/>
    </div>
  );
}

export default App;
