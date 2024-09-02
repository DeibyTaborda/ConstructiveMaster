import React, { createContext, useState, useContext, Children, useEffect } from "react";

export const TablasBdContext = createContext();

export const TablasProveedor = ({children}) => {
    const [tablasBD, setTablasBD] = useState(() => {
        const tablasAlmacenadas = localStorage.getItem('tablaBD');
        return tablasAlmacenadas ? JSON.parse(tablasAlmacenadas) : null;
    });

    useEffect(() => {
        if (tablasBD) {
            localStorage.setItem('tablasBD', JSON.stringify(tablasBD));
        } else {
            localStorage.removeItem('tablasBD');
        }
    }, [tablasBD]);

    const actualizarTablasBD = (nuevosDatosTablasBD) => {
        setTablasBD({...tablasBD, ...nuevosDatosTablasBD}); 
    }

    const limpiarTablasBD = () => {
        setTablasBD(null);
    }

    return (
        <TablasBdContext.Provider value={{tablasBD, actualizarTablasBD, limpiarTablasBD}}>
            {children}
        </TablasBdContext.Provider>
    );

}
