import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();
  const loginAction = async (input) => {
    try {
      // Define the API endpoint
      const loginUrl = 'https://localhost:5261/api/Login/login';
      const dataForLogin = {
        "userName": input.username,
        "password": input.password};
      
       // Make the API call using Axios
       axios({      
        url: loginUrl,        
        method: 'POST',
        data : JSON.stringify(dataForLogin),
        headers: {
          'Content-Type': 'application/json; charset=utf-8', // Explicitly set the content type to JSON
          'accept': '*/*',
          'Access-Control-Allow-Origin':'*'
          }
        }
      )
      .then(response => {
        console.log('Token ' , response.data.accessToken)

        localStorage.setItem("site", response.data.accessToken);
        setToken(response.data.accessToken);
        navigate("/home");
      })
      .catch(error => {
        throw error;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
