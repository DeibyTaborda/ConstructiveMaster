import { useState } from 'react';
import axios from 'axios';

export const usePutRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const sendPutRequest = async (url, data,) => {
    setLoading(true); // Iniciar el estado de carga
    setError(null); // Resetear posibles errores previos
    setResponse(null); // Resetear la respuesta previa    

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(url, data, {
        headers: {Authorization: `Bearer ${token}` }
      });
      setResponse(res.data.message); // Guardar la respuesta de la solicitud en el estado
    } catch (err) {
      setError(err.response?.data?.message || err.message); // Guardar el error si algo sale mal
    } finally {
      setLoading(false); // Finalizar el estado de carga
    }
  };

  return { loading, error, response, sendPutRequest };
};
