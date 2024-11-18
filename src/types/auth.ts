export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUser = null | Record<string, any>;

export type AuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  roles: string[];
};

export type JWTContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  roles: string[];
  method: "jwt";
  signIn: (email: string, password: string) => Promise<void>;
  singGoogle: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (
    nombreUsuario: string,
    password: string,
    email: string,
    idColaborador: number
  ) => Promise<void>;
  resetPassword: (email: string) => void;
  newPassword: (resetToken: string, password: string) => void;
};

export type FirebaseAuthContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  method: "firebase";
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (
    email: string,
    password: string,    
  ) => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  signInWithMicrosoft: () => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

export type Auth0ContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  method: "auth0";
  signIn: () => Promise<void>;
  signOut: VoidFunction;
  resetPassword: (email: string) => void;
};

export type CognitoContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  method: "cognito";
  signIn: (email: string, password: string) => Promise<unknown>;
  signUp: (
    email: string,
    password: string
  ) => Promise<unknown>;
  signOut: VoidFunction;
  resetPassword: (email: string) => void;
};
