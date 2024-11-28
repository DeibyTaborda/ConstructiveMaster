import axios from "axios";
import { useEffect, useState } from "react";

function useAxios(url, params = {}) { 
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorCode, setErrorCode] = useState(null);
    const [response, setResponse] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setData(response.data);
            setResponse(response);
        } catch (error) {
            setError(error.response?.data?.message || 'Error en la solicitud');
            setErrorCode(error.response?.status || 'Desconocido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [url]);

    return { data, loading, error, errorCode, fetchData, response };
}

export default useAxios;
