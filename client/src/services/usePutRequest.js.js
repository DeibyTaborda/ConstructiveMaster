import { useState } from 'react';
import axios from 'axios';

export const usePutRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const sendPutRequest = async (url, data, config = {}) => {
    setLoading(true); // Iniciar el estado de carga
    setError(null); // Resetear posibles errores previos
    setResponse(null); // Resetear la respuesta previa

    try {
      const res = await axios.put(url, data, config);
      setResponse(res.data); // Guardar la respuesta de la solicitud en el estado
    } catch (err) {
      setError(err); // Guardar el error si algo sale mal
    } finally {
      setLoading(false); // Finalizar el estado de carga
    }
  };

  return { loading, error, response, sendPutRequest };
};
