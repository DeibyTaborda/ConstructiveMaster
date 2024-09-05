import { useEffect, useState } from 'react';
import axios from 'axios';

function usePostRequest(url) {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const postRequest = async (data) => {
        setLoading(true);
        setError(null);
 
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                      Authorization: `Bearer ${token}` 
                },
            });
            setResponse(res.data.message);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message ? err.response.data.message :  err.response.data);
            } else {
                setError('Error al enviar la solicitud.');
            }
        } finally {
            setLoading(false);
        }
    };
    return { response, error, loading, postRequest };
}

export default usePostRequest;
