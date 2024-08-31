import React, { useEffect } from "react";
import '../../assets/styles/inicioAdmin.css';
import MenuAdmin from "../../components/administrador/MenuAdmin";
import TablaAdmin from "../../components/administrador/TablaAdmin";
import useAxios from "../../services/api";

function SolicitudProfesional() {
    const {loading, error, data, fetchData} = useAxios('http://localhost:3001/solicitud_profesional');

    const columnas = ['id', 'nombre', 'apellido', 'especialidad', 'correo', 'telefono', 'curriculum', 'created_at', 'Acciones'];

    return (
        <div className="container-menu-table">
            <MenuAdmin />
            <div className="container-table-solicitud-profesional">
              <div className="hola">
                <TablaAdmin  columns={columnas} data={data} title={'Solitudes de Profesionales'} tableId={'solicitud'} />
              </div>
            </div>
        </div>
    );
}

export default SolicitudProfesional;
