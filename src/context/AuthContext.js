// src/context/AuthContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useState } from 'react';


const API_URL = 'http://localhost:3333'
const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
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
          senha: password,
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
        const msg =
          data?.error || `Erro ao fazer login (status ${response.status})`;
        throw new Error(msg);
      }

      // normaliza o user pra bater com o que você usa na UI (name / email)
      const normalizedUser = {
        id: data.user.id,
        name: data.user.nome,
        email: data.user.email,
        type: data.user.tipo,
      };

      setUser(normalizedUser);
      setToken(data.token);

      // salva pra uso futuro (auto-login depois se quiser)
      await AsyncStorage.setItem('@auth_token', data.token);
      await AsyncStorage.setItem('@auth_user', JSON.stringify(normalizedUser));

      console.log('[Auth] login bem-sucedido:', normalizedUser);

      return normalizedUser;
    } catch (err) {
      console.log('[Auth] erro signIn:', err);
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  }

  // LOGOUT COMPLETO
  async function signOut() {
    try {
      if (token) {
        // chama o back só pra manter fluxo bonitinho
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.log('[Auth] erro ao chamar /auth/logout:', err);
      // mesmo que o back falhe, vamos limpar o front assim mesmo
    } finally {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem('@auth_token');
      await AsyncStorage.removeItem('@auth_user');
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isLoadingAuth, signIn, signOut }}
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
