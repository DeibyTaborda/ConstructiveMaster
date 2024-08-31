import { useState } from 'react';
import axios from 'axios';

function usePostRequestJson(url) {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const postRequestJson = async (data) => {
        setLoading(true);
        setError(null);
 
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
            });
            setResponse(res.data.message ? res.data.message : res.data);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Error al enviar la solicitud.');
            }
        } finally {
            setLoading(false);
        }
    };

    return { response, error, loading, postRequestJson };
}

export default usePostRequestJson;