import axios from "axios";
import { createContext, useEffect, useState } from "react";


// Componente de contexto
const AuthContext = createContext();

// Componente de envoltorio
function AuthWrapper(props) {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const [isValidatingToken, setIsValidatingToken] = useState(true);

  useEffect(() => {

    // esto para verificar si el usuario está logueado o no cuando visita la página (cuando la página ocurre el componentDidMount)
    authenticateUser();
  }, [])

  const authenticateUser = async () => {
    // esta es una función que llamará a la ruta /verify y nos actualiza los estados y se llamará luego de hacer login/logout o volver a la app.

    try {
      
      const authToken = localStorage.getItem("authToken")

      const response = await axios.get("http://localhost:5005/api/auth/verify",{
        headers: { authorization: `Bearer ${authToken}` }
      });
      //en rutas get el segundo argumento es la configuración. En el resto es el body y el tercero la configuración
      console.log(response);
      //el token es válido
      setIsLoggedIn(true);
      setLoggedUserId(response.data._id);
      setIsValidatingToken(false);

    } catch (error) {
      //el token no es válido o no existe
      console.log(error);
      setIsLoggedIn(false);
      setLoggedUserId(null);
      setIsValidatingToken(false);
    }
  }

  const passedContext = {
    isLoggedIn,
    loggedUserId,
    authenticateUser
  }

  if(isValidatingToken){
    return <h3>... vlaidando usuario</h3>
  }
  return (
    <AuthContext.Provider value={passedContext}>
      {props.children}
    </AuthContext.Provider>
  )
}

export {
  AuthContext,
  AuthWrapper
}