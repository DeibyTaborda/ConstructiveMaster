import React, { createContext, useState, useEffect } from 'react';
import useAxios from '../services/api';

export const ProfesionalesContext = createContext();

export const ProfesionalesProvider = ({ children }) => {
  const [profesionales, setProfesionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {loading: loadingProfesionales, error: errorProfesionales, data, fetchData} = useAxios('http://localhost:3001/profesionales');

  useEffect(() => {
    if (data){
        setProfesionales(data);
    }
  }, [data]);

  return (
    <ProfesionalesContext.Provider value={{ profesionales, loading, error }}>
      {children}
    </ProfesionalesContext.Provider>
  );
};
