import './App.css';
import Components from './Components';
import React from 'react';
import ResponsiveAppBar from './Navbar';

function App() {
  return (
    <div className="App">

      <ResponsiveAppBar />
      <Components />
    </div>
  );
}

export default App;
