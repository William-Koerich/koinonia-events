// src/context/AuthContext.js
import { createContext, useContext, useState } from 'react';

const API_URL = 'http://localhost:3333'; 

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  async function signIn(email, password) {
    setIsLoadingAuth(true);
    try {
      console.log('[Auth] tentando login em:', `${API_URL}/auth/login`);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          senha: password, // 👈 tem que bater com o back
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log('[Auth] status login:', response.status, 'body:', data);

      if (!response.ok) {
        const msg = data?.error || `Erro ao fazer login (status ${response.status})`;
        throw new Error(msg);
      }

      setUser(data.user);
      console.log('[Auth] login bem-sucedido:', data.user);

      return data.user;
    } catch (err) {
      console.log('[Auth] erro signIn:', err);
      throw err;
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
