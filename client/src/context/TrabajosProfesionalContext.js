import React, { createContext, useState, useEffect } from 'react';
import useAxios from '../services/api';

export const TrabajosProfesionalContext = createContext();

export const TrabajosProfesionalProvider = ({ children }) => {
  const [trabajos, setTrabajos] = useState([]);

  const obtenerIdProfesional = () => {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const profesional = JSON.parse(usuario);
      return profesional?.id || null; 
    }
    return null;
  };

  const [idProfesional, setIdProfesional] = useState(obtenerIdProfesional());


  const { data } = useAxios('http://localhost:3001/trabajos-profesional', { idProfesional });

  useEffect(() => {
    if (data) {
      setTrabajos(data); 
      console.log('estamos presentes', data)
    }
  }, [data]);

  return (
    <TrabajosProfesionalContext.Provider value={{ trabajos }}>
      {children}
    </TrabajosProfesionalContext.Provider>
  );
};
