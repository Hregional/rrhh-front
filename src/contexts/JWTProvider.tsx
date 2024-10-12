import { useEffect, useReducer, ReactNode } from "react";

import { ActionMap, AuthState, AuthUser } from "../types/auth";

import axios from "axios";
import { isValidToken, setSession } from "../utils/jwt";

import AuthContext from "./JWTContext";

import { apiURL } from "../utils/endpoints";

const INITIALIZE = "INITIALIZE";
const SIGN_IN = "SIGN_IN";
const SIGN_OUT = "SIGN_OUT";
const SIGN_UP = "SIGN_UP";

type AuthActionTypes = {
  [INITIALIZE]: {
    isAuthenticated: boolean;
    user: AuthUser;
    roles: string[];
  };
  [SIGN_IN]: {
    user: AuthUser;
    roles: string[];
  };
  [SIGN_OUT]: undefined;
  [SIGN_UP]: {
    user: AuthUser;
  };
};

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  roles: [],
};

const JWTReducer = (
  state: AuthState,
  action: ActionMap<AuthActionTypes>[keyof ActionMap<AuthActionTypes>]
) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
        roles: action.payload.roles
      };
    case SIGN_IN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        roles: action.payload.roles
      };
    case SIGN_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        roles: []
      };

    case SIGN_UP:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const  { roles }  = setSession(accessToken);
          console.log(roles);
          const response = await axios.get(`${apiURL}/auth/my-account`);
          const { user } = response.data;
          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: true,
              user,
              roles,
            },
          });
        } else {
          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: false,
              user: null,
              roles: [],
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
            roles: [],
          },
        });
      }
    };

    initialize();
  }, []);

  const signIn = async (email: string, password: string) => {
    try{
      const response = await axios.post(`${apiURL}/Login/authenticate`, {
        email,
        password,
      });
      const { accessToken, user } = response.data;
      const { roles } = setSession(accessToken);
      console.log(roles);
      // const { roles, depa, depaDefault } = setSession(accessToken); // Aquí obtenemos los roles
  
      setSession(accessToken);
      dispatch({
        type: SIGN_IN,
        payload: {
          user,
          roles,
        },
      });
    } catch (error: any) {
      console.error(`Error en la solicitud de inicio de sesión: ${error.message}`);
      throw error;
    }
  };

  const signOut = async () => {
    setSession(null);
    dispatch({ type: SIGN_OUT });
  };

  const signUp = async (
    email: string,
    password: string,
    nombreUsuario: string,
    idColaborador: number
  ) => {
    const response = await axios.post(`${apiURL}/UserUser/crear`, {
      email,
      password,
      nombreUsuario,
      idColaborador,
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem("accessToken", accessToken);
    dispatch({
      type: SIGN_UP,
      payload: {
        user,
      },
    });
  };

  const resetPassword = async (email: string): Promise<void> => {
    // Realiza la solicitud a la API con el endpoint reset-password
    const response = await axios.post(`${apiURL}/Email/reset-password`, {
      email: email,
    });
    // Verifica la respuesta de la API
    if (response.status === 200) {
      console.log(
        "Solicitud de restablecimiento de contraseña enviada correctamente."
      );
    } else {
      console.error(
        "Error al enviar la solicitud de restablecimiento de contraseña."
      );
    }
    return response.data;
  };
  const newPassword = async (
    token: string,
    newPassword: string
  ): Promise<void> => {
    try {
      const response = await axios.post(`${apiURL}/Password/reset`, {
        resetToken: token,
        newPassword: newPassword,
      });

      // Verifica la respuesta de la API
      if (response.status === 200) {
        console.log("Restablecimiento de contraseña exitoso.");
      } else {
        console.error("Error, no se pudo cambiar la contraseña");
      }
    } catch (error: any) {
      console.error(
        `Error en la solicitud de restablecimiento de contraseña: ${error.message}`
      );
      // Puedes lanzar el error nuevamente si necesitas manejarlo en el lugar donde llamas a esta función
      throw error;
    }
  };
  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        signIn,
        signOut,
        signUp,
        resetPassword,
        newPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export default AuthProvider;
