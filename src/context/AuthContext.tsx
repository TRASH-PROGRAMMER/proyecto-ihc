// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: "administrador" | "guia" | "turista";
}

interface AuthContextType {
  user?: User;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  registerUser: (user: Omit<User, "id">) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);

  // Cargar usuarios desde localStorage al iniciar
  useEffect(() => {
    const storedUsers = localStorage.getItem('ecorutas-users');
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    }

    // Cargar sesión actual si existe
    const storedUser = localStorage.getItem('ecorutas-current-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error al cargar sesión:', error);
      }
    }
  }, []);

  // Guardar usuarios en localStorage cuando cambien
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('ecorutas-users', JSON.stringify(users));
    }
  }, [users]);

  const login = async (email: string, password: string) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem('ecorutas-current-user', JSON.stringify(found));
      return found;
    }
    return null;
  };

  const logout = () => {
    setUser(undefined);
    localStorage.removeItem('ecorutas-current-user');
  };

  const registerUser = async (newUser: Omit<User, "id">) => {
    // Verificar si el email ya existe
    if (users.find(u => u.email === newUser.email)) {
      return null;
    }
    
    // Crear nuevo usuario con ID único
    const userWithId: User = { ...newUser, id: Date.now().toString() };
    
    // Agregar a la lista de usuarios
    setUsers(prev => [...prev, userWithId]);
    
    // NO establecer el usuario automáticamente (no iniciar sesión)
    // El usuario tendrá que iniciar sesión manualmente después del registro
    
    return userWithId;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
