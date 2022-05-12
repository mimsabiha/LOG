
import React from "react";
import {useEffect , useState ,useContext } from "react";
import './App.css';
import Axios from 'axios';
import {AuthContext} from './helpers/AuthContext';


function App() {

  const [authState, setAuthState] = useState(false); // initially its boolean cz we check its logged in or not

  const [usernameReg,setUsernameReg] = useState("");
  const [passwordReg,setPasswordReg] = useState("");


  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");

  const [loginStatus,setLoginStatus] = useState("");
  //const setAuthState = useContext(AuthContext);

 // Axios.defaults.withCredentials = true;

  const register = () => { // sending variables to backend
    Axios.post("http://localhost:3001/register" , {username:usernameReg , password:passwordReg}).then((response) => {
      console.log(response);
    });
  };

  const login = () => {
    Axios.post("http://localhost:3001/login" , {username:username , password:password}).then((response) => {
      //console.log(response.data);
      if(response.data.message){
        setLoginStatus(response.data.message);
      }else {
        //setLoginStatus(response.data[0].username);
        localStorage.setItem("accessToken",response.data);
        setAuthState(true);
      }
    });
  };

  useEffect(() => {
    Axios
      .get("http://localhost:3001/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.message) {
          setAuthState(false);
        } else {
          setAuthState(true);
        }
      });
  }, []);

  
 /* useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
    
      if (response.data.loggedIn === true) {
        setLoginStatus(response.data.user[0].username);
      }
      
    });
  }, []);*/

  return (
    <div className="App">
      <AuthContext.Provider value={{authState,setAuthState}}>
      { !authState && (
        <>
      <div className='Registration'>
        <h2>Registration</h2>
        <label>username</label>
        <input type= "text"
        onChange={(e) =>
        {setUsernameReg(e.target.value);
        }
        }/>
        <label>password</label>
        <input type= "text"
        onChange={(e) =>
          {setPasswordReg(e.target.value);
          }
          } />
        <button onClick={register} >Register</button>
 
      </div>
 
      <div className='Login'>
        <h2>Login</h2>
        <label>username</label>
        <input type= "text" 
        onChange={(e) =>
          {setUsername(e.target.value);
          } 
        } />
        <label>password</label>
        <input type= "text"
        onChange={(e) =>
          {setPassword(e.target.value);
          }
          }  />
        <button onClick={login}>Login</button>
 
      </div>
      </>
      )
     }

      <div>Hello World!Mein Iha hoo!!</div>
      </AuthContext.Provider>

      
      
    </div>
  );
}

export default App;
