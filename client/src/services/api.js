import axios from "axios";
import { useEffect, useState } from "react";


function useAxios(url){
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

        const fetchData = async () => {
            setLoading(true);
            try{
                const token = localStorage.getItem('token');
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
                setResponse(response);
            } catch (error) {
                setError(error.response.data.message);
            } finally {
                setLoading(false);
            }
        };


    useEffect(() => {
        fetchData()
    }, [url])

    return {data, loading, error, fetchData, response};
}

export default useAxios;