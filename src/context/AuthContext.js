import { createContext, useContext, useState } from 'react';

const MOCK_USER = {
  email: 'admin@koinonia.com',
  password: '123456',
  name: 'Admin Koinonia',
  type: 'admin',
};

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  async function signIn(email, password) {
    setIsLoadingAuth(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        setUser({ name: MOCK_USER.name, email: MOCK_USER.email });
        console.log('[Auth] login bem-sucedido');
      } else {
        throw new Error('E-mail ou senha inválidos');
      }
    } finally {
      setIsLoadingAuth(false);
    }
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoadingAuth, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
}
