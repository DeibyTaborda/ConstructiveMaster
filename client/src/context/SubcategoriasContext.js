import { createContext, useState, useEffect } from "react";
import useAxios from "../services/api";

export const SubcategoriasContext = createContext();

export const SubcategoriasProveedor = ({children}) => {
    const [subcategorias, setSubcategorias] = useState([]);
    const {loading, error, data} = useAxios('http://localhost:3001/subcategorias-general');

    useEffect(() => {
        if (data) {
            setSubcategorias(data);
        }
    }, [data]);

    if (error) {
        console.error('Error al cargar las subcategorías:', error);
        return <div>Error al cargar las subcategorías.</div>;
    }

    return (
        <SubcategoriasContext.Provider value={{subcategorias, error, loading}}>
            {children}
        </SubcategoriasContext.Provider>
    );
};
