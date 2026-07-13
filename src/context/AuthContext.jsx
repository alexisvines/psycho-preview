import React, { createContext, useContext } from 'react'

// Vista previa visual: no hay panel admin ni login real, así que
// isAuthenticated queda fijo en false. Se mantiene el mismo contrato de
// useAuth() que el proyecto real para no tocar PublicLayout/Booking.
const AuthContext = createContext({ isAuthenticated: false, logout: () => {} })

export const AuthProvider = ({ children }) => (
  <AuthContext.Provider value={{ isAuthenticated: false, logout: () => {} }}>
    {children}
  </AuthContext.Provider>
)

export const useAuth = () => useContext(AuthContext)
