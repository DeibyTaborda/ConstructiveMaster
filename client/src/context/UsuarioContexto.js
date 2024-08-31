import React, { createContext, useState, useEffect } from 'react';

// Crear el Contexto
export const UsuarioContexto = createContext();

// Crear el Proveedor
export const UsuarioProveedor = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const usuarioAlmacenado = localStorage.getItem('usuario');
    return usuarioAlmacenado ? JSON.parse(usuarioAlmacenado) : null;
  });

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuario');
    }
  }, [usuario]);

  // Función para actualizar la información del usuario
  const actualizarUsuario = (nuevosDatosUsuario) => {
    setUsuario(prevUsuario => ({
      ...prevUsuario,
      ...nuevosDatosUsuario
    }));
  };

  // Función para limpiar el usuario (ej. al hacer logout)
  const limpiarUsuario = () => {
    setUsuario(null);
  };

  return (
    <UsuarioContexto.Provider value={{ usuario, actualizarUsuario, limpiarUsuario }}>
      {children}
    </UsuarioContexto.Provider>
  );
};
