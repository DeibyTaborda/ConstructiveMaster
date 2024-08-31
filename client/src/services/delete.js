import { useState } from "react"
import axios from "axios"

const useDelete = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [responseDelete, setResponseDelete] = useState(null);

    const eliminar = async() => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(url, {
                headers: {Authorization: `Bearer ${token}` }
            });
            console.log('Eliminación exitosa');
            setResponseDelete(response.data);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Error en eliminar el registro');
            }
        } finally {
            setLoading(false);
        }
    } 

    return {loading, error, responseDelete, eliminar};
}

export default useDelete;
