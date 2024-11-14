import logo from './logo.svg';
import './App.css';
import MyComponent from './components/MyComponent/MyComponent'
import Products from './components/Products/Products'
import Login from './components/Login/Login'
import NavBar from './components/NavBar/NavBar'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import AuthProvider from "./AuthProvider";
import PrivateRoute from "./PrivateRoute";
import {useState } from "react";

function App() {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const Logout = (e) => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    
    window.location = 'login';
  };
  return (
    <div className="wrapper">
     <div class="d-flex" style={{"width":"100%"}}>
          <div  style={{"width":"98%"}}>
          <NavBar/>
          </div>
          <div class="ml-auto" style={{"width":"10%"}}>
          <input type='button' onClick={Logout} value='Logout'></input>
          </div>
    </div>     
      
      <BrowserRouter>
      <AuthProvider>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path='/login' Component={Login}/>
            <Route element={<PrivateRoute />}>
              <Route path='/products' Component={Products}/>
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path='/home' Component={MyComponent}/>  
            </Route>
          </Routes>          
        </header>
      </div>
      </AuthProvider>
      </BrowserRouter>
      
    </div>    
  );
}

export default App;
