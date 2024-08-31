import React, { useState } from "react";
import '../../assets/styles/clientesAdmin.css';
import MenuAdmin from "../../components/administrador/MenuAdmin";
import TablaAdmin from "../../components/administrador/TablaAdmin";
import axios from "axios";
import useAxios from "../../services/api";

function Clientes(){
    const {data, loading, error} = useAxios('http://localhost:3001/clientes');
    const [datos, setDatos] = useState(data);
    const title = 'Clientes';

    if (loading) return <p>Loading ....</p>
    if (error) return <p>{error.message}</p>

    const columnas = ['id', 'nombre', 'correo', 'contrasena', 'telefono', 'direccion', 'Acciones'];


    return(
        <>
        <div className="container-menu-table-clientes">
            <MenuAdmin/>
            <div className="container-table-clientes">
                <TablaAdmin data={data} columns={columnas} title={title} />
            </div>
        </div>
        </>
    );
}

export default Clientes;