import axios from "axios";
import { useEffect, useState } from "react";

function useAxios(url, params = {}) { // Añadimos params como argumento opcional
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
                params // Agregamos los params a la solicitud
            });
            setData(response.data);
            setResponse(response);
        } catch (error) {
            setError(error.response?.data?.message || 'Error en la solicitud');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [url]); // Dependencias actualizadas para incluir params

    return { data, loading, error, fetchData, response };
}

export default useAxios;
