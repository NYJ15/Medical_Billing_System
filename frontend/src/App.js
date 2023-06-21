import './App.css';
import Components from './Components';
import React from 'react';
import ResponsiveAppBar from './Navbar';
import Cookies from 'universal-cookie';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';

function App() {
  const cookies = new Cookies();
  if (cookies.get('access_token')) {
    return (
      <div className="App">

        <ResponsiveAppBar />
        <Components />
      </div>
    );
  }
  else {
    return (
      <div>
        {window.location.pathname === "/signup" ?
          <SignUp />
          :

          <SignIn />
        }

      </div>

    )
  }
}

export default App;
